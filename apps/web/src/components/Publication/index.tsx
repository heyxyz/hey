import Feed from '@components/Comment/Feed';
import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import PublicationStaffTool from '@components/StaffTools/Panels/Publication';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import formatHandle from '@lib/formatHandle';
import clsx from 'clsx';
import { APP_NAME } from 'data/constants';
import { usePublicationQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';

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
    setAdaptiveHeight(`calc(100vh + ${currentRef.clientHeight - 85}px)`);
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
      </GridItemEight>
      <GridItemFour className="relative">
        <div className="fixed space-y-5 max-w-[392px]">
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
