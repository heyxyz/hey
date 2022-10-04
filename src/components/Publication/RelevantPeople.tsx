import { useQuery } from '@apollo/client';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card, CardBody } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { LensterPublication } from '@generated/lenstertypes';
import { Profile, RelevantPeopleDocument } from '@generated/types';
import { FC } from 'react';
import { ALL_HANDLES_REGEX, HANDLE_SANITIZE_REGEX } from 'src/constants';

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

        return publication?.profile?.handle;
      })
    : [];

  const cleanedMentions = [...new Set(processedMentions)];

  const { data, loading, error } = useQuery(RelevantPeopleDocument, {
    variables: { request: { handles: cleanedMentions.slice(0, 5) } }
  });

  if (loading) {
    return (
      <Card as="aside">
        <CardBody className="space-y-4">
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
        </CardBody>
      </Card>
    );
  }

  if (data?.profiles?.items?.length === 0) {
    return null;
  }

  return (
    <Card as="aside">
      <CardBody className="space-y-4">
        <ErrorMessage title="Failed to load relevant people" error={error} />
        {data?.profiles?.items?.map((profile) => (
          <div key={profile?.id} className="truncate">
            <UserProfile profile={profile as Profile} isFollowing={profile.isFollowedByMe} showFollow />
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default RelevantPeople;
