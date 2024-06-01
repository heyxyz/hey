import type { Express } from 'express';

import passport from './passport';

const handleGitHub = (app: Express) => {
  app.get(
    '/connections/github',
    passport.authenticate('github', { scope: ['read:user'] })
  );
  app.get(
    '/connections/github/callback',
    passport.authenticate('github', {
      failureMessage: 'Failed to authenticate'
    }),
    (req, res) => {
      if (!req.user) {
        console.error('No user data received.');
        return res.redirect('/error');
      }
      const { id, username } = req.user as any;
      try {
        console.log('Storing user:', id, username);
        return res.redirect('http://localhost:4783/settings/connections');
      } catch (error) {
        console.error('Error storing user:', error);
        res.redirect('/error');
      }
    }
  );
};

export default handleGitHub;
