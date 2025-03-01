import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Image } from "@hey/ui";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { type Address, formatUnits } from "viem";
import { useBalance } from "wagmi";
import Loader from "../../Loader";
import Fund from "./Fund";

const FundAccount: FC = () => {
  const { currentAccount } = useAccountStore();

  const { data, isLoading } = useBalance({
    address: currentAccount?.address,
    token: DEFAULT_COLLECT_TOKEN as Address,
    query: { refetchInterval: 2000 }
  });

  if (isLoading) {
    return <Loader message="Loading balance..." className="my-10" />;
  }

  const accountBalance = data
    ? Number.parseFloat(formatUnits(data.value, 18)).toFixed(2)
    : 0;

  return (
    <div className="m-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          className="size-12 rounded-full"
          src={`${STATIC_IMAGES_URL}/tokens/gho.svg`}
          alt="wGHO"
        />
        <div className="font-bold text-2xl">{accountBalance} wGHO</div>
        <div className="ld-text-gray-500 text-sm">
          Wrapped GHO enables various Hey-specific actions.
        </div>
      </div>
      <Fund recipient={currentAccount?.address} />
    </div>
  );
};

export default FundAccount;
