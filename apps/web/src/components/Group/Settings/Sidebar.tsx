import Sidebar from "@components/Shared/Sidebar";
import SingleGroup from "@components/Shared/SingleGroup";
import { NoSymbolIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import type { Group } from "@hey/indexer";
import { useRouter } from "next/router";
import type { FC } from "react";

interface SettingsSidebarProps {
  group: Group;
}

const SettingsSidebar: FC<SettingsSidebarProps> = ({ group }) => {
  const {
    pathname,
    query: { address }
  } = useRouter();

  const sidebarItems = [
    {
      icon: <UserGroupIcon className="size-4" />,
      title: "Group",
      url: `/g/${address}/settings`,
      active: pathname === "/g/[address]/settings"
    },
    {
      icon: <NoSymbolIcon className="size-4" />,
      title: "Banned Members",
      url: `/g/${address}/settings/banned`,
      active: pathname === "/g/[address]/settings/banned"
    }
  ];

  return (
    <div className="mb-4 px-3 sm:px-0">
      <div className="pb-3">
        <SingleGroup group={group} hideJoinButton hideLeaveButton />
      </div>
      <Sidebar items={sidebarItems} />
    </div>
  );
};

export default SettingsSidebar;
