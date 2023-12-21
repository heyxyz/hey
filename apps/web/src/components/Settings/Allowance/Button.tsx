import type { ApprovedAllowanceAmountResult } from '@hey/lens';
import type { Dispatch, FC, SetStateAction } from 'react';

import {
  ExclamationTriangleIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { SETTINGS } from '@hey/data/tracking';
import { useGenerateModuleCurrencyApprovalDataLazyQuery } from '@hey/lens';
import { Button, Modal, Spinner, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import getAllowanceModule from '@lib/getAllowanceModule';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSendTransaction, useWaitForTransaction } from 'wagmi';

interface AllowanceButtonProps {
  allowed: boolean;
  module: ApprovedAllowanceAmountResult;
  setAllowed: Dispatch<SetStateAction<boolean>>;
  title?: string;
}

const AllowanceButton: FC<AllowanceButtonProps> = ({
  allowed,
  module,
  setAllowed,
  title = 'Allow'
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
    onError,
    onSuccess: () => {
      toast.success(
        allowed
          ? 'Module disabled successfully!'
          : 'Module enabled successfully!'
      );
      setShowWarningModal(false);
      setAllowed(!allowed);
      Leafwatch.track(SETTINGS.ALLOWANCE.TOGGLE, {
        allowed: !allowed,
        currency: module.allowance.asset.symbol,
        module: module.moduleName
      });
    }
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
        data: data?.data,
        to: data?.to
      });
    });
  };

  return allowed ? (
    <Button
      icon={
        queryLoading || transactionLoading || waitLoading ? (
          <Spinner size="xs" variant="warning" />
        ) : (
          <MinusIcon className="size-4" />
        )
      }
      onClick={() =>
        handleAllowance(
          module.allowance.asset.contract.address,
          '0',
          module.moduleName
        )
      }
      variant="warning"
    >
      Revoke
    </Button>
  ) : (
    <>
      <Button
        icon={<PlusIcon className="size-4" />}
        onClick={() => setShowWarningModal(!showWarningModal)}
      >
        {title}
      </Button>
      <Modal
        icon={<ExclamationTriangleIcon className="size-5 text-yellow-500" />}
        onClose={() => setShowWarningModal(false)}
        show={showWarningModal}
        title="Warning"
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            message={
              <div className="leading-6">
                Please be aware that by allowing this module, the amount
                indicated will be automatically deducted when you <b>Collect</b>{' '}
                and <b>Super follow</b>.
              </div>
            }
            title="Handle with care!"
          />
          <Button
            icon={
              queryLoading || transactionLoading || waitLoading ? (
                <Spinner size="xs" />
              ) : (
                <PlusIcon className="size-4" />
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
