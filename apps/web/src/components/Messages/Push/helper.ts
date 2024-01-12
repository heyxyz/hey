import type {
  IMessageIPFSWithCID,
  Message,
  MessageObj
} from '@pushprotocol/restapi';

import { LENSHUB_PROXY } from '@hey/data/constants';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { CHAIN_ID } from 'src/constants';
import { v4 as uuid } from 'uuid';

import type { MessageReactions } from './Actions/Reactions';

dayjs.extend(calendar);

export const getAccountFromProfile = (lensProfileId: string) => {
  return `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${lensProfileId}`;
};

export const getProfileIdFromDID = (id: string) => {
  return id.split(':')[4];
};

export const dateToFromNowDaily = (timestamp: number): string => {
  return dayjs(timestamp).calendar(null, {
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    nextWeek: 'dddd',
    sameDay: '[Today]',
    sameElse: 'DD/MM/YYYY'
  });
};

export const computeSendPayload = (message: {
  content: {
    content: string;
    type: Exclude<MessageType, MessageType.REACTION | MessageType.REPLY>;
  };
  reference?: string;
  type?: MessageType.REACTION | MessageType.REPLY;
}): Message => {
  // @ts-expect-error
  return {
    default: {
      content: message.content.content,
      type: message.content.type
    },
    [MessageType.REACTION]: {
      content: message.content.content,
      reference: message.reference,
      type: MessageType.REACTION
    },
    [MessageType.REPLY]: {
      content: {
        content: message.content.content,
        type: message.content.type
      },
      reference: message.reference,
      type: MessageType.REPLY
    }
  }[message.type ?? 'default'];
};

export const createTemporaryMessage = (
  messageContents: Message,
  profileId: string
) => {
  const tempMessageId = `temp_${uuid()}`;
  // PushSDK does weird nesting for REPLY messages
  const messageContentFormatted =
    messageContents.type === MessageType.REPLY
      ? {
          content: {
            messageObj: {
              content: messageContents.content.content
            },
            messageType: messageContents.content.type
          },
          reference: messageContents.reference
        }
      : messageContents;

  return {
    cid: tempMessageId,
    fromDID: getAccountFromProfile(profileId),
    link: tempMessageId,
    messageObj: messageContentFormatted,
    messageType: messageContents.type,
    timestamp: Date.now()
  } as IMessageIPFSWithCID;
};

export const transformReplyToMessage = (
  reply: IMessageIPFSWithCID
): IMessageIPFSWithCID => {
  if (reply?.messageType !== MessageType.REPLY) {
    return reply;
  }

  // @ts-expect-error
  const messageInner = reply?.messageObj?.content as {
    messageObj: MessageObj;
    messageType: MessageType;
  };

  return {
    ...reply,
    messageObj: {
      content: messageInner?.messageObj?.content as string
    },
    messageType: messageInner?.messageType
  };
};

export const getMessageReactions = (
  chat: IMessageIPFSWithCID,
  reactions: IMessageIPFSWithCID[]
): MessageReactions[] => {
  return reactions
    .filter(
      (reaction) =>
        // @ts-expect-error
        reaction.messageObj?.reference === (chat as IMessageIPFSWithCID).cid
    )
    .map((item) =>
      typeof item.messageObj === 'string'
        ? item.messageObj
        : (item.messageObj?.content as string)
    ) as MessageReactions[];
};

export const getPrimaryMessage = (
  chat: IMessageIPFSWithCID
): IMessageIPFSWithCID => {
  const isReplyMessage = chat.messageType === MessageType.REPLY;
  return isReplyMessage ? transformReplyToMessage(chat) : chat;
};

export const getReplyMessage = (
  chat: IMessageIPFSWithCID,
  selectedChat: IMessageIPFSWithCID[]
): IMessageIPFSWithCID | null => {
  const isReplyMessage = chat.messageType === MessageType.REPLY;
  const replyMessage = selectedChat.find(
    (message) =>
      // @ts-expect-error
      (message as IMessageIPFSWithCID).cid === chat.messageObj?.reference
  );
  return isReplyMessage ? transformReplyToMessage(replyMessage!) : null;
};
