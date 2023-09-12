import { useAcl, useHuddle01, useRoom } from '@huddle01/react/hooks';
import type { FC } from 'react';
import React from 'react';

import Strip from './Strip';

interface CoHostDataProps {
  peerId: string;
}

const CoHostData: FC<CoHostDataProps> = ({ peerId }) => {
  const { changePeerRole, kickPeer } = useAcl();

  const { me } = useHuddle01();

  const { leaveRoom } = useRoom();

  return (
    <>
      {me.role === 'host' && (
        <>
          <Strip
            type="remove"
            title="Remove as Co-Host"
            variant="danger"
            onClick={() => {
              if (me.role === 'host' || me.role === 'coHost') {
                changePeerRole(peerId, 'listener');
              }
            }}
          />
          <Strip
            type="leave"
            title="Remove from spaces"
            variant="danger"
            onClick={() => {
              if (me.role === 'host') {
                kickPeer(peerId);
              }
            }}
          />
        </>
      )}
      {me.role === 'coHost' && (
        <>
          <Strip
            type="leave"
            title="Leave the spaces"
            variant="danger"
            onClick={leaveRoom}
          />
          <Strip
            type="leave"
            title="Leave co-host role"
            variant="danger"
            onClick={() => {
              changePeerRole(peerId, 'listener');
            }}
          />
        </>
      )}
    </>
  );
};
export default CoHostData;
