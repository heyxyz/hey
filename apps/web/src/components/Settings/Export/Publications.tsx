import { Trans } from '@lingui/macro';
import type { PublicationsQueryRequest } from 'lens';
import { PublicationTypes, useProfileFeedLazyQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { Button, Card } from 'ui';

const Publications: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [publications, setPublications] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: PublicationsQueryRequest = {
    profileId: currentProfile?.id,
    publicationTypes: [PublicationTypes.Post, PublicationTypes.Comment, PublicationTypes.Mirror],
    limit: 50
  };

  const [exportPublications] = useProfileFeedLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    setExporting(true);
    const fetchPublications = async (cursor?: string) => {
      const { data } = await exportPublications({
        variables: { request: { ...request, cursor } },
        onCompleted: (data) => {
          setPublications((prev) => {
            const newPublications = data.publications.items.filter((newPublication) => {
              return !prev.some((publication) => publication.id === newPublication.id);
            });

            return [...prev, ...newPublications];
          });
        }
      });

      if (data?.publications.pageInfo.next) {
        await fetchPublications(data?.publications.pageInfo.next);
      } else {
        if (cursor) {
          setFetchCompleted(true);
          setExporting(false);
        }
      }
    };

    await fetchPublications();
  };

  const downloadPublications = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(publications)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'publications.json';
    document.body.appendChild(element);
    element.click();

    setPublications([]);
    setFetchCompleted(false);
  };

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">
        <Trans>Export Publications</Trans>
      </div>
      <div className="pb-2">
        <Trans>Export all your posts, comments and mirrors to a JSON file.</Trans>
      </div>
      {publications.length > 0 ? (
        <div className="pb-2">
          Exported <b>{publications.length}</b> publications
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={downloadPublications}>
          <Trans>Download Publication</Trans>
        </Button>
      ) : (
        <Button onClick={handleExportClick} disabled={exporting}>
          <Trans>Export now</Trans>
        </Button>
      )}
    </Card>
  );
};

export default Publications;
