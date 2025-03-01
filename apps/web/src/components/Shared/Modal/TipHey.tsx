import { APP_NAME, COLLECT_FEES_WALLET } from "@hey/data/constants";
import { H4 } from "@hey/ui";
import type { FC } from "react";
import Fund from "../Fund/FundAccount/Fund";

interface TipHeyProps {
  onSuccess: () => void;
}

const TipHey: FC<TipHeyProps> = ({ onSuccess }) => {
  return (
    <div className="m-5 space-y-5">
      <div className="space-y-2">
        <H4>Support {APP_NAME}</H4>
        <div className="ld-text-gray-500 text-sm">
          Support the growth and development of {APP_NAME} by giving a tip.
        </div>
      </div>
      <Fund isHeyTip onSuccess={onSuccess} recipient={COLLECT_FEES_WALLET} />
    </div>
  );
};

export default TipHey;
