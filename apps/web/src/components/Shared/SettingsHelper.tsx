import type { FC, ReactNode } from 'react';

interface SettingsHelperProps {
  icon?: ReactNode;
  heading: string;
  description: string;
}

const SettingsHelper: FC<SettingsHelperProps> = ({ icon, heading, description }) => {
  return (
    <div className="lg-ml-0 mb-4 ml-4 w-5/6 space-y-2 md:ml-0">
      <div className="flex items-center gap-1.5 text-xl">
        {icon}
        <div>{heading}</div>
      </div>
      <div className="lt-text-gray-500">{description}</div>
    </div>
  );
};

export default SettingsHelper;
