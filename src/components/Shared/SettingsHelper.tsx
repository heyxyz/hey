import { FC, ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  heading: string;
  description: string;
}

const SettingsHelper: FC<Props> = ({ icon, heading, description }) => {
  return (
    <div className="mb-4 ml-4 space-y-2 w-5/6 md:ml-0 lg-ml-0">
      <div className="flex gap-1.5 items-center text-xl">
        {icon}
        <div>{heading}</div>
      </div>
      <div className="text-gray-600 dark:text-gray-400">{description}</div>
    </div>
  );
};

export default SettingsHelper;
