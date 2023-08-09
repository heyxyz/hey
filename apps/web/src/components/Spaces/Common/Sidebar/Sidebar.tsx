import clsx from 'clsx';
import React from 'react';
// Store
import { useSpacesStore } from 'src/store/spaces';

import ViewComponent from './ViewController';

type SidebarProps = {};

const Sidebar: React.FC<SidebarProps> = () => {
  const isSidebarOpen = useSpacesStore((state) => state.sidebar.isSidebarOpen);

  const sidebarView = useSpacesStore((state) => state.sidebar.sidebarView);

  if (sidebarView === 'close') {
    return null;
  }

  return (
    <aside
      className={clsx(
        'mr-1 min-h-[40vh] w-[20vw] flex-col rounded-xl border border-neutral-500 bg-neutral-900 transition-all duration-300 ease-out',
        isSidebarOpen ? 'flex' : 'hidden'
      )}
    >
      <div className="overflow-y-auto px-4 py-4">
        {ViewComponent[sidebarView].component}
      </div>
    </aside>
  );
};
export default React.memo(Sidebar);
