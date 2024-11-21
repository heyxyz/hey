import MetaTags from "@components/Common/MetaTags";
import NewPost from "@components/Composer/NewPost";
import Cover from "@components/Shared/Cover";
import { Leafwatch } from "@helpers/leafwatch";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import {
  APP_NAME,
  HANDLE_PREFIX,
  STATIC_IMAGES_URL
} from "@hey/data/constants";
import { AccountFeedType } from "@hey/data/enums";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW } from "@hey/data/tracking";
import getAccountDetails, {
  GET_ACCOUNT_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getAccountDetails";
import getAccount from "@hey/helpers/getAccount";
import type { Profile } from "@hey/lens";
import { useProfileQuery } from "@hey/lens";
import { EmptyState, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import AccountFeed from "./AccountFeed";
import Details from "./Details";
import FeedType from "./FeedType";
import Lists from "./Lists";
import AccountPageShimmer from "./Shimmer";
import SuspendedDetails from "./SuspendedDetails";

const ViewProfile: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { handle, id, source, type }
  } = useRouter();
  const { currentAccount } = useAccountStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  useEffect(() => {
    if (isReady) {
      Leafwatch.track(PAGEVIEW, {
        page: "profile",
        subpage: pathname
          .replace("/u/[handle]", "")
          .replace("/profile/[id]", ""),
        ...(source ? { source } : {})
      });
    }
  }, [handle, id]);

  const lowerCaseAccountFeedType = [
    AccountFeedType.Feed.toLowerCase(),
    AccountFeedType.Replies.toLowerCase(),
    AccountFeedType.Media.toLowerCase(),
    AccountFeedType.Collects.toLowerCase(),
    AccountFeedType.Lists.toLowerCase()
  ];

  const feedType = type
    ? lowerCaseAccountFeedType.includes(type as string)
      ? type.toString().toUpperCase()
      : AccountFeedType.Feed
    : AccountFeedType.Feed;

  const {
    data,
    error,
    loading: profileLoading
  } = useProfileQuery({
    skip: id ? !id : !handle,
    variables: {
      request: {
        ...(id
          ? { forProfileId: id }
          : { forHandle: `${HANDLE_PREFIX}${handle}` })
      }
    }
  });

  const account = data?.profile as Profile;

  const { data: accountDetails, isLoading: accountDetailsLoading } = useQuery({
    enabled: Boolean(account?.id),
    queryFn: () => getAccountDetails(account?.id),
    queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, account?.id]
  });

  if (!isReady || profileLoading) {
    return <AccountPageShimmer />;
  }

  if (!account) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const isSuspended = isStaff ? false : accountDetails?.isSuspended;

  return (
    <>
      <MetaTags
        creator={getAccount(account).displayName}
        description={account.metadata?.bio}
        title={`${getAccount(account).displayName} (${
          getAccount(account).slugWithPrefix
        }) • ${APP_NAME}`}
      />
      <Cover
        cover={
          isSuspended
            ? `${STATIC_IMAGES_URL}/patterns/2.svg`
            : account?.metadata?.coverPicture?.optimized?.uri ||
              `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <GridLayout>
        <GridItemFour>
          {isSuspended ? (
            <SuspendedDetails account={account as Profile} />
          ) : (
            <Details
              isSuspended={accountDetails?.isSuspended || false}
              account={account as Profile}
            />
          )}
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {isSuspended ? (
            <EmptyState
              icon={<NoSymbolIcon className="size-8" />}
              message="Profile Suspended"
            />
          ) : (
            <>
              <FeedType feedType={feedType as AccountFeedType} />
              {currentAccount?.id === account?.id &&
              feedType !== AccountFeedType.Lists ? (
                <NewPost />
              ) : null}
              {feedType === AccountFeedType.Feed ||
              feedType === AccountFeedType.Replies ||
              feedType === AccountFeedType.Media ||
              feedType === AccountFeedType.Collects ? (
                <AccountFeed
                  handle={getAccount(account).slugWithPrefix}
                  accountDetailsLoading={accountDetailsLoading}
                  accountId={account.id}
                  type={feedType}
                />
              ) : feedType === AccountFeedType.Lists ? (
                <Lists account={account} />
              ) : null}
            </>
          )}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
