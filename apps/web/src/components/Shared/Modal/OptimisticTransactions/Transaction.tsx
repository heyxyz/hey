import { XMarkIcon } from "@heroicons/react/24/outline";
import { BLOCKEXPLORER_URL } from "@hey/data/constants";
import { OptimisticTxType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Tooltip } from "@hey/ui";
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
        {Object.values(OptimisticTxType).includes(transaction.type) ? (
          <div className="text-sm">
            {convertEnumKeyToReadable(transaction.type)}
          </div>
        ) : null}
      </Tooltip>
      <div className="flex items-center space-x-2">
        <Tooltip content="Indexing" placement="top">
          <Link
            href={`${BLOCKEXPLORER_URL}/tx/${transaction.txHash}`}
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
