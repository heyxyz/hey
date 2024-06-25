import type { FC } from 'react';

import { APP_NAME, DESCRIPTION } from '@hey/data/constants';
import { useRouter } from 'next/router';

import MetaTags from '../Common/MetaTags';

const PageMetatags: FC = () => {
  const { pathname } = useRouter();

  const ogData: Record<string, { description: string; title: string }> = {
    '/explore': {
      description: `Explore top commented, collected and latest publications in the ${APP_NAME}.`,
      title: `Explore • ${APP_NAME}`
    },
    '/privacy': {
      description: `Privacy Policy of ${APP_NAME}.`,
      title: `Privacy Policy • ${APP_NAME}`
    },
    '/rules': {
      description: `Rules of ${APP_NAME}.`,
      title: `Rules • ${APP_NAME}`
    },
    '/signup': {
      description: `Signup on ${APP_NAME} to create, share and discover content.`,
      title: `Signup • ${APP_NAME}`
    },
    '/terms': {
      description: `Terms & Conditions of ${APP_NAME}.`,
      title: `Terms & Conditions • ${APP_NAME}`
    },
    '/thanks': {
      description: `Thanks to all the people and projects that have supported ${APP_NAME}.`,
      title: `Thanks • ${APP_NAME}`
    },
    default: {
      description: DESCRIPTION,
      title: APP_NAME
    }
  };

  const { description, title } = ogData[pathname] || ogData.default;

  return <MetaTags description={description} title={title} />;
};

export default PageMetatags;
