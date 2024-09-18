import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { CollectOpenActionModuleType } from "@hey/lens";
import type { CollectModuleType } from "@hey/types/hey";
import { Input } from "@hey/ui";
import type { FC } from "react";
import { useCollectModuleStore } from "src/store/non-persisted/publication/useCollectModuleStore";

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
        <div className="mt-4 ml-8 flex space-x-2 text-sm">
          <Input
            iconRight="%"
            label="Referral fee"
            max="100"
            min="1"
            onChange={(event) => {
              setCollectType({
                referralFee: Number.parseInt(
                  event.target.value ? event.target.value : "0"
                )
              });
            }}
            placeholder="5"
            type="number"
            value={collectModule.referralFee}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ReferralConfig;
