import Beta from '@components/Shared/Badges/Beta';
import { Card } from '@components/UI/Card';
import { Toggle } from '@components/UI/Toggle';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { usePreferencesStore } from 'src/store/preferences';

const LikesPreferences: FC = () => {
  const hideLikesCount = usePreferencesStore((state) => state.hideLikesCount);
  const setHideLikesCount = usePreferencesStore((state) => state.setHideLikesCount);

  return (
    <Card className="linkify space-y-2 p-5">
      <div className="flex items-center space-x-2">
        <div className="text-lg font-bold">
          <Trans>Hide number of likes</Trans>
        </div>
        <Beta />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="lt-text-gray-500 mr-5">
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
    </Card>
  );
};

export default LikesPreferences;
