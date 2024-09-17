import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";

const useDebouncedCallback = (callback: VoidFunction, delay: number) => {
  const [changeSignal, setChangeSignal] = useState(-1);
  const debouncedChangeSignal = useDebounce(changeSignal, delay);

  const increaseChanges = useCallback(() => {
    setChangeSignal((num) => (num + 1) % Number.MAX_SAFE_INTEGER);
  }, []);

  useEffect(() => {
    if (debouncedChangeSignal >= 0) {
      callback();
    }
  }, [debouncedChangeSignal, callback]);

  return increaseChanges;
};

export default useDebouncedCallback;
