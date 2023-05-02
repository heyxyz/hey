import { ExclamationIcon, MinusIcon, PlusIcon } from '@heroicons/react/outline';
import { getModule } from '@lib/getModule';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import { t, Trans } from '@lingui/macro';
// import { SANDBOX_QUADRATIC_VOTE_COLLECT_MODULE } from 'data/contracts';
import getEnvConfig from 'data/utils/getEnvConfig';
import { ethers } from 'ethers';
import type { ApprovedAllowanceAmount } from 'lens';
import { useGenerateModuleCurrencyApprovalDataLazyQuery } from 'lens';
import type { Dispatch, FC } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { SETTINGS } from 'src/tracking';
import { Button, Modal, Spinner, WarningMessage } from 'ui';
import { useSendTransaction, useWaitForTransaction } from 'wagmi';

import type { QuadraticCollectModuleData } from '../../Publication/Actions/Collect/QuadraticModule';

interface AllowanceButtonProps {
  title?: string;
  module: ApprovedAllowanceAmount;
  allowed: boolean;
  setAllowed: Dispatch<boolean>;
  collectModule?: QuadraticCollectModuleData;
}

const AllowanceButton: FC<AllowanceButtonProps> = ({
  title = t`Allow`,
  module,
  allowed,
  setAllowed,
  collectModule
}) => {
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
      toast.success(allowed ? t`Module disabled successfully!` : t`Module enabled successfully!`);
      setShowWarningModal(false);
      setAllowed(!allowed);
      Mixpanel.track(SETTINGS.ALLOWANCE.TOGGLE, {
        allowance_module: module.module,
        allowance_currency: module.currency,
        allowance_allowed: !allowed
      });
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
        getEnvConfig().QuadraticVoteCollectModuleAddress,
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
