import type { Group } from "@hey/indexer";
import { Card, CardHeader } from "@hey/ui";
import type { FC } from "react";
import ApprovalRule from "./ApprovalRule";
import BanRule from "./BanRule";

interface BasicRulesProps {
  group: Group;
}

const BasicRules: FC<BasicRulesProps> = ({ group }) => {
  return (
    <Card>
      <CardHeader
        body="Update the rules for your group and control how your group should operate."
        title="Group Rules"
      />
      <div className="m-5 space-y-5">
        <ApprovalRule group={group} />
        <BanRule group={group} />
      </div>
    </Card>
  );
};

export default BasicRules;
