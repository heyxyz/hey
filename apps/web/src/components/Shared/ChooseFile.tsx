import type { ChangeEventHandler, FC } from 'react';

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const ChooseFile: FC<Props> = ({ onChange }) => {
  return (
    <input
      className="focus:border-brand-400 cursor-pointer rounded-xl border border-gray-300 bg-white pr-1 text-sm text-gray-700 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      type="file"
      accept=".png, .jpg, .jpeg, .gif"
      onChange={onChange}
    />
  );
};

export default ChooseFile;
