import Link from 'next/link';
import type { FC } from 'react';

import Login from '../Auth';

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

const MenuItems: FC = () => {
  return <Login />;
};

export default MenuItems;
