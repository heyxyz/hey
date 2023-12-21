import type { Profile } from '@hey/lens';

import {
  BellIcon,
  HomeIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  HomeIcon as HomeIconSolid,
  Squares2X2Icon as Squares2X2IconSolid
} from '@heroicons/react/24/solid';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useProfileStore from 'src/store/persisted/useProfileStore';

const BottomNavigation = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const router = useRouter();
  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[5] border-t border-gray-200 bg-white md:hidden dark:border-gray-800 dark:bg-black">
      <div
        className={cn('grid', currentProfile ? 'grid-cols-4' : 'grid-cols-3')}
      >
        <Link className="mx-auto my-3" href="/">
          {isActivePath('/') ? (
            <HomeIconSolid className="text-brand-500 size-6" />
          ) : (
            <HomeIcon className="size-6" />
          )}
        </Link>
        <Link className="mx-auto my-3" href="/explore">
          {isActivePath('/explore') ? (
            <Squares2X2IconSolid className="text-brand-500 size-6" />
          ) : (
            <Squares2X2Icon className="size-6" />
          )}
        </Link>
        <Link className="mx-auto my-3" href="/notifications">
          {isActivePath('/notifications') ? (
            <BellIconSolid className="text-brand-500 size-6" />
          ) : (
            <BellIcon className="size-6" />
          )}
        </Link>
        {currentProfile && (
          <Link className="mx-auto my-3" href={getProfile(currentProfile).link}>
            <Image
              alt={currentProfile?.id}
              className="size-6 rounded-full border dark:border-gray-700"
              src={getAvatar(currentProfile as Profile)}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
