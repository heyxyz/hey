import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { CollectActionType } from "@hey/types/hey";
import { RangeSlider } from "@hey/ui";
import type { FC } from "react";
import { useCollectActionStore } from "src/store/non-persisted/post/useCollectActionStore";

interface ReferralConfigProps {
  setCollectType: (data: CollectActionType) => void;
}

const ReferralConfig: FC<ReferralConfigProps> = ({ setCollectType }) => {
  const { collectAction } = useCollectActionStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Share your fee with people who amplify your content"
        heading="Repost referral reward"
        icon={<ArrowsRightLeftIcon className="size-5" />}
        on={Boolean(collectAction.referralShare)}
        setOn={() =>
          setCollectType({
            referralShare: collectAction.referralShare ? 0 : 25
          })
        }
      />
      {collectAction.referralShare ? (
        <div className="mt-4 ml-8 space-y-2 text-sm">
          <div>Referral fee</div>
          <RangeSlider
            showValueInThumb
            min={1}
            max={100}
            displayValue={`${collectAction.referralShare.toString()}%`}
            defaultValue={[collectAction.referralShare]}
            onValueChange={(value) =>
              setCollectType({ referralShare: Number(value[0]) })
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default ReferralConfig;
