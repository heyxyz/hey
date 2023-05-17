import type { DecodedMessage } from '@xmtp/xmtp-js';

/**
 * Returns an array of unique messages from the given array of decoded messages.
 *
 * @param msgObj Array of decoded messages.
 * @returns Array of unique messages.
 */
const getUniqueMessages = (msgObj: DecodedMessage[]): DecodedMessage[] => {
  const uniqueMessages = [
    ...Array.from(new Map(msgObj.map((item) => [item['id'], item])).values())
  ];
  uniqueMessages.sort((a, b) => {
    return (b.sent?.getTime() ?? 0) - (a.sent?.getTime() ?? 0);
  });

  return uniqueMessages ?? [];
};

export default getUniqueMessages;
