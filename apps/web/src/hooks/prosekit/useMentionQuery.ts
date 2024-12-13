import isVerified from "@helpers/isVerified";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { type Account, useAccountsLazyQuery } from "@hey/indexer";
import { useEffect, useState } from "react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionAccount = {
  displayUsername: string;
  username: string;
  address: string;
  name: string;
  picture: string;
  score: number;
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
      const accounts = accountsSearchResult?.items as Account[];
      const accountsResults = (accounts ?? []).map(
        (account): MentionAccount => ({
          displayUsername: getAccount(account).usernameWithPrefix,
          username: getAccount(account).username,
          address: account.address,
          name: getAccount(account).name,
          picture: getAvatar(account),
          score: account.score || 0
        })
      );

      setResults(
        accountsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT).sort((a, b) => {
          // Convert boolean to number: true -> 1, false -> 0
          const verifiedA = isVerified(a.address) ? 1 : 0;
          const verifiedB = isVerified(b.address) ? 1 : 0;

          // Primary sort by verification status (descending: verified first)
          if (verifiedA !== verifiedB) {
            return verifiedB - verifiedA;
          }

          // Secondary sort by score (descending)
          return b.score - a.score;
        })
      );
    });
  }, [query, searchAccounts]);

  return results;
};

export default useMentionQuery;
