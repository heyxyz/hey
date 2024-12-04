import isVerified from "@helpers/isVerified";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { type Account, useSearchAccountsLazyQuery } from "@hey/indexer";
import { useEffect, useState } from "react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionAccount = {
  displayUsername: string;
  handle: string;
  address: string;
  name: string;
  picture: string;
  score: number;
};

const useMentionQuery = (query: string): MentionAccount[] => {
  const [results, setResults] = useState<MentionAccount[]>([]);
  const [searchAccounts] = useSearchAccountsLazyQuery();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    searchAccounts({ variables: { request: { localName: query } } }).then(
      ({ data }) => {
        const search = data?.searchAccounts;
        const accountsSearchResult = search;
        const accounts = accountsSearchResult?.items as Account[];
        const accountsResults = (accounts ?? []).map(
          (profile): MentionAccount => ({
            displayUsername: getAccount(profile).slugWithPrefix,
            handle: getAccount(profile).slug,
            address: profile?.address,
            name: getAccount(profile).name,
            picture: getAvatar(profile),
            score: profile.score || 0
          })
        );

        setResults(
          accountsResults
            .slice(0, SUGGESTION_LIST_LENGTH_LIMIT)
            .sort((a, b) => {
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
      }
    );
  }, [query, searchAccounts]);

  return results;
};

export default useMentionQuery;
