import Sidebar from "@components/Shared/Sidebar";
import {
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  UserIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import type { FC } from "react";

const sidebarItems = [
  {
    icon: <ClipboardIcon className="size-4" />,
    title: "Overview",
    url: "/staff"
  },
  {
    icon: <CurrencyDollarIcon className="size-4" />,
    title: "Revenue",
    url: "/staff/revenue"
  },
  {
    icon: <ChartBarIcon className="size-4" />,
    title: "Stats",
    url: "/staff/stats"
  },
  {
    icon: <UserIcon className="size-4" />,
    title: "Users",
    url: "/staff/users"
  },
  {
    icon: <CurrencyDollarIcon className="size-4" />,
    title: "Tokens",
    url: "/staff/tokens"
  },
  {
    icon: <AdjustmentsHorizontalIcon className="size-4" />,
    title: "Permissions",
    url: "/staff/permissions"
  },
  {
    icon: <UserPlusIcon className="size-4" />,
    title: "Signup",
    url: "/staff/signup"
  }
];

const StaffSidebar: FC = () => {
  return (
    <div className="mb-4 px-3 sm:px-0">
      <Sidebar items={sidebarItems} />
    </div>
  );
};

export default StaffSidebar;
