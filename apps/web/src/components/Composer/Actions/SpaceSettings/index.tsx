import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Input, Toggle } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { TokenGateCondition, useSpacesStore } from 'src/store/spaces';

interface SpaceSettingsProps {
  children?: React.ReactNode;
}

const SpaceSettings: FC<SpaceSettingsProps> = ({ children }) => {
  const {
    isRecordingOn,
    setIsRecordingOn,
    isTokenGated,
    setIsTokenGated,
    setTokenGateConditionType,
    tokenGateConditionType,
    setTokenGateConditionValue,
    tokenGateConditionValue
  } = useSpacesStore();

  interface ModuleProps {
    title: string;
    onClick: () => void;
    condition: TokenGateCondition;
  }

  const Module: FC<ModuleProps> = ({ title, onClick, condition }) => (
    <Menu.Item
      as="a"
      className={clsx(
        { 'dropdown-active': tokenGateConditionType === condition },
        'menu-item'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-1.5">
          <div>{title}</div>
        </div>
        {tokenGateConditionType === condition && (
          <CheckCircleIcon className="w-5 text-green-500" />
        )}
      </div>
    </Menu.Item>
  );

  return (
    <div>
      {tokenGateConditionType !== TokenGateCondition.HAVE_A_LENS_PROFILE && (
        <div className="flex w-full items-center gap-2 px-4 py-3">
          <div className="flex items-center gap-3 text-neutral-500">
            <Trans>
              {tokenGateConditionType ===
              TokenGateCondition.FOLLOW_A_LENS_PROFILE
                ? 'Enter Lens profile'
                : 'Enter Lens post link'}
            </Trans>
          </div>
          <div className="flex flex-[1_0_0] items-center gap-1 px-3">
            <Input
              placeholder={`Lens ${
                tokenGateConditionType ===
                TokenGateCondition.FOLLOW_A_LENS_PROFILE
                  ? 'handle'
                  : 'post link'
              }`}
              value={tokenGateConditionValue}
              onChange={(e) => setTokenGateConditionValue(e.target.value)}
              className="placeholder-neutral-400"
            />
          </div>
        </div>
      )}
      <div className="block items-center px-4 pt-3 sm:flex">
        <div className="flex flex-[0_0_1] gap-2 space-x-1">
          <div>
            <Toggle
              on={isRecordingOn}
              setOn={() => setIsRecordingOn(!isRecordingOn)}
            />
          </div>
          <div className="flex flex-col items-start text-sm text-neutral-400 dark:text-neutral-500">
            <Trans>Record Spaces</Trans>
          </div>
          <div>
            <Toggle
              on={isTokenGated}
              setOn={() => setIsTokenGated(!isTokenGated)}
            />
          </div>
          <div className="flex items-start gap-1">
            <div className="flex flex-col items-start text-sm text-neutral-400 dark:text-neutral-500">
              <Trans>Token gate with</Trans>
            </div>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-start gap-1">
                <span className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-300">
                  <Trans>
                    {tokenGateConditionType !==
                    TokenGateCondition.HAVE_A_LENS_PROFILE
                      ? tokenGateConditionType ===
                        TokenGateCondition.FOLLOW_A_LENS_PROFILE
                        ? 'follow a lens profile'
                        : tokenGateConditionType ===
                          TokenGateCondition.COLLECT_A_POST
                        ? 'collect a post'
                        : 'mirror a post'
                      : 'have a lens profile'}
                  </Trans>
                  <ChevronDownIcon className="h-4 w-4 items-center justify-center" />
                </span>
              </Menu.Button>
              <MenuTransition>
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border bg-white text-sm shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900">
                  <Module
                    title="have a lens profile"
                    onClick={() =>
                      setTokenGateConditionType(
                        TokenGateCondition.HAVE_A_LENS_PROFILE
                      )
                    }
                    condition={TokenGateCondition.HAVE_A_LENS_PROFILE}
                  />

                  <Module
                    title="follow a lens profile"
                    onClick={() =>
                      setTokenGateConditionType(
                        TokenGateCondition.FOLLOW_A_LENS_PROFILE
                      )
                    }
                    condition={TokenGateCondition.FOLLOW_A_LENS_PROFILE}
                  />

                  <Module
                    title="collect a post"
                    onClick={() =>
                      setTokenGateConditionType(
                        TokenGateCondition.COLLECT_A_POST
                      )
                    }
                    condition={TokenGateCondition.COLLECT_A_POST}
                  />

                  <Module
                    title="mirror a post"
                    onClick={() =>
                      setTokenGateConditionType(
                        TokenGateCondition.MIRROR_A_POST
                      )
                    }
                    condition={TokenGateCondition.MIRROR_A_POST}
                  />
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
