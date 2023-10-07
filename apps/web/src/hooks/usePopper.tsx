import type { Options } from '@popperjs/core';
import { createPopper } from '@popperjs/core';
import type { RefCallback } from 'react';
import { useCallback, useMemo, useRef } from 'react';

export function usePopper(
  options?: Partial<Options>
): [RefCallback<Element | null>, RefCallback<HTMLElement | null>] {
  let reference = useRef<Element>(null);
  let popper = useRef<HTMLElement>(null);

  let cleanupCallback = useRef(() => {});

  let instantiatePopper = useCallback(() => {
    if (!reference.current) {
      return;
    }
    if (!popper.current) {
      return;
    }

    if (cleanupCallback.current) {
      cleanupCallback.current();
    }

    cleanupCallback.current = createPopper(
      reference.current,
      popper.current,
      options
    ).destroy;
  }, [reference, popper, cleanupCallback, options]);

  return useMemo(
    () => [
      (referenceDomNode) => {
        // @ts-ignore
        reference.current = referenceDomNode;
        instantiatePopper();
      },
      (popperDomNode) => {
        // @ts-ignore
        popper.current = popperDomNode;
        instantiatePopper();
      }
    ],
    [reference, popper, instantiatePopper]
  );
}
