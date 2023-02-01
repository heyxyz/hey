import { GlobeAltIcon, HashtagIcon, TemplateIcon } from '@heroicons/react/outline';
import { GIT_COMMIT_SHA, IS_MAINNET, IS_PRODUCTION } from 'data/constants';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Badge: FC<Props> = ({ children }) => (
  <span className="rounded-md bg-gray-300 py-0.5 px-1.5 text-xs font-bold dark:bg-gray-900">{children}</span>
);

const StaffBar: FC = () => {
  return (
    <div className="flex justify-between bg-gray-200 py-1 px-3 text-sm dark:bg-black">
      <div className="flex items-center space-x-2">
        {IS_PRODUCTION ? (
          <div className="flex items-center space-x-1">
            <GlobeAltIcon className="h-4 w-4 text-green-500" />
            <Badge>
              prod <span className="text-[10px]">({IS_MAINNET ? 'mainnet' : 'testnet'})</span>
            </Badge>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <GlobeAltIcon className="h-4 w-4 text-yellow-500" />
            <Badge>
              dev <span className="text-[10px]">({IS_MAINNET ? 'mainnet' : 'testnet'})</span>
            </Badge>
          </div>
        )}
        {GIT_COMMIT_SHA && (
          <a
            href={`https://github.com/lensterxyz/lenster/commit/${GIT_COMMIT_SHA}`}
            className="flex items-center space-x-1"
            title="Git commit SHA"
            target="_blank"
            rel="noreferrer noopener"
          >
            <HashtagIcon className="h-4 w-4" />
            <Badge>{GIT_COMMIT_SHA}</Badge>
          </a>
        )}
      </div>
      <div className="flex items-center">
        <Link href="/stafftools">
          <TemplateIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default StaffBar;
