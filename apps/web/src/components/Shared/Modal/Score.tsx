import type { ScoreAllocation } from '@hey/types/hey';
import type { FC } from 'react';

import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { APP_NAME, HEY_API_URL, STATIC_IMAGES_URL } from '@hey/data/constants';
import humanize from '@hey/helpers/humanize';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const Score: FC = () => {
  const { score, scoreViewerProfileId } = useGlobalModalStateStore();
  const renderScore =
    score !== 0 ? (score ? humanize(score) : '...') : 'Not calculated yet';

  const getAllocations = async (
    profileId: null | string
  ): Promise<ScoreAllocation[]> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/score/allocations`, {
        params: { id: profileId }
      });
      return response.data.result;
    } catch {
      return [];
    }
  };

  const { data } = useQuery({
    enabled: Boolean(scoreViewerProfileId),
    queryFn: () => getAllocations(scoreViewerProfileId),
    queryKey: ['getAllocations', scoreViewerProfileId]
  });

  return (
    <div className="flex flex-col items-center space-y-5 p-5">
      <img
        alt="Score"
        className="size-14"
        src={`${STATIC_IMAGES_URL}/app-icon/2.png`}
      />
      <div className="flex flex-col items-center space-y-2">
        <div className="font-bold">Score</div>
        <div className="w-fit rounded-full bg-gradient-to-r from-green-500 to-cyan-500 px-4 py-0.5 !text-lg font-bold text-white">
          {renderScore}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center leading-7">
          <b>{APP_NAME} score</b> is determined by a super-secret algorithm that
          combines the number of crucial interactions you've received, the
          publications you've posted, and lot other factors 🤓
        </div>
        <Link
          className="text-brand-500 underline"
          href="https://yoginth.notion.site/4010193edb6e4bd98cf1e26561859ba1"
          target="_blank"
        >
          Read more about {APP_NAME} score
        </Link>
      </div>
      {(data || [])?.length > 0 ? (
        <div className="space-y-2">
          {data?.map((allocation) => (
            <div
              className="flex items-center space-x-2 text-sm"
              key={allocation.id}
            >
              <div className="flex items-center space-x-1 font-bold text-green-500">
                <ArrowTrendingUpIcon className="size-4" />
                <div>{allocation.score}</div>
              </div>
              <ArrowLongRightIcon className="size-4" />
              <div className="flex items-center space-x-2">
                <img
                  alt={allocation.name}
                  className="h-4"
                  src={allocation.icon}
                />
                <div>{allocation.name}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Score;
