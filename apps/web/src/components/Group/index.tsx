import MetaTags from "@components/Common/MetaTags";
import NewPost from "@components/Composer/NewPost";
import Cover from "@components/Shared/Cover";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import { type Group, useGroupQuery } from "@hey/indexer";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Members from "../Shared/Modal/Members";
import Details from "./Details";
import GroupFeed from "./GroupFeed";
import GroupPageShimmer from "./Shimmer";

const ViewGroup: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { slug }
  } = useRouter();
  const { currentAccount } = useAccountStore();

  const showMembers = pathname === "/g/[slug]/members";

  useEffect(() => {
    if (isReady) {
      Leafwatch.track(PAGEVIEW, {
        page: "group",
        subpage: pathname.replace("/g/[handle]", "")
      });
    }
  }, [slug]);

  const { data, loading, error } = useGroupQuery({
    variables: { request: { group: slug } }
  });

  if (!isReady || loading) {
    return <GroupPageShimmer profileList={showMembers} />;
  }

  if (!data?.group) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const group = data.group as Group;

  return (
    <>
      <MetaTags
        description={group.metadata?.description || ""}
        title={`${group.metadata?.name} (/${group.metadata?.slug}) • ${APP_NAME}`}
      />
      <Cover
        cover={group.metadata?.icon || `${STATIC_IMAGES_URL}/patterns/2.svg`}
      />
      <GridLayout>
        <GridItemFour>
          <Details group={group} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {showMembers ? (
            <Members address={group.address} slug={group.metadata?.slug} />
          ) : (
            <>
              {currentAccount && group.isMember && (
                <NewPost
                  tags={[
                    `orbcommunities${group.handle}`,
                    `heyclubs${group.handle}`
                  ]}
                />
              )}
              <GroupFeed handle={group.handle} />
            </>
          )}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewGroup;
