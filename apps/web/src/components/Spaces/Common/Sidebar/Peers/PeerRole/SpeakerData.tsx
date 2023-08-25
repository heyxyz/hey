import { useAppUtils } from '@huddle01/react/app-utils';
import { useAcl, useHuddle01, useRoom } from '@huddle01/react/hooks';
import type { FC } from 'react';
import React from 'react';

import Strip from './Strip';

type SpeakerDataProps = {
  peerId: string;
};

const Speaker: FC<SpeakerDataProps> = ({ peerId }) => {
  const { changePeerRole, kickPeer } = useAcl();
  const { leaveRoom } = useRoom();
  const { me } = useHuddle01();
  const { sendData } = useAppUtils();

  return (
    <>
      {me.role === 'host' && (
        <Strip
          type="personNormal"
          title="Invite as Co-Host"
          variant="normal"
          onClick={() => {
            sendData([peerId], {
              requestType: 'coHost-invitation',
              peerId: peerId
            });
          }}
        />
      )}
      {['host', 'coHost'].includes(me.role) && (
        <>
          <Strip
            type="speaker"
            title="Remove as Speaker"
            variant="danger"
            onClick={() => {
              changePeerRole(peerId, 'listener');
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
        </>
      )}

      {me.role === 'speaker' && (
        <>
          <Strip
            type="leave"
            title="Leave speaker role"
            variant="danger"
            onClick={() => {
              changePeerRole(peerId, 'listener');
            }}
          />
          <Strip
            type="leave"
            title="Leave the spaces"
            variant="danger"
            onClick={() => {
              leaveRoom();
            }}
          />
        </>
      )}
    </>
  );
};
export default Speaker;
