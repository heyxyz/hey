import MetaDetails from "@components/Shared/MetaDetails";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import {
  CursorArrowRaysIcon,
  EyeIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { HEY_API_URL } from "@hey/data/constants";
import { GET_ACCOUNT_DETAILS_QUERY_KEY } from "@hey/helpers/api/getAccountDetails";
import humanize from "@hey/helpers/humanize";
import { H5 } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";

const GET_PROFILE_IMPRESSIONS_QUERY_KEY = "getProfileImpressions";

interface LeafwatchDetailsProps {
  accountId: string;
}

const LeafwatchDetails: FC<LeafwatchDetailsProps> = ({ accountId }) => {
  const getAccountDetails = async (): Promise<{
    browser: string;
    city: string;
    country: string;
    events: number;
  } | null> => {
    try {
      const { data } = await axios.get(
        `${HEY_API_URL}/internal/leafwatch/profile/details`,
        { headers: getAuthApiHeaders(), params: { id: accountId } }
      );

      return data.result;
    } catch {
      return null;
    }
  };

  const { data: leafwatchDetails } = useQuery({
    enabled: Boolean(accountId),
    queryFn: getAccountDetails,
    queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, accountId]
  });

  const getProfileImpressions = async (): Promise<{
    totalImpressions: number;
  } | null> => {
    try {
      const { data } = await axios.get(
        `${HEY_API_URL}/internal/leafwatch/profile/impressions`,
        { headers: getAuthApiHeaders(), params: { id: accountId } }
      );

      return data;
    } catch {
      return null;
    }
  };

  const { data: impressionDetails } = useQuery({
    enabled: Boolean(accountId),
    queryFn: getProfileImpressions,
    queryKey: [GET_PROFILE_IMPRESSIONS_QUERY_KEY, accountId]
  });

  if (!leafwatchDetails || !impressionDetails) {
    return null;
  }

  return (
    <>
      <div className="divider my-5 border-yellow-600 border-dashed" />
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="size-5" />
        <H5>Leafwatch Details</H5>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <MetaDetails
          icon={<EyeIcon className="ld-text-gray-500 size-4" />}
          title="Impressions"
        >
          {humanize(impressionDetails.totalImpressions)}
        </MetaDetails>
        <MetaDetails
          icon={<CursorArrowRaysIcon className="ld-text-gray-500 size-4" />}
          title="Total events"
        >
          {humanize(leafwatchDetails.events)}
        </MetaDetails>
        <MetaDetails
          icon={<GlobeAltIcon className="ld-text-gray-500 size-4" />}
          title="Browser"
        >
          {leafwatchDetails.browser}
        </MetaDetails>
      </div>
    </>
  );
};

export default LeafwatchDetails;
