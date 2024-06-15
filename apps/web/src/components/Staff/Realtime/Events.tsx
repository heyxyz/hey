import type { FC } from 'react';

import { HEY_MAINNET_RAILWAY_URL } from '@hey/data/constants';
import { Card, CardHeader } from '@hey/ui';
import { useEffect, useState } from 'react';

interface Event {
  actor: string;
  date: Date;
  name: string;
}

const Events: FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${HEY_MAINNET_RAILWAY_URL}/leafwatch/stream`
    );

    eventSource.onmessage = function (event) {
      const newEvent = JSON.parse(event.data);
      newEvent.date = new Date();
      setEvents((prevEvents: Event[]) => {
        const updatedEvents = [newEvent, ...prevEvents];
        return updatedEvents.slice(0, 50);
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Card>
      <CardHeader title="Publication Stats" />
      <div>
        {events.length === 0 ? (
          <div className="p-5 italic">Waiting for events...</div>
        ) : (
          <ul className="divide-y">
            {events.map((event, index: any) => (
              <li className="px-5 py-2" key={index}>
                <div>{event.name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default Events;
