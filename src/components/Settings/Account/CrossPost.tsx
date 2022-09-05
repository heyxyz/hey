import Beta from '@components/Shared/Beta';
import { Card, CardBody } from '@components/UI/Card';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { APP_NAME } from 'src/constants';
import { SETTINGS } from 'src/tracking';

const CrossPost: FC = () => {
  return (
    <Card>
      <CardBody className="space-y-2 linkify">
        <div className="flex items-center space-x-2">
          <div className="text-lg font-bold">Cross post to Twitter</div>
          <Beta />
        </div>
        <div className="pb-3">
          Reflect will auto-tweet new {APP_NAME} posts, so you can finally escape the bird site.
        </div>
        <a
          href="https://reflect.withlens.app"
          className="flex items-center space-x-1.5"
          onClick={() => {
            Mixpanel.track(SETTINGS.ACCOUNT.OPEN_REFLECT);
          }}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>Setup now</span>
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </CardBody>
    </Card>
  );
};

export default CrossPost;
