import type { FC } from 'react';

import { APP_NAME, DESCRIPTION } from '@hey/data/constants';
import { useRouter } from 'next/router';

import MetaTags from '../Common/MetaTags';

const PageMetatags: FC = () => {
  const { pathname } = useRouter();

  const getOg = () => {
    switch (pathname) {
      case '/signup': {
        return {
          description: `Signup on ${APP_NAME} to create, share and discover content.`,
          title: `Signup • ${APP_NAME}`
        };
      }
      case '/explore': {
        return {
          description: `Explore top commented, collected and latest publications in the ${APP_NAME}.`,
          title: `Explore • ${APP_NAME}`
        };
      }
      case '/privacy': {
        return {
          description: `Privacy Policy of ${APP_NAME}.`,
          title: `Privacy Policy • ${APP_NAME}`
        };
      }
      case '/rules': {
        return {
          description: `Rules of ${APP_NAME}.`,
          title: `Rules • ${APP_NAME}`
        };
      }
      case '/terms': {
        return {
          description: `Terms & Conditions of ${APP_NAME}.`,
          title: `Terms & Conditions • ${APP_NAME}`
        };
      }
      case '/thanks': {
        return {
          description: `Thanks to all the people and projects that have supported ${APP_NAME}.`,
          title: `Thanks • ${APP_NAME}`
        };
      }
      default: {
        return {
          description: DESCRIPTION,
          title: APP_NAME
        };
      }
    }
  };

  return <MetaTags description={getOg().description} title={getOg().title} />;
};

export default PageMetatags;
