import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { CollectModuleType } from "@hey/types/hey";
import { RangeSlider } from "@hey/ui";
import type { FC } from "react";
import { useCollectModuleStore } from "src/store/non-persisted/post/useCollectModuleStore";

interface ReferralConfigProps {
  setCollectType: (data: CollectModuleType) => void;
}

const ReferralConfig: FC<ReferralConfigProps> = ({ setCollectType }) => {
  const { collectModule } = useCollectModuleStore((state) => state);

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Share your fee with people who amplify your content"
        heading="Mirror referral reward"
        icon={<ArrowsRightLeftIcon className="size-5" />}
        on={Boolean(collectModule.referralShare)}
        setOn={() =>
          setCollectType({
            referralShare: collectModule.referralShare ? 0 : 25,
          })
        }
      />
      {collectModule.referralShare ? (
        <div className="mt-4 ml-8 space-y-2 text-sm">
          <div>Referral fee</div>
          <RangeSlider
            showValueInThumb
            min={1}
            max={100}
            displayValue={`${collectModule.referralShare.toString()}%`}
            defaultValue={[collectModule.referralShare]}
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
