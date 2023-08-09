// Hooks
import { useAcl, useHuddle01, usePeers } from '@huddle01/react/hooks';
import { Input } from '@lenster/ui';
import React, { useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

import type { Peer } from '../../SpacesTypes';
// Components
import PeerList from './PeerList';
import PeerMetaData from './PeerMetaData';

type PeersProps = {};

const Peers: React.FC<PeersProps> = () => {
  const BlackList = ['peer', 'listener'];

  const { me } = useHuddle01();
  const { peers } = usePeers();
  const { changePeerRole } = useAcl();
  const [searchPeerName, setSearchPeerName] = useState('');
  const [searchPeer, setSearchPeer] = useState<Peer>();

  const requestedPeers = useSpacesStore((state) => state.requestedPeers);
  const removeRequestedPeers = useSpacesStore(
    (state) => state.removeRequestedPeers
  );

  useUpdateEffect(() => {
    if (searchPeerName.length > 0) {
      const peer = Object.values(peers).find(({ displayName }) =>
        displayName.toLowerCase().includes(searchPeerName.toLowerCase())
      );
      if (peer) {
        setSearchPeer(peer);
      }
      console.log('peer', peer);
    }
  }, [searchPeerName]);

  return (
    <div>
      <Input
        placeholder="Search for peers"
        className="w-full"
        onChange={(e) => setSearchPeerName(e.target.value)}
      />

      {searchPeer && (
        <PeerMetaData
          key={searchPeer.peerId}
          className="mt-5"
          name={searchPeer.displayName}
          src={searchPeer.avatarUrl}
          role="listener"
          peerId={searchPeer.peerId}
        />
      )}

      {requestedPeers.length > 0 && (
        <PeerList className="mt-5" title="Requested to Speak">
          {Object.values(peers)
            .filter(({ peerId }) => requestedPeers.includes(peerId))
            .map(({ peerId, displayName, avatarUrl, mic }) => (
              <PeerMetaData
                key={peerId}
                isRequested
                className="mt-5"
                name={displayName}
                isMicActive={mic ? true : false}
                src={avatarUrl}
                role="host"
                onAccept={() => {
                  if (me.role == 'host' || me.role == 'coHost') {
                    changePeerRole(peerId, 'speaker');
                    removeRequestedPeers(peerId);
                  }
                }}
                onDeny={() => {
                  removeRequestedPeers(peerId);
                }}
                peerId={peerId}
              />
            ))}
        </PeerList>
      )}

      {/* Host */}
      <PeerList title="Host">
        {me.role === 'host' && (
          <PeerMetaData
            key={me.meId}
            className="mt-5"
            name={me.displayName}
            src={me.avatarUrl}
            role={me.role}
            peerId={me.meId}
          />
        )}
        {Object.values(peers)
          .filter((peer) => peer.role === 'host')
          .map(({ displayName, mic, peerId, role, avatarUrl }) => (
            <PeerMetaData
              key={peerId}
              className="mt-5"
              name={displayName}
              isMicActive={mic ? true : false}
              src={avatarUrl}
              role={role}
              peerId={peerId}
            />
          ))}
      </PeerList>

      {/* Co-Hosts */}
      {(Object.values(peers).filter((peer) => peer.role === 'coHost').length >
        0 ||
        me.role == 'coHost') && (
        <PeerList title="Co-Hosts">
          {me.role === 'coHost' && (
            <PeerMetaData
              className="mt-5"
              name={me.displayName}
              src={me.avatarUrl}
              role={me.role}
              peerId={me.meId}
            />
          )}

          {Object.values(peers)
            .filter((peer) => peer.role === 'coHost')
            .map(({ displayName, mic, peerId, role, avatarUrl }) => (
              <PeerMetaData
                key={peerId}
                className="mt-5"
                name={displayName}
                isMicActive={mic ? true : false}
                src={avatarUrl}
                role={role}
                peerId={peerId}
              />
            ))}
        </PeerList>
      )}

      {/* Speakers */}
      {(Object.values(peers).filter((peer) => peer.role === 'speaker').length >
        0 ||
        me.role == 'speaker') && (
        <PeerList
          title="Speakers"
          count={
            Object.values(peers).filter((peer) => peer.role === 'speaker')
              .length + (me.role == 'speaker' ? 1 : 0)
          }
        >
          {me.role === 'speaker' && (
            <PeerMetaData
              className="mt-5"
              name={me.displayName}
              src={me.avatarUrl}
              role={me.role}
              peerId={me.meId}
            />
          )}

          {Object.values(peers)
            .filter((peer) => peer.role === 'speaker')
            .map(({ displayName, peerId, role, avatarUrl, mic }) => (
              <PeerMetaData
                key={peerId}
                className="mt-5"
                name={displayName}
                src={avatarUrl}
                isMicActive={mic ? true : false}
                role={role}
                peerId={peerId}
              />
            ))}
        </PeerList>
      )}

      {/* listeners */}
      {(Object.values(peers).filter(({ role }) => role == 'listener').length >
        0 ||
        me.role == 'listener') && (
        <PeerList
          title="Listeners"
          count={
            Object.values(peers).filter(({ role }) => role == 'listener')
              .length + (me.role == 'listener' ? 1 : 0)
          }
        >
          {BlackList.includes(me.role) && (
            <PeerMetaData
              key={me.meId}
              name={me.displayName}
              role={me.role}
              className="mt-5"
              src={me.avatarUrl}
              peerId={me.meId}
            />
          )}

          {Object.values(peers)
            .filter((peer) => BlackList.includes(peer.role))
            .map(({ cam, displayName, mic, peerId, role, avatarUrl }) => (
              <PeerMetaData
                key={peerId}
                className="mt-5"
                name={displayName}
                src={avatarUrl}
                role={role}
                peerId={peerId}
              />
            ))}
        </PeerList>
      )}
    </div>
  );
};
export default Peers;

interface Props {
  onClick: () => void;
}
