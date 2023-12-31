import type { ReactNode } from 'react';

import { motion } from 'framer-motion';
import React from 'react';

export interface ChatAction {
  children: ReactNode;
  onClick: () => void;
  showAction: boolean;
}

export const ChatAction: React.FC<ChatAction> = ({
  children,
  onClick,
  showAction
}) => (
  <motion.div
    animate={{ opacity: showAction ? 1 : 0 }}
    className="border-brand-400 ml-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border"
    initial={{ opacity: 1 }}
    onClick={onClick}
  >
    {children}
  </motion.div>
);
