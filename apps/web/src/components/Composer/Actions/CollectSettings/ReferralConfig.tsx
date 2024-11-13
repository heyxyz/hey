import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { CollectOpenActionModuleType } from "@hey/lens";
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
        on={Boolean(collectModule.referralFee)}
        setOn={() =>
          setCollectType({
            referralFee: collectModule.referralFee ? 0 : 25,
            type: collectModule.recipients?.length
              ? CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule
              : CollectOpenActionModuleType.SimpleCollectOpenActionModule
          })
        }
      />
      {collectModule.referralFee ? (
        <div className="mt-4 ml-8 space-y-2 text-sm">
          <div>Referral fee</div>
          <RangeSlider
            showValueInThumb
            min={1}
            max={100}
            displayValue={`${collectModule.referralFee.toString()}%`}
            defaultValue={[collectModule.referralFee]}
            onValueChange={(value) =>
              setCollectType({ referralFee: Number(value[0]) })
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default ReferralConfig;
