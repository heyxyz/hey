import type { Message } from '@xmtp/xmtp-js';

/**
 *
 * @param msgObj - Message[]
 * @returns Message[]
 */

const getUniqueMessages = (msgObj: Message[]): Message[] => {
  const uniqueMessages = [...Array.from(new Map(msgObj.map((item) => [item['id'], item])).values())];
  uniqueMessages.sort((a, b) => {
    return (b.sent?.getTime() ?? 0) - (a.sent?.getTime() ?? 0);
  });

  return uniqueMessages ?? [];
};

export default getUniqueMessages;
