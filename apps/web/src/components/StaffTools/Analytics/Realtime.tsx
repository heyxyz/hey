import { Card } from '@components/UI/Card';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('wss://online.simpleanalytics.com/ws');
client.onopen = () => {
  client.send(JSON.stringify({ hostname: 'lenster.xyz' }));
};

const Realtime: FC = () => {
  const [items, setItems] = useState<any>();

  client.onmessage = (message) => {
    const data = JSON.parse(message.data as string)[0];
    setItems((prev: any) => {
      if (prev) {
        if (prev.length > 10) {
          prev.pop();
        }
        prev.unshift(data);

        return prev;
      } else {
        return [data];
      }
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Realtime</h1>
      <div className="space-y-2">
        {items?.map((item: any, index: number) => (
          <Card
            key={index}
            className={clsx(
              { 'bg-green-100 bg-opacity-50': item?.unique },
              'px-5 py-2 text-sm flex items-center justify-between'
            )}
          >
            <Link href={item?.path ?? '/'} className="font-bold">
              {item?.path}
            </Link>
            <div className="flex items-center divide-x-2">
              <b className="pr-2">{item?.browser}</b>
              <b className="px-2">{item?.country}</b>
              <b className="pl-2">{item?.device}</b>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Realtime;
