import {
  ChevronLeftIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { Radio } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';

import Dropdown from './Dropdown';

interface DeviceButtonProps {
  device: MediaDeviceInfo;
  activeDevice: MediaDeviceInfo | null;
  setActiveDevice: (device: MediaDeviceInfo) => void;
}

interface DeviceListProps {
  devices: MediaDeviceInfo[];
  deviceType: 'mic' | 'speaker';
}

const SelectDevice: React.FC<DeviceButtonProps> = ({
  device,
  activeDevice,
  setActiveDevice
}) => {
  return (
    <Radio
      value={device.deviceId}
      checked={activeDevice?.deviceId === device.deviceId}
      onChange={() => setActiveDevice(device)}
      heading={<div className="items-center text-xs">{device.label}</div>}
    />
  );
};

const DeviceList: React.FC<DeviceListProps> = ({ devices, deviceType }) => {
  const {
    setActiveMicDevice,
    setActiveSpeakerDevice,
    activeMicDevice,
    activeSpeakerDevice
  } = useSpacesStore();

  return (
    <div className="flex flex-col rounded-xl border border-gray-400 bg-gray-100 p-1 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
      {devices.map((device, index) => (
        <div
          key={index}
          className={cn(
            'p-1',
            index !== devices.length - 1 && 'border-b border-gray-400'
          )}
        >
          <SelectDevice
            key={device.deviceId}
            device={device}
            activeDevice={
              deviceType === 'mic' ? activeMicDevice : activeSpeakerDevice
            }
            setActiveDevice={
              deviceType === 'mic' ? setActiveMicDevice : setActiveSpeakerDevice
            }
          />
        </div>
      ))}
    </div>
  );
};

interface SettingsTrayProps {
  micDevices: MediaDeviceInfo[];
  speakerDevices: MediaDeviceInfo[];
}

const SettingsTray: FC<SettingsTrayProps> = ({
  micDevices,
  speakerDevices
}) => {
  const {
    activeMicDevice,
    activeSpeakerDevice,
    setActiveMicDevice,
    setActiveSpeakerDevice
  } = useSpacesStore();
  const [showSettings, setShowSettings] = useState(true);

  return (
    showSettings && (
      <div className="flex w-48 flex-col gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-500 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <div className="flex border-b border-gray-300  py-2 font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
          <span>
            <ChevronLeftIcon
              className="mr-2 h-4 w-4 cursor-pointer"
              onClick={() => setShowSettings(false)}
            />
          </span>
          <span className="text-sm font-medium ">
            <Trans>Settings</Trans>
          </span>
        </div>
        <Dropdown
          triggerChild={
            <button className="flex items-center border-b border-gray-300 pb-2 dark:border-gray-500">
              <span className="text-start">{activeMicDevice?.label}</span>
              <span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </span>
            </button>
          }
        >
          <div className="absolute top-24 w-44">
            <DeviceList devices={micDevices} deviceType="mic" />
          </div>
        </Dropdown>
        <Dropdown
          triggerChild={
            <button className="flex items-center">
              <span className="text-start">{activeSpeakerDevice?.label}</span>
              <span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </span>
            </button>
          }
        >
          <div className="absolute top-36 w-44">
            <DeviceList devices={speakerDevices} deviceType="speaker" />
          </div>
        </Dropdown>
      </div>
    )
  );
};

export default SettingsTray;
