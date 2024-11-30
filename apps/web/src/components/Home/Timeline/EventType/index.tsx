import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { TimelineItem } from "@hey/indexer";
import type { FC } from "react";
import Combined from "./Combined";
import Mirrored from "./Mirrored";

const getCanCombined = (aggregations: number[]) => {
  // show combined reactions if more than 2 items in aggregations
  return aggregations.filter((n) => n > 0).length > 1;
};

interface ActionTypeProps {
  timelineItem: TimelineItem;
}

const ActionType: FC<ActionTypeProps> = ({ timelineItem }) => {
  const { reposts } = timelineItem;
  const canCombined = getCanCombined([reposts?.length || 0]);

  return (
    <span onClick={stopEventPropagation}>
      {canCombined ? (
        <Combined timelineItem={timelineItem} />
      ) : reposts?.length ? (
        <Mirrored reposts={reposts} />
      ) : null}
    </span>
  );
};

export default ActionType;
