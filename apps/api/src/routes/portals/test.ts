import type { Handler } from 'express';

import catchedError from 'src/lib/catchedError';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  let idd = Number(id as string) || 0;
  // br if 0 brr if 1 brrr if 2 brrrr if 3
  const title = `br${'r'.repeat(idd)}`;

  try {
    // return html
    return res.send(`
      <html>
        <head>
          <meta charset="utf-8" />
          <meta property="hey:portal" content="vLatest" />
          <meta property="hey:portal:image" content="https://fcframes.vercel.app/br${idd + 1}.gif" />
          <meta property="hey:portal:button:1" content="⏪" />
          <meta property="hey:portal:button:2" content="${title}" />
          <meta property="hey:portal:button:3" content="⏩︎" />
          <meta property="hey:portal:post_url" content="http://localhost:4784/portals/test?id=${idd + 1}" />
        </head>
        <body>OK</body>
      </html>
    `);
  } catch (error) {
    return catchedError(res, error);
  }
};
