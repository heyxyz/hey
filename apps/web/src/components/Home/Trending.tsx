import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { MISCELLANEOUS } from '@hey/data/tracking';
import type { TagResult } from '@hey/lens';
import {
  LimitType,
  TagSortCriteriaType,
  usePublicationsTagsQuery
} from '@hey/lens';
import nFormatter from '@hey/lib/nFormatter';
import { Card, ErrorMessage } from '@hey/ui';
import plur from 'plur';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

import TrendingTagShimmer from '@/components/Shared/Shimmer/TrendingTagShimmer';
import { Leafwatch } from '@/lib/leafwatch';

const Title = () => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
      <div>Trending</div>
    </div>
  );
};

const Trending: FC = () => {
  const { data, loading, error } = usePublicationsTagsQuery({
    variables: {
      request: {
        orderBy: TagSortCriteriaType.MostPopular,
        limit: LimitType.Ten
      }
    }
  });

  if (loading) {
    return (
      <>
        <Title />
        <Card className="mb-4 space-y-4 p-5">
          <TrendingTagShimmer />
          <TrendingTagShimmer />
          <TrendingTagShimmer />
          <TrendingTagShimmer />
          <TrendingTagShimmer />
          <TrendingTagShimmer />
        </Card>
      </>
    );
  }

  return (
    <>
      <Title />
      <Card as="aside" className="mb-4 space-y-4 p-5">
        <ErrorMessage title="Failed to load trending" error={error} />
        {data?.publicationsTags?.items?.map((tag: TagResult) =>
          tag?.tag !== '{}' ? (
            <div key={tag?.tag}>
              <Link
                to={`/search?q=${tag?.tag}&type=pubs`}
                onClick={() =>
                  Leafwatch.track(MISCELLANEOUS.OPEN_TRENDING_TAG, {
                    trending_tag: tag?.tag
                  })
                }
              >
                <div className="font-bold">{tag?.tag}</div>
                <div className="ld-text-gray-500 text-[12px]">
                  {nFormatter(tag?.total)} {plur('Publication', tag?.total)}
                </div>
              </Link>
            </div>
          ) : null
        )}
      </Card>
    </>
  );
};

export default Trending;
