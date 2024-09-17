import type { FC } from "react";

import SidebarMenu from "@components/Shared/Sidebar/SidebarMenu";
import SidebarTabs from "@components/Shared/Sidebar/SidebarTabs";

export interface SidebarProps {
  items: {
    active?: boolean;
    enabled?: boolean;
    icon: any;
    title: any;
    url: string;
  }[];
}

const Sidebar: FC<SidebarProps> = ({ items }) => {
  return (
    <>
      <div className="hidden lg:block">
        <SidebarTabs items={items} />
      </div>
      <div className="block lg:hidden">
        <SidebarMenu items={items} />
      </div>
    </>
  );
};

export default Sidebar;
