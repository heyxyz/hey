import type { Profile } from 'passport-github2';

import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

dotenv.config({ override: true });

passport.use(
  new GitHubStrategy(
    {
      callbackURL: 'http://localhost:4784/connections/github/callback',
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    },
    (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: Function
    ) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj as Profile);
});

export default passport;
