import { Menu, Transition } from '@headlessui/react';
import { ChartPieIcon, GlobeAltIcon, HashtagIcon, TerminalIcon } from '@heroicons/react/outline';
import React, { FC, Fragment, ReactNode } from 'react';
import { GIT_COMMIT_REF, GIT_COMMIT_SHA, IS_MAINNET, IS_PRODUCTION } from 'src/constants';

import Stats from './Stats';

interface Props {
  children: ReactNode;
}

const Badge: FC<Props> = ({ children }) => (
  <span className="py-0.5 px-1.5 text-xs font-bold bg-gray-300 rounded-md dark:bg-gray-900">{children}</span>
);

const StaffBar: FC = () => {
  return (
    <div className="flex justify-between py-1 px-3 text-sm bg-gray-200 dark:bg-black">
      <div className="flex items-center space-x-2">
        {IS_PRODUCTION ? (
          <div className="flex items-center space-x-1">
            <GlobeAltIcon className="w-4 h-4 text-green-500" />
            <Badge>
              prod <span className="text-[10px]">({IS_MAINNET ? 'mainnet' : 'testnet'})</span>
            </Badge>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <GlobeAltIcon className="w-4 h-4 text-yellow-500" />
            <Badge>
              dev <span className="text-[10px]">({IS_MAINNET ? 'mainnet' : 'testnet'})</span>
            </Badge>
          </div>
        )}
        {GIT_COMMIT_REF && (
          <a
            href={`https://github.com/lensterxyz/lenster/commit/${GIT_COMMIT_REF}`}
            className="flex items-center space-x-1"
            title="Git commit ref"
            target="_blank"
            rel="noreferrer noopener"
          >
            <TerminalIcon className="w-4 h-4" />
            <Badge>{GIT_COMMIT_REF}</Badge>
          </a>
        )}
        {GIT_COMMIT_SHA && (
          <a
            href={`https://github.com/lensterxyz/lenster/commit/${GIT_COMMIT_SHA}`}
            className="flex items-center space-x-1"
            title="Git commit SHA"
            target="_blank"
            rel="noreferrer noopener"
          >
            <HashtagIcon className="w-4 h-4" />
            <Badge>{GIT_COMMIT_SHA}</Badge>
          </a>
        )}
      </div>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button as="button">
              <ChartPieIcon className="w-4 h-4" />
            </Menu.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-2 z-10 py-1 mt-6 bg-white rounded-xl border shadow-sm origin-top-right dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
              >
                <Stats />
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default StaffBar;
