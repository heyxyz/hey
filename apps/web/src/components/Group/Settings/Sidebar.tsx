import Sidebar from "@components/Shared/Sidebar";
import SingleAccount from "@components/Shared/SingleAccount";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import type { Account } from "@hey/indexer";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const SettingsSidebar: FC = () => {
  const { currentAccount } = useAccountStore();

  const sidebarItems = [
    {
      icon: <UserGroupIcon className="size-4" />,
      title: "Group",
      url: "/settings"
    }
  ];

  return (
    <div className="mb-4 px-3 sm:px-0">
      <div className="pb-3">
        <SingleAccount
          hideFollowButton
          hideUnfollowButton
          account={currentAccount as Account}
          showUserPreview={false}
        />
      </div>
      <Sidebar items={sidebarItems} />
    </div>
  );
};

export default SettingsSidebar;
