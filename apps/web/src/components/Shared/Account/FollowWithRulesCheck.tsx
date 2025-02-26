import { getSimplePaymentDetails } from "@helpers/rules";
import type { Account } from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useSuperFollowModalStore } from "src/store/non-persisted/modal/useSuperFollowModalStore";
import Follow from "./Follow";

interface FollowWithRulesCheckProps {
  buttonClassName: string;
  account: Account;
  small: boolean;
  title: string;
}

const FollowWithRulesCheck: FC<FollowWithRulesCheckProps> = ({
  buttonClassName,
  account,
  small,
  title
}) => {
  const { setShowSuperFollowModal } = useSuperFollowModalStore();
  const { assetContract: requiredSimplePayment } = getSimplePaymentDetails(
    account.rules
  );

  if (requiredSimplePayment) {
    return (
      <Button
        aria-label="Super Follow"
        onClick={() => setShowSuperFollowModal(true, account)}
        className={buttonClassName}
        outline
        size={small ? "sm" : "md"}
      >
        Super Follow
      </Button>
    );
  }

  return (
    <Follow
      account={account}
      buttonClassName={buttonClassName}
      small={small}
      title={title}
    />
  );
};

export default FollowWithRulesCheck;
