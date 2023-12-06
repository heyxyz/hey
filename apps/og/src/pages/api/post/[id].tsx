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
  const POST_KIND = publication.__typename;
  const POST_BY =
    publication['by']['handle']['suggestedFormatted']['localName'];
  const POST_BY_PICTURE =
    publication['by']['metadata']['picture']?.optimized?.uri;
  const POST_CONTENT = publication['metadata']['content'];
  const POST_STATS = publication['stats'];
  const stream = await unstable_createNodejsStream(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <span>
        {POST_KIND} by {POST_BY}
      </span>
      {POST_BY_PICTURE && (
        <img
          height="100"
          src={POST_BY_PICTURE}
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
        {POST_CONTENT}
      </div>
      {Object.keys(POST_STATS)
        .filter((i) => i !== '__typename' && i !== 'id')
        .filter((i) => POST_STATS[i] > 0)
        .map((i) => (
          <div key={i} style={{ display: 'flex' }}>
            {i}: {POST_STATS[i]}
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
