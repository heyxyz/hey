import useLocalStorageState from 'use-local-storage-state';

import type { IConfig } from '../layouts/types';

import { layouts } from '../layouts';

export const defaultConfig: IConfig = {
  layoutName: layouts[0].name
};

// export const useConfig = createLocalStorageStateHook<IConfig>(
//   "config-v2",
//   defaultConfig,
// );

export const useConfig = () =>
  useLocalStorageState('config-v3', {
    defaultValue: defaultConfig
  });
