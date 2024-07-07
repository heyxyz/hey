import { Button } from '@hey/ui';
import { type FC, useEffect, useState } from 'react';

import Join from './Join';

interface JoinLeaveButtonProps {
  id: string;
  isMember: boolean;
  small?: boolean;
}

const JoinLeaveButton: FC<JoinLeaveButtonProps> = ({
  id,
  isMember,
  small = false
}) => {
  const [joined, setJoined] = useState(isMember);

  useEffect(() => {
    setJoined(isMember);
  }, [isMember]);

  return joined ? (
    <Button aria-label="Joined" disabled outline size={small ? 'sm' : 'md'}>
      Joined
    </Button>
  ) : (
    <Join id={id} setJoined={setJoined} small={small} />
  );
};

export default JoinLeaveButton;
