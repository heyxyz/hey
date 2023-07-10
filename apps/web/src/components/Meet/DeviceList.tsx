import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import type { FC } from 'react';

type DeviceListProps = {
  devices: MediaDeviceInfo[];
  deviceType: 'audio' | 'video';
  setDevice: (device: MediaDeviceInfo) => void;
};

const DeviceList: FC<DeviceListProps> = ({ devices, setDevice }) => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {devices.map((device) => (
        <Menu.Item key={device.deviceId}>
          {({ active }) => (
            <button
              className={clsx(
                'flex h-full w-full justify-start rounded-lg px-4 py-2 text-sm ',
                !active
                  ? 'text-slate-500'
                  : resolvedTheme == 'dark'
                  ? 'bg-black text-slate-100'
                  : 'bg-brand-500 text-brand-100'
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
