import type { ChangeEventHandler, FC } from 'react';

import { PaperClipIcon } from '@heroicons/react/24/outline';
import { useId } from 'react';

interface ChooseFileProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const ChooseFile: FC<ChooseFileProps> = ({ onChange }) => {
  const id = useId();

  return (
    <div className="flex items-center space-x-2">
      <label
        className="flex cursor-pointer items-center space-x-2 rounded-xl border border-gray-300 bg-white px-3 py-1 text-gray-700 shadow-sm outline-offset-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        htmlFor={id}
      >
        <PaperClipIcon className="size-4" />
        <span>Choose File</span>
      </label>
      <input
        accept=".png, .jpg, .jpeg, .gif"
        className="hidden"
        id={id}
        onChange={onChange}
        onClick={(event) => {
          (event.target as HTMLInputElement).value = '';
        }}
        type="file"
      />
    </div>
  );
};

export default ChooseFile;
