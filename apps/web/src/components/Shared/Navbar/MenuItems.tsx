import type { FC } from 'react';

import { KillSwitch } from '@hey/data/kill-switches';
import getCurrentSession from '@lib/getCurrentSession';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import Link from 'next/link';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { isAddress } from 'viem';

import LoginButton from './LoginButton';
import SignedUser from './SignedUser';
import SignupButton from './SignupButton';
import WalletUser from './WalletUser';

export const NextLink = ({ children, href, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { id: sessionProfileId } = getCurrentSession();

  if (currentProfile) {
    return <SignedUser />;
  }

  // If the currentSessionProfileId is a valid eth address, we can assume that address don't have a profile yet
  if (isAddress(sessionProfileId)) {
    return <WalletUser />;
  }

  return (
    <div className="flex items-center space-x-2">
      {isFeatureEnabled(KillSwitch.Signup) && <SignupButton />}
      <LoginButton />
    </div>
  );
};

export default MenuItems;
