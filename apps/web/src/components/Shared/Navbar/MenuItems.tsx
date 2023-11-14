import getCurrentSession from '@lib/getCurrentSession';
import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { isAddress } from 'viem';

import LoginButton from './LoginButton';
import SignedUser from './SignedUser';
import WalletUser from './WalletUser';

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { id: sessionProfileId } = getCurrentSession();

  if (Boolean(currentProfile)) {
    return <SignedUser />;
  }

  // If the currentSessionProfileId is a valid eth address, we can assume that address don't have a profile yet
  if (isAddress(sessionProfileId)) {
    return <WalletUser />;
  }

  return <LoginButton />;
};

export default MenuItems;
