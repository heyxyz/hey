import type { OpenActionModule } from '@hey/lens';
import type { FC } from 'react';

import {
  BriefcaseIcon,
  DocumentPlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { OpenActionModuleType } from '@hey/lens';
import cn from '@hey/ui/cn';

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
      return <DocumentPlusIcon className={cn('size-5', className)} />;
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return <UserGroupIcon className={cn('size-5', className)} />;
    default:
      return <BriefcaseIcon className={cn('size-5', className)} />;
  }
};

export default GetOpenActionModuleIcon;
