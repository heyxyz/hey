import type { FiatRate } from '@hey/types/lens';
import type { FC } from 'react';

import { getAuthApiHeaders } from '@helpers/getAuthApiHeaders';
import getCurrentSession from '@helpers/getCurrentSession';
import { HEY_API_URL, STALE_TIMES } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getAllTokens from '@hey/helpers/api/getAllTokens';
import getPreferences from '@hey/helpers/api/getPreferences';
import getProfileDetails from '@hey/helpers/api/getProfileFlags';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useProfileDetailsStore } from 'src/store/non-persisted/useProfileDetailsStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useRatesStore } from 'src/store/persisted/useRatesStore';
import { useVerifiedMembersStore } from 'src/store/persisted/useVerifiedMembersStore';

const PreferencesProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const { setVerifiedMembers } = useVerifiedMembersStore();
  const { setAllowedTokens } = useAllowedTokensStore();
  const { setFiatRates } = useRatesStore();
  const {
    setAppIcon,
    setEmail,
    setEmailVerified,
    setHasDismissedOrMintedMembershipNft,
    setHighSignalNotificationFilter
  } = usePreferencesStore();
  const { setPinnedPublication } = useProfileDetailsStore();
  const { setStatus } = useProfileStatus();
  const { setFeatureFlags, setStaffMode } = useFeatureFlagsStore();

  const getPreferencesData = async () => {
    const preferences = await getPreferences(getAuthApiHeaders());

    setHighSignalNotificationFilter(preferences.highSignalNotificationFilter);
    setAppIcon(preferences.appIcon);
    setEmail(preferences.email);
    setEmailVerified(preferences.emailVerified);
    setFeatureFlags(preferences.features);
    setStaffMode(preferences.features.includes(FeatureFlag.StaffMode));
    setStatus({
      isCommentSuspended: preferences.features.includes(
        FeatureFlag.CommentSuspended
      ),
      isSuspended: preferences.features.includes(FeatureFlag.Suspended)
    });
    setHasDismissedOrMintedMembershipNft(
      preferences.hasDismissedOrMintedMembershipNft
    );

    return true;
  };

  const getProfileDetailsData = async () => {
    const details = await getProfileDetails(sessionProfileId);
    setPinnedPublication(details?.pinnedPublication || null);
    return true;
  };

  const getVerifiedMembersData = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/misc/verified`);
      setVerifiedMembers(response.data.result || []);
      return true;
    } catch {
      return false;
    }
  };

  const getAllowedTokensData = async () => {
    const tokens = await getAllTokens();
    setAllowedTokens(tokens);
    return tokens;
  };

  const getFiatRatesData = async (): Promise<FiatRate[]> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/lens/rate`);
      return response.data.result || [];
    } catch {
      return [];
    }
  };

  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: getPreferencesData,
    queryKey: ['getPreferences', sessionProfileId || '']
  });
  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: getProfileDetailsData,
    queryKey: ['getProfileDetails', sessionProfileId || '']
  });
  useQuery({
    queryFn: getVerifiedMembersData,
    queryKey: ['getVerifiedMembers'],
    staleTime: STALE_TIMES.THIRTY_MINUTES
  });
  useQuery({
    queryFn: getAllowedTokensData,
    queryKey: ['getAllowedTokens'],
    staleTime: STALE_TIMES.THIRTY_MINUTES
  });
  useQuery({
    queryFn: () =>
      getFiatRatesData().then((rates) => {
        setFiatRates(rates);
        return rates;
      }),
    queryKey: ['getFiatRates'],
    staleTime: STALE_TIMES.FIVE_MINUTES
  });

  return null;
};

export default PreferencesProvider;
