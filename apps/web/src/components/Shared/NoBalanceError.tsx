import type { FC } from "react";

interface NoBalanceErrorProps {
  assetSymbol?: string;
}

const NoBalanceError: FC<NoBalanceErrorProps> = ({ assetSymbol }) => {
  return (
    <div className="text-sm">
      You don't have enough <b>{assetSymbol || "funds"}</b>
    </div>
  );
};

export default NoBalanceError;
