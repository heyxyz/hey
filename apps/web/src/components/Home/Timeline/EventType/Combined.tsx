import Accounts from "@components/Shared/Accounts";
import { SparklesIcon } from "@heroicons/react/24/outline";
import type { TimelineItem } from "@hey/indexer";
import type { FC } from "react";
import { Fragment } from "react";

interface CombinedProps {
  timelineItem: TimelineItem;
}

const Combined: FC<CombinedProps> = ({ timelineItem }) => {
  const { reposts } = timelineItem;

  const repostsLength = reposts.length;

  const getAllProfiles = () => {
    let profiles = reposts.map((event) => event.author);
    profiles = profiles.filter(
      (profile, index, self) =>
        index === self.findIndex((t) => t.address === profile.address)
    );
    return profiles;
  };

  const actionArray = [];
  if (repostsLength) {
    actionArray.push("reposted");
  }

  return (
    <div className="ld-text-gray-500 flex flex-wrap items-center space-x-1 pb-4 text-[13px] leading-6">
      <SparklesIcon className="size-4" />
      <Accounts accounts={getAllProfiles()} />
      <div className="flex items-center space-x-1">
        {actionArray.map((action, index) => (
          <Fragment key={action}>
            <span>{action}</span>
            {index < actionArray.length - 2 && <span>, </span>}
            {index === actionArray.length - 2 && <span>and</span>}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Combined;
