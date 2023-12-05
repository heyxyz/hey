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
  const HANDLE_PROFILE = profileData.profile;
  const HANDLE_BIO = HANDLE_PROFILE.metadata.bio;
  const HANDLE_POSTS_COUNT = HANDLE_PROFILE.stats.posts;
  const HANDLE_NAME = HANDLE_PROFILE.metadata.displayName;
  const HANDLE_FOLLOWERS_COUNT = HANDLE_PROFILE.stats.followers;
  const HANDLE_FOLLOWING_COUNT = HANDLE_PROFILE.stats.following;
  const HANDLE_PICTURE = HANDLE_PROFILE.metadata.picture.optimized.uri;
  console.log(HANDLE_BIO);
  const stream = await unstable_createNodejsStream(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <span>BIO: {HANDLE_BIO}</span>
      <span>FOLLOWERS_COUNT: {HANDLE_FOLLOWERS_COUNT}</span>
      <span>POSTS_COUNT: {HANDLE_POSTS_COUNT}</span>
      <span>NAME: {HANDLE_NAME}</span>
      <span>FOLLOWING_COUNT: {HANDLE_FOLLOWING_COUNT}</span>
      <img
        height="100"
        src={HANDLE_PICTURE}
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
