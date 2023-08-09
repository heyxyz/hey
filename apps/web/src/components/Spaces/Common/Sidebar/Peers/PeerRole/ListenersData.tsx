import { useAcl, useHuddle01, useRoom } from '@huddle01/react/hooks';
import React from 'react';

import Strip from './Strip';

type ListenersDataProps = {
  peerId: string;
};

const ListenersData: React.FC<ListenersDataProps> = ({ peerId }) => {
  const { changePeerRole, kickPeer } = useAcl();
  const { leaveRoom } = useRoom();
  const { me } = useHuddle01();

  return (
    <>
      {me.role === 'host' && (
        <div>
          <Strip
            type="personNormal"
            title="Invite as Co-Host"
            variant="normal"
            onClick={() => {
              changePeerRole(peerId, 'coHost');
            }}
          />
        </div>
      )}
      {me.role === 'coHost' || me.role === 'host' ? (
        <div>
          <Strip
            type="personSpeaker"
            title="Invite as Speaker"
            variant="normal"
            onClick={() => {
              changePeerRole(peerId, 'speaker');
            }}
          />
          <Strip
            type="leave"
            title="Remove from spaces"
            variant="danger"
            onClick={() => {
              kickPeer(peerId);
            }}
          />
        </div>
      ) : (
        <div>
          <Strip
            type="leave"
            title="Leave the spaces"
            variant="danger"
            onClick={() => {
              leaveRoom();
            }}
          />
        </div>
      )}
    </>
  );
};
export default ListenersData;
