import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { CollectModules } from '@lenster/lens';
import { Input } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';

interface ReferralConfigProps {
  setCollectType: (data: any) => void;
}

const ReferralConfig: FC<ReferralConfigProps> = ({ setCollectType }) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={Boolean(collectModule.referralFee)}
        setOn={() =>
          setCollectType({
            type: collectModule.recipients?.length
              ? CollectModules.MultirecipientFeeCollectModule
              : CollectModules.SimpleCollectModule,
            referralFee: collectModule.referralFee ? 0 : 25
          })
        }
        heading={t`Mirror referral reward`}
        description={t`Share your fee with people who amplify your content`}
        icon={<SwitchHorizontalIcon className="h-4 w-4" />}
      />
      {collectModule.referralFee ? (
        <div className="flex space-x-2 pt-4 text-sm">
          <Input
            label={t`Referral fee`}
            type="number"
            placeholder="5"
            iconRight="%"
            min="0"
            max="100"
            value={collectModule.referralFee}
            onChange={(event) => {
              setCollectType({
                referralFee: parseInt(
                  event.target.value ? event.target.value : '0'
                )
              });
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ReferralConfig;
