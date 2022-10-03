import { Card } from '@components/UI/Card';
import getAvatar from '@lib/getAvatar';
import { FC } from 'react';
import { useAppStore } from 'src/store/app';

const NewPostV2: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Card className="p-5">
      <div className="flex items-center space-x-3">
        <img
          src={getAvatar(currentProfile)}
          className="h-9 w-9 bg-gray-200 rounded-full border dark:border-gray-700/80"
          alt={currentProfile?.handle}
        />
        <div className="w-full bg-gray-100 dark:bg-gray-900 px-5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer">
          What's happening?
        </div>
      </div>
    </Card>
  );
};

export default NewPostV2;
