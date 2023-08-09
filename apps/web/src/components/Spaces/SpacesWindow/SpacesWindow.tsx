import { useAppUtils } from '@huddle01/react/app-utils';
import {
  useAcl,
  useEventListener,
  useHuddle01,
  usePeers
} from '@huddle01/react/hooks';
import getAvatar from '@lenster/lib/getAvatar';
import React, { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useSpacesStore } from 'src/store/spaces';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import InvitationModal from '../Common/InvitationModal';
import Sidebar from '../Common/Sidebar/Sidebar';
import SpacesSummary from './SpacesSummary';
import SpacesWindowBottomBar from './SpacesWindowBottomBar';
import SpaceWindowHeader from './SpaceWindowHeader';

type Props = {};

const SpacesWindow = (props: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setDisplayName, changeAvatarUrl, sendData } = useAppUtils();
  const { changePeerRole } = useAcl();
  const { me } = useHuddle01();
  const [showAcceptRequest, setShowAcceptRequest] = useState(false);
  const [requestedPeerId, setRequestedPeerId] = useState('');
  const { addRequestedPeers, removeRequestedPeers, requestedPeers } =
    useSpacesStore();
  const [requestType, setRequestType] = useState('');
  const { peers } = usePeers();

  const currentProfile = useAppStore((state) => state.currentProfile);

  useEventListener('room:peer-joined', ({ peerId, role }) => {
    if (role === 'peer' && me.role === 'host') {
      changePeerRole(peerId, 'listener');
    }
  });

  useEventListener('room:data-received', (data) => {
    if (data.payload['request-to-speak']) {
      setShowAcceptRequest(true);
      setRequestedPeerId(data.payload['request-to-speak']);
      addRequestedPeers(data.payload['request-to-speak']);
      setTimeout(() => {
        setShowAcceptRequest(false);
      }, 5000);
    }
    if (data.payload['requestType']) {
      const requestedType = data.payload['requestType'];
      setRequestType(requestedType);
      if (requestedType.includes('accepted')) {
        const { peerId } = data.payload;
        if (requestedType === 'accepted-speaker-invitation') {
          changePeerRole(peerId, 'speaker');
        } else if (requestedType === 'accepted-coHost-invitation') {
          changePeerRole(peerId, 'coHost');
        }
      } else {
        setShowAcceptRequest(true);
        setTimeout(() => {
          setShowAcceptRequest(false);
        }, 5000);
      }
    }
  });

  useEffect(() => {
    if (changeAvatarUrl.isCallable) {
      changeAvatarUrl(getAvatar(currentProfile));
    }
  }, [changeAvatarUrl.isCallable]);

  useEffect(() => {
    if (!requestedPeers.includes(requestedPeerId)) {
      setShowAcceptRequest(false);
    }
  }, [requestedPeers]);

  useEffect(() => {
    if (setDisplayName.isCallable) {
      setDisplayName(currentProfile?.handle);
    }
  }, [setDisplayName.isCallable]);

  const handleAcceptInvitation = (requestType: string) => {
    const peerIds = Object.values(peers)
      .filter(({ role }) => role === 'host' || role === 'coHost')
      .map(({ peerId }) => peerId);
    sendData(peerIds, {
      requestType: `accepted-${requestType}`,
      peerId: me.meId
    });
  };

  const handleAccept = () => {
    if (me.role == 'host' || me.role == 'coHost') {
      changePeerRole(requestedPeerId, 'speaker');
      removeRequestedPeers(requestedPeerId);
    }
    if (requestType) {
      console.log(requestType);
      handleAcceptInvitation(requestType);
    }
    setShowAcceptRequest(false);
  };

  return (
    // First 2 divs are for positioning the window based on the winodw size of different devices
    <div className="fixed inset-0 top-auto z-20 mx-auto flex flex h-fit w-full grow">
      <div className="relative mx-auto max-w-screen-xl grow">
        <div className="absolute bottom-0 right-0 ml-auto w-fit rounded-xl rounded-b-none border-[1.5px] border-neutral-700 bg-neutral-900 px-4 pb-4 pt-3">
          <div className="flex justify-center">
            {showAcceptRequest && (
              <InvitationModal
                title={
                  requestType === 'speaker-invitation'
                    ? 'You are invited to speak'
                    : requestType === 'coHost-invitation'
                    ? 'You are invited to be a co-host'
                    : 'Peer requested to speak'
                }
                description={
                  requestType === 'speaker-invitation'
                    ? 'Do you want to accept the invitation to speak?'
                    : requestType === 'coHost-invitation'
                    ? 'Do you want to accept the invitation to be a co-host?'
                    : 'Do you want to accept the request to speak?'
                }
                onAccept={handleAccept}
                onClose={() => {
                  setShowAcceptRequest(false);
                  removeRequestedPeers(requestedPeerId);
                }}
              />
            )}
          </div>
          <SpaceWindowHeader
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
          <div className="min-w-[28rem]">
            {isExpanded ? (
              <div className="relative">
                <div className="absolute bottom-12 right-0 h-fit">
                  <Sidebar />
                </div>
                <div className="pt-4">{<AvatarGrid />}</div>
                <SpacesWindowBottomBar />
              </div>
            ) : (
              <SpacesSummary />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacesWindow;
