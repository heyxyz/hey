import ActionType from '@components/Home/Timeline/EventType';
import PublicationWrapper from '@components/Shared/PublicationWrapper';
import type {
  Comment,
  ElectedMirror,
  FeedItem,
  Publication
} from '@lenster/lens';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationType from './Type';
import { Image } from '@lenster/ui';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import Link from 'next/link';

interface MoreCommentsProps {
  rootPublicationId: string;
  comments: Comment[];
}

const MoreComments: FC<MoreCommentsProps> = ({
  rootPublicationId,
  comments
}) => {
  const hasMoreComments = comments.length > 1;
  const hasMoreThanThreeComments = comments.length > 3;
  const firstComment = comments[0];
  // get the first three comments and remove duplicate profiles based on profile id also make sure profile not in first comment
  const firstThreeComments = comments
    .slice(1, 4)
    .filter((comment) => comment.profile.id !== firstComment.profile.id)
    .filter(
      (comment, index, self) =>
        index === self.findIndex((c) => c.profile.id === comment.profile.id)
    );

  if (!hasMoreComments) {
    return null;
  }

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Link
      className="lt-text-gray-500 mt-3 flex cursor-pointer items-center space-x-2.5 text-sm hover:underline"
      href={`/posts/${rootPublicationId}`}
      aria-hidden="true"
    >
      <div className="contents -space-x-1.5">
        {firstThreeComments?.map((comment) => (
          <Image
            key={comment.profile.handle}
            className="h-5 w-5 rounded-full border dark:border-gray-700"
            src={getAvatar(comment.profile)}
            alt={formatHandle(comment.profile?.handle)}
          />
        ))}
      </div>
      <div>{children} also commented</div>
    </Link>
  );

  const profileOne = firstThreeComments[0]?.profile;
  const profileTwo = firstThreeComments[1]?.profile;
  const profileThree = firstThreeComments[2]?.profile;

  if (firstThreeComments?.length === 1) {
    return (
      <Wrapper>
        <span>{profileOne?.name ?? formatHandle(profileOne?.handle)}</span>
      </Wrapper>
    );
  }

  if (firstThreeComments?.length === 2) {
    return (
      <Wrapper>
        <span>{profileOne?.name ?? formatHandle(profileOne?.handle)} and </span>
        <span>{profileTwo?.name ?? formatHandle(profileTwo?.handle)}</span>
      </Wrapper>
    );
  }

  if (firstThreeComments?.length === 3) {
    return (
      <Wrapper>
        <span>{profileOne?.name ?? formatHandle(profileOne?.handle)}, </span>
        <span>{profileTwo?.name ?? formatHandle(profileTwo?.handle)} and </span>
        <span>{profileThree?.name ?? formatHandle(profileThree?.handle)} </span>
        {!hasMoreThanThreeComments && <span>and others</span>}
      </Wrapper>
    );
  }

  return null;
};

export default MoreComments;
