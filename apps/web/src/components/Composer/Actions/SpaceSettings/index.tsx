import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/outline';
import { Input, Toggle } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';

interface SpaceSettingsProps {
  children: ReactNode;
}

enum tokenGateCondition {
  HAVE_A_LENS_PROFILE = 'have a lens profile',
  FOLLOW_A_LENS_PROFILE = 'follow a lens profile',
  COLLECT_A_POST = 'collect a post',
  MIRROR_A_POST = 'mirror a post'
}

const SpaceSettings: FC<SpaceSettingsProps> = ({ children }) => {
  const [isRecordingOn, setIsRecordingOn] = useState(false);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState<string>('');

  return (
    <div>
      {selectedDropdown.length > 0 &&
        selectedDropdown !== tokenGateCondition.HAVE_A_LENS_PROFILE && (
          <div className="flex w-full items-center gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-3 text-neutral-500">
              <Trans>
                {selectedDropdown === tokenGateCondition.FOLLOW_A_LENS_PROFILE
                  ? 'Enter Lens profile link'
                  : 'Enter Lens post link'}
              </Trans>
            </div>
            <div className="flex flex-[1_0_0] items-center gap-1 px-3">
              <Input
                placeholder={`Lens ${
                  selectedDropdown === tokenGateCondition.FOLLOW_A_LENS_PROFILE
                    ? 'profile'
                    : 'post'
                } link`}
                className="placeholder-neutral-400"
              />
            </div>
          </div>
        )}
      <div className="block items-center border-t border-neutral-200 px-5 pt-3 dark:border-neutral-800 sm:flex">
        <div className="flex flex-[0_0_1] gap-2 space-x-1">
          <div>
            <Toggle
              on={isRecordingOn}
              setOn={() => setIsRecordingOn(!isRecordingOn)}
            />
          </div>
          <div className="flex flex-col items-start text-neutral-400 dark:text-neutral-500">
            <Trans>Record Spaces</Trans>
          </div>
          <div className="flex items-center justify-center">
            <svg
              width="2"
              height="20"
              viewBox="0 0 2 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 0V20" stroke="#262626" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <Toggle
              on={isTokenGated}
              setOn={() => setIsTokenGated(!isTokenGated)}
            />
          </div>
          <div className="flex items-start gap-1">
            <div className="flex flex-col items-start text-neutral-400 dark:text-neutral-500">
              <Trans>Token gate with</Trans>
            </div>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-start gap-1">
                <span className="flex items-start gap-1 text-neutral-500 dark:text-neutral-300">
                  <Trans>
                    {selectedDropdown.length > 0
                      ? selectedDropdown
                      : 'have a lens profile'}
                  </Trans>
                </span>
                <ChevronDownIcon className="h-6 w-6" />
              </Menu.Button>
              <MenuTransition>
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-gray-900">
                  <Menu.Item
                    as="label"
                    className={({ active }) =>
                      clsx(
                        { 'dropdown-active': active },
                        'flex items-center justify-between gap-3 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'
                      )
                    }
                    onClick={() =>
                      setSelectedDropdown(
                        tokenGateCondition.HAVE_A_LENS_PROFILE
                      )
                    }
                  >
                    <span>{tokenGateCondition.HAVE_A_LENS_PROFILE}</span>
                    {(selectedDropdown ===
                      tokenGateCondition.HAVE_A_LENS_PROFILE ||
                      selectedDropdown === '') && (
                      <CheckIcon className="relative h-5 w-5 text-green-400" />
                    )}
                  </Menu.Item>
                  <Menu.Item
                    as="label"
                    className={({ active }) =>
                      clsx(
                        { 'dropdown-active': active },
                        'flex items-center justify-between px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'
                      )
                    }
                    onClick={() =>
                      setSelectedDropdown(
                        tokenGateCondition.FOLLOW_A_LENS_PROFILE
                      )
                    }
                  >
                    <span>{tokenGateCondition.FOLLOW_A_LENS_PROFILE}</span>
                    <Trans>
                      {selectedDropdown === 'follow a lens profile' && (
                        <CheckIcon className="relative h-5 w-5 text-green-400" />
                      )}
                    </Trans>
                  </Menu.Item>
                  <Menu.Item
                    as="label"
                    className={({ active }) =>
                      clsx(
                        { 'dropdown-active': active },
                        'flex items-center justify-between px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'
                      )
                    }
                    onClick={() =>
                      setSelectedDropdown(tokenGateCondition.COLLECT_A_POST)
                    }
                  >
                    <span>
                      {' '}
                      <Trans> {tokenGateCondition.COLLECT_A_POST}</Trans>
                    </span>
                    {selectedDropdown === tokenGateCondition.COLLECT_A_POST && (
                      <CheckIcon className="relative h-5 w-5 text-green-400" />
                    )}
                  </Menu.Item>
                  <Menu.Item
                    as="label"
                    className={({ active }) =>
                      clsx(
                        { 'dropdown-active': active },
                        'flex items-center justify-between px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'
                      )
                    }
                    onClick={() =>
                      setSelectedDropdown(tokenGateCondition.MIRROR_A_POST)
                    }
                  >
                    <span>
                      <Trans> {tokenGateCondition.MIRROR_A_POST} </Trans>
                    </span>
                    {selectedDropdown === tokenGateCondition.MIRROR_A_POST && (
                      <CheckIcon className="relative h-5 w-5 text-green-400" />
                    )}
                  </Menu.Item>
                </Menu.Items>
              </MenuTransition>
            </Menu>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SpaceSettings;
