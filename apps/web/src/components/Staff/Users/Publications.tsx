import type {
  AnyPublication,
  MirrorablePublication,
  PublicationsRequest
} from '@hey/lens';
import type { FC } from 'react';

import GardenerActions from '@components/Publication/Actions/GardenerActions';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { CustomFiltersType, LimitType, usePublicationsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';

interface PublicationsProps {
  profileId: string;
}

const Publications: FC<PublicationsProps> = ({ profileId }) => {
  // Variables
  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: { customFilters: [CustomFiltersType.Gardeners], from: [profileId] }
  };

  const { data, error, fetchMore, loading } = usePublicationsQuery({
    variables: { request }
  });

  const publications = data?.publications?.items;
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return (
      <div className="m-5">
        <PublicationsShimmer />
      </div>
    );
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<RectangleStackIcon className="text-brand-500 size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load profile feed"
      />
    );
  }

  return (
    <div className="m-5 space-y-5">
      {publications?.map((publication, index) => (
        <Card key={`${publication.id}_${index}`}>
          <SinglePublication
            isFirst
            isLast={false}
            publication={publication as AnyPublication}
            showActions={false}
            showThread={false}
          />
          <div>
            <div className="divider" />
            <div className="m-5 space-y-2">
              <b>Gardener actions</b>
              <GardenerActions
                publication={publication as MirrorablePublication}
              />
            </div>
          </div>
        </Card>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default Publications;
