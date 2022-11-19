import { gql } from '@apollo/client';
import generateMeta from '@lib/generateMeta';
import getIPFSLink from '@lib/getIPFSLink';
import type { MediaSet, NftImage, Profile } from 'lens';
import type { NextApiRequest, NextApiResponse } from 'next';
import client from 'src/apollo';

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
      const title = profile?.name
        ? `${profile?.name} (@${profile?.handle}) • Lenster`
        : `@${profile?.handle} • Lenster`;
      const description = profile?.bio ?? '';
      const image = profile
        ? `https://ik.imagekit.io/lensterimg/tr:n-avatar/${getIPFSLink(
            profile?.picture?.original?.url ??
              profile?.picture?.uri ??
              `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
          )}`
        : 'https://assets.lenster.xyz/images/og/logo.jpeg';

      return res
        .setHeader('Content-Type', 'text/html')
        .setHeader('Cache-Control', 's-maxage=86400')
        .send(generateMeta(title, description, image));
    }
  } catch {
    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(generateMeta());
  }
};

export default getProfileMeta;
