import type { Profile } from 'lens';
import { useProfilesLazyQuery } from 'lens';
import { useCallback, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';

const useFetchLensProfiles = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const setLensProfiles = usePushChatStore((state) => state.setLensProfiles);

  const [loadProfiles] = useProfilesLazyQuery();

  const loadLensProfiles = useCallback(
    async (profilesChunk: Array<string>) => {
      try {
        setLoading(true);

        // Make the profileIds array unique using the Set data structure
        const uniqueProfileIds = Array.from(new Set(profilesChunk));

        const result = await loadProfiles({ variables: { request: { profileIds: uniqueProfileIds } } });
        if (result.data) {
          const lensIdsMap = new Map(
            result.data.profiles.items.map((profile) => {
              return [profile.id, profile as Profile];
            })
          );
          setLensProfiles(lensIdsMap);
          return lensIdsMap;
        }
      } catch (error: Error | any) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [loadProfiles, setLensProfiles]
  );

  return { loadLensProfiles, error, loading };
};

export default useFetchLensProfiles;
