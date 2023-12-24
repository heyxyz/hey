import type { IMessageIPFSWithCID, MessageObj } from '@pushprotocol/restapi';

import { MessageType } from '@pushprotocol/restapi/src/lib/constants';

export interface DisplayedMessage {
  cid: string;
  from: string;
  isOptimistic?: boolean;
  link: string;
  messageContent: string;
  messageObj: MessageObj | string;
  messageType: string;
  parentMessage?: DisplayedMessage | null;
  reactions: string[];
  timestamp: number;
}

export const transformMessages = (
  messages: (IMessageIPFSWithCID & { isOptimistic?: boolean })[]
) => {
  const newMessages = new Map<string, DisplayedMessage>();

  const reactionMessages = [];
  const replyMessages = [];

  for (const message of messages.reverse()) {
    if (message.messageType === MessageType.REACTION) {
      reactionMessages.push(message);
      continue;
    }

    if (message.messageType === MessageType.REPLY) {
      replyMessages.push(message);
    }

    newMessages.set(message.link ?? message.cid, {
      cid: message.cid,
      from: message.fromDID.split?.(':')?.pop() ?? '',
      isOptimistic: message.isOptimistic,
      link: message.link ?? '',
      messageContent: message.messageContent,
      messageObj: message.messageObj ?? '',
      messageType: message.messageType,
      parentMessage: null,
      reactions: [],
      timestamp: message.timestamp ?? 0
    });
  }

  for (const reactionMessage of reactionMessages) {
    if (typeof reactionMessage.messageObj === 'string') {
      continue;
    }
    const reactionMessageReference = newMessages.get(
      (reactionMessage.messageObj as any)?.reference
    );
    if (!reactionMessageReference) {
      continue;
    }
    reactionMessageReference.reactions.push(
      reactionMessage.messageObj?.content as string
    );

    // To eliminate duplicate reactions as pagination uses link to retrieve next messages
    reactionMessageReference.reactions = Array.from(
      new Set(reactionMessageReference.reactions)
    );
  }

  for (const reply of replyMessages) {
    const parentMessage = newMessages.get((reply.messageObj as any)?.reference);
    const replyMessages = newMessages.get(reply.link ?? '');
    if (!parentMessage || !replyMessages) {
      continue;
    }

    replyMessages['parentMessage'] = parentMessage;
  }

  return [...newMessages.values()];
};

export const mapReactionsToMessages = (
  messages: IMessageIPFSWithCID[]
): DisplayedMessage[] => {
  transformMessages(messages);
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
