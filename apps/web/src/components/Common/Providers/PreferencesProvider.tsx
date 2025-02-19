import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import getCurrentSession from "@helpers/getCurrentSession";
import { HEY_API_URL } from "@hey/data/constants";
import { Permission } from "@hey/data/permissions";
import getPreferences, {
  GET_PREFERENCES_QUERY_KEY
} from "@hey/helpers/api/getPreferences";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import { useVerifiedMembersStore } from "src/store/persisted/useVerifiedMembersStore";

const GET_VERIFIED_MEMBERS_QUERY_KEY = "getVerifiedMembers";

const PreferencesProvider: FC = () => {
  const { address: sessionAccountAddress } = getCurrentSession();
  const { setVerifiedMembers } = useVerifiedMembersStore();
  const { setAppIcon, setIncludeLowScore } = usePreferencesStore();
  const { setStatus } = useAccountStatus();

  const getPreferencesData = async () => {
    const preferences = await getPreferences(getAuthApiHeaders());

    setIncludeLowScore(preferences.includeLowScore);
    setAppIcon(preferences.appIcon);
    setStatus({
      isSuspended: preferences.permissions.includes(Permission.Suspended)
    });

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

  useQuery({
    enabled: Boolean(sessionAccountAddress),
    queryFn: getPreferencesData,
    queryKey: [GET_PREFERENCES_QUERY_KEY, sessionAccountAddress || ""]
  });
  useQuery({
    queryFn: getVerifiedMembers,
    queryKey: [GET_VERIFIED_MEMBERS_QUERY_KEY]
  });

  return null;
};

export default PreferencesProvider;
