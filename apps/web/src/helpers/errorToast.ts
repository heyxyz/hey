import { Errors } from "@hey/data/errors";
import { toast } from "react-hot-toast";

const FORBIDDEN_ERROR =
  "Forbidden - Failed to generate source stamp: App rejected verification request:";

/**
 * Error toast
 * @param error Error
 * @returns void
 */
const errorToast = (error: any) => {
  if (error?.message.includes("viem")) {
    return;
  }

  if (error?.message.includes(FORBIDDEN_ERROR)) {
    return toast.error(error?.message.replace(FORBIDDEN_ERROR, ""), {
      id: "error"
    });
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
