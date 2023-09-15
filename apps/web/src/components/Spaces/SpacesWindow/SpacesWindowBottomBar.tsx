import {
  EmojiHappyIcon,
  MusicNoteIcon,
  UserIcon
} from '@heroicons/react/outline';
import { useAppUtils } from '@huddle01/react/app-utils';
import {
  useAudio,
  useEventListener,
  useHuddle01,
  usePeers
} from '@huddle01/react/hooks';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { SpacesEvents } from 'src/enums';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

import { Icons } from '../Common/assets/Icons';
import Dropdown from '../Common/Dropdown';
import EmojiTray from '../Common/EmojiTray';
import MusicTray from '../Common/MusicTray';

const SpacesWindowBottomBar: FC = () => {
  const { peers } = usePeers();
  const { me } = useHuddle01();
  const {
    fetchAudioStream,
    stopAudioStream,
    produceAudio,
    stopProducingAudio
  } = useAudio();

  const {
    setSidebarView,
    sidebar,
    isAudioOn,
    setIsAudioOn,
    setActiveMicDevice,
    setActiveSpeakerDevice,
    activeMicDevice,
    activeSpeakerDevice
  } = useSpacesStore();

  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);

  const { sendData } = useAppUtils();

  useEventListener(SpacesEvents.APP_MIC_ON, (stream) => {
    produceAudio(stream);
  });

  useEventListener(SpacesEvents.APP_MIC_OFF, () => {
    stopProducingAudio();
  });

  useEffect(() => {
    if (!activeMicDevice || !activeSpeakerDevice) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        navigator.mediaDevices.enumerateDevices().then(async (devices) => {
          const mic = devices.find((device) => device.kind === 'audioinput');
          if (mic && !activeMicDevice) {
            setActiveMicDevice(mic);
          }
          const speaker = devices.find(
            (device) => device.kind === 'audiooutput'
          );
          if (speaker && !activeSpeakerDevice) {
            setActiveSpeakerDevice(speaker);
          }
        });
      });
    }
    if (micDevices.length === 0 || speakerDevices.length === 0) {
      navigator.mediaDevices.enumerateDevices().then(async (devices) => {
        const mic = devices.filter((device) => device.kind === 'audioinput');
        setMicDevices(mic);
        const speaker = devices.filter(
          (device) => device.kind === 'audiooutput'
        );
        setSpeakerDevices(speaker);
      });
    }
  }, [activeMicDevice, activeSpeakerDevice]);

  const sendSpeakerRequest = () => {
    const peerIds = Object.values(peers)
      .filter(({ role }) => role === 'host' || role === 'coHost')
      .map(({ peerId }) => peerId);
    sendData(peerIds, {
      'request-to-speak': me.meId
    });
    toast.success('Speaker request sent');
  };

  useUpdateEffect(() => {
    if (isAudioOn) {
      stopAudioStream();
      fetchAudioStream(activeMicDevice?.deviceId);
    }
  }, [activeMicDevice]);

  return (
    <div className="flex justify-between border-t border-gray-300 pt-4 dark:border-gray-700">
      {['speaker', 'coHost', 'host'].includes(me.role) ? (
        <button
          onClick={() => {
            if (isAudioOn) {
              stopAudioStream();
              setIsAudioOn(false);
            } else {
              fetchAudioStream();
              setIsAudioOn(true);
            }
          }}
          className="bg-brand-100 text-brand-500 rounded-lg dark:bg-gray-800 dark:text-gray-400"
        >
          {isAudioOn ? Icons.mic.true : Icons.mic.false}
        </button>
      ) : (
        <button
          className="bg-brand-500 dark:bg-brand-950 inline-flex h-5 items-center justify-start gap-1 rounded-lg px-2 py-4"
          onClick={sendSpeakerRequest}
        >
          <div className="dark:text-brand-400 text-xs font-medium leading-none text-gray-50">
            <Trans>Request to speak</Trans>
          </div>
        </button>
      )}

      <div className="flex gap-2">
        {['host', 'coHost'].includes(me.role) && (
          <Dropdown
            triggerChild={
              <div className="bg-brand-100 rounded-lg p-1.5 dark:bg-gray-800">
                <MusicNoteIcon className="text-brand-500 h-5 w-5 dark:text-gray-400" />
              </div>
            }
          >
            <div className="absolute -right-4 bottom-4 w-48 translate-x-1/2">
              <MusicTray />
            </div>
          </Dropdown>
        )}
        <Dropdown
          triggerChild={
            <div className="bg-brand-100 rounded-lg p-1.5 dark:bg-gray-800">
              <EmojiHappyIcon className="text-brand-500 h-5 w-5 dark:text-gray-400" />
            </div>
          }
        >
          <div className="absolute -right-4 bottom-4 w-48 translate-x-1/2">
            <EmojiTray />
          </div>
        </Dropdown>
        <button
          className="bg-brand-100 text-brand-500 flex h-full items-center gap-2 rounded-lg px-2 font-normal dark:bg-gray-800 dark:text-gray-400"
          onClick={() => {
            setSidebarView(sidebar.sidebarView === 'peers' ? 'close' : 'peers');
          }}
        >
          <UserIcon className="h-5 w-5" />
          {Object.keys(peers).filter((peerId) => peerId !== me.meId).length + 1}
        </button>
      </div>
    </div>
  );
};

export default SpacesWindowBottomBar;
