import Sidebar from "@components/Shared/Sidebar";
import SingleAccount from "@components/Shared/SingleAccount";
import {
  AdjustmentsVerticalIcon,
  AtSymbolIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  NoSymbolIcon,
  PaintBrushIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import type { AccountFragment } from "@hey/indexer";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const SettingsSidebar: FC = () => {
  const { currentAccount } = useAccountStore();

  const sidebarItems = [
    {
      icon: <PaintBrushIcon className="size-4" />,
      title: "Personalize",
      url: "/settings"
    },
    {
      icon: <UserIcon className="size-4" />,
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
      icon: <FingerPrintIcon className="size-4" />,
      title: "Manager",
      url: "/settings/manager"
    },
    {
      icon: <GlobeAltIcon className="size-4" />,
      title: "Sessions",
      url: "/settings/sessions"
    },
    {
      icon: <NoSymbolIcon className="size-4" />,
      title: "Blocked Profiles",
      url: "/settings/blocked"
    },
    {
      icon: <CodeBracketIcon className="size-4" />,
      title: "Developer",
      url: "/settings/developer"
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
          account={currentAccount as AccountFragment}
          showUserPreview={false}
        />
      </div>
      <Sidebar items={sidebarItems} />
    </div>
  );
};

export default SettingsSidebar;
