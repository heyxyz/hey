import TrendingTagShimmer from '@components/Shared/Shimmer/TrendingTagShimmer';
import { TrendingUpIcon } from '@heroicons/react/solid';
import { Mixpanel } from '@lib/leafwatch';
import { Plural, t, Trans } from '@lingui/macro';
import type { TagResult } from 'lens';
import { TagSortCriteria, useTrendingQuery } from 'lens';
import nFormatter from 'lib/nFormatter';
import Link from 'next/link';
import type { FC } from 'react';
import { MISCELLANEOUS } from 'src/tracking';
import { Card, ErrorMessage } from 'ui';

const Title = () => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <TrendingUpIcon className="h-4 w-4 text-green-500" />
      <div>
        <Trans>Trending</Trans>
      </div>
    </div>
  );
};

const Trending: FC = () => {
  const { data, loading, error } = useTrendingQuery({
    variables: { request: { limit: 7, sort: TagSortCriteria.MostPopular } }
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
        <ErrorMessage title={t`Failed to load trending`} error={error} />
        {data?.allPublicationsTags?.items?.map((tag: TagResult) =>
          tag?.tag !== '{}' ? (
            <div key={tag?.tag}>
              <Link
                href={`/search?q=${tag?.tag}&type=pubs`}
                onClick={() =>
                  Mixpanel.track(MISCELLANEOUS.OPEN_TRENDING_TAG, {
                    trending_tag: tag?.tag
                  })
                }
              >
                <div className="font-bold">{tag?.tag}</div>
                <div className="lt-text-gray-500 text-[12px]">
                  {nFormatter(tag?.total)}{' '}
                  <Plural
                    value={tag?.total}
                    zero="Publication"
                    one="Publication"
                    other="Publications"
                  />
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
