import { create } from 'zustand';

interface MeetPersistState {
  audioInputDevice: MediaDeviceInfo;
  setAudioInputDevice: (audioInputDevice: MediaDeviceInfo) => void;
  videoDevice: MediaDeviceInfo;
  setVideoDevice: (videoDevice: MediaDeviceInfo) => void;
  audioOutputDevice: MediaDeviceInfo;
  setAudioOutputDevice: (audioOutputDevice: MediaDeviceInfo) => void;
  isMicMuted: boolean;
  toggleMicMuted: (isMicMuted: boolean) => void;
  isCamOff: boolean;
  toggleCamOff: (isCamOff: boolean) => void;
}

export const useMeetPersistStore = create<MeetPersistState>((set) => ({
  audioInputDevice: {} as MediaDeviceInfo,
  setAudioInputDevice: (audioInputDevice) => set(() => ({ audioInputDevice })),
  videoDevice: {} as MediaDeviceInfo,
  setVideoDevice: (videoDevice) => set(() => ({ videoDevice })),
  audioOutputDevice: {} as MediaDeviceInfo,
  setAudioOutputDevice: (audioOutputDevice) =>
    set(() => ({ audioOutputDevice })),
  isMicMuted: true,
  toggleMicMuted: (isMicMuted) => set(() => ({ isMicMuted })),
  isCamOff: true,
  toggleCamOff: (isCamOff) => set(() => ({ isCamOff }))
}));
