import type { FC } from 'react';

import MenuItems from './MenuItems';
import Search from './Search';

const TopNavbar: FC = () => {
  return (
    <aside className="mb-5 flex items-center justify-between space-x-2">
      <Search />
      <MenuItems />
    </aside>
  );
};

export default TopNavbar;
