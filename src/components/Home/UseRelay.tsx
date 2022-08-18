import { Button } from '@components/UI/Button';
import { Card, CardBody } from '@components/UI/Card';
import { HandIcon } from '@heroicons/react/outline';
import { FC } from 'react';
import { useAppPersistStore } from 'src/store/app';

const UseRelay: FC = () => {
  const canUseRelay = useAppPersistStore((state) => state.canUseRelay);

  if (canUseRelay) {
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
          We suggest you to use dispatcher so you don't want to sign all your transactions.
        </p>
        <Button variant="danger" size="md" className="text-sm">
          Enable dispatcher
        </Button>
      </CardBody>
    </Card>
  );
};

export default UseRelay;
