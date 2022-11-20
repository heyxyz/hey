import { readFileSync } from 'node:fs';
import path from 'node:path';

import { gql } from '@apollo/client';
import generateMeta from '@lib/generateMeta';
import { Resvg } from '@resvg/resvg-js';
import type { MediaSet, NftImage, Profile } from 'lens';
import type { NextApiRequest, NextApiResponse } from 'next';
import satori from 'satori';
import client from 'src/apollo';

import { markUp } from './getMarkup';
const PROFILE_QUERY = gql`
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      handle
      name
      bio
      stats {
        totalFollowers
        totalFollowing
      }
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
        ... on NftImage {
          uri
        }
      }
    }
  }
`;

const getProfileMeta = async (req: NextApiRequest, res: NextApiResponse, handle: string) => {
  try {
    const { data } = await client.query({
      query: PROFILE_QUERY,
      variables: { request: { handle } }
    });

    if (data?.profile) {
      const profile: Profile & { picture: MediaSet & NftImage } = data?.profile;

      const fontNormalPath = path.resolve('./fonts', 'CircularXXSub-Book.woff');
      const fontMediumPath = path.resolve('./fonts', 'CircularXXSub-Medium.woff');
      const fontBoldPath = path.resolve('./fonts', 'CircularXXSub-Bold.woff');

      const svg = await satori(markUp(profile), {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'CircularXX Normal',
            data: readFileSync(fontNormalPath),
            weight: 400,
            style: 'normal'
          },
          {
            name: 'CircularXX Bold',
            data: readFileSync(fontBoldPath),
            weight: 400,
            style: 'normal'
          },
          {
            name: 'CircularXX Medium',
            data: readFileSync(fontMediumPath),
            weight: 400,
            style: 'normal'
          }
        ]
      });
      const resvg = new Resvg(svg, {
        background: 'rgba(238, 235, 230, .9)',
        fitTo: {
          mode: 'width',
          value: 1200
        },
        font: {
          fontFiles: [
            path.resolve('./fonts', 'CircularXXSub-Book.woff'),
            path.resolve('./fonts', 'CircularXXSub-Bold.woff'),
            path.resolve('./fonts', 'CircularXXSub-Medium.woff')
          ],
          loadSystemFonts: false,
          defaultFontFamily: 'CircularXX Normal'
        }
      });
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      return res
        .setHeader('Content-Type', 'image/png')
        .setHeader('Cache-Control', 's-maxage=86400')
        .send(pngBuffer);
    }
  } catch (error) {
    console.error('Error: cannot generate og image', error);
    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(generateMeta());
  }
};

export default getProfileMeta;
