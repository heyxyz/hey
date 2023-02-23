import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { UserGroupIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';
import { PUBLICATION } from 'src/tracking';

const FollowersConfig: FC = () => {
  const followerOnly = useCollectModuleStore((state) => state.followerOnly);
  const setFollowerOnly = useCollectModuleStore((state) => state.setFollowerOnly);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={followerOnly}
        setOn={() => {
          setFollowerOnly(!followerOnly);
          Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_FOLLOWERS_ONLY_COLLECT);
        }}
        heading={t`Who can collect`}
        description={t`Only followers can collect`}
        icon={<UserGroupIcon className="h-4 w-4" />}
      />
    </div>
  );
};

export default FollowersConfig;
