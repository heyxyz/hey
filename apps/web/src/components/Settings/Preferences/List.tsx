import Beta from '@components/Shared/Badges/Beta';
import New from '@components/Shared/Badges/New';
import { Card } from '@components/UI/Card';
import { Toggle } from '@components/UI/Toggle';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { usePreferencesStore } from 'src/store/preferences';

const PreferencesList: FC = () => {
  // Likes preference
  const hideLikesCount = usePreferencesStore((state) => state.hideLikesCount);
  const setHideLikesCount = usePreferencesStore((state) => state.setHideLikesCount);

  // Wav3s preference
  const hideWav3sReward = usePreferencesStore((state) => state.hideWav3sReward);
  const setHideWav3sReward = usePreferencesStore((state) => state.setHideWav3sReward);

  return (
    <Card className="p-5">
      <div className="space-y-5">
        <div className="flex items-center space-x-2">
          <div className="text-lg font-bold">
            <Trans>Preferences</Trans>
          </div>
          <Beta />
          <New />
        </div>
        <p>
          <Trans>
            Customize your experience by updating your preferences. You can change these at any time. Please
            note all changes are not synced across devices.
          </Trans>
        </p>
      </div>
      <div className="divider my-5" />
      <div className="space-y-2">
        <div className="flex items-center space-x-2 label">
          <Trans>Hide likes count</Trans>
        </div>
        <div className="flex items-center space-x-2 justify-between">
          <div className="mr-5 lt-text-gray-500">
            <Trans>
              You won't see the total number of likes for publications others share to Feed. Your likes to a
              post will still be visible to you and everyone else.
            </Trans>
          </div>
          <div>
            <Toggle on={hideLikesCount} setOn={setHideLikesCount} />
          </div>
        </div>
      </div>
      <div className="divider my-5" />
      <div className="space-y-2">
        <div className="flex items-center space-x-2 label">
          <Trans>Show wav3s rewards</Trans>
        </div>
        <div className="flex items-center space-x-2 justify-between">
          <div className="mr-5 lt-text-gray-500">
            <Trans>
              Show wav3s rewards related information on publications. So you can see how much you can earn
              from mirroring the publication.
            </Trans>
          </div>
          <div>
            <Toggle on={hideWav3sReward} setOn={setHideWav3sReward} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PreferencesList;
