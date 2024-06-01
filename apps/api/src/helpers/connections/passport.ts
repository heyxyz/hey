import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
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
      profile: any,
      done: Function
    ) => {
      return done(null, profile);
    }
  )
);

passport.use(
  new DiscordStrategy(
    {
      callbackURL: 'http://localhost:4784/connections/discord/callback',
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!
    },
    (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
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
  done(null, obj as any);
});

export default passport;
