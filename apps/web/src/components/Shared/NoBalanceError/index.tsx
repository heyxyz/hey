import { Leafwatch } from "@helpers/leafwatch";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { POST } from "@hey/data/tracking";
import getUniswapURL from "@hey/helpers/getUniswapURL";
import type { Amount } from "@hey/lens";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import WrapWmatic from "./WrapWmatic";

interface NoBalanceErrorProps {
  errorMessage?: ReactNode;
  moduleAmount: Amount;
}

const NoBalanceError: FC<NoBalanceErrorProps> = ({
  errorMessage,
  moduleAmount
}) => {
  const amount = moduleAmount?.value;
  const currency = moduleAmount?.asset?.symbol;
  const assetAddress = moduleAmount?.asset?.contract.address;

  if (currency === "WMATIC") {
    return (
      <WrapWmatic errorMessage={errorMessage} moduleAmount={moduleAmount} />
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-sm">
        {errorMessage ? (
          errorMessage
        ) : (
          <span>
            You don't have enough <b>{currency}</b>
          </span>
        )}
      </div>
      <Link
        className="flex items-center space-x-1.5 font-bold text-pink-500 text-xs"
        href={getUniswapURL(Number.parseFloat(amount), assetAddress)}
        onClick={() => Leafwatch.track(POST.COLLECT_MODULE.OPEN_UNISWAP)}
        rel="noreferrer noopener"
        target="_blank"
      >
        <img
          alt="Uniswap"
          className="size-5"
          height={20}
          src={`${STATIC_IMAGES_URL}/brands/uniswap.png`}
          width={20}
        />
        <div>Swap in Uniswap</div>
      </Link>
    </div>
  );
};

export default NoBalanceError;
