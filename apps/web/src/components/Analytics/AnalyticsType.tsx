import { Leafwatch } from "@helpers/leafwatch";
import { ChartBarIcon, EyeIcon } from "@heroicons/react/24/outline";
import { AnalyticsTabType } from "@hey/data/enums";
import { ANALYTICS } from "@hey/data/tracking";
import { TabButton } from "@hey/ui";
import type { FC } from "react";

interface AnalyticsTypeProps {
  tabType: AnalyticsTabType;
}

const AnalyticsType: FC<AnalyticsTypeProps> = ({ tabType }) => {
  const handleSwitchTab = (type: AnalyticsTabType) => {
    Leafwatch.track(ANALYTICS.SWITCH_ANALYTICS_TAB, {
      analytics_type: type.toLowerCase()
    });
  };

  const tabs = [
    {
      icon: <ChartBarIcon className="size-4" />,
      name: "Overview",
      type: AnalyticsTabType.Overview
    },
    {
      icon: <EyeIcon className="size-4" />,
      name: "Impressions",
      type: AnalyticsTabType.Impressions
    }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        {tabs.map((tab) => (
          <TabButton
            active={tabType === tab.type}
            icon={tab.icon}
            key={tab.type}
            name={tab.name}
            onClick={() => handleSwitchTab(tab.type)}
            type={tab.type.toLowerCase()}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsType;
