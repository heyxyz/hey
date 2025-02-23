import { getSimplePaymentDetails } from "@helpers/group";
import type { Account } from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
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
  const { assetContract: requiredSimplePayment } = getSimplePaymentDetails(
    account.rules
  );

  if (requiredSimplePayment) {
    return (
      <Button
        aria-label="Super Follow"
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
