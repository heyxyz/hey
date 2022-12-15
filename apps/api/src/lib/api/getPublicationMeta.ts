import { gql } from '@apollo/client';
import generateMeta from '@lib/generateMeta';
import getIPFSLink from '@lib/getIPFSLink';
import { OG_MEDIA_PROXY_URL } from 'data/constants';
import type { Publication } from 'lens';
import type { NextApiRequest, NextApiResponse } from 'next';
import client from 'src/apollo';

const PUBLICATION_QUERY = gql`
  query Post($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        metadata {
          content
        }
        profile {
          handle
          ownedBy
          picture {
            ... on NftImage {
              uri
            }
            ... on MediaSet {
              original {
                url
              }
            }
          }
        }
      }
      ... on Comment {
        metadata {
          content
        }
        profile {
          handle
          ownedBy
          picture {
            ... on NftImage {
              uri
            }
            ... on MediaSet {
              original {
                url
              }
            }
          }
        }
      }
      ... on Mirror {
        metadata {
          content
        }
        mirrorOf {
          ... on Post {
            profile {
              handle
              ownedBy
              picture {
                ... on NftImage {
                  uri
                }
                ... on MediaSet {
                  original {
                    url
                  }
                }
              }
            }
          }
          ... on Comment {
            profile {
              handle
              ownedBy
              picture {
                ... on NftImage {
                  uri
                }
                ... on MediaSet {
                  original {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const getPublicationMeta = async (req: NextApiRequest, res: NextApiResponse, id: string) => {
  try {
    const { data } = await client.query({
      query: PUBLICATION_QUERY,
      variables: { request: { publicationId: id } }
    });

    if (data?.publication) {
      const publication: Publication = data?.publication;
      const profile: any =
        publication?.__typename === 'Mirror' ? publication?.mirrorOf?.profile : publication?.profile;

      const title = `${publication?.__typename === 'Post' ? 'Post' : 'Comment'} by @${
        profile.handle
      } • Lenster`;
      const description = publication.metadata?.content ?? '';
      const image = profile
        ? `${OG_MEDIA_PROXY_URL}/tr:n-avatar,tr:di-placeholder.webp/${getIPFSLink(
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

export default getPublicationMeta;
