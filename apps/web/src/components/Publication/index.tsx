import Feed from '@components/Comment/Feed';
import NoneRelevantFeed from '@components/Comment/NoneRelevantFeed';
import MetaTags from '@components/Common/MetaTags';
import NewPublication from '@components/Composer/NewPublication';
import CommentWarning from '@components/Shared/CommentWarning';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import PublicationStaffTool from '@components/StaffTools/Panels/Publication';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { usePublicationQuery } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { usePreferencesStore } from 'src/store/preferences';
import { useEffectOnce } from 'usehooks-ts';

import FullPublication from './FullPublication';
import OnchainMeta from './OnchainMeta';
import RelevantPeople from './RelevantPeople';
import PublicationPageShimmer from './Shimmer';

// Matches Tailwind breakpoints
const isMinimumBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl') => {
  const width = window.innerWidth;
  if (breakpoint === 'sm') {
    return width < 640;
  }
  if (breakpoint === 'md') {
    return width >= 640;
  }
  if (breakpoint === 'lg') {
    return width >= 768;
  }
  if (breakpoint === 'xl') {
    return width >= 1024;
  }
};

const ViewPublication: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = usePreferencesStore((state) => state.staffMode);
  const showNewPostModal = useGlobalModalStateStore(
    (state) => state.showNewPostModal
  );

  const router = useRouter();
  const {
    query: { id }
  } = router;

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'publication' });
  });

  const { data, loading, error } = usePublicationQuery({
    variables: {
      request: { publicationId: id },
      reactionRequest: currentProfile
        ? { profileId: currentProfile?.id }
        : null,
      profileId: currentProfile?.id ?? null
    },
    skip: !id
  });

  const publicationType = data?.publication?.__typename;

  const wrapperRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const mainSectionRef = useRef<HTMLDivElement>(null);
  const mainPostRef = useRef<HTMLDivElement>(null);
  const profileSectionRef = useRef<HTMLDivElement>(null);

  const hasScrolledRef = useRef(false);
  const scrollMainPostIntoView = useCallback(() => {
    // Skip scroll if there's nothing above the publication
    if (publicationType === 'Post') {
      return;
    }

    mainPostRef.current?.scrollIntoView();
  }, [mainPostRef, publicationType]);

  const configureSize = useCallback(() => {
    const wrapperElement = wrapperRef.current;
    const mainSectionElement = mainSectionRef.current;
    const mainPostElement = mainPostRef.current;
    const profileSectionElement = profileSectionRef.current;

    if (
      !wrapperElement ||
      !mainSectionElement ||
      !mainPostElement ||
      !profileSectionElement
    ) {
      return;
    }

    const threadSection = mainSectionElement.children[0] as HTMLDivElement;
    const secondarySection = mainSectionElement.children[1] as HTMLDivElement;

    const navbarHeight = isMinimumBreakpoint('md') ? '4rem' : '3.5rem';
    const sectionHeights = `${
      threadSection.clientHeight + secondarySection.clientHeight
    }px`;
    const profileSectionHeight = isMinimumBreakpoint('xl')
      ? '0px'
      : `${profileSectionElement.clientHeight}px`;
    const additionalSpace = `100vh - ${navbarHeight} - ${mainPostElement.clientHeight}px - ${secondarySection.clientHeight}px - ${profileSectionHeight}`;

    mainSectionElement.style.minHeight = `calc(${sectionHeights} + ${additionalSpace})`;
  }, [mainSectionRef, mainPostRef]);

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver(() => {
        configureSize();
        scrollMainPostIntoView();
      }),
    [configureSize, scrollMainPostIntoView]
  );

  useEffect(() => {
    const resetScrollRef = () => (hasScrolledRef.current = false);

    window.addEventListener('resize', configureSize);
    // Reset the scroll ref on route change
    // to handle switching between posts
    router.events.on('routeChangeStart', resetScrollRef);

    return () => {
      window.removeEventListener('resize', configureSize);
      router.events.off('routeChangeStart', resetScrollRef);
    };
  }, [router, configureSize]);

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
  const canComment = publication?.canComment?.result;

  return (
    <GridLayout
      ref={(element) => {
        // Clean up previously observed elements
        resizeObserver.disconnect();

        if (element) {
          wrapperRef.current = element;

          configureSize();

          if (hasScrolledRef.current) {
            return;
          }

          // Observe image tags to account for content that changes
          // height dynamically because they take time to load.
          const imageElements = element.querySelectorAll('img');
          for (const imageElement of imageElements) {
            resizeObserver.observe(imageElement);
          }

          scrollMainPostIntoView();
        }
      }}
    >
      <MetaTags
        title={
          publication.__typename && publication?.profile?.handle
            ? `${publication.__typename} by @${formatHandle(
                publication.profile.handle
              )} • ${APP_NAME}`
            : APP_NAME
        }
      />
      <GridItemEight className="space-y-5" ref={mainSectionRef}>
        <Card>
          <FullPublication
            publication={publication}
            key={publication?.id}
            mainPostRef={mainPostRef}
          />
        </Card>
        {currentProfile && !publication?.hidden && !showNewPostModal ? (
          canComment ? (
            <NewPublication publication={publication} />
          ) : (
            <CommentWarning />
          )
        ) : null}
        <Feed publication={publication} />
        <NoneRelevantFeed publication={publication} />
      </GridItemEight>
      <GridItemFour className="space-y-5" ref={profileSectionRef}>
        <Card as="aside" className="p-5" dataTestId="poster-profile">
          <UserProfile
            profile={
              publication.__typename === 'Mirror'
                ? publication?.mirrorOf?.profile
                : publication?.profile
            }
            showBio
          />
        </Card>
        <RelevantPeople publication={publication} />
        <OnchainMeta publication={publication} />
        {staffMode ? <PublicationStaffTool publication={publication} /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPublication;
