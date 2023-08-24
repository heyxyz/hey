import { useAppUtils } from '@huddle01/react/app-utils';
import { useAcl, useHuddle01, useRoom } from '@huddle01/react/hooks';
import type { FC } from 'react';
import React from 'react';

import Strip from './Strip';

type ListenersDataProps = {
  peerId: string;
};

const ListenersData: FC<ListenersDataProps> = ({ peerId }) => {
  const { kickPeer } = useAcl();
  const { leaveRoom } = useRoom();
  const { me } = useHuddle01();
  const { sendData } = useAppUtils();

  const sendInvitation = (
    invitationType: 'speaker-invitation' | 'coHost-invitation'
  ) => {
    sendData([peerId], {
      requestType: invitationType,
      peerId: peerId
    });
  };

  return (
    <>
      {me.role === 'host' && (
        <div>
          <Strip
            type="personNormal"
            title="Invite as Co-Host"
            variant="normal"
            onClick={() => {
              sendInvitation('coHost-invitation');
            }}
          />
        </div>
      )}
      {me.role === 'coHost' || me.role === 'host' ? (
        <div>
          <Strip
            type="speaker"
            title="Invite as Speaker"
            variant="normal"
            onClick={() => {
              sendInvitation('speaker-invitation');
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
        <Strip
          type="leave"
          title="Leave the spaces"
          variant="danger"
          onClick={() => {
            leaveRoom();
          }}
        />
      )}
    </>
  );
};
export default ListenersData;
