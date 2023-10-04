import {
  ComputerDesktopIcon,
  CursorArrowRaysIcon,
  GlobeAltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { LEAFWATCH_WORKER_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';

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
      const response = await axios.get(`${LEAFWATCH_WORKER_URL}/profile`, {
        params: { id: profile.id }
      });
      const { data } = response;

      return data.result;
    } catch (error) {
      return null;
    }
  };

  const { data } = useQuery(
    ['getProfileDetails', profile.id],
    () => getProfileDetails().then((res) => res),
    { enabled: Boolean(profile.id) }
  );

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="h-5 w-5" />
        <div className="text-lg font-bold">
          <Trans>Leafwatch Details</Trans>
        </div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <MetaDetails
          icon={<CursorArrowRaysIcon className="lt-text-gray-500 h-4 w-4" />}
          value={humanize(data.events)}
          title={t`Total events`}
        >
          {humanize(data.events)}
        </MetaDetails>
        <MetaDetails
          icon={<MapPinIcon className="lt-text-gray-500 h-4 w-4" />}
          value={data.city}
          title={t`Location`}
        >
          {data.city}, {data.region}, {data.country}
        </MetaDetails>
        <MetaDetails
          icon={<ComputerDesktopIcon className="lt-text-gray-500 h-4 w-4" />}
          value={data.os}
          title={t`OS`}
        >
          {data.os}
        </MetaDetails>
        <MetaDetails
          icon={<GlobeAltIcon className="lt-text-gray-500 h-4 w-4" />}
          value={data.browser}
          title={t`Browser`}
        >
          {data.browser} {data.version}
        </MetaDetails>
      </div>
    </>
  );
};

export default ProfileDetails;
