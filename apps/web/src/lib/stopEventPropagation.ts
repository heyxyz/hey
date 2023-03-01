import type { SyntheticEvent } from 'react';

export const stopEventPropagation = (event: SyntheticEvent) => event.stopPropagation();
