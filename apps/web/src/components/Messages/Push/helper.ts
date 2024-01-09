import type { IMessageIPFSWithCID, MessageObj } from '@pushprotocol/restapi';

import { LENSHUB_PROXY } from '@hey/data/constants';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { CHAIN_ID } from 'src/constants';

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
