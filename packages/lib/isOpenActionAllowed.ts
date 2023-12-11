import {
  type Maybe,
  type OpenActionModule,
  OpenActionModuleType
} from '@hey/lens';

import allowedOpenActionModules from './allowedOpenActionModules';

const allowedTypes = [
  ...allowedOpenActionModules,
  OpenActionModuleType.UnknownOpenActionModule
];

const isOpenActionAllowed = (
  openActions?: Maybe<OpenActionModule[]>
): boolean => {
  if (!openActions?.length) {
    return false;
  }

  return openActions.some((openAction) => {
    const { type } = openAction;

    return allowedTypes.includes(type);
  });
};

export default isOpenActionAllowed;
