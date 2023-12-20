import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import {
  ComputerDesktopIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  GlobeAltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import humanize from '@hey/lib/humanize';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import MetaDetails from '../../../../Shared/Staff/MetaDetails';

interface LeafwatchDetailsProps {
  profile: Profile;
}

const LeafwatchDetails: FC<LeafwatchDetailsProps> = ({ profile }) => {
  const getProfileDetails = async (): Promise<{
    browser: string;
    city: string;
    country: string;
    events: number;
    os: string;
    region: string;
    version: string;
  } | null> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/stats/profileDetails`, {
        params: { id: profile.id }
      });
      const { data } = response;

      return data.result;
    } catch {
      return null;
    }
  };

  const { data: leafwatchDetails } = useQuery({
    enabled: Boolean(profile.id),
    queryFn: getProfileDetails,
    queryKey: ['getProfileDetails', profile.id]
  });

  const getProfileImpressions = async (): Promise<{
    totalImpressions: number;
  } | null> => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/stats/profileImpressions`,
        {
          params: { id: profile.id }
        }
      );
      const { data } = response;

      return data;
    } catch {
      return null;
    }
  };

  const { data: impressionDetails } = useQuery({
    enabled: Boolean(profile.id),
    queryFn: getProfileImpressions,
    queryKey: ['getProfileImpressions', profile.id]
  });

  if (!leafwatchDetails || !impressionDetails) {
    return null;
  }

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="size-5" />
        <div className="text-lg font-bold">Leafwatch Details</div>
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
          icon={<MapPinIcon className="ld-text-gray-500 size-4" />}
          title="Location"
        >
          {leafwatchDetails.city}, {leafwatchDetails.region},{' '}
          {leafwatchDetails.country}
        </MetaDetails>
        <MetaDetails
          icon={<ComputerDesktopIcon className="ld-text-gray-500 size-4" />}
          title="OS"
        >
          {leafwatchDetails.os}
        </MetaDetails>
        <MetaDetails
          icon={<GlobeAltIcon className="ld-text-gray-500 size-4" />}
          title="Browser"
        >
          {leafwatchDetails.browser} {leafwatchDetails.version}
        </MetaDetails>
      </div>
    </>
  );
};

export default LeafwatchDetails;
