import { Radio } from '@lenster/ui';
import { type FC } from 'react';

const Report: FC = () => {
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <Radio
          title="Misleading Account"
          message="Impersonation or false claims about identity or affiliation"
          name="reportReason"
        />
        <Radio
          title="Frequently Posts Unwanted Content"
          message="Spam; excessive mentions or replies"
          name="reportReason"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="rounded-md bg-gray-300 p-1 px-2 text-white hover:bg-gray-400"
          onClick={() => alert('gm 🚀')}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Report;
