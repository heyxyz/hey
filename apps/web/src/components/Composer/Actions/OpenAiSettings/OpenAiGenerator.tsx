import type { FC, ReactNode } from 'react';

import { SparklesIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import { Card, Tooltip } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useState } from 'react';
import { usePublicationOpenAiStore } from 'src/store/non-persisted/publication/usePublicationOpenAiStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: FC<WrapperProps> = ({ children }) => {
  return (
    <Card className="flex justify-center p-3 font-bold hover:bg-gray-50 dark:hover:bg-gray-900">
      <div className="flex items-center space-x-2">{children}</div>
    </Card>
  );
};

const OpenAiGenerator: FC = () => {
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );
  const parentContent = usePublicationOpenAiStore(
    (state) => state.parentContent
  );
  const setShowOpenAiGenerator = usePublicationOpenAiStore(
    (state) => state.setShowOpenAiGenerator
  );

  const [text, setText] = useState('');

  const fetchData = async () => {
    setText('');
    try {
      const response = await fetch(`${HEY_API_URL}/ai/predict`, {
        body: JSON.stringify({
          text: `
            """ ${parentContent} """
            Give a comment on the post that is wrapped in triple quotes above.
          `.trim()
        }),
        headers: {
          ...getAuthApiHeaders(),
          'Content-Type': 'application/json'
        } as any,
        method: 'POST'
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        setText((prev) => prev + new TextDecoder('utf-8').decode(value));
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <Card className="m-5 px-5 py-3" forceRounded>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <SparklesIcon className="text-brand-500 size-4" />
          <b>AI Comment Generator</b>
        </div>
        <div className="flex items-center space-x-3">
          <Tooltip content="Close" placement="top">
            <button
              className="flex"
              onClick={() => {
                setShowOpenAiGenerator(false);
              }}
              type="button"
            >
              <XCircleIcon className="size-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      {text.length > 0 ? <div className="pb-3 pt-5">{text}</div> : null}
      <div className="mt-3 space-y-2">
        <button className="w-full" onClick={() => fetchData()} type="button">
          <Wrapper>Generate Comment</Wrapper>
        </button>
      </div>
    </Card>
  );
};

export default OpenAiGenerator;
