import { BLOCK_EXPLORER_URL } from "@hey/data/constants";
import Link from "next/link";
import type { FC } from "react";
import { useBlockNumber } from "wagmi";
import { Badge } from ".";

const LensChain: FC = () => {
  const { data } = useBlockNumber({ query: { refetchInterval: 2000 } });

  if (!data) {
    return null;
  }

  return (
    <Link href={`${BLOCK_EXPLORER_URL}/block/${data}`} target="_blank">
      <Badge>Block: {data.toString()}</Badge>
    </Link>
  );
};

export default LensChain;
