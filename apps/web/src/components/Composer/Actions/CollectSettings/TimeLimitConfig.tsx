import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { ClockIcon } from "@heroicons/react/24/outline";
import formatDate from "@hey/helpers/datetime/formatDate";
import getNumberOfDaysFromDate from "@hey/helpers/datetime/getNumberOfDaysFromDate";
import getTimeAddedNDay from "@hey/helpers/datetime/getTimeAddedNDay";
import type { CollectModuleType } from "@hey/types/hey";
import { RangeSlider } from "@hey/ui";
import type { FC } from "react";
import { useCollectModuleStore } from "src/store/non-persisted/post/useCollectModuleStore";

interface TimeLimitConfigProps {
  setCollectType: (data: CollectModuleType) => void;
}

const TimeLimitConfig: FC<TimeLimitConfigProps> = ({ setCollectType }) => {
  const { collectModule } = useCollectModuleStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Limit collecting to specific period of time"
        heading="Time limit"
        icon={<ClockIcon className="size-5" />}
        on={Boolean(collectModule.endsAt)}
        setOn={() =>
          setCollectType({
            endsAt: collectModule.endsAt ? null : getTimeAddedNDay(1)
          })
        }
      />
      {collectModule.endsAt ? (
        <div className="mt-4 ml-8 space-y-2 text-sm">
          <div>
            Number of days -{" "}
            <b>
              {formatDate(collectModule.endsAt, "MMM D, YYYY - hh:mm:ss A")}
            </b>
          </div>
          <RangeSlider
            showValueInThumb
            min={1}
            max={100}
            displayValue={getNumberOfDaysFromDate(
              new Date(collectModule.endsAt)
            ).toString()}
            defaultValue={[
              getNumberOfDaysFromDate(new Date(collectModule.endsAt))
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
