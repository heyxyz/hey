import { gql } from '@apollo/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { serverlessClient } from 'src/apollo';

const GET_PROFILE_QUERY = gql`
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      handle
      name
    }
  }
`;

const htmlWrapper = (html: string) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      ${html}
    </head>
  </html>
`;

const getProfileMeta = async (req: NextApiRequest, res: NextApiResponse, handle: string) => {
  const { data } = await serverlessClient.query({
    query: GET_PROFILE_QUERY,
    variables: { request: { handle } }
  });
  const { profile } = data;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(
    htmlWrapper(`
      <title>${profile.handle}</title>
      <div>${profile.name}</div>
    `)
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Invalid method!' });
  }

  const uri = req.query.uri as string;

  if (!uri) {
    return res.status(400).json({ success: false, message: 'Invalid URI!' });
  }

  const isProfile = uri.includes('/u/');
  const isPost = uri.includes('/posts/');

  try {
    if (isProfile) {
      return getProfileMeta(req, res, uri.replace('/u/', ''));
    }

    if (isPost) {
      return getProfileMeta(req, res, uri.replace('/posts/', ''));
    }

    return getProfileMeta(req, res, uri.replace('/posts/', ''));
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export default handler;
