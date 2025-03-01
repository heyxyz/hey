import SmallSingleAccount from "@components/Shared/SmallSingleAccount";
import { UsersIcon } from "@heroicons/react/24/outline";
import { useAccountsAvailableQuery } from "@hey/indexer";
import { H5 } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";

interface ManagedAccountsProps {
  address: string;
}

const ManagedAccounts: FC<ManagedAccountsProps> = ({ address }) => {
  const { data, loading } = useAccountsAvailableQuery({
    variables: {
      lastLoggedInAccountRequest: { address },
      accountsAvailableRequest: { managedBy: address }
    }
  });

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <UsersIcon className="size-5" />
        <H5>Managed profiles</H5>
      </div>
      <div className="mt-3">
        {loading ? (
          <div>Loading managed profiles...</div>
        ) : (
          <div className="space-y-2">
            {data?.lastLoggedInAccount ? (
              <div>
                <Link
                  href={`/staff/accounts/${data?.lastLoggedInAccount?.address}`}
                >
                  <SmallSingleAccount account={data?.lastLoggedInAccount} />
                </Link>
                <div className="divider my-5 border-yellow-600 border-dashed" />
              </div>
            ) : null}
            {data?.accountsAvailable.items.map((accountAvailable) => (
              <div key={accountAvailable.account.address}>
                <Link
                  href={`/staff/accounts/${accountAvailable.account.address}`}
                >
                  <SmallSingleAccount account={accountAvailable.account} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManagedAccounts;
