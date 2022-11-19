import getProfileMeta from '@lib/api/getProfileMeta';
import getPublicationMeta from '@lib/api/getPublicationMeta';
import generateMeta from '@lib/generateMeta';
import type { NextApiRequest, NextApiResponse } from 'next';

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
      return getPublicationMeta(req, res, uri.replace('/posts/', ''));
    }

    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(generateMeta());
  } catch (error) {
    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(generateMeta());
  }
};

export default handler;
