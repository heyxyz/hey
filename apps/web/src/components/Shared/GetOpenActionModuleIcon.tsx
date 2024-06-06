import type { OpenActionModule } from '@good/lens';
import type { FC } from 'react';

import { OpenActionModuleType } from '@good/lens';
import {
  BriefcaseIcon,
  DocumentPlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface GetOpenActionModuleIconProps {
  module?: OpenActionModule;
}

const GetOpenActionModuleIcon: FC<GetOpenActionModuleIconProps> = ({
  module
}) => {
  switch (module?.type) {
    case OpenActionModuleType.SimpleCollectOpenActionModule:
      return <DocumentPlusIcon className="size-5" />;
    case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return <UserGroupIcon className="size-5" />;
    default:
      return <BriefcaseIcon className="size-5" />;
  }
};

export default GetOpenActionModuleIcon;
