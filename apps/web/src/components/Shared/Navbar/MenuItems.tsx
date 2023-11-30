import getCurrentSession from '@lib/getCurrentSession';
import useProfileStore from '@persisted/useProfileStore';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { isAddress } from 'viem';

import LoginButton from './LoginButton';
import SignedUser from './SignedUser';
import WalletUser from './WalletUser';

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link to={href} {...rest}>
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

  return <LoginButton />;
};

export default MenuItems;
