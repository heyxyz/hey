import Beta from '@components/Shared/Badges/Beta';
import { Card } from '@components/UI/Card';
import { Toggle } from '@components/UI/Toggle';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const LikesPreferences: FC = () => {
  return (
    <Card className="space-y-2 linkify p-5">
      <div className="flex items-center space-x-2">
        <div className="text-lg font-bold">
          <Trans>Hide number of likes</Trans>
        </div>
        <Beta />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="mr-5 lt-text-gray-500">
            <Trans>
              You won't see the total number of likes for publications others share to Feed. Your likes to a
              post will still be visible to you and everyone else.
            </Trans>
          </div>
          <div>
            <Toggle on={true} setOn={() => {}} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LikesPreferences;
