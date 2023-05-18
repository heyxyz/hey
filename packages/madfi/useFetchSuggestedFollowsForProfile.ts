import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { MADFI_API_URL } from './utils';

const useFetchSuggestedFollowsForProfile = (
  profileId: string
): {
  data?: { interest?: string; suggestedFollows: string[] };
  error?: unknown;
  loading?: unknown;
} => {
  const fetchSuggestedProfiles = async () => {
    const response = await axios({
      method: 'GET',
      url: `${MADFI_API_URL}/suggested_follows`,
      params: { profileId }
    });

    const { allProfiles, interest } = response.data?.suggestedFollows || {};

    if (!allProfiles?.length) {
      return { suggestedFollows: [] };
    }

    return { suggestedFollows: allProfiles, interest };
  };

  return useQuery(
    ['suggested-follows-for-profile', profileId],
    () => fetchSuggestedProfiles().then((res) => res),
    {
      enabled: !!profileId
    }
  );
};

export default useFetchSuggestedFollowsForProfile;
