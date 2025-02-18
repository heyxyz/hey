import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { ClockIcon } from "@heroicons/react/24/outline";
import formatDate from "@hey/helpers/datetime/formatDate";
import getNumberOfDaysFromDate from "@hey/helpers/datetime/getNumberOfDaysFromDate";
import getTimeAddedNDay from "@hey/helpers/datetime/getTimeAddedNDay";
import type { CollectActionType } from "@hey/types/hey";
import { RangeSlider } from "@hey/ui";
import type { FC } from "react";
import { useCollectActionStore } from "src/store/non-persisted/post/useCollectActionStore";

interface TimeLimitConfigProps {
  setCollectType: (data: CollectActionType) => void;
}

const TimeLimitConfig: FC<TimeLimitConfigProps> = ({ setCollectType }) => {
  const { collectAction } = useCollectActionStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Limit collecting to specific period of time"
        heading="Time limit"
        icon={<ClockIcon className="size-5" />}
        on={Boolean(collectAction.endsAt)}
        setOn={() =>
          setCollectType({
            endsAt: collectAction.endsAt ? null : getTimeAddedNDay(1)
          })
        }
      />
      {collectAction.endsAt ? (
        <div className="mt-4 ml-8 space-y-2 text-sm">
          <div>
            Number of days -{" "}
            <b>
              {formatDate(collectAction.endsAt, "MMM D, YYYY - hh:mm:ss A")}
            </b>
          </div>
          <RangeSlider
            showValueInThumb
            min={1}
            max={100}
            displayValue={getNumberOfDaysFromDate(
              new Date(collectAction.endsAt)
            ).toString()}
            defaultValue={[
              getNumberOfDaysFromDate(new Date(collectAction.endsAt))
            ]}
            onValueChange={(value) =>
              setCollectType({ endsAt: getTimeAddedNDay(Number(value[0])) })
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default TimeLimitConfig;
