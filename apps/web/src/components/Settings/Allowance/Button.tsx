import {
  ExclamationTriangleIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { SETTINGS } from '@hey/data/tracking';
import type { ApprovedAllowanceAmountResult } from '@hey/lens';
import { useGenerateModuleCurrencyApprovalDataLazyQuery } from '@hey/lens';
import { Button, Modal, Spinner, WarningMessage } from '@hey/ui';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSendTransaction, useWaitForTransaction } from 'wagmi';

import errorToast from '@/lib/errorToast';
import getAllowanceModule from '@/lib/getAllowanceModule';
import { Leafwatch } from '@/lib/leafwatch';

interface AllowanceButtonProps {
  title?: string;
  module: ApprovedAllowanceAmountResult;
  allowed: boolean;
  setAllowed: Dispatch<SetStateAction<boolean>>;
}

const AllowanceButton: FC<AllowanceButtonProps> = ({
  title = 'Allow',
  module,
  allowed,
  setAllowed
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [generateModuleCurrencyApprovalData, { loading: queryLoading }] =
    useGenerateModuleCurrencyApprovalDataLazyQuery();

  const onError = (error: any) => {
    errorToast(error);
  };

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    onError
  });

  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success(
        allowed
          ? 'Module disabled successfully!'
          : 'Module enabled successfully!'
      );
      setShowWarningModal(false);
      setAllowed(!allowed);
      Leafwatch.track(SETTINGS.ALLOWANCE.TOGGLE, {
        module: module.moduleName,
        currency: module.allowance.asset.symbol,
        allowed: !allowed
      });
    },
    onError
  });

  const handleAllowance = (
    contract: string,
    value: string,
    selectedModule: string
  ) => {
    generateModuleCurrencyApprovalData({
      variables: {
        request: {
          allowance: { currency: contract, value: value },
          module: {
            [getAllowanceModule(module.moduleName).field]: selectedModule
          }
        }
      }
    }).then((res) => {
      const data = res?.data?.generateModuleCurrencyApprovalData;
      sendTransaction?.({
        account: data?.from,
        to: data?.to,
        data: data?.data
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
          <MinusIcon className="h-4 w-4" />
        )
      }
      onClick={() =>
        handleAllowance(
          module.allowance.asset.contract.address,
          '0',
          module.moduleName
        )
      }
    >
      Revoke
    </Button>
  ) : (
    <>
      <Button
        icon={<PlusIcon className="h-4 w-4" />}
        onClick={() => setShowWarningModal(!showWarningModal)}
      >
        {title}
      </Button>
      <Modal
        title="Warning"
        icon={<ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />}
        show={showWarningModal}
        onClose={() => setShowWarningModal(false)}
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            title="Handle with care!"
            message={
              <div className="leading-6">
                Please be aware that by allowing this module, the amount
                indicated will be automatically deducted when you <b>Collect</b>{' '}
                and <b>Super follow</b>.
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
              handleAllowance(
                module.allowance.asset.contract.address,
                Number.MAX_SAFE_INTEGER.toString(),
                module.moduleName
              )
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
