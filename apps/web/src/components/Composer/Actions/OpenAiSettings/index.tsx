import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { SparklesIcon } from '@heroicons/react/24/outline';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Tooltip } from '@hey/ui';
import { motion } from 'framer-motion';
import { usePublicationOpenAiStore } from 'src/store/non-persisted/publication/usePublicationOpenAiStore';

interface OpenAiGeneratorProps {
  parent: AnyPublication;
}

const OpenAiGenerator: FC<OpenAiGeneratorProps> = ({ parent }) => {
  const showOpenAiGenerator = usePublicationOpenAiStore(
    (state) => state.showOpenAiGenerator
  );
  const setShowOpenAiGenerator = usePublicationOpenAiStore(
    (state) => state.setShowOpenAiGenerator
  );
  const setParentContent = usePublicationOpenAiStore(
    (state) => state.setParentContent
  );
  const targetPublication = isMirrorPublication(parent)
    ? parent.mirrorOn
    : parent;
  const filteredContent =
    getPublicationData(targetPublication.metadata)?.content || '';

  return (
    <Tooltip content="AI Generator" placement="top">
      <motion.button
        aria-label="AI Generator"
        onClick={() => {
          setParentContent(filteredContent);
          setShowOpenAiGenerator(!showOpenAiGenerator);
        }}
        type="button"
        whileTap={{ scale: 0.9 }}
      >
        <SparklesIcon className="text-brand-500 size-5" />
      </motion.button>
    </Tooltip>
  );
};

export default OpenAiGenerator;
