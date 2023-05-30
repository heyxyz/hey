import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { UserGroupIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';

interface ReferralConfigProps {
  setCollectType: (data: any) => void;
}

const FollowersConfig: FC<ReferralConfigProps> = ({ setCollectType }) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={collectModule.followerOnlyCollect ?? false}
        setOn={() => setCollectType({ followerOnlyCollect: true })}
        heading={t`Who can collect`}
        description={t`Only followers can collect`}
        icon={<UserGroupIcon className="h-4 w-4" />}
      />
    </div>
  );
};

export default FollowersConfig;
