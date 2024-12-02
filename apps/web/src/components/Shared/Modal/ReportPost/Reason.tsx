import convertToTitleCase from "@hey/helpers/convertToTitleCase";
import { PostReportReason } from "@hey/indexer";
import { Select } from "@hey/ui";
import type { Dispatch, FC, SetStateAction } from "react";

interface ReasonProps {
  setReason: Dispatch<SetStateAction<string>>;
  reason: string;
}

const Reason: FC<ReasonProps> = ({ setReason, reason }) => {
  return (
    <div className="space-y-3">
      <div className="label">Type</div>
      <Select
        onChange={(value) => setReason(value)}
        options={[
          ...Object.keys(PostReportReason).map((reasonFromEnum) => ({
            label: convertToTitleCase(reasonFromEnum),
            selected: reason === reasonFromEnum,
            value: reasonFromEnum
          })),
          { disabled: true, label: "Select type", value: "Select type" }
        ]}
      />
    </div>
  );
};

export default Reason;
