'use client';
import downloadJson from '@lib/downloadJson';
import { Mixpanel } from '@lib/mixpanel';
import { Trans } from '@lingui/macro';
import type { PublicationsQueryRequest } from 'lens';
import { PublicationTypes, useProfileFeedLazyQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { Button, Card } from 'ui';

const Publications: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [publications, setPublications] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: PublicationsQueryRequest = {
    profileId: currentProfile?.id,
    publicationTypes: [
      PublicationTypes.Post,
      PublicationTypes.Comment,
      PublicationTypes.Mirror
    ],
    limit: 50
  };

  const [exportPublications] = useProfileFeedLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    Mixpanel.track(SETTINGS.EXPORT.PUBLICATIONS);
    setExporting(true);
    const fetchPublications = async (cursor?: string) => {
      const { data } = await exportPublications({
        variables: { request: { ...request, cursor } },
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
        }
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
      <div className="text-lg font-bold">
        <Trans>Export publications</Trans>
      </div>
      <div className="pb-2">
        <Trans>
          Export all your posts, comments and mirrors to a JSON file.
        </Trans>
      </div>
      {publications.length > 0 ? (
        <div className="pb-2">
          <Trans>
            Exported <b>{publications.length}</b> publications
          </Trans>
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={download}>
          <Trans>Download publications</Trans>
        </Button>
      ) : (
        <Button onClick={handleExportClick} disabled={exporting}>
          {exporting ? <Trans>Exporting...</Trans> : <Trans>Export now</Trans>}
        </Button>
      )}
    </Card>
  );
};

export default Publications;
