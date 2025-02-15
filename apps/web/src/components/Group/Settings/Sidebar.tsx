import Sidebar from "@components/Shared/Sidebar";
import SingleGroup from "@components/Shared/SingleGroup";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { type Group, useGroupQuery } from "@hey/indexer";
import { PageLoading } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";
import Custom500 from "src/pages/500";

const SettingsSidebar: FC = () => {
  const {
    isReady,
    query: { address }
  } = useRouter();

  const sidebarItems = [
    {
      icon: <UserGroupIcon className="size-4" />,
      title: "Group",
      url: `/g/${address}/settings`
    }
  ];

  const { data, loading, error } = useGroupQuery({
    variables: {
      groupRequest: { group: address },
      groupStatsRequest: { group: address }
    },
    skip: !address
  });

  if (!isReady || loading) {
    return <PageLoading />;
  }

  if (error) {
    return <Custom500 />;
  }

  const group = data?.group as Group;

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
