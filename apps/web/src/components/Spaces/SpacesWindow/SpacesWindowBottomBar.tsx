import { useAppUtils } from '@huddle01/react/app-utils';
import {
  useAudio,
  useEventListener,
  useHuddle01,
  usePeers
} from '@huddle01/react/hooks';
import React, { useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';

import { Icons } from '../Common/assets/Icons';
import Dropdown from '../Common/Dropdown';
import EmojiTray from '../Common/EmojiTray';
import MusicTray from '../Common/MusicTray';

type Props = {};

const SpacesWindowBottomBar = (props: Props) => {
  const { peers } = usePeers();
  const { me } = useHuddle01();
  const {
    isAudioOn,
    fetchAudioStream,
    stopAudioStream,
    produceAudio,
    stopProducingAudio
  } = useAudio();
  const setSidebarView = useSpacesStore((state) => state.setSidebarView);
  const sidebarView = useSpacesStore((state) => state.sidebar.sidebarView);
  const { sendData } = useAppUtils();
  const [isEmojiTrayOpen, setIsEmojiTrayOpen] = useState(false);
  const [isMusicTrayOpen, setIsMusicTrayOpen] = useState(false);

  useEventListener('app:mic-on', (stream) => {
    produceAudio(stream);
  });

  useEventListener('app:mic-off', () => {
    stopProducingAudio();
  });

  const sendSpeakerRequest = () => {
    const peerIds = Object.values(peers)
      .filter(({ role }) => role === 'host' || role === 'coHost')
      .map(({ peerId }) => peerId);
    sendData(peerIds, {
      'request-to-speak': me.meId
    });
  };

  return (
    <div className="flex justify-between pt-4">
      {['speaker', 'coHost', 'host'].includes(me.role) ? (
        <button
          onClick={() => {
            if (isAudioOn) {
              stopAudioStream();
            } else {
              fetchAudioStream();
            }
          }}
        >
          {isAudioOn ? Icons.mic.true : Icons.mic.false}
        </button>
      ) : (
        <button
          className="inline-flex h-5 items-center justify-start gap-1 rounded-lg bg-indigo-950 px-2 py-4"
          onClick={sendSpeakerRequest}
        >
          <div className="relative h-5 w-5">{Icons.speaker}</div>
          <div className="text-xs font-medium leading-none text-violet-400">
            Request to speak
          </div>
        </button>
      )}
      <div className="flex gap-2">
        {['host', 'coHost'].includes(me.role) && (
          <Dropdown
            triggerChild={Icons.music}
            open={isMusicTrayOpen}
            onOpenChange={() => setIsMusicTrayOpen((prev) => !prev)}
          >
            <MusicTray onClose={() => setIsMusicTrayOpen(false)} />
          </Dropdown>
        )}
        <Dropdown
          triggerChild={Icons.reaction}
          open={isEmojiTrayOpen}
          onOpenChange={() => setIsEmojiTrayOpen((prev) => !prev)}
        >
          <div className="absolute -right-20 bottom-12 w-[15vw] min-w-[12rem]">
            <EmojiTray onClose={() => setIsEmojiTrayOpen(false)} />
          </div>
        </Dropdown>
        <button
          className="flex h-full items-center gap-2 rounded-lg bg-neutral-800 px-2 font-normal text-neutral-500"
          onClick={() => {
            setSidebarView(sidebarView === 'peers' ? 'close' : 'peers');
          }}
        >
          <span>{Icons.people}</span>
          {Object.keys(peers).filter((peerId) => peerId !== me.meId).length + 1}
        </button>
      </div>
    </div>
  );
};

export default SpacesWindowBottomBar;
