import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { MADFI_API_KEY, MADFI_API_URL } from './utils';

const useFetchSuggestedFollowsForProfile = (
  profileId: string
): {
  data?: {
    interest?: string;
    suggestedFollows: string[];
    promotedProfile?: string;
  };
  error?: unknown;
  loading?: unknown;
} => {
  const fetchSuggestedProfiles = async () => {
    const response = await axios({
      method: 'GET',
      url: `${MADFI_API_URL}/suggested_follows`,
      params: { profileId },
      headers: { 'x-api-key': MADFI_API_KEY }
    });

    const { allProfiles, interest, promotedProfile } =
      response.data?.suggestedFollows || {};

    if (!allProfiles?.length) {
      return { suggestedFollows: [] };
    }

    // include any promoted profile in the full array
    if (promotedProfile) {
      allProfiles.unshift(promotedProfile);
      allProfiles.pop();
    }

    return { suggestedFollows: allProfiles, interest, promotedProfile };
  };

  return useQuery(
    ['suggested-follows-for-profile', profileId],
    () => fetchSuggestedProfiles().then((res) => res),
    {
      enabled: !!profileId,
      staleTime: 300 // 5min, considering api gateway caching
    }
  );
};

export default useFetchSuggestedFollowsForProfile;
