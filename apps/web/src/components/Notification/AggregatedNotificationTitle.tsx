import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import Link from "next/link";
import type { FC } from "react";
import { NotificationAccountName } from "./Account";

interface AggregatedNotificationTitleProps {
  firstAccount: Profile;
  linkToType: string;
  text: string;
  type?: string;
}

const AggregatedNotificationTitle: FC<AggregatedNotificationTitleProps> = ({
  firstAccount,
  linkToType,
  text,
  type
}) => {
  return (
    <div>
      <NotificationAccountName account={firstAccount} />
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
