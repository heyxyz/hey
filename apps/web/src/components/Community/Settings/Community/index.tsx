import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { PAGEVIEW } from '@lenster/data/tracking';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import type { Community } from '@lenster/types/communities';
import {
  Card,
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
import React from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import Picture from './Picture';
import ProfileSettingsForm from './Profile';

const CommunitySettings: NextPage = () => {
  const {
    query: { slug }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isCommunitiesEnabled = isFeatureEnabled(FeatureFlag.Communities);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, {
      page: 'community-settings',
      subpage: 'profile'
    });
  });

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

  if (!data || data.admin !== currentProfile?.id) {
    return <Custom404 />;
  }

  const community: Community = data;

  return (
    <GridLayout>
      <MetaTags title={t`Community Settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar community={community} />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <ProfileSettingsForm community={community as any} />
        <Card className="space-y-5 p-5">
          <Picture community={community as any} />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default CommunitySettings;
