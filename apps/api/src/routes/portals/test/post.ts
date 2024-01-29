import type { Handler } from 'express';

import catchedError from 'src/lib/catchedError';

export const post: Handler = async (req, res) => {
  const { id } = req.query;

  let idd = Number(id as string) || 0;
  const title = `br${'r'.repeat(idd)}`;

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
          <meta property="hey:portal:button:1:type" content="submit" />
          <meta property="hey:portal:button:2" content="${title}" />
          <meta property="hey:portal:button:2:type" content="submit" />
          <meta property="hey:portal:button:3" content="⏩︎" />
          <meta property="hey:portal:button:3:type" content="submit" />
          <meta property="hey:portal:post_url" content="https://api.hey.xyz/portals/test/post?id=${idd + 1}" />
        </head>
        <body>OK</body>
      </html>
    `);
  } catch (error) {
    return catchedError(res, error);
  }
};
