import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { Spinner } from '@components/UI/Spinner';
import { WarningMessage } from '@components/UI/WarningMessage';
import { ExclamationIcon, MinusIcon, PlusIcon } from '@heroicons/react/outline';
import { getModule } from '@lib/getModule';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import { t, Trans } from '@lingui/macro';
import { SANDBOX_QUADRATIC_VOTE_COLLECT_MODULE } from 'data/contracts';
import { ethers } from 'ethers';
import type { ApprovedAllowanceAmount } from 'lens';
import { useGenerateModuleCurrencyApprovalDataLazyQuery } from 'lens';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSendTransaction, useWaitForTransaction } from 'wagmi';

import type { QuadraticCollectModuleData } from '../../Publication/Actions/Collect/QuadraticModule';

interface Props {
  title?: string;
  module: ApprovedAllowanceAmount;
  allowed: boolean;
  setAllowed: Dispatch<boolean>;
  collectModule?: QuadraticCollectModuleData;
}

const AllowanceButton: FC<Props> = ({ title = t`Allow`, module, allowed, setAllowed, collectModule }) => {
  const [showWarningModal, setShowWarningModal] = useState(false);

  const [generateAllowanceQuery, { loading: queryLoading }] =
    useGenerateModuleCurrencyApprovalDataLazyQuery();

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    request: {},
    mode: 'recklesslyUnprepared',
    onError
  });
  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success(t`Module ${allowed ? 'disabled' : 'enabled'} successfully!`);
      setShowWarningModal(false);
      setAllowed(!allowed);
      Leafwatch.track(`module_${allowed ? 'disabled' : 'enabled'}`);
    },
    onError
  });

  const handleAllowance = (currencies: string, value: string, selectedModule: string) => {
    generateAllowanceQuery({
      variables: {
        request: {
          currency: currencies,
          value: value,
          [getModule(module.module).field]: selectedModule
        }
      }
    }).then((res) => {
      const data = res?.data?.generateModuleCurrencyApprovalData;
      const moduleType = getModule(selectedModule).name;
      const abi = ['function approve(address spender, uint256 value)'];
      let iface = new ethers.utils.Interface(abi);

      const approveUnknownCollectModule = iface.encodeFunctionData('approve', [
        SANDBOX_QUADRATIC_VOTE_COLLECT_MODULE,
        value === '0' ? 0 : ethers.constants.MaxUint256
      ]);

      const approveVotingStrategy = iface.encodeFunctionData('approve', [
        collectModule?.votingStrategy,
        value === '0' ? 0 : ethers.constants.MaxUint256
      ]);
      sendTransaction?.({
        recklesslySetUnpreparedRequest: {
          from: data?.from,
          to: data?.to,
          data: moduleType === 'Unknown Collect' ? approveUnknownCollectModule : data?.data
        }
      });
      if (moduleType === 'Unknown Collect') {
        sendTransaction?.({
          recklesslySetUnpreparedRequest: {
            from: data?.from,
            to: data?.to,
            data: approveVotingStrategy
          }
        });
      }
    });
  };

  return allowed ? (
    <Button
      variant="warning"
      icon={
        queryLoading || transactionLoading || waitLoading ? (
          <Spinner variant="warning" size="xs" />
        ) : (
          <MinusIcon className="h-4 w-4" />
        )
      }
      onClick={() => handleAllowance(module.currency, '0', module.module)}
    >
      <Trans>Revoke</Trans>
    </Button>
  ) : (
    <>
      <Button icon={<PlusIcon className="h-4 w-4" />} onClick={() => setShowWarningModal(!showWarningModal)}>
        {title}
      </Button>
      <Modal
        title={t`Warning`}
        icon={<ExclamationIcon className="h-5 w-5 text-yellow-500" />}
        show={showWarningModal}
        onClose={() => setShowWarningModal(false)}
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            title={t`Important Note:`}
            message={
              <div className="leading-6">
                <Trans>
                  <div>
                    <span className="my-4 block text-center">
                      <b>YOU WILL NEED TO APPROVE TWO (2) TRANSACTIONS IN ORDER TO TIP.</b>
                    </span>
                  </div>
                  <br />
                  Please be aware that by allowing this module, the amount indicated will be automatically
                  deducted when you <b>collect</b> and <b>super follow</b>.
                </Trans>
              </div>
            }
          />
          <Button
            icon={
              queryLoading || transactionLoading || waitLoading ? (
                <Spinner size="xs" />
              ) : (
                <PlusIcon className="h-4 w-4" />
              )
            }
            onClick={() =>
              handleAllowance(module.currency, Number.MAX_SAFE_INTEGER.toString(), module.module)
            }
          >
            {title}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AllowanceButton;
