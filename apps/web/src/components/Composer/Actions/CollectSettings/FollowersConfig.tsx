import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';

interface FollowersConfigProps {
  setCollectType: (data: any) => void;
}

const FollowersConfig: FC<FollowersConfigProps> = ({ setCollectType }) => {
  const { collectModule } = useCollectModuleStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Only followers can collect"
        heading="Exclusivity"
        icon={<UserGroupIcon className="size-5" />}
        on={collectModule.followerOnly || false}
        setOn={() =>
          setCollectType({ followerOnly: !collectModule.followerOnly })
        }
      />
    </div>
  );
};

export default FollowersConfig;
