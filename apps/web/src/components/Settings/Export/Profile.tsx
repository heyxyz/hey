import type { ProfileRequest, Profile as TProfile } from '@hey/lens';
import type { FC } from 'react';

import { SETTINGS } from '@hey/data/tracking';
import downloadJson from '@hey/helpers/downloadJson';
import { useProfileLazyQuery } from '@hey/lens';
import { Button, Card, CardHeader } from '@hey/ui';
import { useState } from 'react';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

const Profile: FC = () => {
  const { currentProfile } = useProfileStore();
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
    <Card>
      <CardHeader
        body="Export all your profile data to a JSON file."
        title="Export profile"
      />
      <div className="m-5">
        {fetchCompleted ? (
          <Button onClick={download} outline>
            Download profile
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

export default Profile;
