import { Button } from "@hey/ui";
import type { FC } from "react";
import { useFundModalStore } from "src/store/non-persisted/modal/useFundModalStore";

interface FundButtonProps {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const FundButton: FC<FundButtonProps> = ({
  size = "md",
  className = "",
  label = "Fund account"
}) => {
  const { setShowFundModal } = useFundModalStore();

  return (
    <Button
      aria-label="Fund account"
      className={className}
      onClick={() => setShowFundModal(true)}
      size={size}
    >
      {label}
    </Button>
  );
};

export default FundButton;
