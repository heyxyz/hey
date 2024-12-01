import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useTransactionStatusQuery } from "@hey/indexer";
import { Spinner } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import type { Address } from "viem";

interface IndexStatusProps {
  message?: string;
  shouldReload?: boolean;
  txHash?: Address;
}

const IndexStatus: FC<IndexStatusProps> = ({
  message = "Transaction Indexing",
  shouldReload = false,
  txHash
}) => {
  const { reload } = useRouter();
  const [hide, setHide] = useState(false);
  const [pollInterval, setPollInterval] = useState(500);

  const { data, loading } = useTransactionStatusQuery({
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ transactionStatus }) => {
      if (transactionStatus?.__typename === "FinishedTransactionStatus") {
        setPollInterval(0);
        if (shouldReload) {
          reload();
        }
        setTimeout(() => {
          setHide(true);
        }, 5000);
      }
    },
    pollInterval,
    variables: { request: { txHash } }
  });

  const getStatusContent = () => {
    if (
      loading ||
      !data?.transactionStatus ||
      data.transactionStatus.__typename === "PendingTransactionStatus"
    ) {
      return (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>{message}</div>
        </div>
      );
    }

    if (data.transactionStatus.__typename === "FailedTransactionStatus") {
      return (
        <div className="flex items-center space-x-1.5">
          <XCircleIcon className="size-5 text-red-500" />
          <div>Index failed</div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <CheckCircleIcon className="size-5 text-green-500" />
        <div className="text-black dark:text-white">Index Successful</div>
      </div>
    );
  };

  return (
    <span className={cn({ hidden: hide }, "ml-auto font-medium text-sm")}>
      {getStatusContent()}
    </span>
  );
};

export default IndexStatus;
