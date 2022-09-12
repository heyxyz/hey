import Link from 'next/link';
import { FC } from 'react';
import { useAppStore } from 'src/store/app';

import LoginButton from './LoginButton';
import SignedUser from './SignedUser';

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <LoginButton />;
  }

  return <SignedUser />;
};

export default MenuItems;
