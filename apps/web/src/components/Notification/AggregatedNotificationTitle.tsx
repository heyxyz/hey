import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import Link from "next/link";
import type { FC } from "react";
import { NotificationProfileName } from "./Profile";

interface AggregatedNotificationTitleProps {
  firstProfile: Profile;
  linkToType: string;
  text: string;
  type?: string;
}

const AggregatedNotificationTitle: FC<AggregatedNotificationTitleProps> = ({
  firstProfile,
  linkToType,
  text,
  type
}) => {
  return (
    <div>
      <NotificationProfileName profile={firstProfile} />
      <span> {text} </span>
      {type && (
        <Link
          className="outline-none hover:underline focus:underline"
          href={linkToType}
          onClick={stopEventPropagation}
        >
          {type.toLowerCase()}
        </Link>
      )}
    </div>
  );
};

export default AggregatedNotificationTitle;
