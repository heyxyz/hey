import type { Express } from 'express';

import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';

import validateLensAccessToken from '../middlewares/validateLensAccessToken';
import prisma from '../prisma';
import passport from './passport';

const handleGitHub = (app: Express) => {
  app.get('/connections/github', async (req, res, next) => {
    const state = req.query.accessToken as string | undefined;

    if (!state) {
      logger.error('GitHub: No access token provided.');
      return res.status(400).send('Access token is required');
    }

    const validateLensAccountStatus = await validateLensAccessToken(
      state,
      'mainnet'
    );

    if (validateLensAccountStatus !== 200) {
      return res.status(validateLensAccountStatus).send('Invalid access token');
    }

    passport.authenticate('github', { scope: ['read:user'], state })(
      req,
      res,
      next
    );
  });

  app.get(
    '/connections/github/callback',
    passport.authenticate('github', {
      failureMessage: 'Failed to authenticate'
    }),
    async (req, res) => {
      if (!req.user) {
        logger.error('GitHub: No user data received');
        return res.status(500).send('No user data received');
      }

      const { id, username } = req.user as any;
      const accessToken = req.query.state as string;

      try {
        const payload = parseJwt(accessToken);

        if (!payload.id) {
          return res.status(500).send('No profile id received');
        }

        const data = await prisma.gitHubConnection.upsert({
          create: { githubId: id, id: payload.id, username },
          update: { githubId: id, username },
          where: { id: payload.id }
        });

        logger.info(`GitHub: Storing user for ${data.id} - ${data.username}`);
        return res.redirect('http://localhost:4783/settings/connections');
      } catch (error) {
        logger.error('GitHub: Error storing user');
        return res.status(500).send('Error storing user');
      }
    }
  );
};

export default handleGitHub;
