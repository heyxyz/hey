import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { PAGEVIEW } from '@lenster/data/tracking';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import type { Community } from '@lenster/types/communities';
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
  PageLoading
} from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import DeleteSettings from './Delete';

const DangerSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'danger' });
  });

  const {
    query: { slug }
  } = useRouter();
  const isCommunitiesEnabled = isFeatureEnabled(FeatureFlag.Communities);

  const fetchCommunity = async () => {
    try {
      const response = await axios(
        `${COMMUNITIES_WORKER_URL}/getCommunityBySlug/${slug}`
      );

      return response.data;
    } catch (error) {
      return [];
    }
  };

  const { data, isLoading, error } = useQuery(['community', slug], () =>
    fetchCommunity().then((res) => res)
  );

  if (!isCommunitiesEnabled) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  if (isLoading) {
    return <PageLoading message={t`Loading settings`} />;
  }

  if (!data) {
    return <Custom404 />;
  }

  const community: Community = data;

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Delete Community • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar community={community} />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <DeleteSettings community={community} />
      </GridItemEight>
    </GridLayout>
  );
};

export default DangerSettings;
