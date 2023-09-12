import cn from '@lenster/ui/cn';
import type { FC } from 'react';
import React from 'react';
// Store
import { useSpacesStore } from 'src/store/spaces';

import ViewComponent from './ViewController';

const Sidebar: FC = () => {
  const isSidebarOpen = useSpacesStore((state) => state.sidebar.isSidebarOpen);

  const sidebarView = useSpacesStore((state) => state.sidebar.sidebarView);

  if (sidebarView === 'close') {
    return null;
  }

  return (
    <div
      className={cn(
        'min-h-[35vh] w-[20vw] flex-col rounded-xl border border-gray-300 bg-white transition-all duration-300 ease-out dark:border-gray-500 dark:bg-gray-900',
        isSidebarOpen ? 'flex' : 'hidden'
      )}
    >
      <div className="overflow-y-auto px-4 py-4">
        {ViewComponent[sidebarView].component}
      </div>
    </div>
  );
};
export default React.memo(Sidebar);
