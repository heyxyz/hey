import type { FC, ReactNode } from 'react';

import { Toggle } from '@hey/ui';

interface ToggleWithHelperProps {
  description: ReactNode;
  disabled?: boolean;
  heading?: ReactNode;
  icon?: ReactNode;
  on: boolean;
  setOn: (on: boolean) => void;
}

const ToggleWithHelper: FC<ToggleWithHelperProps> = ({
  description,
  disabled,
  heading,
  icon,
  on,
  setOn
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start space-x-3">
        {icon ? <span className="mt-1">{icon}</span> : null}
        <div>
          {heading ? <b>{heading}</b> : null}
          <div className="ld-text-gray-500 text-sm">{description}</div>
        </div>
      </div>
      <Toggle disabled={disabled} on={on} setOn={setOn} />
    </div>
  );
};

export default ToggleWithHelper;
