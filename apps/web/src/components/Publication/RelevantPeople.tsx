import { FollowSource } from '@components/Shared/Follow';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import formatHandle from '@lib/formatHandle';
import { t } from '@lingui/macro';
import { ALL_HANDLES_REGEX, HANDLE_SANITIZE_REGEX } from 'data/constants';
import type { Profile, Publication } from 'lens';
import { useRelevantPeopleQuery } from 'lens';
import type { FC } from 'react';

interface Props {
  publication: Publication;
}

const RelevantPeople: FC<Props> = ({ publication }) => {
  const mentions = publication?.metadata?.content?.match(ALL_HANDLES_REGEX, '$1[~$2]') ?? [];

  const processedMentions = mentions?.map((mention: string) => {
    const trimmedMention = mention.trim().replace('@', '').replace("'s", '');

    if (trimmedMention.length > 9) {
      return mention.trim().replace("'s", '').replace(HANDLE_SANITIZE_REGEX, '');
    }

    return formatHandle(publication?.profile?.handle);
  });

  const cleanedMentions = processedMentions.reduce((handles: string[], handle: string) => {
    if (!handles.includes(handle)) {
      handles.push(handle);
    }

    return handles;
  }, []);

  const { data, loading, error } = useRelevantPeopleQuery({
    variables: { request: { handles: cleanedMentions.slice(0, 5) } },
    skip: mentions.length <= 0
  });

  if (mentions.length <= 0) {
    return null;
  }

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
      {data?.profiles?.items?.map((profile, index) => (
        <div key={profile?.id} className="truncate">
          <UserProfile
            profile={profile as Profile}
            isFollowing={profile.isFollowedByMe}
            followPosition={index + 1}
            followSource={FollowSource.PUBLICATION_RELEVANT_PROFILES}
            showUserPreview={false}
            showFollow
          />
        </div>
      ))}
    </Card>
  );
};

export default RelevantPeople;
