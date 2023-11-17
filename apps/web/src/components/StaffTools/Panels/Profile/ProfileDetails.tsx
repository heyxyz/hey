import {
  ComputerDesktopIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  GlobeAltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';

import MetaDetails from '../MetaDetails';

interface ProfileDetailsProps {
  profile: Profile;
}

const ProfileDetails: FC<ProfileDetailsProps> = ({ profile }) => {
  const getProfileDetails = async (): Promise<{
    region: string;
    city: string;
    country: string;
    events: number;
    os: string;
    browser: string;
    version: string;
  } | null> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/stats/profileDetails`, {
        params: { id: profile.id }
      });
      const { data } = response;

      return data.result;
    } catch (error) {
      return null;
    }
  };

  const { data: leafwatchDetails } = useQuery({
    queryKey: ['getProfileDetails', profile.id],
    queryFn: getProfileDetails,
    enabled: Boolean(profile.id)
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
    } catch (error) {
      return null;
    }
  };

  const { data: impressionDetails } = useQuery({
    queryKey: ['getProfileImpressions', profile.id],
    queryFn: getProfileImpressions,
    enabled: Boolean(profile.id)
  });

  if (!leafwatchDetails || !impressionDetails) {
    return null;
  }

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Leafwatch Details</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <MetaDetails
          icon={<EyeIcon className="ld-text-gray-500 h-4 w-4" />}
          value={humanize(impressionDetails.totalImpressions)}
          title="Impressions"
        >
          {humanize(impressionDetails.totalImpressions)}
        </MetaDetails>
        <MetaDetails
          icon={<CursorArrowRaysIcon className="ld-text-gray-500 h-4 w-4" />}
          value={humanize(leafwatchDetails.events)}
          title="Total events"
        >
          {humanize(leafwatchDetails.events)}
        </MetaDetails>
        <MetaDetails
          icon={<MapPinIcon className="ld-text-gray-500 h-4 w-4" />}
          value={leafwatchDetails.city}
          title="Location"
        >
          {leafwatchDetails.city}, {leafwatchDetails.region},{' '}
          {leafwatchDetails.country}
        </MetaDetails>
        <MetaDetails
          icon={<ComputerDesktopIcon className="ld-text-gray-500 h-4 w-4" />}
          value={leafwatchDetails.os}
          title="OS"
        >
          {leafwatchDetails.os}
        </MetaDetails>
        <MetaDetails
          icon={<GlobeAltIcon className="ld-text-gray-500 h-4 w-4" />}
          value={leafwatchDetails.browser}
          title="Browser"
        >
          {leafwatchDetails.browser} {leafwatchDetails.version}
        </MetaDetails>
      </div>
    </>
  );
};

export default ProfileDetails;
