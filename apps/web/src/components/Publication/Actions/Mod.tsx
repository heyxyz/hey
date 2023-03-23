import { ShieldCheckIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/alerts';
import { Tooltip } from 'ui';

interface ModProps {
  publication: Publication;
  isFullPublication?: boolean;
}

const Mod: FC<ModProps> = ({ publication, isFullPublication = false }) => {
  const setShowModActionAlert = useGlobalAlertStateStore((state) => state.setShowModActionAlert);
  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setShowModActionAlert(true, publication)}
      aria-label="Mod"
    >
      <div className="rounded-full p-1.5 text-yellow-600 hover:bg-yellow-400 hover:bg-opacity-20">
        <Tooltip placement="top" content="Mod actions" withDelay>
          <ShieldCheckIcon className={iconClassName} />
        </Tooltip>
      </div>
    </motion.button>
  );
};

export default Mod;
