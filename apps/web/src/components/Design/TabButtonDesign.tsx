import New from "@components/Shared/Badges/New";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, TabButton } from "@hey/ui";
import type { FC } from "react";

const TabButtonDesign: FC = () => {
  const tabs = [
    { name: "Latest Posts", active: true },
    { name: "Latest Comments" },
    { name: "Latest Likes" }
  ];

  return (
    <Card>
      <CardHeader title="Range Slider" />
      <div className="m-5 flex flex-col items-start gap-5">
        <div>
          <div className="label pb-2">Simple Tab Buttons</div>
          <div className="flex gap-3 overflow-x-auto px-5 sm:px-0">
            {tabs.map((tab) => (
              <TabButton
                key={tab.name}
                name={tab.name}
                active={tab.active || false}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="label pb-2">Tab Buttons visible on small screens</div>
          <div className="flex gap-3 overflow-x-auto px-5 sm:px-0">
            {tabs.map((tab) => (
              <TabButton
                key={tab.name}
                name={tab.name}
                active={tab.active || false}
                showOnSm
              />
            ))}
          </div>
        </div>
        <div>
          <div className="label pb-2">Tab Buttons with badge</div>
          <div className="flex gap-3 overflow-x-auto px-5 sm:px-0">
            {tabs.map((tab) => (
              <TabButton
                key={tab.name}
                name={tab.name}
                active={tab.active || false}
                badge={tab.active ? <New /> : null}
                showOnSm
              />
            ))}
          </div>
        </div>
        <div>
          <div className="label pb-2">Tab Buttons with icon</div>
          <div className="flex gap-3 overflow-x-auto px-5 sm:px-0">
            {tabs.map((tab) => (
              <TabButton
                key={tab.name}
                name={tab.name}
                active={tab.active || false}
                icon={<CheckBadgeIcon className="size-4" />}
                showOnSm
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TabButtonDesign;
