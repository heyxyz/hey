import type { ChangeEventHandler, FC } from 'react';

interface ChooseFileProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const ChooseFile: FC<ChooseFileProps> = ({ onChange }) => {
  return (
    <input
      accept=".png, .jpg, .jpeg, .gif"
      className="cursor-pointer rounded-xl border border-gray-300 bg-white pr-1 text-sm text-gray-700 shadow-sm outline-offset-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      onChange={onChange}
      onClick={(event) => {
        (event.target as HTMLInputElement).value = '';
      }}
      type="file"
    />
  );
};

export default ChooseFile;
