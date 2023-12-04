import {
  BriefcaseIcon,
  DocumentPlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { type OpenActionModule, OpenActionModuleType } from '@hey/lens';
import cn from '@hey/ui/cn';
import { type FC } from 'react';

interface GetOpenActionModuleIconProps {
  className?: string;
  module?: OpenActionModule;
}

const GetOpenActionModuleIcon: FC<GetOpenActionModuleIconProps> = ({
  className = '',
  module
}) => {
  switch (module?.type) {
    case OpenActionModuleType.SimpleCollectOpenActionModule:
      return <DocumentPlusIcon className={cn('h-5 w-5', className)} />;
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return <UserGroupIcon className={cn('h-5 w-5', className)} />;
    default:
      return <BriefcaseIcon className={cn('h-5 w-5', className)} />;
  }
};

export default GetOpenActionModuleIcon;
