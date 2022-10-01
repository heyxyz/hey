import Beta from '@components/Shared/Beta';
import { Card, CardBody } from '@components/UI/Card';
import { CheckCircleIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { APP_NAME } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';

const CrossPost: FC = () => {
  const [isReposting, setIsReposting] = useState<boolean>(false);
  const [repostingTo, setRepostingTo] = useState<string>('');

  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    axios
      .get('https://reflect.withlens.app/api/profile/' + currentProfile?.id)
      .then((response) => {
        if (response.data?.active) {
          setIsReposting(true);
          setRepostingTo(response.data?.twitter_handle);
        }
      })
      .catch(() => {
        setIsReposting(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {isReposting ? (
          <div className="flex items-center space-x-1.5">
            <span>
              Already reposting to <b>@{repostingTo}</b>
            </span>
            <CheckCircleIcon className="w-5 h-5 text-brand" />
          </div>
        ) : (
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
        )}
      </CardBody>
    </Card>
  );
};

export default CrossPost;
