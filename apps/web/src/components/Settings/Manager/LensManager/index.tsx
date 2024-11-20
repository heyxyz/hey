import { APP_NAME } from "@hey/data/constants";
import checkDispatcherPermissions from "@hey/helpers/checkDispatcherPermissions";
import { Card, CardHeader } from "@hey/ui";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import ToggleLensManager from "./ToggleLensManager";

const LensManager: FC = () => {
  const { currentAccount } = useAccountStore();
  const { canUseSignless } = checkDispatcherPermissions(currentAccount);

  return (
    <Card>
      <CardHeader
        body={`You can enable Lens manager to interact with ${APP_NAME} without
        signing any of your transactions.`}
        title={
          canUseSignless
            ? "Disable signless transactions"
            : "Signless transactions"
        }
      />
      <div className="m-5">
        <ToggleLensManager />
      </div>
    </Card>
  );
};

export default LensManager;
