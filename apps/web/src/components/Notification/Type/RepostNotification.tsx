import Markup from "@components/Shared/Markup";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import getPostData from "@hey/helpers/getPostData";
import type { RepostNotificationFragment } from "@hey/indexer";
import Link from "next/link";
import plur from "plur";
import type { FC } from "react";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface RepostNotificationProps {
  notification: RepostNotificationFragment;
}

const RepostNotification: FC<RepostNotificationProps> = ({ notification }) => {
  const metadata = notification.post.metadata;
  const filteredContent = getPostData(metadata)?.content || "";
  const reposts = notification.reposts;
  const firstAccount = reposts?.[0]?.account;
  const length = reposts.length - 1;
  const moreThanOneAccount = length > 1;

  const text = moreThanOneAccount
    ? `and ${length} ${plur("other", length)} reposted your`
    : "reposted your";
  const type = notification.post.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ArrowsRightLeftIcon className="size-6" />
        <div className="flex items-center space-x-1">
          {reposts.slice(0, 10).map((repost) => (
            <div key={repost.account.address}>
              <NotificationAccountAvatar account={repost.account} />
            </div>
          ))}
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

export default RepostNotification;
