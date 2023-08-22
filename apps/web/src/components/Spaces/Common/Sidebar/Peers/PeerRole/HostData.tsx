import { useHuddle01, useRoom } from '@huddle01/react/hooks';
import type { FC } from 'react';
import React from 'react';

import Strip from './Strip';

const HostData: FC = () => {
  const { leaveRoom, endRoom } = useRoom();

  const { me } = useHuddle01();

  return (
    <div>
      {me.role === 'host' && (
        <div>
          <Strip
            type="close"
            title="End spaces for all"
            variant="danger"
            onClick={() => {
              endRoom();
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
        </div>
      )}
    </div>
  );
};
export default React.memo(HostData);
