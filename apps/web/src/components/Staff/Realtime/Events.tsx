import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { Card, CardHeader } from '@hey/ui';
import { useEffect, useState } from 'react';

interface Event {
  actor: string;
  name: string;
}

const Events: FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`${HEY_API_URL}/leafwatch/stream`);

    eventSource.onmessage = function (event) {
      const newEvent = JSON.parse(event.data);
      setEvents((prevEvents: Event[]) => {
        const updatedEvents = [newEvent, ...prevEvents];
        return updatedEvents.slice(0, 50); // Limit to last 50 events
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
        <ul>
          {events.map((event, index: any) => (
            <li key={index}>{event.name}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default Events;
