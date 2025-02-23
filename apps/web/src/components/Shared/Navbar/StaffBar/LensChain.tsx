import type { FC } from "react";
import { useBlockNumber } from "wagmi";
import { Badge } from ".";

const LensChain: FC = () => {
  const { data: blockNumber, isLoading: blockNumberLoading } = useBlockNumber({
    query: { refetchInterval: 1000 }
  });

  if (blockNumberLoading) {
    return null;
  }

  return (
    <>
      {blockNumber && (
        <Badge>
          <span>Block: {blockNumber?.toString()}</span>
        </Badge>
      )}
    </>
  );
};

export default LensChain;
