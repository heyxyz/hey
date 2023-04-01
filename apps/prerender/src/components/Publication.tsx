import { AVATAR, DEFAULT_OG, USER_CONTENT_URL } from 'data/constants';
import type { Comment, MediaSet, NftImage, Profile } from 'lens';
import { Publication } from 'lens';
import formatHandle from 'lib/formatHandle';
import getStampFyiURL from 'lib/getStampFyiURL';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { FC } from 'react';
import { BASE_URL } from 'src/constants';

import DefaultTags from './Shared/DefaultTags';
import Tags from './Shared/Tags';

interface PublicationProps {
  publication: Publication;
  comments: Comment[];
}

const Publication: FC<PublicationProps> = ({ publication, comments }) => {
  if (!publication) {
    return <DefaultTags />;
  }

  const { id, stats, metadata, __typename } = publication;
  const hasMedia = metadata?.media.length;
  const isMirror = __typename === 'Mirror';
  const profile: any = isMirror ? publication?.mirrorOf?.profile : publication?.profile;
  const publicationId = isMirror ? publication?.mirrorOf?.id : id;

  const title = `${__typename === 'Post' ? 'Post' : 'Comment'} by @${profile.handle} • Lenster`;
  const description = metadata?.content ?? '';
  const image = hasMedia
    ? sanitizeDStorageUrl(metadata?.media[0].original.url)
    : profile
    ? `${USER_CONTENT_URL}/${AVATAR}/${sanitizeDStorageUrl(
        profile?.picture?.original?.url ?? profile?.picture?.uri ?? getStampFyiURL(profile?.ownedBy)
      )}`
    : DEFAULT_OG;

  return (
    <>
      <Tags
        title={title}
        description={description}
        image={image}
        cardType={hasMedia ? 'summary_large_image' : 'summary'}
      />
      <header>
        <div>
          <div>
            <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>
              <img alt={`@${formatHandle(profile.handle)}'s avatar`} src={image} width="64" />
            </a>
          </div>
          <div>
            <div>
              <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>{profile.name ?? profile.handle}</a>
            </div>
            <div>
              <a href={`${BASE_URL}/u/${formatHandle(profile.handle)}`}>@{formatHandle(profile.handle)}</a>
            </div>
            <h1>
              <a href={`${BASE_URL}/posts/${publicationId}`}>{metadata.content ?? ''}</a>
            </h1>
          </div>
          <div>
            <div>
              {isMirror ? publication.mirrorOf.stats.totalAmountOfComments : stats.totalAmountOfComments}{' '}
              Comments
            </div>
            <div>{isMirror ? publication.mirrorOf.stats.totalUpvotes : stats.totalUpvotes} Likes</div>
            {publication.collectModule.__typename !== 'RevertCollectModuleSettings' ? (
              <div>
                {isMirror ? publication.mirrorOf.stats.totalAmountOfCollects : stats.totalAmountOfCollects}{' '}
                Collects
              </div>
            ) : null}
            <div>
              {isMirror ? publication.mirrorOf.stats.totalAmountOfMirrors : stats.totalAmountOfMirrors}{' '}
              Mirrors
            </div>
            <hr />
          </div>
        </div>
      </header>
      <div data-testid="publication-comment-feed">
        {comments?.map((comment) => {
          const { id, stats, metadata, profile } = comment;
          const commentProfile = profile as Profile & { picture: MediaSet & NftImage };
          const commentProfileAvatar = `${USER_CONTENT_URL}/${AVATAR}/${sanitizeDStorageUrl(
            commentProfile.picture?.original?.url ??
              commentProfile.picture?.uri ??
              getStampFyiURL(profile?.ownedBy)
          )}`;
          return (
            <div key={id}>
              <div>
                <a href={`${BASE_URL}/u/${formatHandle(commentProfile.handle)}`}>
                  <img
                    alt={`@${formatHandle(commentProfile.handle)}'s avatar`}
                    src={commentProfileAvatar}
                    width="64"
                  />
                </a>
              </div>
              <div>
                <div>
                  <a href={`${BASE_URL}/u/${formatHandle(commentProfile.handle)}`}>
                    {commentProfile.name ?? commentProfile.handle}
                  </a>
                </div>
                <div>
                  <a href={`${BASE_URL}/u/${formatHandle(commentProfile.handle)}`}>
                    @{formatHandle(commentProfile.handle)}
                  </a>
                </div>
                <div>
                  <a href={`${BASE_URL}/posts/${id}`}>{metadata.content ?? ''}</a>
                </div>
              </div>
              <div>
                <div>{stats.totalAmountOfComments} Comments</div>
                <div>{stats.totalUpvotes} Likes</div>
                {publication.collectModule.__typename !== 'RevertCollectModuleSettings' ? (
                  <div>{stats.totalAmountOfCollects} Collects</div>
                ) : null}
                <div>{stats.totalAmountOfMirrors} Mirrors</div>
                <hr />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Publication;
