import ToggleDispatcher from '@components/Settings/Dispatcher/ToggleDispatcher';
import { Card, CardBody } from '@components/UI/Card';
import { HandIcon } from '@heroicons/react/outline';
import { FC } from 'react';
import { APP_NAME } from 'src/constants';
import { useAppStore } from 'src/store/app';

const EnableDispatcher: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (currentProfile?.dispatcher?.canUseRelay) {
    return null;
  }

  return (
    <Card className="mb-4 bg-red-50 dark:bg-red-900 !border-red-600">
      <CardBody className="space-y-2.5 text-red-600">
        <div className="flex items-center space-x-2 font-bold">
          <HandIcon className="w-5 h-5" />
          <p>Set dispatcher</p>
        </div>
        <p className="text-sm leading-[22px]">
          We suggest you to enable dispatcher so you don't want to sign all your transactions in {APP_NAME}.
        </p>
        <ToggleDispatcher buttonSize="sm" />
      </CardBody>
    </Card>
  );
};

export default EnableDispatcher;
