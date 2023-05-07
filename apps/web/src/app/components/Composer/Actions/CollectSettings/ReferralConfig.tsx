'use client';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';
import { Input } from 'ui';

const ReferralConfig: FC = () => {
  const referralFee = useCollectModuleStore((state) => state.referralFee);
  const setReferralFee = useCollectModuleStore((state) => state.setReferralFee);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={Boolean(referralFee)}
        setOn={() => setReferralFee(referralFee ? null : '25')}
        heading={t`Mirror referral reward`}
        description={t`Share your fee with people who amplify your content`}
        icon={<SwitchHorizontalIcon className="h-4 w-4" />}
      />
      {referralFee ? (
        <div className="flex space-x-2 pt-4 text-sm">
          <Input
            label={t`Referral fee`}
            type="number"
            placeholder="5"
            iconRight="%"
            min="0"
            max="100"
            value={parseFloat(referralFee ?? '0')}
            onChange={(event) => {
              setReferralFee(event.target.value ? event.target.value : '0');
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ReferralConfig;
