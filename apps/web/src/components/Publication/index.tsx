import Feed from '@components/Comment/Feed';
import NoneRelevantFeed from '@components/Comment/NoneRelevantFeed';
import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import PublicationStaffTool from '@components/StaffTools/Panels/Publication';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import formatHandle from '@lib/formatHandle';
import getURLs from '@lib/getURLs';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import { APP_NAME } from 'data/constants';
import { usePublicationQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import FullPublication from './FullPublication';
import OnchainMeta from './OnchainMeta';
import RelevantPeople from './RelevantPeople';
import PublicationPageShimmer from './Shimmer';

const ViewPublication: NextPage = () => {
  const [adaptiveHeight, setAdaptiveHeight] = useState('');
  const postContainerRef = useRef<HTMLDivElement>(null);

  const currentProfile = useAppStore((state) => state.currentProfile);
  const { allowed: staffMode } = useStaffMode();
  const {
    query: { id }
  } = useRouter();

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'publication' });
  }, []);

  const { data, loading, error } = usePublicationQuery({
    variables: {
      request: { publicationId: id },
      reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
      profileId: currentProfile?.id ?? null
    },
    skip: !id
  });

  const calculateAdaptiveHeight = () => {
    const currentRef = postContainerRef.current;
    if (!currentRef || !data?.publication) {
      return;
    }

    if (data?.publication?.isGated) {
      return;
    }
    const { publication } = data;
    const commentOn = publication.__typename === 'Comment' ? (publication?.commentOn as any) : null;
    const mainPost = commentOn?.__typename !== 'Mirror' ? commentOn?.mainPost : null;
    const hasUrls =
      getURLs(publication?.metadata?.content) ||
      getURLs(commentOn.metadata.content) ||
      getURLs(mainPost.metadata.content);
    const height = hasUrls.length ? 360 : 0;
    setAdaptiveHeight(`calc(100vh + ${currentRef.clientHeight + height}px)`);
  };

  useEffect(() => {
    calculateAdaptiveHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postContainerRef, data]);

  if (error) {
    return <Custom500 />;
  }

  if (loading || !data) {
    return <PublicationPageShimmer />;
  }

  if (!data.publication) {
    return <Custom404 />;
  }

  const { publication } = data as any;

  return (
    <GridLayout className={clsx(publication.commentOn && !publication.isGated && 'min-h-screen')}>
      <MetaTags
        title={
          publication.__typename && publication?.profile?.handle
            ? `${publication.__typename} by @${formatHandle(publication.profile.handle)} • ${APP_NAME}`
            : APP_NAME
        }
      />
      <GridItemEight className="space-y-5" style={{ minHeight: adaptiveHeight }}>
        <Card>
          <FullPublication publication={publication} postContainerRef={postContainerRef} />
        </Card>
        <Feed publication={publication} />
        <NoneRelevantFeed publication={publication} />
      </GridItemEight>
      <GridItemFour className="relative">
        <div className="fixed max-w-[392px] space-y-5">
          <Card as="aside" className="p-5">
            <UserProfile
              profile={
                publication.__typename === 'Mirror' ? publication?.mirrorOf?.profile : publication?.profile
              }
              showBio
            />
          </Card>
          <RelevantPeople publication={publication} />
          <OnchainMeta publication={publication} />
          {staffMode && <PublicationStaffTool publication={publication} />}
          <Footer />
        </div>
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPublication;
