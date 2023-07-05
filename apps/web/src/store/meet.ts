import { create } from 'zustand';

interface MeetPersistState {
  audioInputDevice: MediaDeviceInfo;
  setAudioInputDevice: (audioInputDevice: MediaDeviceInfo) => void;
  videoDevice: MediaDeviceInfo;
  setVideoDevice: (videoDevice: MediaDeviceInfo) => void;
  audioOutputDevice: MediaDeviceInfo;
  setAudioOutputDevice: (audioOutputDevice: MediaDeviceInfo) => void;
}

export const useMeetPersistStore = create<MeetPersistState>((set) => ({
  audioInputDevice: {} as MediaDeviceInfo,
  setAudioInputDevice: (audioInputDevice) => set(() => ({ audioInputDevice })),
  videoDevice: {} as MediaDeviceInfo,
  setVideoDevice: (videoDevice) => set(() => ({ videoDevice })),
  audioOutputDevice: {} as MediaDeviceInfo,
  setAudioOutputDevice: (audioOutputDevice) =>
    set(() => ({ audioOutputDevice }))
}));
