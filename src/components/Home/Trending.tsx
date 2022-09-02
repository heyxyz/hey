import { gql, useQuery } from '@apollo/client';
import TrendingTagShimmer from '@components/Shared/Shimmer/TrendingTagShimmer';
import { Card, CardBody } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { TagResult, TagSortCriteria } from '@generated/types';
import { TrendingUpIcon } from '@heroicons/react/solid';
import nFormatter from '@lib/nFormatter';
import { hashflags } from 'data/hashflags';
import Link from 'next/link';
import React, { FC } from 'react';
import { STATIC_ASSETS } from 'src/constants';

export const TRENDING_QUERY = gql`
  query Trending($request: AllPublicationsTagsRequest!) {
    allPublicationsTags(request: $request) {
      items {
        tag
        total
      }
    }
  }
`;

const Title = () => {
  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      <TrendingUpIcon className="w-4 h-4 text-green-500" />
      <div>Trending</div>
    </div>
  );
};

interface HashflagProps {
  tag: string;
}

const Hashflag: FC<HashflagProps> = ({ tag }) => {
  const hashflag = tag.toLowerCase();
  const hasHashflag = hashflags.hasOwnProperty(hashflag);

  if (!hasHashflag) {
    return null;
  }

  return (
    <img
      className="h-4 !mr-0.5"
      height={16}
      src={`${STATIC_ASSETS}/hashflags/${hashflags[hashflag]}.png`}
      alt={hashflag}
    />
  );
};

const Trending: FC = () => {
  const { data, loading, error } = useQuery(TRENDING_QUERY, {
    variables: {
      request: { limit: 7, sort: TagSortCriteria.MostPopular }
    }
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
          {data?.allPublicationsTags?.items?.map((tag: TagResult) => (
            <div key={tag?.tag}>
              <Link href={`/search?q=${tag?.tag}&type=pubs`}>
                <div className="font-bold flex items-center space-x-1.5">
                  <span>#{tag?.tag}</span>
                  <Hashflag tag={tag?.tag} />
                </div>
                <div className="text-[12px] text-gray-500">{nFormatter(tag?.total)} Publications</div>
              </Link>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
};

export default Trending;
