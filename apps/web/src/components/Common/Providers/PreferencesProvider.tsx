import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import getCurrentSession from "@helpers/getCurrentSession";
import { HEY_API_URL } from "@hey/data/constants";
import { Permission } from "@hey/data/permissions";
import getAllTokens, {
  GET_ALL_TOKENS_QUERY_KEY
} from "@hey/helpers/api/getAllTokens";
import getPreferences, {
  GET_PREFERENCES_QUERY_KEY
} from "@hey/helpers/api/getPreferences";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountThemeStore } from "src/store/persisted/useAccountThemeStore";
import { useAllowedTokensStore } from "src/store/persisted/useAllowedTokensStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import { useRatesStore } from "src/store/persisted/useRatesStore";
import { useVerifiedMembersStore } from "src/store/persisted/useVerifiedMembersStore";

const GET_VERIFIED_MEMBERS_QUERY_KEY = "getVerifiedMembers";
const GET_FIAT_RATES_QUERY_KEY = "getFiatRates";

const PreferencesProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const { setTheme } = useAccountThemeStore();
  const { setVerifiedMembers } = useVerifiedMembersStore();
  const { setAllowedTokens } = useAllowedTokensStore();
  const { setFiatRates } = useRatesStore();
  const {
    setAppIcon,
    setEmail,
    setEmailVerified,
    setHasDismissedOrMintedMembershipNft,
    setHighSignalNotificationFilter,
    setDeveloperMode,
    setMutedWords,
    setLoading: setPreferencesLoading
  } = usePreferencesStore();
  const { setStatus } = useAccountStatus();

  const getPreferencesData = async () => {
    setPreferencesLoading(true);
    const preferences = await getPreferences(getAuthApiHeaders());

    setHighSignalNotificationFilter(preferences.highSignalNotificationFilter);
    setAppIcon(preferences.appIcon);
    setEmail(preferences.email);
    setEmailVerified(preferences.emailVerified);
    setDeveloperMode(preferences.developerMode);
    setStatus({
      isCommentSuspended: preferences.permissions.includes(
        Permission.CommentSuspended
      ),
      isSuspended: preferences.permissions.includes(Permission.Suspended)
    });
    setHasDismissedOrMintedMembershipNft(
      preferences.hasDismissedOrMintedMembershipNft
    );
    setMutedWords(preferences.mutedWords);
    setPreferencesLoading(false);
    setTheme({ fontStyle: preferences.theme?.fontStyle });

    return true;
  };

  const getVerifiedMembers = async () => {
    try {
      const { data } = await axios.get(`${HEY_API_URL}/misc/verified`);
      setVerifiedMembers(data.result || []);
      return true;
    } catch {
      return false;
    }
  };

  const getFiatRates = async () => {
    try {
      const { data } = await axios.get(`${HEY_API_URL}/lens/rate`);
      setFiatRates(data.result || []);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: getPreferencesData,
    queryKey: [GET_PREFERENCES_QUERY_KEY, sessionProfileId || ""]
  });
  useQuery({
    queryFn: getVerifiedMembers,
    queryKey: [GET_VERIFIED_MEMBERS_QUERY_KEY]
  });
  useQuery({
    queryFn: () =>
      getAllTokens().then((tokens) => {
        setAllowedTokens(tokens);
        return tokens;
      }),
    queryKey: [GET_ALL_TOKENS_QUERY_KEY]
  });
  useQuery({
    queryFn: getFiatRates,
    queryKey: [GET_FIAT_RATES_QUERY_KEY],
    refetchInterval: 10000
  });

  return null;
};

export default PreferencesProvider;
