import type { Handler } from 'express';

import catchedError from 'src/lib/catchedError';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  let idd = Number(id as string) || 0;
  const title = `br${'r'.repeat(idd)}`;

  console.log(req);
  console.log('gmgm');

  try {
    return res.send(`
      <html>
        <head>
          <meta charset="utf-8" />
          <meta property="og:title" content="1337" />
          <meta property="og:description" content="1337" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="#1" />
          <meta property="og:image" content="https://fcframes.vercel.app/br${idd + 1}.gif" />

          <meta property="hey:portal" content="vLatest" />
          <meta property="hey:portal:image" content="https://fcframes.vercel.app/br${idd + 1}.gif" />
          <meta property="hey:portal:button:1" content="⏪" />
          <meta property="hey:portal:button:2" content="${title}" />
          <meta property="hey:portal:button:3" content="⏩︎" />
          <meta property="hey:portal:post_url" content="https://api.hey.xyz/portals/test?id=${idd + 1}" />

          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://fcframes.vercel.app/br${idd + 1}.gif" />
          <meta property="fc:frame:button:1" content="⏪" />
          <meta property="fc:frame:button:2" content="br" />
          <meta property="fc:frame:button:3" content="⏩︎" />
          <meta property="fc:frame:post_url" content="https://fcframes.vercel.app/api/brians?id=${idd + 1}" />
        </head>
        <body>OK</body>
      </html>
    `);
  } catch (error) {
    return catchedError(res, error);
  }
};
