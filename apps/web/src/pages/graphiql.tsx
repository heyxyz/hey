import type { FC } from 'react';

import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { LENS_API_URL } from '@hey/data/constants';
import cn from '@hey/ui/cn';
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

const Graphiql: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  const { accessToken } = hydrateAuthTokens();

  const fetcher = createGraphiQLFetcher({
    fetch,
    headers: {
      'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
    },
    url: LENS_API_URL
  });

  const defaultQuery = `{
  profile(request: {forProfileId: "${currentProfile?.id || '0x0d'}"}) {
    id
    handle {
      fullHandle
    }
    metadata {
      displayName
      bio
    }
  }
}`;

  return (
    <div
      className={cn(
        staffMode ? 'h-[calc(100vh-93px)]' : 'h-[calc(100vh-65px)]'
      )}
    >
      <GraphiQL
        defaultQuery={defaultQuery}
        disableTabs
        fetcher={fetcher}
        isHeadersEditorEnabled={false}
        maxHistoryLength={10}
        shouldPersistHeaders={false}
      />
    </div>
  );
};

export default Graphiql;
