import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import type { LensterPublication } from '@generated/types';
import formatHandle from '@lib/formatHandle';
import { t } from '@lingui/macro';
import { ALL_HANDLES_REGEX, HANDLE_SANITIZE_REGEX } from 'data/constants';
import type { Profile } from 'lens';
import { useRelevantPeopleQuery } from 'lens';
import type { FC } from 'react';

interface Props {
  publication: LensterPublication;
}

const RelevantPeople: FC<Props> = ({ publication }) => {
  const mentions = publication?.metadata?.content?.match(ALL_HANDLES_REGEX, '$1[~$2]') ?? [];

  mentions.push(publication?.profile?.handle);

  const processedMentions = mentions
    ? mentions.map((mention: string) => {
        const trimmedMention = mention.trim().replace('@', '').replace("'s", '');

        if (trimmedMention.length > 9) {
          return mention.trim().replace("'s", '').replace(HANDLE_SANITIZE_REGEX, '');
        }

        return formatHandle(publication?.profile?.handle);
      })
    : [];

  const cleanedMentions = processedMentions.reduce((handles: string[], handle: string) => {
    if (!handles.includes(handle)) {
      handles.push(handle);
    }
    return handles;
  }, []);

  const { data, loading, error } = useRelevantPeopleQuery({
    variables: { request: { handles: cleanedMentions.slice(0, 5) } }
  });

  if (loading) {
    return (
      <Card as="aside" className="space-y-4 p-5">
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
      </Card>
    );
  }

  if (data?.profiles?.items?.length === 0) {
    return null;
  }

  return (
    <Card as="aside" className="space-y-4 p-5">
      <ErrorMessage title={t`Failed to load relevant people`} error={error} />
      {data?.profiles?.items?.map((profile) => (
        <div key={profile?.id} className="truncate">
          <UserProfile profile={profile as Profile} isFollowing={profile.isFollowedByMe} showFollow />
        </div>
      ))}
    </Card>
  );
};

export default RelevantPeople;
