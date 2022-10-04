import { useQuery } from '@apollo/client';
import TrendingTagShimmer from '@components/Shared/Shimmer/TrendingTagShimmer';
import { Card, CardBody } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { TagResult, TagSortCriteria, TrendingDocument } from '@generated/types';
import { TrendingUpIcon } from '@heroicons/react/solid';
import { Mixpanel } from '@lib/mixpanel';
import nFormatter from '@lib/nFormatter';
import Link from 'next/link';
import { FC } from 'react';
import { MISCELLANEOUS } from 'src/tracking';

const Title = () => {
  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      <TrendingUpIcon className="w-4 h-4 text-green-500" />
      <div>Trending</div>
    </div>
  );
};

const Trending: FC = () => {
  const { data, loading, error } = useQuery(TrendingDocument, {
    variables: {
      request: { limit: 7, sort: TagSortCriteria.MostPopular }
    },
    pollInterval: 10000
  });

  if (loading) {
    return (
      <>
        <Title />
        <Card className="mb-4">
          <CardBody className="space-y-4">
            <TrendingTagShimmer />
            <TrendingTagShimmer />
            <TrendingTagShimmer />
            <TrendingTagShimmer />
            <TrendingTagShimmer />
            <TrendingTagShimmer />
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <Title />
      <Card as="aside" className="mb-4">
        <CardBody className="space-y-4">
          <ErrorMessage title="Failed to load recommendations" error={error} />
          {data?.allPublicationsTags?.items?.map((tag: TagResult) =>
            tag?.tag !== '{}' ? (
              <div key={tag?.tag}>
                <Link
                  href={`/search?q=${tag?.tag}&type=pubs`}
                  onClick={() => Mixpanel.track(MISCELLANEOUS.OPEN_TRENDING_TAG)}
                >
                  <div className="font-bold">{tag?.tag}</div>
                  <div className="text-[12px] text-gray-500">{nFormatter(tag?.total)} Publications</div>
                </Link>
              </div>
            ) : null
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default Trending;
