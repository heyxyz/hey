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
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {icon ? <span className="text-brand">{icon}</span> : null}
        {heading ? <span>{heading}</span> : null}
      </div>
      <div className="flex items-center space-x-2">
        <Toggle on={on} setOn={setOn} />
        <div className="lt-text-gray-500 text-sm font-bold">{description}</div>
      </div>
    </div>
  );
};

export default ToggleWithHelper;
