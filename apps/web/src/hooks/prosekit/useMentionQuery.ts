import isVerified from "@helpers/isVerified";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { useAccountsLazyQuery } from "@hey/indexer";
import { useEffect, useState } from "react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionAccount = {
  displayUsername: string;
  username: string;
  address: string;
  name: string;
  picture: string;
};

const useMentionQuery = (query: string): MentionAccount[] => {
  const [results, setResults] = useState<MentionAccount[]>([]);
  const [searchAccounts] = useAccountsLazyQuery();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    searchAccounts({
      variables: {
        request: { filter: { searchBy: { localNameQuery: query } } }
      }
    }).then(({ data }) => {
      const search = data?.accounts;
      const accountsSearchResult = search;
      const accounts = accountsSearchResult?.items;
      const accountsResults = (accounts ?? []).map(
        (account): MentionAccount => ({
          displayUsername: getAccount(account).usernameWithPrefix,
          username: getAccount(account).username,
          address: account.address,
          name: getAccount(account).name,
          picture: getAvatar(account)
        })
      );

      setResults(
        accountsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT).sort((a, b) => {
          const verifiedA = isVerified(a.address) ? 1 : 0;
          const verifiedB = isVerified(b.address) ? 1 : 0;
          return verifiedB - verifiedA;
        })
      );
    });
  }, [query, searchAccounts]);

  return results;
};

export default useMentionQuery;
