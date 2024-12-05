import {
  BriefcaseIcon,
  DocumentPlusIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import type { PostAction } from "@hey/indexer";
import type { FC } from "react";

interface GetOpenActionModuleIconProps {
  module?: PostAction;
}

const GetOpenActionModuleIcon: FC<GetOpenActionModuleIconProps> = ({
  module
}) => {
  switch (module?.__typename) {
    case "SimpleCollectActionSettings":
      return <DocumentPlusIcon className="size-5" />;
    case "MultirecipientFeeCollectActionSettings":
      return <UserGroupIcon className="size-5" />;
    default:
      return <BriefcaseIcon className="size-5" />;
  }
};

export default GetOpenActionModuleIcon;
