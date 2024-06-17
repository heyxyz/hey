import type { FC } from 'react';

import Link from 'next/link';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import LoginButton from '../LoginButton';
import SignedUser from './SignedUser';
import SignupButton from './SignupButton';

export const NextLink = ({ children, href, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  const { currentProfile } = useProfileStore();

  if (currentProfile) {
    return <SignedUser />;
  }

  return (
    <div className="relative hidden md:block">
      <div className="mb-4">
        <SignupButton />
      </div>
      <div>
        <LoginButton />
      </div>
    </div>
  );
};

export default MenuItems;
