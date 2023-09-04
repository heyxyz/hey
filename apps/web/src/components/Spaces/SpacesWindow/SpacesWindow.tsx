import { useAppUtils } from '@huddle01/react/app-utils';
import {
  useAcl,
  useEventListener,
  useHuddle01,
  usePeers
} from '@huddle01/react/hooks';
import getAvatar from '@lenster/lib/getAvatar';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import React, { createRef, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MusicTrack, SpacesEvents } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useSpacesStore } from 'src/store/spaces';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import InvitationModal from '../Common/InvitationModal';
import Sidebar from '../Common/Sidebar/Sidebar';
import SpacesSummary from './SpacesSummary';
import SpacesWindowBottomBar from './SpacesWindowBottomBar';
import SpaceWindowHeader from './SpaceWindowHeader';

const SpacesWindow: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setDisplayName, changeAvatarUrl, sendData } = useAppUtils();
  const { changePeerRole } = useAcl();
  const { me } = useHuddle01();
  const [showAcceptRequest, setShowAcceptRequest] = useState(false);
  const [requestedPeerId, setRequestedPeerId] = useState('');
  const {
    addRequestedPeers,
    removeRequestedPeers,
    requestedPeers,
    myMusicTrack,
    isMyMusicPlaying
  } = useSpacesStore();
  const [requestType, setRequestType] = useState('');
  const { peers } = usePeers();
  const [musicTrack, setMusicTrack] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = createRef<HTMLAudioElement>();

  const currentProfile = useAppStore((state) => state.currentProfile);

  const setMusicTrackPath = (musicTrack: MusicTrack) => {
    switch (musicTrack) {
      case MusicTrack.CALM_MY_MIND: {
        return '/music/calm_my_mind.mp3';
      }
      case MusicTrack.CRADLE_OF_SOUL: {
        return '/music/cradle_of_soul.mp3';
      }
      case MusicTrack.FOREST_LULLABY: {
        return '/music/forest_lullaby.mp3';
      }
      default: {
        return '';
      }
    }
  };

  useEventListener(SpacesEvents.ROOM_PEER_JOINED, ({ peerId, role }) => {
    if (role === 'peer' && me.role === 'host') {
      changePeerRole(peerId, 'listener');
    }
  });

  useEventListener(SpacesEvents.ROOM_ME_ROLE_UPDATE, (role) => {
    if (role !== 'listener') {
      toast.success(t`You are now a ${role}`);
    }
  });

  useEventListener(SpacesEvents.ROOM_DATA_RECEIVED, (data) => {
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
    if (data.payload['musicTrack']) {
      const {
        musicTrack: musicTrackSelection,
        isMusicPlaying: isMusicTrackPlaying
      } = data.payload;
      setIsMusicPlaying(isMusicTrackPlaying);
      if (musicTrackSelection !== MusicTrack.DEFAULT && isMusicTrackPlaying) {
        setMusicTrack(setMusicTrackPath(musicTrackSelection));
      }
    }
  });

  useEffect(() => {
    if (['host', 'coHost'].includes(me.role)) {
      setMusicTrack(setMusicTrackPath(myMusicTrack));
      setIsMusicPlaying(isMyMusicPlaying);
    }
  }, [myMusicTrack, isMyMusicPlaying]);

  useEffect(() => {
    if (isMusicPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isMusicPlaying]);

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
      handleAcceptInvitation(requestType);
    }
    setShowAcceptRequest(false);
  };

  return (
    <div className="fixed inset-0 top-auto z-20 mx-auto flex flex h-fit w-full grow">
      {musicTrack !== MusicTrack.DEFAULT && isMusicPlaying && (
        <audio ref={audioRef} src={musicTrack} loop />
      )}
      <div className="relative mx-auto max-w-screen-xl grow">
        <div className="absolute bottom-0 right-0 ml-auto rounded-xl rounded-b-none border-[1.5px] border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex justify-center">
            {showAcceptRequest && isExpanded && (
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
              <div className="relative mt-4">
                <div className="absolute bottom-12 right-0 z-10 h-fit">
                  <Sidebar />
                </div>
                <AvatarGrid isLobbyPreview={false} />
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
