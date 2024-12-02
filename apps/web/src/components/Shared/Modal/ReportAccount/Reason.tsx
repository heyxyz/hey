import { Select } from "@hey/ui";
import type { Dispatch, FC, SetStateAction } from "react";

interface ReasonProps {
  setReason: Dispatch<SetStateAction<string>>;
  reason: string;
}

const Reason: FC<ReasonProps> = ({ setReason, reason }) => {
  return (
    <div>
      <div className="label">Type</div>
      <Select
        onChange={(value) => setReason(value)}
        options={[
          {
            disabled: true,
            label: "Select type",
            value: "Select type"
          },
          {
            label: "Impersonation",
            selected: reason === "IMPERSONATION",
            value: "IMPERSONATION"
          },
          {
            label: "Repetitive Spam",
            selected: reason === "REPETITIVE_SPAM",
            value: "REPETITIVE_SPAM"
          },
          {
            label: "Other",
            selected: reason === "OTHER",
            value: "OTHER"
          }
        ]}
      />
    </div>
  );
};

export default Reason;
