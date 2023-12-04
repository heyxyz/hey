import type { PublicationsRequest } from '@hey/lens';
import type { FC } from 'react';

import { SETTINGS } from '@hey/data/tracking';
import { LimitType, usePublicationsLazyQuery } from '@hey/lens';
import downloadJson from '@hey/lib/downloadJson';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

const Publications: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [publications, setPublications] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: { from: currentProfile?.id }
  };

  const [exportPublications] = usePublicationsLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    Leafwatch.track(SETTINGS.EXPORT.PUBLICATIONS);
    setExporting(true);
    const fetchPublications = async (cursor?: string) => {
      const { data } = await exportPublications({
        onCompleted: (data) => {
          setPublications((prev) => {
            const newPublications = data.publications.items.filter(
              (newPublication) => {
                return !prev.some(
                  (publication) => publication.id === newPublication.id
                );
              }
            );

            return [...prev, ...newPublications];
          });
        },
        variables: { request: { ...request, cursor } }
      });

      if (
        data?.publications.items.length === 0 ||
        !data?.publications.pageInfo.next
      ) {
        setFetchCompleted(true);
        setExporting(false);
      } else {
        await fetchPublications(data?.publications.pageInfo.next);
      }
    };

    await fetchPublications();
  };

  const download = () => {
    downloadJson(publications, 'publications', () => {
      setPublications([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Export publications</div>
      <div className="pb-2">
        Export all your posts, comments and mirrors to a JSON file.
      </div>
      {publications.length > 0 ? (
        <div className="pb-2">
          Exported <b>{publications.length}</b> publications
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={download}>Download publications</Button>
      ) : (
        <Button disabled={exporting} onClick={handleExportClick}>
          {exporting ? 'Exporting...' : 'Export now'}
        </Button>
      )}
    </Card>
  );
};

export default Publications;
