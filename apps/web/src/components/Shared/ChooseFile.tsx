import type { ChangeEventHandler, FC } from 'react';

interface ChooseFileProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const ChooseFile: FC<ChooseFileProps> = ({ onChange }) => {
  return (
    <input
      accept=".png, .jpg, .jpeg, .gif"
      className="focus:border-brand-400 cursor-pointer rounded-xl border border-gray-300 bg-white pr-1 text-sm text-gray-700 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      onChange={onChange}
      onClick={(event) => {
        // reset the value so that an onChange event is generated also when the user selects the same filename again
        // this allows the user to make a new attempt with the same image
        (event.target as HTMLInputElement).value = '';
      }}
      type="file"
    />
  );
};

export default ChooseFile;
