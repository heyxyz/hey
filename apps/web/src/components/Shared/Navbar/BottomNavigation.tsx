import {
  BellIcon,
  EnvelopeIcon,
  HomeIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  HomeIcon as HomeIconSolid,
  Squares2X2Icon as Squares2X2IconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BottomNavigation = () => {
  const router = useRouter();
  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[5] border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:hidden">
      <div className="grid grid-cols-4">
        <Link href="/" className="mx-auto my-3">
          {isActivePath('/') ? (
            <HomeIconSolid className="text-brand h-6 w-6" />
          ) : (
            <HomeIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/explore" className="mx-auto my-3">
          {isActivePath('/explore') ? (
            <Squares2X2IconSolid className="text-brand h-6 w-6" />
          ) : (
            <Squares2X2Icon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/notifications" className="mx-auto my-3">
          {isActivePath('/notifications') ? (
            <BellIconSolid className="text-brand h-6 w-6" />
          ) : (
            <BellIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/messages" className="mx-auto my-3">
          {isActivePath('/messages') ? (
            <EnvelopeIconSolid className="text-brand h-6 w-6" />
          ) : (
            <EnvelopeIcon className="h-6 w-6" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
