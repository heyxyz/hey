import {
  type AccountFragment,
  type AccountsRequest,
  PageSize,
  useAccountsLazyQuery
} from "@hey/indexer";
import { Card, Input } from "@hey/ui";
import type { ChangeEvent, FC } from "react";
import Loader from "./Loader";
import SmallSingleAccount from "./SmallSingleAccount";

interface SearchAccountsProps {
  error?: boolean;
  hideDropdown?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAccountSelected: (account: AccountFragment) => void;
  placeholder?: string;
  value: string;
}

const SearchAccounts: FC<SearchAccountsProps> = ({
  error = false,
  hideDropdown = false,
  onChange,
  onAccountSelected,
  placeholder = "Search…",
  value
}) => {
  const [searchAccounts, { data, loading }] = useAccountsLazyQuery();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);

    const keyword = event.target.value;
    const request: AccountsRequest = {
      pageSize: PageSize.Fifty,
      filter: { searchBy: { localNameQuery: keyword } }
    };

    searchAccounts({ variables: { request } });
  };

  const accounts = data?.accounts?.items;

  return (
    <div className="relative w-full">
      <Input
        error={error}
        onChange={handleSearch}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {!hideDropdown && value.length > 0 && (
        <div className="absolute mt-2 flex w-[94%] max-w-md flex-col">
          <Card className="z-[2] max-h-[80vh] overflow-y-auto py-2">
            {loading ? (
              <Loader className="my-3" message="Searching users" small />
            ) : accounts && accounts.length > 0 ? (
              accounts.slice(0, 7).map((account) => (
                <div
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  key={account.address}
                  onClick={() => onAccountSelected(account)}
                >
                  <SmallSingleAccount account={account} />
                </div>
              ))
            ) : (
              <div className="px-4 py-2">No matching users</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchAccounts;
