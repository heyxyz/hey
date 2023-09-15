import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Input, Toggle } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import React from 'react';
import { TokenGateCondition } from 'src/enums';
import { useSpacesStore } from 'src/store/spaces';

import SearchProfile from './SeachProfile';

const getTokenGateConditionDescription = (
  tokenGateConditionType: TokenGateCondition
): string => {
  switch (tokenGateConditionType) {
    case TokenGateCondition.HAVE_A_LENS_PROFILE:
      return t`have a lens profile`;
    case TokenGateCondition.FOLLOW_A_LENS_PROFILE:
      return t`follow a lens profile`;
    case TokenGateCondition.COLLECT_A_POST:
      return t`collect a post`;
    case TokenGateCondition.MIRROR_A_POST:
      return t`mirror a post`;
  }
};

interface ModuleProps {
  title: string;
  onClick: () => void;
  conditionToShow: TokenGateCondition;
  selectedCondition: TokenGateCondition;
}

const Module: FC<ModuleProps> = ({
  title,
  onClick,
  conditionToShow,
  selectedCondition
}) => (
  <Menu.Item
    as="button"
    className={cn(
      { 'dropdown-active': selectedCondition === conditionToShow },
      'menu-item w-44'
    )}
    onClick={onClick}
  >
    <div className="flex items-center justify-between space-x-2">
      <span>{t`${title}`}</span>
      {selectedCondition === conditionToShow ? (
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
      ) : null}
    </div>
  </Menu.Item>
);

const TokenGateForm: FC = () => {
  const {
    isTokenGated,
    setIsTokenGated,
    setTokenGateConditionType,
    tokenGateConditionType,
    setTokenGateConditionValue,
    tokenGateConditionValue
  } = useSpacesStore();

  return (
    <div className="items-center p-5 text-gray-500">
      {[
        TokenGateCondition.MIRROR_A_POST,
        TokenGateCondition.COLLECT_A_POST,
        TokenGateCondition.FOLLOW_A_LENS_PROFILE
      ].includes(tokenGateConditionType) && (
        <div className="flex-1 px-3">
          {tokenGateConditionType ===
          TokenGateCondition.FOLLOW_A_LENS_PROFILE ? (
            <SearchProfile
              modalWidthClassName="max-w-xs"
              placeholder={t`Search for lens profile...`}
              label={t`Enter Lens profile handle`}
            />
          ) : (
            <Input
              label="Enter Lens post link"
              placeholder={t`Lens post link`}
              value={tokenGateConditionValue}
              onChange={(e) => setTokenGateConditionValue(e.target.value)}
              className="placeholder-gray-400"
            />
          )}
        </div>
      )}
      <div className="flex items-center gap-2 p-3">
        <Toggle
          on={isTokenGated}
          setOn={() => setIsTokenGated(!isTokenGated)}
        />
        <div className="flex items-start gap-1">
          <span className="text-gray-400 dark:text-gray-500">
            <Trans>Token gate with</Trans>
          </span>
          <Menu as="div" className="relative">
            <Menu.Button>
              <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                <span>
                  {getTokenGateConditionDescription(tokenGateConditionType)}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </Menu.Button>
            <MenuTransition>
              <Menu.Items className="absolute right-0 w-48 rounded-lg border bg-white text-sm shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900">
                <Module
                  title={t`have a lens profile`}
                  onClick={() =>
                    setTokenGateConditionType(
                      TokenGateCondition.HAVE_A_LENS_PROFILE
                    )
                  }
                  conditionToShow={TokenGateCondition.HAVE_A_LENS_PROFILE}
                  selectedCondition={tokenGateConditionType}
                />
                <Module
                  title={t`follow a lens profile`}
                  onClick={() =>
                    setTokenGateConditionType(
                      TokenGateCondition.FOLLOW_A_LENS_PROFILE
                    )
                  }
                  conditionToShow={TokenGateCondition.FOLLOW_A_LENS_PROFILE}
                  selectedCondition={tokenGateConditionType}
                />
                <Module
                  title={t`collect a post`}
                  onClick={() =>
                    setTokenGateConditionType(TokenGateCondition.COLLECT_A_POST)
                  }
                  conditionToShow={TokenGateCondition.COLLECT_A_POST}
                  selectedCondition={tokenGateConditionType}
                />
                <Module
                  title={t`mirror a post`}
                  onClick={() =>
                    setTokenGateConditionType(TokenGateCondition.MIRROR_A_POST)
                  }
                  conditionToShow={TokenGateCondition.MIRROR_A_POST}
                  selectedCondition={tokenGateConditionType}
                />
              </Menu.Items>
            </MenuTransition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default TokenGateForm;
