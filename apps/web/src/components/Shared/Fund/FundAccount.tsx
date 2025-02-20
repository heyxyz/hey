import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Card, Image } from "@hey/ui";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { type Address, formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

const FundAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const { address } = useAccount();

  const { data: accountBalanceData } = useBalance({
    address: currentAccount?.address,
    token: DEFAULT_COLLECT_TOKEN as Address,
    query: { refetchInterval: 2000 }
  });

  const { data: walletBalanceData } = useBalance({
    address,
    token: DEFAULT_COLLECT_TOKEN as Address,
    query: { refetchInterval: 2000 }
  });

  const accountBalance = accountBalanceData
    ? Number.parseFloat(formatUnits(accountBalanceData.value, 18)).toFixed(2)
    : 0;

  const walletBalance = walletBalanceData
    ? Number.parseFloat(formatUnits(walletBalanceData.value, 18)).toFixed(2)
    : 0;

  return (
    <div className="m-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          className="size-12 rounded-full"
          src={`${STATIC_IMAGES_URL}/tokens/gho.svg`}
          alt="GHO"
        />
        <div className="font-bold text-2xl">{accountBalance} GHO</div>
        <div className="ld-text-gray-500 text-sm">
          GHO enables various on-chain and Hey-specific actions.
        </div>
      </div>
      <Card className="mt-5">
        <div className="mx-5 my-3">
          <b>Purchase</b>
        </div>
        <div className="divider" />
        <div className="p-5">gm {walletBalance}</div>
      </Card>
    </div>
  );
};

export default FundAccount;
