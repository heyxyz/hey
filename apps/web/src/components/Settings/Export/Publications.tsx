import { Leafwatch } from "@helpers/leafwatch";
import { SETTINGS } from "@hey/data/tracking";
import downloadJson from "@hey/helpers/downloadJson";
import type { PublicationsRequest } from "@hey/lens";
import { LimitType, usePublicationsLazyQuery } from "@hey/lens";
import { Button, Card, CardHeader } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";

const Publications: FC = () => {
  const { currentProfile } = useProfileStore();
  const [publications, setPublications] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: { from: currentProfile?.id }
  };

  const [exportPublications] = usePublicationsLazyQuery({
    fetchPolicy: "network-only"
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
    downloadJson(publications, "publications", () => {
      setPublications([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card>
      <CardHeader
        body="Export all your posts, comments and mirrors to a JSON file."
        title="Export publications"
      />
      <div className="m-5">
        {publications.length > 0 ? (
          <div className="pb-2">
            Exported <b>{publications.length}</b> publications
          </div>
        ) : null}
        {fetchCompleted ? (
          <Button onClick={download} outline>
            Download publications
          </Button>
        ) : (
          <Button disabled={exporting} onClick={handleExportClick} outline>
            {exporting ? "Exporting..." : "Export now"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Publications;
