import type { FC, ReactNode } from "react";

interface NoBalanceErrorProps {
  errorMessage?: ReactNode;
  assetSymbol?: string;
}

const NoBalanceError: FC<NoBalanceErrorProps> = ({
  errorMessage,
  assetSymbol
}) => {
  return (
    <div className="text-sm">
      {errorMessage ? (
        errorMessage
      ) : (
        <span>
          You don't have enough <b>{assetSymbol || "funds"}</b>
        </span>
      )}
    </div>
  );
};

export default NoBalanceError;
