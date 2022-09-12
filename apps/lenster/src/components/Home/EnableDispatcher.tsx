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
    <Card as="aside" className="mb-4 bg-brand-50 dark:bg-brand-900 !border-brand-600">
      <CardBody className="space-y-2.5 text-brand-600">
        <div className="flex items-center space-x-2 font-bold">
          <HandIcon className="w-5 h-5" />
          <p>Action Required</p>
        </div>
        <p className="text-sm leading-[22px]">
          You can enable dispatcher to interact with {APP_NAME} without signing any of your transactions.
        </p>
        <ToggleDispatcher buttonSize="sm" />
      </CardBody>
    </Card>
  );
};

export default EnableDispatcher;
