import { useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import type { ILayoutConfig } from '../layouts/types';

import { getDefaultLayoutConfig, layouts } from '../layouts';
import { useConfig } from './useConfig';

// const useAllLayoutConfigs = createLocalStorageStateHook("layout-configs", {});
const useAllLayoutConfigs = () =>
  useLocalStorageState('layout-configs-v2', {
    defaultValue: {}
  });

export const useLayoutConfig = (): [
  ILayoutConfig,
  (layoutConfig: ILayoutConfig) => void
] => {
  const [{ layoutName }] = useConfig();
  const layout = useMemo(
    () => layouts.find((l) => l.name === layoutName),
    [layoutName]
  );

  const defaultConfig = useMemo(
    () => (layout != null ? getDefaultLayoutConfig(layout) : {}),
    [layout]
  );

  const [allLayoutConfig, setAllLayoutConfigs] = useAllLayoutConfigs();

  // @ts-ignore
  const layoutConfig = allLayoutConfig[layoutName] ?? {};

  const setLayoutConfig = (config: ILayoutConfig) => {
    setAllLayoutConfigs((all) => ({
      ...all,
      [layoutName]: {
        ...layoutConfig,
        ...config
      }
    }));
  };

  return [
    {
      ...defaultConfig,
      ...layoutConfig
    },
    setLayoutConfig
  ];
};
