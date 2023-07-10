import { useRoom } from '@huddle01/react/hooks';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Meet from './Meet';

const MeetRoom: NextPage = () => {
  const { isRoomJoined } = useRoom();
  const { push, query } = useRouter();

  useEffect(() => {
    if (!isRoomJoined) {
      push(`/meet/${query.roomid}/lobby`);
      return;
    }
  }, []);

  return <Meet />;
};

export default MeetRoom;
