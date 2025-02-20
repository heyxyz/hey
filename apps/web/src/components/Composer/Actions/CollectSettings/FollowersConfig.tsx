import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import type { CollectActionType } from "@hey/types/hey";
import type { FC } from "react";
import { useCollectActionStore } from "src/store/non-persisted/post/useCollectActionStore";

interface FollowersConfigProps {
  setCollectType: (data: CollectActionType) => void;
}

const FollowersConfig: FC<FollowersConfigProps> = ({ setCollectType }) => {
  const { collectAction } = useCollectActionStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Only followers can collect"
        heading="Exclusivity"
        icon={<UserGroupIcon className="size-5" />}
        on={collectAction.followerOnly || false}
        setOn={() =>
          setCollectType({ followerOnly: !collectAction.followerOnly })
        }
      />
    </div>
  );
};

export default FollowersConfig;
