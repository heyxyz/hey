import { Card } from '@components/UI/Card';
import { Tooltip } from '@components/UI/Tooltip';
import {
  DocumentTextIcon,
  MusicNoteIcon,
  PencilAltIcon,
  PhotographIcon,
  VideoCameraIcon
} from '@heroicons/react/outline';
import getAvatar from '@lib/getAvatar';
import { FC, ReactNode } from 'react';
import { useAppStore } from 'src/store/app';

interface ActionProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
}

const Action: FC<ActionProps> = ({ icon, text, onClick }) => (
  <Tooltip content={text} placement="top">
    <button className="flex flex-col items-center text-gray-500 hover:text-brand-500" onClick={onClick}>
      {icon}
    </button>
  </Tooltip>
);

const NewPostV2: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center space-x-3">
        <img
          src={getAvatar(currentProfile)}
          className="h-9 w-9 bg-gray-200 rounded-full border dark:border-gray-700/80"
          alt={currentProfile?.handle}
        />
        <div className="w-full flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer">
          <PencilAltIcon className="h-5 w-5" />
          <span>What's happening?</span>
        </div>
        <div className="flex items-center space-x-5">
          <Action icon={<PhotographIcon className="h-5 w-5" />} text="Image" onClick={() => {}} />
          <Action icon={<VideoCameraIcon className="h-5 w-5" />} text="Video" onClick={() => {}} />
          <Action icon={<MusicNoteIcon className="h-5 w-5" />} text="Audio" onClick={() => {}} />
          <Action icon={<DocumentTextIcon className="h-5 w-5" />} text="Blog" onClick={() => {}} />
        </div>
      </div>
    </Card>
  );
};

export default NewPostV2;
