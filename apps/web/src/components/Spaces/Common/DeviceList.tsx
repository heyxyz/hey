import React from 'react';
import { useSpacesStore } from 'src/store/spaces';

import SelectDevice from './SelectDevice';

interface DeviceListProps {
  devices: MediaDeviceInfo[];
  deviceType: 'mic' | 'speaker';
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, deviceType }) => {
  const {
    setActiveMicDevice,
    setActiveSpeakerDevice,
    activeMicDevice,
    activeSpeakerDevice
  } = useSpacesStore();

  return (
    <div className="flex flex-col rounded-xl bg-gray-700 p-1 text-gray-400">
      {devices.map((device, index) => (
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
      ))}
    </div>
  );
};

export default DeviceList;
