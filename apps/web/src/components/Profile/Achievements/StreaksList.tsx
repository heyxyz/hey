import {
  ChatAlt2Icon,
  CheckCircleIcon,
  CollectionIcon,
  HeartIcon,
  PencilAltIcon,
  SwitchHorizontalIcon,
  UserAddIcon
} from '@heroicons/react/outline';
import { CalendarIcon } from '@heroicons/react/solid';
import { ACHIEVEMENTS_WORKER_URL } from '@lenster/data/constants';
import { PROFILE, PUBLICATION } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import { Card } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';

interface StreaksListProps {
  profile: Profile;
}

const StreaksList: FC<StreaksListProps> = ({ profile }) => {
  const fetchStreaksList = async () => {
    try {
      const response = await axios(
        `${ACHIEVEMENTS_WORKER_URL}/streaks/${profile.id}/latest`
      );

      return response.data.data;
    } catch (error) {
      return [];
    }
  };

  const { data, isLoading } = useQuery(['streaksList', profile.id], () =>
    fetchStreaksList().then((res) => res)
  );

  const EventIcon = ({ event }: { event: string }) => {
    switch (event) {
      case PROFILE.FOLLOW:
      case PROFILE.SUPER_FOLLOW:
        return <UserAddIcon className="h-5 w-5 text-green-500" />;
      case PUBLICATION.LIKE:
        return <HeartIcon className="h-5 w-5 text-red-500" />;
      case PUBLICATION.NEW_POST:
        return <PencilAltIcon className="text-brand h-5 w-5" />;
      case PUBLICATION.NEW_COMMENT:
        return <ChatAlt2Icon className="text-brand h-5 w-5" />;
      case PUBLICATION.MIRROR:
        return <SwitchHorizontalIcon className="h-5 w-5 text-green-500" />;
      case PUBLICATION.COLLECT_MODULE.COLLECT:
        return <CollectionIcon className="h-5 w-5 text-pink-500" />;
      case PUBLICATION.WIDGET.SNAPSHOT.VOTE:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const EventName = ({ event }: { event: string }) => {
    switch (event) {
      case PROFILE.FOLLOW:
        return t`Followed a profile`;
      case PROFILE.SUPER_FOLLOW:
        return t`Super followed a profile`;
      case PUBLICATION.LIKE:
        return t`Liked a publication`;
      case PUBLICATION.NEW_POST:
        return t`Created a new post`;
      case PUBLICATION.NEW_COMMENT:
        return t`Commented on a publication`;
      case PUBLICATION.MIRROR:
        return t`Mirrored a publication`;
      case PUBLICATION.COLLECT_MODULE.COLLECT:
        return t`Collected a publication`;
      case PUBLICATION.WIDGET.SNAPSHOT.VOTE:
        return t`Voted on a poll`;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div>Loading</div>
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
        <CalendarIcon className="text-brand h-6 w-6" />
        <span>
          <Trans>Events today</Trans>
        </span>
      </div>
      <div className="divider" />
      <div className="space-y-4 p-6">
        {data.map((streak: { id: string; event: string; date: string }) => (
          <div key={streak.id} className="flex items-center space-x-2">
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
