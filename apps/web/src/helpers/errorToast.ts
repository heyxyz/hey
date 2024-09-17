import { Errors } from "@hey/data/errors";
import { toast } from "react-hot-toast";

/**
 * Error toast
 * @param error Error
 * @returns void
 */
const errorToast = (error: any) => {
  if (error?.message.includes("viem")) {
    return;
  }

  if (error?.message.includes("UNPREDICTABLE_GAS_LIMIT")) {
    return toast.error(Errors.UnpredictableGasLimit, { id: "error" });
  }

  if (error?.message.includes("Connector not connected")) {
    return toast.error("Connect or switch to the correct wallet!", {
      id: "connector-error"
    });
  }

  toast.error(
    error?.data?.message || error?.message || Errors.SomethingWentWrong,
    { id: "error" }
  );
};

export default errorToast;
