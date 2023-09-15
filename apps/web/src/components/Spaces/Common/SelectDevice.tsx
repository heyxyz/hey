import { Radio } from '@lenster/ui';

interface DeviceButtonProps {
  device: MediaDeviceInfo;
  activeDevice: MediaDeviceInfo | null;
  setActiveDevice: (device: MediaDeviceInfo) => void;
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
      heading={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xs font-medium text-gray-300">
              {device.label}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default SelectDevice;
