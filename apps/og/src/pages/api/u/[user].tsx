import type { NextApiHandler } from 'next';

import { HANDLE_PREFIX } from '@hey/data/constants';
import { ProfileDocument } from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
import { unstable_createNodejsStream } from '@vercel/og';

const handler: NextApiHandler = async (req, res) => {
  const HANDLE = req.query.user;
  if (!HANDLE) {
    return res.end();
  }
  const { data: profileData } = await apolloClient().query({
    query: ProfileDocument,
    variables: { request: { forHandle: HANDLE_PREFIX + HANDLE } }
  });
  const handProfile = profileData.profile;
  const handBio = handProfile.metadata.bio;
  const handlePostsCount = handProfile.stats.posts;
  const handleName = handProfile.metadata.displayName;
  const handleFollowersCount = handProfile.stats.followers;
  const handleFollowingCount = handProfile.stats.following;
  const handlePicture = handProfile.metadata.picture.optimized.uri;
  const stream = await unstable_createNodejsStream(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <span>BIO: {handBio}</span>
      <span>FOLLOWERS_COUNT: {handleFollowersCount}</span>
      <span>POSTS_COUNT: {handlePostsCount}</span>
      <span>NAME: {handleName}</span>
      <span>FOLLOWING_COUNT: {handleFollowingCount}</span>
      <img
        height="100"
        src={handlePicture}
        style={{ borderRadius: '9999px' }}
        width="100"
      />
    </div>,
    {
      emoji: 'twemoji',
      height: 630,
      width: 1200
    }
  );
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.statusCode = 200;
  res.statusMessage = 'OK';
  stream.on('end', () => {
    res.end();
  });
  stream.pipe(res);
};

export default handler;
