import type { RefObject } from "react";

import { useEffect } from "react";

const usePreventScrollOnNumberInput = (ref: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    const input = ref.current;
    if (input) {
      const preventScroll = (event: WheelEvent) => {
        event.preventDefault();
        event.stopPropagation();
      };

      input.addEventListener("wheel", preventScroll, { passive: false });

      return () => {
        input.removeEventListener("wheel", preventScroll);
      };
    }
  }, [ref]);
};

export default usePreventScrollOnNumberInput;
