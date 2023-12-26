import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import Loader from '@components/Shared/Loader';
import { PencilIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { usePublicationsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';

const List: FC = () => {
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const getTop50Publications = async (): Promise<
    [] | [{ count: number; id: string }]
  > => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/internal/leafwatch/top50Publications`
      );

      return response.data.result;
    } catch {
      return [];
    }
  };

  const { data: top50Publications } = useQuery({
    queryFn: () => getTop50Publications(),
    queryKey: ['getTop50Publications']
  });

  const publicationIds = top50Publications?.map((p) => p.id) || [];

  const { data, error, loading } = usePublicationsQuery({
    onCompleted: async ({ publications }) => {
      const ids = publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    },
    skip: publicationIds.length === 0,
    variables: { request: { where: { publicationIds } } }
  });

  const publications = data?.publications.items || [];

  return (
    <Card>
      <div className="space-x-5 p-5">
        <div className="text-lg font-bold">
          Top Publications in the last 24h
        </div>
      </div>
      <div className="divider" />
      <div className="p-5">
        {loading ? (
          <Loader message="Loading top publications..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load top publications" />
        ) : !publications.length ? (
          <EmptyState
            hideCard
            icon={<PencilIcon className="text-brand-500 size-8" />}
            message={<span>No top publications found</span>}
          />
        ) : (
          <div className="space-y-5 -p-5">
            {publications?.map((publication) => (
              <Card forceRounded key={publication.id}>
                <SinglePublication
                  isFirst
                  isLast
                  publication={publication as AnyPublication}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default List;
