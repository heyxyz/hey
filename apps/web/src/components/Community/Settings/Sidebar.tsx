import CommunityProfile from '@components/Shared/CommunityProfile';
import Sidebar from '@components/Shared/Sidebar';
import {
  ExclamationIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/outline';
import type { Community } from '@lenster/types/communities';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';

interface SidebarProps {
  community: Community;
}

const SettingsSidebar: FC<SidebarProps> = ({ community }) => {
  return (
    <div className="mb-4 space-y-1.5 px-3 sm:px-0">
      <div className="pb-3">
        <CommunityProfile community={community as Community} />
      </div>
      <Sidebar
        items={[
          {
            title: t`Profile`,
            icon: <UserIcon className="h-4 w-4" />,
            url: `/c/${community?.slug}/settings`
          },
          {
            title: t`Rules`,
            icon: <SparklesIcon className="h-4 w-4" />,
            url: `/c/${community?.slug}/settings/rules`
          },
          {
            title: (
              <div className="text-red-500">
                <Trans>Danger Zone</Trans>
              </div>
            ),
            icon: <ExclamationIcon className="h-4 w-4 text-red-500" />,
            url: `/c/${community?.slug}/settings/danger`
          }
        ]}
      />
    </div>
  );
};

export default SettingsSidebar;
