import Beta from '@components/Shared/Badges/Beta';
import { Card } from '@components/UI/Card';
import { CheckCircleIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import axios from 'axios';
import { APP_NAME } from 'data/constants';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';

const REFLECT_URL = 'https://reflect.withlens.app';

const CrossPost: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [repostingTo, setRepostingTo] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('https://reflect.withlens.app/api/profile/' + currentProfile?.id)
      .then((response) => {
        if (response.data?.active) {
          setRepostingTo(response.data?.twitter_handle);
        }
      })
      .catch(() => {
        setRepostingTo(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="space-y-2 linkify p-5">
      <div className="flex items-center space-x-2">
        <div className="text-lg font-bold">
          <Trans>Cross post to Twitter</Trans>
        </div>
        <Beta />
      </div>
      <div className="pb-3">
        <Trans>Reflect will auto-tweet new {APP_NAME} posts, so you can finally escape the bird site.</Trans>
      </div>
      {repostingTo ? (
        <>
          <div className="flex items-center space-x-1.5">
            <span>
              <Trans>
                Already reposting to <b>@{repostingTo}</b>
              </Trans>
            </span>
            <CheckCircleIcon className="w-5 h-5 text-brand" />
          </div>
          <a
            href={REFLECT_URL}
            className="flex items-center space-x-1.5"
            onClick={() => {
              Analytics.track(SETTINGS.ACCOUNT.OPEN_REFLECT_DISABLE);
            }}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>
              <Trans>Disable now</Trans>
            </span>
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </>
      ) : (
        <a
          href={REFLECT_URL}
          className="flex items-center space-x-1.5"
          onClick={() => {
            Analytics.track(SETTINGS.ACCOUNT.OPEN_REFLECT_ENABLE);
          }}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>
            <Trans>Setup now</Trans>
          </span>
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      )}
    </Card>
  );
};

export default CrossPost;
