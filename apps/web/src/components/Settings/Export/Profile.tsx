import type { ProfileRequest, Profile as TProfile } from '@hey/lens';
import type { FC } from 'react';

import { SETTINGS } from '@hey/data/tracking';
import { useProfileLazyQuery } from '@hey/lens';
import downloadJson from '@hey/lib/downloadJson';
import { Button, Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

const Profile: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [profile, setProfile] = useState<null | TProfile>(null);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: ProfileRequest = {
    forProfileId: currentProfile?.id
  };

  const [exportProfile] = useProfileLazyQuery({
    fetchPolicy: 'network-only',
    variables: { request }
  });

  const handleExportClick = () => {
    Leafwatch.track(SETTINGS.EXPORT.PROFILE);
    setExporting(true);
    exportProfile({
      onCompleted: ({ profile }) => {
        setProfile(profile as TProfile);
        setFetchCompleted(true);
        setExporting(false);
      }
    });
  };

  const download = () => {
    downloadJson(profile, 'profile', () => {
      setProfile(null);
      setFetchCompleted(false);
    });
  };

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Export profile</div>
      <div className="pb-2">Export all your profile data to a JSON file.</div>
      {fetchCompleted ? (
        <Button onClick={download}>Download profile</Button>
      ) : (
        <Button disabled={exporting} onClick={handleExportClick}>
          {exporting ? 'Exporting...' : 'Export now'}
        </Button>
      )}
    </Card>
  );
};

export default Profile;
