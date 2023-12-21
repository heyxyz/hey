import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import {
  ArrowsRightLeftIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  HeartIcon,
  PencilSquareIcon,
  RectangleStackIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import { PROFILE, PUBLICATION } from '@hey/data/tracking';
import { Card, Spinner } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface StreaksListProps {
  profile: Profile;
}

const StreaksList: FC<StreaksListProps> = ({ profile }) => {
  const fetchStreaksList = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/stats/streaksList`, {
        params: { date: 'latest', id: profile.id }
      });

      return response.data.data;
    } catch {
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryFn: fetchStreaksList,
    queryKey: ['fetchStreaksList', profile.id]
  });

  const EventIcon = ({ event }: { event: string }) => {
    switch (event) {
      case PROFILE.FOLLOW:
      case PROFILE.SUPER_FOLLOW:
        return <UserPlusIcon className="size-5 text-green-500" />;
      case PUBLICATION.LIKE:
        return <HeartIcon className="size-5 text-red-500" />;
      case PUBLICATION.NEW_POST:
        return <PencilSquareIcon className="text-brand-500 size-5" />;
      case PUBLICATION.NEW_COMMENT:
        return <ChatBubbleLeftRightIcon className="text-brand-500 size-5" />;
      case PUBLICATION.MIRROR:
        return <ArrowsRightLeftIcon className="size-5 text-green-500" />;
      case PUBLICATION.COLLECT_MODULE.COLLECT:
        return <RectangleStackIcon className="size-5 text-pink-500" />;
      case PUBLICATION.WIDGET.POLL.VOTE:
        return <CheckCircleIcon className="size-5 text-green-500" />;
      default:
        return null;
    }
  };

  const EventName = ({ event }: { event: string }) => {
    switch (event) {
      case PROFILE.FOLLOW:
        return 'Followed a profile';
      case PROFILE.SUPER_FOLLOW:
        return 'Super followed a profile';
      case PUBLICATION.LIKE:
        return 'Liked a publication';
      case PUBLICATION.NEW_POST:
        return 'Created a new post';
      case PUBLICATION.NEW_COMMENT:
        return 'Commented on a publication';
      case PUBLICATION.MIRROR:
        return 'Mirrored a publication';
      case PUBLICATION.COLLECT_MODULE.COLLECT:
        return 'Collected a publication';
      case PUBLICATION.WIDGET.POLL.VOTE:
        return 'Voted on a poll';
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="space-y-2 px-5 py-3.5 text-center font-bold">
          <Spinner className="mx-auto" size="md" />
          <div>Loading events</div>
        </div>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="p-6">
        <div>No events today</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-2 px-6 py-5 text-lg font-bold">
        <CalendarIcon className="text-brand-500 size-6" />
        <span>Latest events</span>
      </div>
      <div className="divider" />
      <div className="m-6 space-y-4">
        {data.map((streak: { date: string; event: string; id: string }) => (
          <div className="flex items-center space-x-2" key={streak.id}>
            <EventIcon event={streak.event} />
            <div>
              <EventName event={streak.event} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StreaksList;
