import { UserPlusIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import type { FollowNotification as TFollowNotification } from "@hey/lens";
import plur from "plur";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface FollowNotificationProps {
  notification: TFollowNotification;
}

const FollowNotification: FC<FollowNotificationProps> = ({ notification }) => {
  const { currentAccount } = useAccountStore();
  const followers = notification?.followers;
  const firstAccount = followers?.[0];
  const length = followers.length - 1;
  const moreThanOneAccount = length > 1;

  const text = moreThanOneAccount
    ? `and ${length} ${plur("other", length)} followed`
    : "followed";
  const type = "you";

  return (
    <div className="space-y-2 p-5">
      <div className="flex items-center space-x-3">
        <UserPlusIcon className="size-6" />
        <div className="flex items-center space-x-1">
          {followers.slice(0, 10).map((follower) => (
            <div key={follower.id}>
              <NotificationAccountAvatar account={follower} />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstAccount={firstAccount}
          linkToType={getAccount(currentAccount).link}
          text={text}
          type={type}
        />
      </div>
    </div>
  );
};

export default FollowNotification;
