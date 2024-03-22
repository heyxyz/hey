import type { FollowingRequest } from '@hey/lens';
import type { FC } from 'react';

import { SETTINGS } from '@hey/data/tracking';
import { LimitType, useFollowingLazyQuery } from '@hey/lens';
import downloadJson from '@hey/lib/downloadJson';
import { Button, Card, CardHeader } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

const Following: FC = () => {
  const { currentProfile } = useProfileStore();
  const [following, setFollowing] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: FollowingRequest = {
    for: currentProfile?.id,
    limit: LimitType.TwentyFive
  };

  const [exportFollowing] = useFollowingLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    Leafwatch.track(SETTINGS.EXPORT.FOLLOWING);
    setExporting(true);
    const fetchFollowing = async (cursor?: string) => {
      const { data } = await exportFollowing({
        onCompleted: (data) => {
          setFollowing((prev) => {
            const newFollowing = data.following.items.filter((newFollowing) => {
              return !prev.some(
                (following) => following.id === newFollowing.id
              );
            });

            return [...prev, ...newFollowing];
          });
        },
        variables: { request: { ...request, cursor } }
      });

      if (
        data?.following.items.length === 0 ||
        !data?.following.pageInfo.next
      ) {
        setFetchCompleted(true);
        setExporting(false);
      } else {
        await fetchFollowing(data?.following.pageInfo.next);
      }
    };

    await fetchFollowing();
  };

  const download = () => {
    downloadJson(following, 'following', () => {
      setFollowing([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card>
      <CardHeader
        body="Export all your following to a JSON file."
        title="Export following"
      />
      <div className="m-5">
        {following.length > 0 ? (
          <div className="pb-2">
            Exported <b>{following.length}</b> following
          </div>
        ) : null}
        {fetchCompleted ? (
          <Button onClick={download} outline>
            Download following
          </Button>
        ) : (
          <Button disabled={exporting} onClick={handleExportClick} outline>
            {exporting ? 'Exporting...' : 'Export now'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Following;
