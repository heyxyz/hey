import Link from 'next/link';
import type { FC } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';

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
  const walletAuthenticated = useAppPersistStore(
    (state) => state.walletAuthenticated
  );

  if (walletAuthenticated && !currentProfile) {
    return <WalletUser />;
  }

  if (!currentProfile) {
    return <LoginButton />;
  }

  return <SignedUser />;
};

export default MenuItems;
