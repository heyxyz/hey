import downloadJson from '@lib/downloadJson';
import { Mixpanel } from '@lib/mixpanel';
import { Trans } from '@lingui/macro';
import type { FollowersRequest } from 'lens';
import { useFollowersLazyQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { Button, Card } from 'ui';

const Followers: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [followers, setFollowers] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: FollowersRequest = {
    profileId: currentProfile?.id,
    limit: 50
  };

  const [exportFollowers] = useFollowersLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    Mixpanel.track(SETTINGS.EXPORT.FOLLOWERS);
    setExporting(true);
    const fetchFollowers = async (cursor?: string) => {
      const { data } = await exportFollowers({
        variables: { request: { ...request, cursor } },
        onCompleted: (data) => {
          setFollowers((prev) => {
            const newFollowers = data.followers.items.filter((newFollower) => {
              return !prev.some(
                (follower) =>
                  follower.wallet.address === newFollower.wallet.address
              );
            });

            return [...prev, ...newFollowers];
          });
        }
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
      <div className="text-lg font-bold">
        <Trans>Export followers</Trans>
      </div>
      <div className="pb-2">
        <Trans>Export all your followers to a JSON file.</Trans>
      </div>
      {followers.length > 0 ? (
        <div className="pb-2">
          <Trans>
            Exported <b>{followers.length}</b> followers
          </Trans>
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={download}>
          <Trans>Download followers</Trans>
        </Button>
      ) : (
        <Button onClick={handleExportClick} disabled={exporting}>
          {exporting ? <Trans>Exporting...</Trans> : <Trans>Export now</Trans>}
        </Button>
      )}
    </Card>
  );
};

export default Followers;
