import { useRoom } from '@huddle01/react/hooks';
import type { NextPage } from 'next';

import Lobby from './Lobby';
import Meet from './Meet';

const Main: NextPage = () => {
  const { isRoomJoined } = useRoom();

  return isRoomJoined ? <Meet /> : <Lobby />;
};

export default Main;
