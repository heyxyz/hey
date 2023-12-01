import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useEffectOnce } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import MetaTags from '@/components/Common/MetaTags';
import NotLoggedIn from '@/components/Shared/NotLoggedIn';
import { Leafwatch } from '@/lib/leafwatch';
import Custom404 from '@/pages/404';
import useProfileStore from '@/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';
import DeleteSettings from './Delete';
import GuardianSettings from './Guardian';

const DangerSettings = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { address } = useAccount();
  const disabled = currentProfile?.ownedBy.address !== address;

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'danger' });
  });

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (disabled) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Delete Profile • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <GuardianSettings />
        <DeleteSettings />
      </GridItemEight>
    </GridLayout>
  );
};

export default DangerSettings;
