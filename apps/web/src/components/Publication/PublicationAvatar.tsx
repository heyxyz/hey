import type { Profile } from '@hey/lens';

import getAvatar from '@hey/lib/getAvatar';
import getLennyURL from '@hey/lib/getLennyURL';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useRouter } from 'next/router';
import { type FC, memo } from 'react';

interface PublicationAvatarProps {
  profile: Profile;
  quoted?: boolean;
}

const PublicationAvatar: FC<PublicationAvatarProps> = ({
  profile,
  quoted = false
}) => {
  const { push } = useRouter();

  return (
    <Image
      alt={profile.id}
      className={cn(
        quoted ? 'size-6' : 'size-12',
        'z-[1] cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={quoted ? 25 : 48}
      loading="lazy"
      onClick={() => push(getProfile(profile).link)}
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(profile.id);
      }}
      src={getAvatar(profile)}
      width={quoted ? 25 : 48}
    />
  );
};

export default memo(PublicationAvatar);
