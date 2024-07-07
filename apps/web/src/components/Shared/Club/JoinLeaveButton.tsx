import type { Club } from '@hey/types/club';
import type { FC } from 'react';

import { Button } from '@hey/ui';
import { useEffect, useState } from 'react';

import Join from './Join';

interface JoinLeaveButtonProps {
  club: Club;
  small?: boolean;
}

const JoinLeaveButton: FC<JoinLeaveButtonProps> = ({ club, small = false }) => {
  const [joined, setJoined] = useState(club.isMember);

  useEffect(() => {
    setJoined(club.isMember);
  }, [club.isMember]);

  return joined ? (
    <Button aria-label="Joined" disabled outline size={small ? 'sm' : 'md'}>
      Joined
    </Button>
  ) : (
    <Join id={club.id} setJoined={setJoined} small={small} />
  );
};

export default JoinLeaveButton;
