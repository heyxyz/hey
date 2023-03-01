import type { SyntheticEvent } from 'react';

export const stopEventPropagation = (e: SyntheticEvent) => e.stopPropagation();
