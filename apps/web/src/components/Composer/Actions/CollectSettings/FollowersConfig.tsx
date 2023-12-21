import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';

interface FollowersConfigProps {
  setCollectType: (data: any) => void;
}

const FollowersConfig: FC<FollowersConfigProps> = ({ setCollectType }) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        description="Only followers can collect"
        heading="Who can collect"
        icon={<UserGroupIcon className="size-4" />}
        on={collectModule.followerOnly || false}
        setOn={() =>
          setCollectType({ followerOnly: !collectModule.followerOnly })
        }
      />
    </div>
  );
};

export default FollowersConfig;
