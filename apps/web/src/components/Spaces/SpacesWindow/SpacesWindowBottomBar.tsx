import { useAppUtils } from '@huddle01/react/app-utils';
import {
  useAudio,
  useEventListener,
  useHuddle01,
  usePeers
} from '@huddle01/react/hooks';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';

import { Icons } from '../Common/assets/Icons';
import Dropdown from '../Common/Dropdown';
import EmojiTray from '../Common/EmojiTray';
import MusicTray from '../Common/MusicTray';

const SpacesWindowBottomBar: FC = () => {
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
    <div className="flex justify-between border-t border-neutral-300 pt-4 dark:border-neutral-700">
      {['speaker', 'coHost', 'host'].includes(me.role) ? (
        <button
          onClick={() => {
            if (isAudioOn) {
              stopAudioStream();
            } else {
              fetchAudioStream();
            }
          }}
          className="bg-brand-100 rounded-lg dark:bg-neutral-800"
        >
          {isAudioOn ? Icons.mic.true : Icons.mic.false}
        </button>
      ) : (
        <button
          className="bg-brand-500 inline-flex h-5 items-center justify-start gap-1 rounded-lg px-2 py-4 dark:bg-indigo-950"
          onClick={sendSpeakerRequest}
        >
          <div className="relative h-5 w-5 text-neutral-50">
            {Icons.speaker}
          </div>
          <div className="dark:text-brand-400 text-xs font-medium leading-none text-neutral-50">
            <Trans>Request to speak</Trans>
          </div>
        </button>
      )}
      <div className="flex gap-2">
        {['host', 'coHost'].includes(me.role) && (
          <Dropdown
            triggerChild={
              <div className="bg-brand-100 rounded-lg text-black dark:bg-neutral-800">
                {Icons.music}
              </div>
            }
          >
            <div className="absolute -right-4 bottom-4 w-[12rem] translate-x-1/2">
              <MusicTray />
            </div>
          </Dropdown>
        )}
        <Dropdown
          triggerChild={
            <div className="bg-brand-100 rounded-lg dark:bg-neutral-800">
              {Icons.reaction}
            </div>
          }
        >
          <div className="absolute -right-4 bottom-4 w-[12rem] translate-x-1/2">
            <EmojiTray />
          </div>
        </Dropdown>
        <button
          className="bg-brand-100 text-brand-500 flex h-full items-center gap-2 rounded-lg px-2 font-normal dark:bg-neutral-800 dark:text-neutral-500"
          onClick={() => {
            setSidebarView(sidebarView === 'peers' ? 'close' : 'peers');
          }}
        >
          <div className="text-brand-500 dark:text-neutral-500">
            {Icons.people}
          </div>
          {Object.keys(peers).filter((peerId) => peerId !== me.meId).length + 1}
        </button>
      </div>
    </div>
  );
};

export default SpacesWindowBottomBar;
