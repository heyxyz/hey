import type { SyntheticEvent } from 'react';

/**
 *
 * @param event the event to stop propagation
 * @returns void
 */
export const stopEventPropagation = (event: SyntheticEvent) => event.stopPropagation();
