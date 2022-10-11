import { Tooltip } from '@components/UI/Tooltip';
import { EyeIcon } from '@heroicons/react/outline';
import { Dogstats } from '@lib/dogstats';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { PUBLICATION } from 'src/tracking';

const Preview: FC = () => {
  const previewPublication = usePublicationStore((state) => state.previewPublication);
  const setPreviewPublication = usePublicationStore((state) => state.setPreviewPublication);

  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          setPreviewPublication(!previewPublication);
          Dogstats.track(PUBLICATION.NEW.MARKDOWN_PREVIEW);
        }}
        aria-label="Choose Attachment"
      >
        <Tooltip placement="top" content="Preview">
          <EyeIcon className="w-5 h-5 text-brand" />
        </Tooltip>
      </motion.button>
    </div>
  );
};

export default Preview;
