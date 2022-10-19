import type { Message } from '@xmtp/xmtp-js';

import getUniqueMessages from './getUniqueMessages';

const addMessages = (existing: Message[], newMessages: Message[]): Message[] => {
  return getUniqueMessages(existing.concat(newMessages));
};

export default addMessages;
