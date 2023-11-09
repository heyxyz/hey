import isValidEthAddress from '@hey/lib/isValidEthAddress';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

import LoginButton from './LoginButton';
import SignedUser from './SignedUser';

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profileId = getCurrentSessionProfileId();

  if (Boolean(currentProfile)) {
    return <SignedUser />;
  }

  // If the profileId is a valid eth address, we can assume that address don't have a profile yet
  if (isValidEthAddress(profileId)) {
    return <div>{JSON.stringify(isValidEthAddress(profileId))}</div>;
  }

  return <LoginButton />;
};

export default MenuItems;
