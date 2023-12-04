import type { FollowersRequest } from '@hey/lens';
import type { FC } from 'react';

import { SETTINGS } from '@hey/data/tracking';
import { LimitType, useFollowersLazyQuery } from '@hey/lens';
import downloadJson from '@hey/lib/downloadJson';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

const Followers: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [followers, setFollowers] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: FollowersRequest = {
    limit: LimitType.TwentyFive,
    of: currentProfile?.id
  };

  const [exportFollowers] = useFollowersLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    Leafwatch.track(SETTINGS.EXPORT.FOLLOWERS);
    setExporting(true);
    const fetchFollowers = async (cursor?: string) => {
      const { data } = await exportFollowers({
        onCompleted: (data) => {
          setFollowers((prev) => {
            const newFollowers = data.followers.items.filter((newFollower) => {
              return !prev.some((follower) => follower.id === newFollower.id);
            });

            return [...prev, ...newFollowers];
          });
        },
        variables: { request: { ...request, cursor } }
      });

      if (
        data?.followers.items.length === 0 ||
        !data?.followers.pageInfo.next
      ) {
        setFetchCompleted(true);
        setExporting(false);
      } else {
        await fetchFollowers(data?.followers.pageInfo.next);
      }
    };

    await fetchFollowers();
  };

  const download = () => {
    downloadJson(followers, 'followers', () => {
      setFollowers([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Export followers</div>
      <div className="pb-2">Export all your followers to a JSON file.</div>
      {followers.length > 0 ? (
        <div className="pb-2">
          Exported <b>{followers.length}</b> followers
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={download}>Download followers</Button>
      ) : (
        <Button disabled={exporting} onClick={handleExportClick}>
          {exporting ? 'Exporting...' : 'Export now'}
        </Button>
      )}
    </Card>
  );
};

export default Followers;
