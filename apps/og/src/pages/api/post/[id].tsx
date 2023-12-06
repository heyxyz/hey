import type { NextApiHandler } from 'next';

import { PublicationDocument } from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
import { unstable_createNodejsStream } from '@vercel/og';

const handler: NextApiHandler = async (req, res) => {
  const postID = req.query.id;
  if (!postID) {
    return res.end();
  }
  const { data: publicationData } = await apolloClient().query({
    query: PublicationDocument,
    variables: { request: { forId: postID } }
  });
  if (!publicationData.publication) {
    res.end();
  }
  const { publication } = publicationData;
  const postKind = publication.__typename;
  const postBy = publication['by']['handle']['suggestedFormatted']['localName'];
  const postByPicture =
    publication['by']['metadata']['picture']?.optimized?.uri;
  const postContent = publication['metadata']['content'];
  const postStats = publication['stats'];
  const stream = await unstable_createNodejsStream(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <span>
        {postKind} by {postBy}
      </span>
      {postByPicture && (
        <img
          height="100"
          src={postByPicture}
          style={{ borderRadius: '9999px' }}
          width="100"
        />
      )}
      <div
        style={{
          display: '-webkit-box',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          whiteSpace: 'pre-wrap'
        }}
      >
        {postContent}
      </div>
      {Object.keys(postStats)
        .filter((i) => i !== '__typename' && i !== 'id')
        .filter((i) => postStats[i] > 0)
        .map((i) => (
          <div key={i} style={{ display: 'flex' }}>
            {i}: {postStats[i]}
          </div>
        ))}
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
