import type { IMessageIPFSWithCID, MessageObj } from '@pushprotocol/restapi';

export interface DisplayedMessage {
  cid: string;
  from: string;
  link: string;
  messageContent: string;
  messageObj: MessageObj | string;
  messageType: string;
  reactions: string[];
  timestamp: number;
}

export const transformMessages = (messages: IMessageIPFSWithCID[]) => {
  const newMessages = new Map();
  //
};

export const mapReactionsToMessages = (
  messages: IMessageIPFSWithCID[]
): DisplayedMessage[] => {
  const formattedMessages: DisplayedMessage[] = messages.map((message) => ({
    cid: message.cid,
    from: message.fromDID.split?.(':')?.pop() ?? '',
    link: message.link ?? '',
    messageContent: message.messageContent,
    messageObj: message.messageObj ?? '',
    messageType: message.messageType,
    reactions: [],
    timestamp: message.timestamp ?? 0
  }));

  const findPerson = (reference: string) =>
    formattedMessages.find((message) => message.link === reference);

  let formattedResult: DisplayedMessage[] = [];
  for (const message of formattedMessages) {
    if (
      message.messageObj &&
      typeof message.messageObj !== 'string' &&
      'reference' in message.messageObj &&
      message.messageObj.reference
    ) {
      const result = findPerson(message.messageObj.reference);

      const prevElementIndex = formattedResult.findIndex(
        (item) =>
          message.messageObj &&
          typeof message.messageObj !== 'string' &&
          'reference' in message.messageObj &&
          message.messageObj?.reference &&
          item.link === message.messageObj.reference
      );

      if (!prevElementIndex && result) {
        formattedResult.push({
          ...result,
          reactions: Array.from(
            new Set([...(result?.reactions ?? []), message.messageContent])
          )
        });
      }

      formattedResult[prevElementIndex] = {
        ...formattedResult[prevElementIndex],
        reactions: [
          ...formattedResult[prevElementIndex].reactions,
          message.messageContent
        ]
      };
    } else {
      formattedResult.push(message);
    }
  }

  // To eliminate duplicate reactions
  formattedResult = formattedResult.map((each) => ({
    ...each,
    reactions: Array.from(new Set(each.reactions))
  }));

  return formattedResult;
};
