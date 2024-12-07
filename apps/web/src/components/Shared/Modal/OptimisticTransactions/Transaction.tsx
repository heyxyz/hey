import { XMarkIcon } from "@heroicons/react/24/outline";
import { OptmisticTransactionType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Tooltip } from "@hey/ui";
import { chains } from "@lens-network/sdk/viem";
import Link from "next/link";
import type { FC } from "react";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

const convertEnumKeyToReadable = (key: string) => {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2");
};

interface TransactionProps {
  transaction: OptimisticTransaction;
}

const Transaction: FC<TransactionProps> = ({ transaction }) => {
  const { removeTransaction } = useTransactionStore();

  return (
    <div className="flex items-center justify-between">
      <Tooltip content={transaction.txHash} placement="top">
        {transaction.type === OptmisticTransactionType.Post ||
        transaction.type === OptmisticTransactionType.Quote ||
        transaction.type === OptmisticTransactionType.AssignUsername ||
        transaction.type === OptmisticTransactionType.UnassignUsername ||
        transaction.type === OptmisticTransactionType.SetAccountMetadata ? (
          <div className="text-sm">
            {convertEnumKeyToReadable(transaction.type)}
          </div>
        ) : transaction.type === OptmisticTransactionType.Follow ||
          transaction.type === OptmisticTransactionType.Unfollow ||
          transaction.type === OptmisticTransactionType.Block ||
          transaction.type === OptmisticTransactionType.Unblock ||
          transaction.type === OptmisticTransactionType.Repost ||
          transaction.type === OptmisticTransactionType.Comment ||
          transaction.type === OptmisticTransactionType.Collect ? (
          <div className="text-sm">
            {convertEnumKeyToReadable(transaction.type)} on{" "}
            {transaction.followOn ||
              transaction.unfollowOn ||
              transaction.blockOn ||
              transaction.unblockOn ||
              transaction.repostOf ||
              transaction.commentOn ||
              transaction.collectOn}
          </div>
        ) : null}
      </Tooltip>
      <div className="flex items-center space-x-2">
        <Tooltip content="Indexing" placement="top">
          <Link
            href={`${chains.testnet.blockExplorers?.default.url}/tx/${transaction.txHash}`}
            target="_blank"
          >
            <div className="flex size-4 items-center justify-center rounded-full bg-gray-200">
              <div className="size-2 animate-shimmer rounded-full bg-gray-500" />
            </div>
          </Link>
        </Tooltip>
        <button
          type="button"
          onClick={() => removeTransaction(transaction.txHash)}
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Transaction;
