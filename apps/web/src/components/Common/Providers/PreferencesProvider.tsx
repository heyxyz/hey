import type { FiatRate } from '@hey/types/lens';
import type { FC } from 'react';

import { HEY_API_URL, STALE_TIMES } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import getAllTokens from '@hey/helpers/api/getAllTokens';
import getPreferences from '@hey/helpers/api/getPreferences';
import getProfileDetails from '@hey/helpers/api/getProfileFlags';
import getScore from '@hey/helpers/api/getScore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useLensAuthData from 'src/hooks/useLensAuthData';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useProfileDetailsStore } from 'src/store/non-persisted/useProfileDetailsStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useScoreStore } from 'src/store/non-persisted/useScoreStore';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useRatesStore } from 'src/store/persisted/useRatesStore';
import { useVerifiedMembersStore } from 'src/store/persisted/useVerifiedMembersStore';

const PreferencesProvider: FC = () => {
  const { setVerifiedMembers } = useVerifiedMembersStore();
  const { setAllowedTokens } = useAllowedTokensStore();
  const { setFiatRates } = useRatesStore();
  const { setScore } = useScoreStore();
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
  const lensAuthData = useLensAuthData();

  const getPreferencesData = async () => {
    const preferences = await getPreferences({ ...lensAuthData });

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
    const details = await getProfileDetails(lensAuthData.id as string);
    setPinnedPublication(details?.pinnedPublication || null);
    return true;
  };

  const getScoreData = async () => {
    const score = await getScore(lensAuthData.id as string);
    setScore(score.score);
    return score;
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
    enabled: Boolean(lensAuthData.id),
    queryFn: getPreferencesData,
    queryKey: ['getPreferences', lensAuthData.id || '']
  });
  useQuery({
    enabled: Boolean(lensAuthData.id),
    queryFn: getProfileDetailsData,
    queryKey: ['getProfileDetails', lensAuthData.id || '']
  });
  useQuery({
    enabled: Boolean(lensAuthData.id),
    queryFn: getScoreData,
    queryKey: ['getScore', lensAuthData.id],
    staleTime: STALE_TIMES.SIX_HOURS
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
