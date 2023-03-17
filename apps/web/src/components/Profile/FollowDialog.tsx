import Follow from '@components/Shared/Follow';
import Slug from '@components/Shared/Slug';
import SuperFollow from '@components/Shared/SuperFollow';
import { Image } from '@components/UI/Image';
import { t, Trans } from '@lingui/macro';
import { Button } from 'components/Button';
import type { Profile } from 'lens';
import type { Dispatch, FC } from 'react';
import formatHandle from 'utils/formatHandle';
import getAvatar from 'utils/getAvatar';

interface FollowModalProps {
  setShowFollowModal: Dispatch<boolean>;
  setFollowing: Dispatch<boolean | null>;
  profile: Profile;
}

const FollowModal: FC<FollowModalProps> = ({ profile, setFollowing, setShowFollowModal }) => {
  const followType = profile?.followModule?.__typename;

  return (
    <div className="p-5">
      <div className="flex justify-between text-lg font-bold">
        <span className="flex">
          <Image
            onError={({ currentTarget }) => {
              currentTarget.src = getAvatar(profile, false);
            }}
            src={getAvatar(profile)}
            className="mr-2 h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
            alt={formatHandle(profile?.handle)}
          />
          <Slug className="flex items-center" slug={formatHandle(profile?.handle)} prefix="@" />{' '}
        </span>
        <span className="flex">
          {followType === 'FeeFollowModuleSettings' ? (
            <div className="flex space-x-2">
              <SuperFollow profile={profile as any} setFollowing={setFollowing} showText />
            </div>
          ) : (
            <div className="flex space-x-2">
              <Follow profile={profile as any} setFollowing={setFollowing} showText outline={false} />
            </div>
          )}
          <Button
            className="ml-3 !px-3 !py-1.5 text-sm"
            outline
            onClick={() => {
              setShowFollowModal(false);
            }}
            aria-label={t`Not now`}
          >
            <Trans>Not now</Trans>
          </Button>
        </span>
      </div>
    </div>
  );
};

export default FollowModal;
