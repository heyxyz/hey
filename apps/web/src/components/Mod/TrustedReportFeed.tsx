import type { AnyPublication, PublicationsRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { LimitType, usePublicationsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';

import Actions from './Actions';

const TrustedReportFeed: FC = () => {
  const [displayedPublications, setDisplayedPublications] = useState<any[]>([]);

  const limit = LimitType.TwentyFive;
  const offset = displayedPublications.length;

  const getTrustedReportFeed = async (
    limit: null | number,
    offset: null | number
  ) => {
    try {
      const response = await axios.get(`${HEY_API_URL}/trusted/publications`, {
        params: { limit, offset }
      });

      return response.data.success ? response.data.ids : [];
    } catch {
      return [];
    }
  };

  const {
    data: publicationIds,
    error: algoError,
    isLoading: algoLoading
  } = useQuery({
    queryFn: async () => await getTrustedReportFeed(25, offset),
    queryKey: ['getTrustedReportFeed', 25, offset]
  });

  const request: PublicationsRequest = {
    limit,
    where: { publicationIds }
  };

  const { data, error, loading } = usePublicationsQuery({
    fetchPolicy: 'no-cache',
    skip: !publicationIds,
    variables: { request }
  });

  const publications = [
    ...displayedPublications,
    ...(data?.publications?.items || [])
  ];

  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (!inView) {
        return;
      }

      if (publications.length !== displayedPublications.length) {
        setDisplayedPublications(publications);
      }
    }
  });

  if (publications.length === 0 && (algoLoading || loading)) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<SparklesIcon className="text-brand-500 size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (publications.length === 0 && (error || algoError)) {
    return <ErrorMessage error={error} title="Failed to load for you" />;
  }

  return (
    <div className="space-y-5">
      {publications?.map((publication, index) => (
        <Card key={`${publication.id}_${index}`}>
          <SinglePublication
            isFirst
            isLast
            publication={publication as AnyPublication}
            showActions={false}
            showThread={false}
          />
          <Actions hideTrustedReport publicationId={publication.id} />
        </Card>
      ))}
      <span ref={observe} />
    </div>
  );
};

export default TrustedReportFeed;
