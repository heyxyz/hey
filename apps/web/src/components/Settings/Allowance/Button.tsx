import errorToast from "@helpers/errorToast";
import getAllowanceModule from "@helpers/getAllowanceModule";
import { Leafwatch } from "@helpers/leafwatch";
import { SETTINGS } from "@hey/data/tracking";
import type { ApprovedAllowanceAmountResult } from "@hey/lens";
import {
  OpenActionModuleType,
  useGenerateModuleCurrencyApprovalDataLazyQuery
} from "@hey/lens";
import { Button, Modal, WarningMessage } from "@hey/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

interface AllowanceButtonProps {
  allowed: boolean;
  className?: string;
  module: ApprovedAllowanceAmountResult;
  setAllowed: Dispatch<SetStateAction<boolean>>;
  title?: string;
}

const AllowanceButton: FC<AllowanceButtonProps> = ({
  allowed,
  className = "",
  module,
  setAllowed,
  title = "Allow"
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [generateModuleCurrencyApprovalData, { loading: queryLoading }] =
    useGenerateModuleCurrencyApprovalDataLazyQuery();
  const handleWrongNetwork = useHandleWrongNetwork();

  const onError = (error: any) => {
    errorToast(error);
  };

  const {
    data: txHash,
    isPending: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    mutation: { onError }
  });

  const {
    error,
    isLoading: waitLoading,
    isSuccess
  } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess) {
      toast.success(allowed ? "Module disabled" : "Module enabled");
      setShowWarningModal(false);
      setAllowed(!allowed);
      Leafwatch.track(SETTINGS.ALLOWANCE.TOGGLE, {
        allowed: !allowed,
        currency: module.allowance.asset.symbol,
        module: module.moduleName
      });
    }

    if (error) {
      onError(error);
    }
  }, [isSuccess, error]);

  const handleAllowance = async (
    contract: string,
    value: string,
    selectedModule: string
  ) => {
    try {
      const isUnknownModule =
        module.moduleName === OpenActionModuleType.UnknownOpenActionModule;

      const { data } = await generateModuleCurrencyApprovalData({
        variables: {
          request: {
            allowance: { currency: contract, value: value },
            module: {
              [isUnknownModule
                ? "unknownOpenActionModule"
                : getAllowanceModule(module.moduleName).field]: isUnknownModule
                ? module.moduleContract.address
                : selectedModule
            }
          }
        }
      });
      await handleWrongNetwork();

      return sendTransaction?.({
        account: data?.generateModuleCurrencyApprovalData.from,
        data: data?.generateModuleCurrencyApprovalData.data,
        to: data?.generateModuleCurrencyApprovalData.to
      });
    } catch (error) {
      onError(error);
    }
  };

  return allowed ? (
    <Button
      className={className}
      disabled={queryLoading || transactionLoading || waitLoading}
      onClick={() =>
        handleAllowance(
          module.allowance.asset.contract.address,
          "0",
          module.moduleName
        )
      }
    >
      Revoke
    </Button>
  ) : (
    <>
      <Button
        className={className}
        onClick={() => setShowWarningModal(!showWarningModal)}
        outline
      >
        {title}
      </Button>
      <Modal
        onClose={() => setShowWarningModal(false)}
        show={showWarningModal}
        title="Warning"
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            message={
              <div className="leading-6">
                Please be aware that by allowing this module, the amount
                indicated will be automatically deducted when you <b>Collect</b>{" "}
                and <b>Super follow</b>.
              </div>
            }
            title="Handle with care!"
          />
          <Button
            disabled={queryLoading || transactionLoading || waitLoading}
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
