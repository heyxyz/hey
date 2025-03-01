import Sidebar from "@components/Shared/Sidebar";
import SingleGroup from "@components/Shared/SingleGroup";
import {
  CheckCircleIcon,
  LockClosedIcon,
  NoSymbolIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import type { GroupFragment } from "@hey/indexer";
import { useRouter } from "next/router";
import type { FC } from "react";

interface SettingsSidebarProps {
  group: GroupFragment;
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
      icon: <LockClosedIcon className="size-4" />,
      title: "Group Rules",
      url: `/g/${address}/settings/rules`,
      active: pathname === "/g/[address]/settings/rules"
    },
    {
      icon: <NoSymbolIcon className="size-4" />,
      title: "Banned Members",
      url: `/g/${address}/settings/banned`,
      active: pathname === "/g/[address]/settings/banned"
    },
    {
      icon: <CheckCircleIcon className="size-4" />,
      title: "Membership Requests",
      url: `/g/${address}/settings/approval`,
      active: pathname === "/g/[address]/settings/approval"
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
