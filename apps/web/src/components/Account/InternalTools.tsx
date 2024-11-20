import { FeatureFlag } from "@hey/data/feature-flags";
import type { Profile } from "@hey/lens";
import { Card } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import CreatorTool from "./CreatorTool";
import StaffTool from "./StaffTool";

interface InternalToolsProps {
  account: Profile;
}

const InternalTools: FC<InternalToolsProps> = ({ account }) => {
  const hasCreatorToolAccess = useFlag(FeatureFlag.CreatorTools);
  const isStaff = useFlag(FeatureFlag.Staff);

  if (!hasCreatorToolAccess || !isStaff) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="!bg-yellow-300/20 mb-4 space-y-5 border-yellow-400 p-5 text-yellow-600"
      forceRounded
    >
      {hasCreatorToolAccess && <CreatorTool account={account} />}
      {isStaff && <StaffTool account={account} />}
    </Card>
  );
};

export default InternalTools;
