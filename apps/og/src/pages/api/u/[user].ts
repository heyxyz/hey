import type { NextApiHandler } from 'next';

import { HANDLE_PREFIX } from '@hey/data/constants';
import { ProfileDocument } from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
import { z } from 'zod';

import { getLayoutAndConfig } from '../../../layouts';
import { renderLayoutToSVG, renderSVGToPNG } from '../../../og';

const imageReq = z.object({
  fileType: z.enum(['svg', 'png']).nullish(),
  layoutName: z.string()
});

const handler: NextApiHandler = async (req, res) => {
  try {
    const HANDLE = req.query.user;
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
    const { fileType, layoutName } = await imageReq.parseAsync(req.query);

    const { config, layout } = await getLayoutAndConfig(
      layoutName.toLowerCase(),
      req.query
    );
    const svg = await renderLayoutToSVG({ config, layout });

    res.statusCode = 200;
    res.setHeader(
      'Content-Type',
      fileType === 'svg' ? 'image/svg+xml' : `image/${fileType}`
    );
    res.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );

    if (fileType === 'png') {
      const png = await renderSVGToPNG(svg);
      res.end(png);
    } else {
      res.end(svg);
    }
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end(
      `<h1>Internal Error</h1><pre><code>${(error as any).message}</code></pre>`
    );
    console.error(error);
  }
};

export default handler;
