import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Input, Toggle } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';

enum TokenGateCondition {
  HAVE_A_LENS_PROFILE,
  FOLLOW_A_LENS_PROFILE,
  COLLECT_A_POST,
  MIRROR_A_POST
}

const SpaceSettings: FC = () => {
  const { isRecordingOn, setIsRecordingOn, isTokenGated, setIsTokenGated } =
    useSpacesStore();

  const [selectedDropdown, setSelectedDropdown] = useState<TokenGateCondition>(
    TokenGateCondition.HAVE_A_LENS_PROFILE
  );

  interface ModuleProps {
    title: string;
    onClick: () => void;
    condition: TokenGateCondition;
  }

  const Module: FC<ModuleProps> = ({ title, onClick, condition }) => (
    <Menu.Item
      as="a"
      className={clsx(
        { 'dropdown-active': selectedDropdown === condition },
        'menu-item'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-1.5">
          <div>{title}</div>
        </div>
        {selectedDropdown === condition && (
          <CheckCircleIcon className="w-5 text-green-500" />
        )}
      </div>
    </Menu.Item>
  );

  return (
    <div>
      {selectedDropdown !== TokenGateCondition.HAVE_A_LENS_PROFILE && (
        <div className="flex w-full items-center gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-3 text-neutral-500">
            <Trans>
              {selectedDropdown === TokenGateCondition.FOLLOW_A_LENS_PROFILE
                ? 'Enter Lens profile link'
                : 'Enter Lens post link'}
            </Trans>
          </div>
          <div className="flex flex-[1_0_0] items-center gap-1 px-3">
            <Input
              placeholder={`Lens ${
                selectedDropdown === TokenGateCondition.FOLLOW_A_LENS_PROFILE
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
                <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-300">
                  <Trans>
                    {selectedDropdown !== TokenGateCondition.HAVE_A_LENS_PROFILE
                      ? selectedDropdown ===
                        TokenGateCondition.FOLLOW_A_LENS_PROFILE
                        ? 'follow a lens profile'
                        : selectedDropdown === TokenGateCondition.COLLECT_A_POST
                        ? 'collect a post'
                        : 'mirror a post'
                      : 'have a lens profile'}
                  </Trans>
                  <ChevronDownIcon className="h-4 w-4 items-center justify-center" />
                </span>
              </Menu.Button>
              <MenuTransition>
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-gray-900">
                  <Module
                    title="have a lens profile"
                    onClick={() =>
                      setSelectedDropdown(
                        TokenGateCondition.HAVE_A_LENS_PROFILE
                      )
                    }
                    condition={TokenGateCondition.HAVE_A_LENS_PROFILE}
                  />

                  <Module
                    title="follow a lens profile"
                    onClick={() =>
                      setSelectedDropdown(
                        TokenGateCondition.FOLLOW_A_LENS_PROFILE
                      )
                    }
                    condition={TokenGateCondition.FOLLOW_A_LENS_PROFILE}
                  />

                  <Module
                    title="collect a post"
                    onClick={() =>
                      setSelectedDropdown(TokenGateCondition.COLLECT_A_POST)
                    }
                    condition={TokenGateCondition.COLLECT_A_POST}
                  />

                  <Module
                    title="mirror a post"
                    onClick={() =>
                      setSelectedDropdown(TokenGateCondition.MIRROR_A_POST)
                    }
                    condition={TokenGateCondition.MIRROR_A_POST}
                  />
                </Menu.Items>
              </MenuTransition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceSettings;
