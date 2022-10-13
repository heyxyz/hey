import { useLazyQuery } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { Spinner } from '@components/UI/Spinner';
import { WarningMessage } from '@components/UI/WarningMessage';
import { GenerateModuleCurrencyApprovalDataDocument } from '@generated/types';
import { ExclamationIcon, MinusIcon, PlusIcon } from '@heroicons/react/outline';
import { getModule } from '@lib/getModule';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi';

interface Props {
  title?: string;
  module: any;
  allowed: boolean;
  setAllowed: Dispatch<boolean>;
}

const AllowanceButton: FC<Props> = ({ title = 'Allow', module, allowed, setAllowed }) => {
  const [showWarningModal, setShowWarninModal] = useState(false);
  const [generateAllowanceQuery, { loading: queryLoading }] = useLazyQuery(
    GenerateModuleCurrencyApprovalDataDocument
  );

  const { config } = usePrepareSendTransaction({
    request: {}
  });

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    ...config,
    mode: 'recklesslyUnprepared',
    onError
  });

  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success(`Module ${allowed ? 'disabled' : 'enabled'} successfully!`);
      setShowWarninModal(false);
      setAllowed(!allowed);
      Leafwatch.track(`Module ${allowed ? 'disabled' : 'enabled'}`);
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
      sendTransaction?.({
        recklesslySetUnpreparedRequest: {
          from: data?.from,
          to: data?.to,
          data: data?.data
        }
      });
    });
  };

  return allowed ? (
    <Button
      variant="warning"
      icon={
        queryLoading || transactionLoading || waitLoading ? (
          <Spinner variant="warning" size="xs" />
        ) : (
          <MinusIcon className="w-4 h-4" />
        )
      }
      onClick={() => handleAllowance(module.currency, '0', module.module)}
    >
      Revoke
    </Button>
  ) : (
    <>
      <Button
        variant="success"
        icon={<PlusIcon className="w-4 h-4" />}
        onClick={() => setShowWarninModal(!showWarningModal)}
      >
        {title}
      </Button>
      <Modal
        title="Warning"
        icon={<ExclamationIcon className="w-5 h-5 text-yellow-500" />}
        show={showWarningModal}
        onClose={() => setShowWarninModal(false)}
      >
        <div className="p-5 space-y-3">
          <WarningMessage
            title="Handle with care!"
            message={
              <div className="leading-6">
                Please be aware that by allowing this module, the amount indicated will be automatically
                deducted when you <b>collect</b> and <b>super follow</b>.
              </div>
            }
          />
          <Button
            variant="success"
            icon={
              queryLoading || transactionLoading || waitLoading ? (
                <Spinner variant="success" size="xs" />
              ) : (
                <PlusIcon className="w-4 h-4" />
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
