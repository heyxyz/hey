import copy from 'copy-to-clipboard';
import { useRef, useState } from 'react';

export const useCopy = (): [boolean, (text: string) => void] => {
  const [showCopied, setShowCopied] = useState(false);
  const timeoutRef = useRef<any>(null);

  const copyText = (text: string) => {
    copy(text);
    setShowCopied(true);

    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowCopied(false);
      timeoutRef.current = null;
    }, 1500);
  };

  return [showCopied, copyText];
};
