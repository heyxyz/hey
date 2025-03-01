import Loader from "@components/Shared/Loader";
import SingleAccount from "@components/Shared/SingleAccount";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import {
  type AccountFragment,
  type AccountsRequest,
  PageSize,
  useAccountsLazyQuery
} from "@hey/indexer";
import { Card, Input } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import type { ChangeEvent, FC, MutableRefObject } from "react";
import { useEffect, useState } from "react";
import { useSearchStore } from "src/store/persisted/useSearchStore";
import RecentAccounts from "./RecentAccounts";

interface SearchProps {
  placeholder?: string;
}

const Search: FC<SearchProps> = ({ placeholder = "Search…" }) => {
  const { pathname, push, query } = useRouter();
  const { addAccount } = useSearchStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [accounts, setAccounts] = useState<AccountFragment[]>([]);
  const debouncedSearchText = useDebounce<string>(searchText, 500);

  const handleReset = () => {
    setShowDropdown(false);
    setAccounts([]);
  };

  const dropdownRef = useClickAway(() => {
    handleReset();
  }) as MutableRefObject<HTMLDivElement>;

  const [searchAccounts, { loading }] = useAccountsLazyQuery();

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
  };

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (pathname === "/search") {
      push(`/search?q=${encodeURIComponent(searchText)}&type=${query.type}`);
    } else {
      push(`/search?q=${encodeURIComponent(searchText)}&type=profiles`);
    }
    handleReset();
  };

  useEffect(() => {
    if (pathname !== "/search" && showDropdown && debouncedSearchText) {
      const request: AccountsRequest = {
        pageSize: PageSize.Fifty,
        filter: { searchBy: { localNameQuery: debouncedSearchText } }
      };

      searchAccounts({ variables: { request } }).then((res) => {
        if (res.data?.accounts?.items) {
          setAccounts(res.data.accounts.items);
        }
      });
    }
  }, [debouncedSearchText]);

  return (
    <div className="w-full">
      <form onSubmit={handleKeyDown}>
        <Input
          className="px-3 py-2 text-sm"
          iconLeft={<MagnifyingGlassIcon />}
          iconRight={
            <XMarkIcon
              className={cn(
                "cursor-pointer",
                searchText ? "visible" : "invisible"
              )}
              onClick={handleReset}
            />
          }
          onChange={handleSearch}
          onClick={() => setShowDropdown(true)}
          placeholder={placeholder}
          type="text"
          value={searchText}
        />
      </form>
      {pathname !== "/search" && showDropdown ? (
        <div
          className="absolute mt-2 flex w-[94%] max-w-md flex-col"
          ref={dropdownRef}
        >
          <Card className="z-[2] max-h-[80vh] overflow-y-auto py-2">
            {!debouncedSearchText && (
              <RecentAccounts onAccountClick={handleReset} />
            )}
            {loading ? (
              <Loader className="my-3" message="Searching users" small />
            ) : (
              <>
                {accounts.map((account) => (
                  <div
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    key={account.address}
                    onClick={() => {
                      addAccount(account.address);
                      push(getAccount(account).link);
                      handleReset();
                    }}
                  >
                    <SingleAccount
                      hideFollowButton
                      hideUnfollowButton
                      linkToAccount={false}
                      account={account}
                      showUserPreview={false}
                    />
                  </div>
                ))}
                {accounts.length === 0 ? (
                  <div className="px-4 py-2">
                    Try searching for people or keywords
                  </div>
                ) : null}
              </>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
