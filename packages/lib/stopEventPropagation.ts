import type { SyntheticEvent } from 'react';

/**
 * Stops the propagation of a SyntheticEvent.
 *
 * @param event The SyntheticEvent to stop propagation for.
 * @returns void.
 */
export const stopEventPropagation = (event: SyntheticEvent) =>
  event.stopPropagation();
