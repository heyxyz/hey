import Sidebar from "@components/Shared/Sidebar";
import SingleAccount from "@components/Shared/SingleAccount";
import {
  AdjustmentsVerticalIcon,
  AtSymbolIcon,
  BookmarkIcon,
  CircleStackIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  NoSymbolIcon,
  QueueListIcon,
  ShareIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import type { Profile } from "@hey/lens";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const SettingsSidebar: FC = () => {
  const { currentAccount } = useAccountStore();

  const sidebarItems = [
    {
      icon: <UserIcon className="size-4" />,
      title: "Profile",
      url: "/settings"
    },
    {
      icon: <CpuChipIcon className="size-4" />,
      title: "Account",
      url: "/settings/account"
    },
    {
      icon: <AtSymbolIcon className="size-4" />,
      title: "Handles",
      url: "/settings/handles"
    },
    {
      icon: <AdjustmentsVerticalIcon className="size-4" />,
      title: "Preferences",
      url: "/settings/preferences"
    },
    {
      icon: <BookmarkIcon className="size-4" />,
      title: "Interests",
      url: "/settings/interests"
    },
    {
      icon: <FingerPrintIcon className="size-4" />,
      title: "Manager",
      url: "/settings/manager"
    },
    {
      icon: <ShareIcon className="size-4" />,
      title: "Allowance",
      url: "/settings/allowance"
    },
    {
      icon: <GlobeAltIcon className="size-4" />,
      title: "Sessions",
      url: "/settings/sessions"
    },
    {
      icon: <QueueListIcon className="size-4" />,
      title: "Action History",
      url: "/settings/actions"
    },
    {
      icon: <NoSymbolIcon className="size-4" />,
      title: "Blocked Profiles",
      url: "/settings/blocked"
    },
    {
      icon: <CircleStackIcon className="size-4" />,
      title: "Export",
      url: "/settings/export"
    },
    {
      icon: <ExclamationTriangleIcon className="size-4 text-red-500" />,
      title: <div className="text-red-500">Danger zone</div>,
      url: "/settings/danger"
    }
  ];

  return (
    <div className="mb-4 px-3 sm:px-0">
      <div className="pb-3">
        <SingleAccount
          hideFollowButton
          hideUnfollowButton
          account={currentAccount as Profile}
          showUserPreview={false}
        />
      </div>
      <Sidebar items={sidebarItems} />
    </div>
  );
};

export default SettingsSidebar;
