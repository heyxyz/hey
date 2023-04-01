import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['profileIds', 'ownedBy', 'handles', 'whoMirroredPublicationId']]);
};

export default createProfilesFieldPolicy;
