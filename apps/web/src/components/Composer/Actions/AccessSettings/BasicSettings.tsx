import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Card } from '@components/UI/Card';
import { UsersIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';

const BasicSettings: FC = () => {
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const setRestricted = useAccessSettingsStore((state) => state.setRestricted);
  const followToView = useAccessSettingsStore((state) => state.followToView);
  const setFollowToView = useAccessSettingsStore((state) => state.setFollowToView);

  return (
    <div className="p-5">
      <ToggleWithHelper
        on={restricted}
        setOn={() => {
          setRestricted(!restricted);
        }}
        label="Add restrictions on who can view this post"
      />
      {restricted && (
        <Card className="p-5 mt-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-4 w-4 text-brand-500" />
              <span>Followers can view</span>
            </div>
            <ToggleWithHelper
              on={followToView}
              setOn={() => setFollowToView(!followToView)}
              label="People need to follow you to be able to view it"
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default BasicSettings;
