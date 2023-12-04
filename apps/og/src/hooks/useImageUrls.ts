import { useMemo } from 'react';

import type { FileType } from '../layouts/types';

import { useConfig } from './useConfig';
import { useLayoutConfig } from './useLayoutConfig';

export const useImageUrl = (fileType: FileType) => {
  const [config] = useConfig();
  const [layoutConfig] = useLayoutConfig();

  const query = useMemo(() => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries({
      ...config,
      ...layoutConfig
    })) {
      if (value != null) {
        searchParams.set(key, value as string);
      }
    }

    return searchParams.toString();
  }, [config, layoutConfig]);

  const imageUrl = useMemo(
    () => `/api/image?fileType=${fileType}&${query}`,
    [query, fileType]
  );

  return imageUrl;
};
