import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import formatRelativeOrAbsolute from '@hey/helpers/datetime/formatRelativeOrAbsolute';
import { Card, CardHeader } from '@hey/ui';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Event {
  actor: string;
  created: Date;
  date: Date;
  ip: string;
  name: string;
}

const Events: FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get<{ result: Event[]; success: boolean }>(
        `${HEY_API_URL}/leafwatch/stream`
      );
      if (response.data.success) {
        setEvents(response.data.result);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchEvents, 800);
    fetchEvents();
    return () => clearInterval(interval);
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
              <li
                className="flex items-center justify-between px-5 py-2"
                key={index}
              >
                <div className="flex items-center space-x-2">
                  <div className="font-semibold">{event.name}</div>
                  {event.actor ? (
                    <>
                      <span>·</span>
                      <div className="ld-text-gray-500 font-mono text-xs">
                        {event.actor}
                      </div>
                    </>
                  ) : null}
                  {event.ip ? (
                    <>
                      <span>·</span>
                      <div className="ld-text-gray-500 font-mono text-xs">
                        {event.ip}
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="ld-text-gray-500 text-xs">
                  {formatRelativeOrAbsolute(event.created)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default Events;
