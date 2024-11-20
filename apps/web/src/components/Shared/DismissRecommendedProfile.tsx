import { Leafwatch } from "@helpers/leafwatch";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ACCOUNT } from "@hey/data/tracking";
import type { Profile } from "@hey/lens";
import { useDismissRecommendedProfilesMutation } from "@hey/lens";
import type { FC } from "react";

interface DismissRecommendedProfileProps {
  account: Profile;
}

const DismissRecommendedProfile: FC<DismissRecommendedProfileProps> = ({
  account
}) => {
  const [dismissRecommendedProfile] = useDismissRecommendedProfilesMutation({
    update: (cache) => {
      cache.evict({ id: cache.identify(account) });
    },
    variables: { request: { dismiss: [account.id] } }
  });

  const handleDismiss = async () => {
    await dismissRecommendedProfile();
    Leafwatch.track(ACCOUNT.DISMISS_RECOMMENDED_PROFILE, {
      target: account.id
    });
  };

  return (
    <button onClick={handleDismiss} type="reset">
      <XMarkIcon className="size-4 text-gray-500" />
    </button>
  );
};

export default DismissRecommendedProfile;
