import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { OpenActionModuleType } from '@hey/lens';
import { Input } from '@hey/ui';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';

interface ReferralConfigProps {
  setCollectType: (data: any) => void;
}

const ReferralConfig: FC<ReferralConfigProps> = ({ setCollectType }) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        description="Share your fee with people who amplify your content"
        heading="Mirror referral reward"
        icon={<ArrowsRightLeftIcon className="size-4" />}
        on={Boolean(collectModule.referralFee)}
        setOn={() =>
          setCollectType({
            referralFee: collectModule.referralFee ? 0 : 25,
            type: collectModule.recipients?.length
              ? OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
              : OpenActionModuleType.SimpleCollectOpenActionModule
          })
        }
      />
      {collectModule.referralFee ? (
        <div className="flex space-x-2 pt-4 text-sm">
          <Input
            iconRight="%"
            label="Referral fee"
            max="100"
            min="0"
            onChange={(event) => {
              setCollectType({
                referralFee: parseInt(
                  event.target.value ? event.target.value : '0'
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
