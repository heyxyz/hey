import type { NextPage } from 'next';
import type { Address } from 'viem';

import MetaTags from '@components/Common/MetaTags';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import {
  APP_NAME,
  HEY_LENS_SIGNUP,
  POLYGONSCAN_URL
} from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import StaffSidebar from '../Sidebar';
import Balance from './Balance';
import LensCredits from './LensCredits';
import ProfilesCreated from './ProfilesCreated';
import RelayerBalance from './RelayerBalance';
import SignupPrice from './SignupPrice';

const relayAddresses: Address[] = [
  '0xb9C6e304545386E95d5c4ab183EE97A13555A49d',
  '0x69827eB22B5e153de6ff480417c436a0A56Be7F7',
  '0x77EE64875072055836eB966633cf690acdB0529d',
  '0xa12F2B9e9bf26f1A22D4Ff4b79483e8953A436F8',
  '0x9B1B32981E9444BaF6CBcC79903Fb67A6587F3cD'
];

const SignupContract: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, {
      page: 'staff-tools',
      subpage: 'singup-contract'
    });
  }, []);

  if (!currentProfile || !staffMode) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Signup Contract • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <div className="flex items-center space-x-2 p-5 text-lg font-bold">
            <div>Signup Contract</div>
            <Link
              href={`${POLYGONSCAN_URL}/address/${HEY_LENS_SIGNUP}`}
              target="_blank"
            >
              <ArrowTopRightOnSquareIcon className="text-brand-500 size-4" />
            </Link>
          </div>
          <div className="divider" />
          <div className="space-y-5 p-5">
            <LensCredits />
            <SignupPrice />
            <ProfilesCreated />
            <Balance />
            <div className="divider" />
            {relayAddresses.map((address, index) => (
              <RelayerBalance address={address} index={index} key={address} />
            ))}
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default SignupContract;
