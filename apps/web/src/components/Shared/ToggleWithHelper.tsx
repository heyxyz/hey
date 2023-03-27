import type { FC, ReactNode } from 'react';
import { Toggle } from 'ui';

interface ToggleWithHelperProps {
  on: boolean;
  setOn: (on: boolean) => void;
  heading?: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
}

const ToggleWithHelper: FC<ToggleWithHelperProps> = ({ on, setOn, heading, description, icon }) => {
  const hasHeadingAndIcon = heading && icon;
  return (
    <div className="space-y-2">
      {hasHeadingAndIcon && (
        <div className="flex items-center space-x-2">
          <span className="text-brand-500">{icon}</span>
          <span>{heading}</span>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Toggle on={on} setOn={setOn} />
        <div className="lt-text-gray-500 text-sm font-bold">{description}</div>
      </div>
    </div>
  );
};

export default ToggleWithHelper;
