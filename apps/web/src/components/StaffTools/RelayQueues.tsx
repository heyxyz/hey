import MetaTags from '@components/Common/MetaTags';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import { APP_NAME, POLYGONSCAN_URL } from 'data/constants';
import Errors from 'data/errors';
import { useRelayQueuesQuery } from 'lens';
import type { NextPage } from 'next';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import { PAGEVIEW } from 'src/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout, Spinner } from 'ui';

import StaffToolsSidebar from './Sidebar';

interface RelayProps {
  address: string;
  queue: number;
  relayer: string;
}

export const Relay: FC<RelayProps> = ({ address, queue, relayer }) => {
  function getRelayerName(name: string): string {
    const words = name.split('_');
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return capitalizedWords.join(' ');
  }

  return (
    <Card
      className="flex w-full flex-wrap items-center justify-between p-5"
      forceRounded
    >
      <div>
        <b>{getRelayerName(relayer)}</b>
        <div>
          <Link
            className="text-sm"
            href={`${POLYGONSCAN_URL}/address/${address}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {address}
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <b className="text-xl">{queue}</b>
        <span className="lt-text-gray-500">
          <Trans>Transactions</Trans>
        </span>
      </div>
    </Card>
  );
};

const RelayQueues: NextPage = () => {
  const { allowed } = useStaffMode();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'stafftools', subpage: 'relayqueues' });
  }, []);

  const { data, loading, error } = useRelayQueuesQuery({
    pollInterval: 5000
  });

  if (!allowed) {
    return <Custom404 />;
  }

  const sortedRelays = data?.relayQueues
    .map((relay) => ({
      ...relay,
      queue: relay.queue
    }))
    .sort((a, b) => b.queue - a.queue);

  return (
    <GridLayout>
      <MetaTags title={t`Stafftools | Relay queues • ${APP_NAME}`} />
      <GridItemFour>
        <StaffToolsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card className="p-5">
          {error ? (
            <b className="text-red-500">{Errors.SomethingWentWrong}</b>
          ) : loading ? (
            <div className="flex justify-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <section className="space-y-3">
              <h1 className="mb-4 text-xl font-bold">
                <Trans>Relay queues</Trans>
              </h1>
              <div className="space-y-3">
                {sortedRelays?.map(({ address, queue, relayer }) => (
                  <Relay
                    key={address}
                    address={address}
                    queue={queue}
                    relayer={relayer}
                  />
                ))}
              </div>
            </section>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default RelayQueues;
