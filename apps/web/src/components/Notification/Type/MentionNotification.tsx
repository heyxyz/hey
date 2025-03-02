import Markup from "@components/Shared/Markup";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import type { MentionNotificationFragment } from "@hey/indexer";
import Link from "next/link";
import type { FC } from "react";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface MentionNotificationProps {
  notification: MentionNotificationFragment;
}

const MentionNotification: FC<MentionNotificationProps> = ({
  notification
}) => {
  const metadata = notification.post.metadata;
  const filteredContent = getPostData(metadata)?.content || "";
  const firstAccount = notification.post.author;

  const text = "mentioned you in a";
  const type = notification.post.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <AtSymbolIcon className="size-6" />
        <div className="flex items-center space-x-1">
          <NotificationAccountAvatar account={firstAccount} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstAccount={firstAccount}
          linkToType={`/posts/${notification.post.id}`}
          text={text}
          type={type}
        />
        <Link
          className="ld-text-gray-500 linkify mt-2 line-clamp-2"
          href={`/posts/${notification.post.id}`}
        >
          <Markup mentions={notification.post.mentions}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default MentionNotification;
