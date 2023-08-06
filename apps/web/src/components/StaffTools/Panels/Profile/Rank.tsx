import {
  CurrencyDollarIcon,
  HandIcon,
  UserAddIcon,
  UserCircleIcon
} from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';

import MetaDetails from '../MetaDetails';

interface RankProps {
  profile: Profile;
}

const Rank: FC<RankProps> = ({ profile }) => {
  const getRank = async (strategy: string) => {
    try {
      const response = await axios(
        `https://lens-api.k3l.io/profile/rank?strategy=${strategy}&handle=${profile.handle}`
      );

      return response.data;
    } catch (error) {
      return false;
    }
  };

  const { data: followship } = useQuery(
    ['getRank', profile.id, 'followship'],
    () => getRank('followship').then((res) => res)
  );

  const { data: engagement } = useQuery(
    ['getRank', profile.id, 'engagement'],
    () => getRank('engagement').then((res) => res)
  );

  const { data: influencer } = useQuery(
    ['getRank', profile.id, 'influencer'],
    () => getRank('influencer').then((res) => res)
  );

  const { data: creator } = useQuery(['getRank', profile.id, 'creator'], () =>
    getRank('creator').then((res) => res)
  );

  return (
    <>
      {followship ? (
        <MetaDetails
          icon={<UserAddIcon className="lt-text-gray-500 h-4 w-4" />}
          value={followship.rank}
          title={t`Followship Rank`}
        >
          {followship.rank}
        </MetaDetails>
      ) : null}
      {engagement ? (
        <MetaDetails
          icon={<HandIcon className="lt-text-gray-500 h-4 w-4" />}
          value={engagement.rank}
          title={t`Engagement Rank`}
        >
          {engagement.rank}
        </MetaDetails>
      ) : null}
      {influencer ? (
        <MetaDetails
          icon={<UserCircleIcon className="lt-text-gray-500 h-4 w-4" />}
          value={influencer.rank}
          title={t`Influencer Rank`}
        >
          {influencer.rank}
        </MetaDetails>
      ) : null}
      {creator ? (
        <MetaDetails
          icon={<CurrencyDollarIcon className="lt-text-gray-500 h-4 w-4" />}
          value={creator.rank}
          title={t`Creator Rank`}
        >
          {creator.rank}
        </MetaDetails>
      ) : null}
    </>
  );
};

export default Rank;
