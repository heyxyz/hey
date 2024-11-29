import getAccountDetails, {
  GET_ACCOUNT_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getAccountDetails";
import { Tooltip } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

interface AccountStatusProps {
  address: string;
}

const AccountStatus: FC<AccountStatusProps> = ({ address }) => {
  const { data } = useQuery({
    enabled: Boolean(address),
    queryFn: () => getAccountDetails(address),
    queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, address]
  });

  if (!data?.status) {
    return null;
  }

  if (!data.status.message) {
    return <span className="cursor-default text-lg">{data.status.emoji}</span>;
  }

  return (
    <Tooltip content={data.status.message}>
      <span className="cursor-default text-lg">{data.status.emoji}</span>
    </Tooltip>
  );
};

export default AccountStatus;
