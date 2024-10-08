import ToggleLensManager from "@components/Settings/Manager/LensManager/ToggleLensManager";
import { APP_NAME } from "@hey/data/constants";
import checkDispatcherPermissions from "@hey/helpers/checkDispatcherPermissions";
import { Card, H5 } from "@hey/ui";
import type { FC } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import { useAccount } from "wagmi";

const EnableLensManager: FC = () => {
  const { currentProfile } = useProfileStore();
  const { address } = useAccount();
  const { canUseSignless } = checkDispatcherPermissions(currentProfile);

  if (canUseSignless || currentProfile?.ownedBy.address !== address) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-2.5 p-5">
      <H5>Signless transactions</H5>
      <p className="text-sm leading-[22px]">
        You can enable Lens manager to interact with {APP_NAME} without signing
        any of your transactions.
      </p>
      <ToggleLensManager buttonSize="sm" />
    </Card>
  );
};

export default EnableLensManager;
