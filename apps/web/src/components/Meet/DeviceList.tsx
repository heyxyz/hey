import { Menu } from '@headlessui/react';
import { useAudio, useVideo } from '@huddle01/react/hooks';
import clsx from 'clsx';
import type { FC } from 'react';

type DeviceListProps = {
  devices: MediaDeviceInfo[];
  deviceType: 'audio' | 'video';
  setDevice: (device: MediaDeviceInfo) => void;
};

const DeviceList: FC<DeviceListProps> = ({
  devices,
  deviceType,
  setDevice
}) => {
  const { fetchVideoStream } = useVideo();
  const { fetchAudioStream } = useAudio();

  return (
    <>
      {devices.map((device) => (
        <Menu.Item key={device.deviceId}>
          {({ active }) => (
            <button
              className={clsx(
                active ? 'bg-black text-slate-500' : 'text-slate-500',
                'block px-4 py-2 text-sm'
              )}
              key={device.deviceId}
              onClick={() => {
                setDevice(device);
              }}
            >
              {device.label}
            </button>
          )}
        </Menu.Item>
      ))}
    </>
  );
};

export default DeviceList;
