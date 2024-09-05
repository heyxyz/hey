import * as Sentry from '@sentry/nextjs';

Sentry.init({
  debug: false,
  dsn: 'https://glet_85e8511597c1ec9fd11b49addb52d697@observe.gitlab.com:443/errortracking/api/v1/projects/61401782'
});
