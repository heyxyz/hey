import { useEffect, useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type GroupProfile = {
  slug: string;
  handle: string;
  address: string;
  name: string;
  picture: string;
};

const useGroupQuery = (query: string): GroupProfile[] => {
  const { currentAccount } = useAccountStore();
  const [results, setResults] = useState<GroupProfile[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    getGroups({ limit: 10, profile_id: currentAccount?.address, query }).then(
      (data) => {
        const groups = data as Group[];
        const groupsResults = (groups ?? []).map(
          (group): GroupProfile => ({
            slug: group.metadata?.slug || "",
            handle: group.metadata?.slug || "",
            address: group.address,
            name: group.metadata?.name || "",
            picture: group.metadata?.icon || ""
          })
        );

        setResults(groupsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
      }
    );
  }, [query]);

  return results;
};

export default useGroupQuery;
