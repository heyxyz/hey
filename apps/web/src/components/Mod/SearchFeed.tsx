import type { AnyPublication, PublicationSearchRequest } from '@hey/lens';
import type { FC } from 'react';

import GardenerActions from '@components/Publication/Actions/GardenerActions';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { GARDENER } from '@hey/data/tracking';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import {
  CustomFiltersType,
  LimitType,
  useSearchPublicationsQuery
} from '@hey/lens';
import { Button, Card, EmptyState, ErrorMessage, Input } from '@hey/ui';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Leafwatch } from 'src/helpers/leafwatch';

const SearchFeed: FC = () => {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState('');

  // Variables
  const request: PublicationSearchRequest = {
    limit: LimitType.Fifty,
    query,
    where: { customFilters: [CustomFiltersType.Gardeners] }
  };

  const { data, error, fetchMore, loading } = useSearchPublicationsQuery({
    skip: !query,
    variables: { request }
  });

  const search = data?.searchPublications;
  const publications = search?.items as AnyPublication[];
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    return await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  const Search = () => {
    return (
      <form
        className="flex items-center space-x-2"
        onSubmit={() => {
          Leafwatch.track(GARDENER.SEARCH_PUBLICATION, { query: value });
          setQuery(value);
        }}
      >
        <Input
          autoFocus
          onChange={(event) => {
            setValue(event.target.value);
          }}
          placeholder="Search Publications"
          type="text"
          value={value}
        />
        <Button size="lg">Search</Button>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <Search />
        <PublicationsShimmer />
      </div>
    );
  }

  if (!query || publications?.length === 0) {
    return (
      <div className="space-y-5">
        <Search />
        <EmptyState
          icon={<RectangleStackIcon className="size-8" />}
          message="No posts yet!"
        />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load search feed" />;
  }

  return (
    <div className="space-y-5">
      <Search />
      <Virtuoso
        className="[&>div>div]:space-y-5"
        components={{ Footer: () => <div className="pb-5" /> }}
        computeItemKey={(index, publication) => `${publication.id}-${index}`}
        data={publications}
        endReached={onEndReached}
        itemContent={(index, publication) => {
          const targetPublication = isMirrorPublication(publication)
            ? publication.mirrorOn
            : publication;

          return (
            <Card>
              <SinglePublication
                isFirst
                isLast={false}
                publication={publication as AnyPublication}
                showActions={false}
                showThread={false}
              />
              <div className="divider" />
              <div className="m-5">
                <GardenerActions publication={targetPublication} />
              </div>
            </Card>
          );
        }}
        useWindowScroll
      />
    </div>
  );
};

export default SearchFeed;
