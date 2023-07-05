import type {
  RoundMetaData,
  RoundStats as RoundStatsType
} from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import { useGetRoundMatchingUpdate } from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import PublicationRow from '@components/QFRound/PublicationRow';
import Loading from '@components/Shared/Loading';
import { t, Trans } from '@lingui/macro';
import { Card } from 'ui';

const Item = ({ title, value }: { title: string; value: string | number }) => (
  <div className="mb-2 flex basis-1/2 flex-col">
    <div className="lt-text-gray-500 text-sm">{title}</div>
    <div className="font-extrabold">{value}</div>
  </div>
);

const numberOfPopularPosts = 5;

const tokenAddressToSymbol = (tokenAddress: string) => {
  switch (tokenAddress) {
    case '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': {
      return 'DAI';
    }
    case '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': {
      return 'wETH';
    }
    case '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889':
    default: {
      return 'wMATIC';
    }
  }
};

export const RoundStats = ({
  stats,
  metaData,
  roundId
}: {
  roundId: string;
  stats: RoundStatsType;
  metaData: RoundMetaData;
}) => {
  const { data: matchingUpdate, isLoading } = useGetRoundMatchingUpdate(roundId);

  if (isLoading) {
    return <Loading />;
  }

  const postsWithMatching = stats.posts
    .map((post) => ({
      ...post,
      matching: matchingUpdate?.posts[post.publicationId]
    }))
    .filter((post) => post.matching);

  const sortedPostsWithMatching = postsWithMatching.sort(
    (a, b) => b.matching!.matchPoolPercentage - a.matching!.matchPoolPercentage
  );

  const mostPopularPosts = sortedPostsWithMatching.slice(0, numberOfPopularPosts);
  const otherPosts = sortedPostsWithMatching.slice(numberOfPopularPosts);

  const endTime = new Date(stats.roundEndTime * 1000).toLocaleString();

  return (
    <div className="">
      <div className="mb-4 text-2xl font-extrabold uppercase">{metaData?.name || 'Loading...'}</div>
      {metaData?.description && <div className="mb-4">{metaData.description}</div>}
      <div className="flex w-full flex-wrap">
        <Item title={t`Total of all tips`} value={`$ ${matchingUpdate?.totalTips}`} />
        <Item
          title={t`Total matching funds`}
          value={`${stats.totalMatched} ${tokenAddressToSymbol(stats.token)}`}
        />
        <Item title={t`Posts receiving tips`} value={stats.uniqueTippedPosts} />
        <Item title={t`Unique tippers`} value={stats.uniqueTippers} />
        {/*<Item title={t`Average tip`} value={`$ ${stats.averageTip}`} />*/}
        <Item title={t`Average tips per post`} value={stats.averageTipsPerPost} />
        <Item title={t`Round end`} value={endTime} />
      </div>
      {!!stats.posts.length && (
        <div className="mt-4 space-y-4">
          {!!mostPopularPosts.length && (
            <div className="mt-4">
              <div className="lt-text-gray-500 mb-2 text-sm">
                <Trans>Most popular posts in round</Trans>
              </div>
              <Card className="divide-y-[1px] dark:divide-gray-700">
                {mostPopularPosts.map(({ publicationId, matching }) => (
                  <PublicationRow
                    key={publicationId}
                    publicationId={publicationId}
                    matchingUpdateEntry={matching!}
                  />
                ))}
              </Card>
            </div>
          )}
          {!!otherPosts.length && (
            <div>
              <div className="lt-text-gray-500 mb-2 text-sm">
                <Trans>All posts in this round ({otherPosts.length})</Trans>
              </div>
              <Card className="divide-y-[1px] dark:divide-gray-700">
                {otherPosts.map(({ publicationId }) => (
                  <PublicationRow key={publicationId} publicationId={publicationId} />
                ))}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
