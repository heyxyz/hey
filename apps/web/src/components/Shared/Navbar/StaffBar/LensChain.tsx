import plur from "plur";
import type { FC } from "react";
import { useBlock } from "wagmi";
import { Badge } from ".";

const LensChain: FC = () => {
  const { data: block, isLoading: blockLoading } = useBlock({
    query: { refetchInterval: 2000 }
  });

  if (blockLoading) {
    return null;
  }

  const blockNumber = block?.number?.toString();
  const transactionCount = block?.transactions.length;

  return (
    <>
      {block && (
        <Badge>
          Block: {blockNumber} ({transactionCount}{" "}
          {plur("txn", transactionCount)})
        </Badge>
      )}
    </>
  );
};

export default LensChain;
