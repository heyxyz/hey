import Sidebar from "@components/Shared/Sidebar";
import { ChartBarIcon, EyeIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";

const AnalyticsSidebar: FC = () => {
  const sidebarItems = [
    {
      icon: <ChartBarIcon className="size-4" />,
      title: "Overview",
      url: "/analytics/overview"
    },
    {
      icon: <EyeIcon className="size-4" />,
      title: "Impressions",
      url: "/analytics/impressions"
    }
  ];

  return (
    <div className="mb-4 px-3 sm:px-0">
      <Sidebar items={sidebarItems} />
    </div>
  );
};

export default AnalyticsSidebar;
