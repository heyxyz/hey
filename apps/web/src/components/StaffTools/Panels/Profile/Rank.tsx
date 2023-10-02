import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  HandRaisedIcon,
  UserCircleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { HashtagIcon } from '@heroicons/react/24/solid';
import type { Profile } from '@hey/lens';
import { formatDate } from '@lib/formatTime';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import urlcat from 'urlcat';

import MetaDetails from '../MetaDetails';

interface RankProps {
  profile: Profile;
}

const Rank: FC<RankProps> = ({ profile }) => {
  const getRank = async (strategy: string) => {
    try {
      const response = await axios.get(
        urlcat('https://lens-api.k3l.io/profile/rank', {
          strategy,
          handle: profile.handle
        })
      );

      return response.data;
    } catch (error) {
      return false;
    }
  };

  const getGitcoinScore = async () => {
    try {
      const response = await axios.get(
        urlcat('https://api.scorer.gitcoin.co/registry/score/:id/:address', {
          id: 335,
          address: profile.ownedBy
        }),
        {
          headers: { 'X-API-Key': 'xn9e7AFv.aEfS0ioNhaVtww1jdwnsWtxnrNHspVsS' }
        }
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

  const { data: gitcoinScore } = useQuery(['getRank', profile.id], () =>
    getGitcoinScore().then((res) => res)
  );

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <HashtagIcon className="h-5 w-5" />
        <div className="text-lg font-bold">
          <Trans>Scores</Trans>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<UserPlusIcon className="lt-text-gray-500 h-4 w-4" />}
          value={followship?.rank}
          title={t`Followship Rank`}
        >
          {followship ? (
            followship.rank
          ) : (
            <div className="shimmer h-4 w-5 rounded" />
          )}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="lt-text-gray-500 h-4 w-4" />}
          value={engagement?.rank}
          title={t`Engagement Rank`}
        >
          {engagement ? (
            engagement.rank
          ) : (
            <div className="shimmer h-4 w-5 rounded" />
          )}
        </MetaDetails>
        <MetaDetails
          icon={<UserCircleIcon className="lt-text-gray-500 h-4 w-4" />}
          value={influencer?.rank}
          title={t`Influencer Rank`}
        >
          {influencer ? (
            influencer.rank
          ) : (
            <div className="shimmer h-4 w-5 rounded" />
          )}
        </MetaDetails>
        <MetaDetails
          icon={<CurrencyDollarIcon className="lt-text-gray-500 h-4 w-4" />}
          value={creator?.rank}
          title={t`Creator Rank`}
        >
          {creator ? creator.rank : <div className="shimmer h-4 w-5 rounded" />}
        </MetaDetails>
        <MetaDetails
          icon={<CheckCircleIcon className="lt-text-gray-500 h-4 w-4" />}
          value={gitcoinScore?.evidence?.rawScore}
          title={t`Gitcoin Score`}
        >
          {gitcoinScore ? (
            <span>
              {parseInt(gitcoinScore?.evidence?.rawScore) > 0 ? (
                <>
                  {parseFloat(gitcoinScore?.evidence?.rawScore).toFixed(2)}
                  <span className="lt-text-gray-500 text-xs">
                    {' '}
                    (Updated: {formatDate(gitcoinScore?.last_score_timestamp)})
                  </span>
                </>
              ) : (
                'Not scored'
              )}
            </span>
          ) : (
            <div className="shimmer h-4 w-5 rounded" />
          )}
        </MetaDetails>
      </div>
    </>
  );
};

export default Rank;
