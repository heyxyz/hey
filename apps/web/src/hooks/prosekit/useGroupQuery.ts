import { useGroupsLazyQuery } from "@hey/indexer";
import { useEffect, useState } from "react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type GroupProfile = {
  slug: string;
  handle: string;
  address: string;
  name: string;
  picture: string;
};

const useGroupQuery = (query: string): GroupProfile[] => {
  const [results, setResults] = useState<GroupProfile[]>([]);
  const [searchGroups] = useGroupsLazyQuery();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    searchGroups({
      variables: { request: { filter: { searchQuery: query } } }
    }).then(({ data }) => {
      const groups = data?.groups?.items;
      const groupsResults = (groups ?? []).map(
        (group): GroupProfile => ({
          slug: group.address || "",
          handle: group.metadata?.name || "",
          address: group.address,
          name: group.metadata?.name || "",
          picture: group.metadata?.icon || ""
        })
      );

      setResults(groupsResults.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
    });
  }, [query]);

  return results;
};

export default useGroupQuery;
