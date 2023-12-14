import {
  BellIcon,
  HomeIcon,
  Squares2X2Icon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  HomeIcon as HomeIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getProfile from '@hey/lib/getProfile';
import useProfileStore from 'src/store/persisted/useProfileStore';
import cn from '@hey/ui/cn';

const BottomNavigation = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const router = useRouter();
  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[5] border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:hidden">
      <div className={cn("grid", currentProfile ? "grid-cols-4" : "grid-cols-3")}>
        <Link className="mx-auto my-3" href="/">
          {isActivePath('/') ? (
            <HomeIconSolid className="text-brand-500 h-6 w-6" />
          ) : (
            <HomeIcon className="h-6 w-6" />
          )}
        </Link>
        <Link className="mx-auto my-3" href="/explore">
          {isActivePath('/explore') ? (
            <Squares2X2IconSolid className="text-brand-500 h-6 w-6" />
          ) : (
            <Squares2X2Icon className="h-6 w-6" />
          )}
        </Link>
        <Link className="mx-auto my-3" href="/notifications">
          {isActivePath('/notifications') ? (
            <BellIconSolid className="text-brand-500 h-6 w-6" />
          ) : (
            <BellIcon className="h-6 w-6" />
          )}
        </Link>
        {currentProfile &&
          <Link className="mx-auto my-3" href={getProfile(currentProfile).link}>
            {isActivePath('/u/[handle]') ? (
              <UserIconSolid className="text-brand-500 h-6 w-6" />
            ) : (
              <UserIcon className="h-6 w-6" />
            )}
          </Link>
        }
      </div>
    </div>
  );
};

export default BottomNavigation;
