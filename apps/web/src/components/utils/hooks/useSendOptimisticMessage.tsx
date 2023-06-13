import { parseConversationKey } from '@lib/conversationKey';
import type {
  ContentTypeId,
  Conversation,
  DecodedMessage
} from '@xmtp/xmtp-js';
import { useEffect, useRef, useState } from 'react';
import { useMessageStore } from 'src/store/message';
import { v4 as uuid } from 'uuid';
import type { RemoteAttachment } from 'xmtp-content-type-remote-attachment';

type ResolveReject<T = void> = (value: T | PromiseLike<T>) => void;

/**
 * This is a helper function for creating a new promise and getting access
 * to the resolve and reject callbacks for external use.
 */
function makePromise<T = void>() {
  let reject: ResolveReject<T> = () => {};
  let resolve: ResolveReject<T> = () => {};
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return {
    promise,
    reject,
    resolve
  };
}

export type PreparedMessage = Awaited<
  ReturnType<Conversation['prepareMessage']>
>;

export type SendMessageOptions = {
  fallback?: string;
  id?: string;
  preparedMessage?: PreparedMessage;
  renderPreview?: React.ReactNode;
};

export type PendingMessage = {
  status: 'pending';
  id: string;
  content?: any;
  contentType: ContentTypeId;
  error?: Error;
  options?: SendMessageOptions;
  sent: Date;
  senderAddress: string;
  render?: React.ReactNode;
};

export type FailedMessage = Omit<PendingMessage, 'status'> & {
  status: 'failed';
  retry: () => Promise<void>;
  cancel: () => void;
};

export type MessageQueue = (PendingMessage | FailedMessage)[];
export type PendingQueueItem = {
  message: PendingMessage;
  resolve: (value: boolean) => void;
};

export type AllowedContent = string | RemoteAttachment;

export type SendMessageContent<T extends AllowedContent = string> =
  T extends string ? T : () => Promise<T>;

export const isQueuedMessage = (
  message: DecodedMessage | PendingMessage | FailedMessage
): message is PendingMessage | FailedMessage => {
  return 'status' in message;
};

export type UseSendOptimisticMessageOptions = {
  onCancel?: (id: string) => void;
  onQueue?: (message: PendingMessage | FailedMessage) => void;
  onUpdate?: (id: string, message: PendingMessage | FailedMessage) => void;
};

const useSendOptimisticMessage = (
  conversationKey: string,
  options?: UseSendOptimisticMessageOptions
) => {
  const client = useMessageStore((state) => state.client);
  const conversations = useMessageStore((state) => state.conversations);
  const addConversation = useMessageStore((state) => state.addConversation);
  const [missingXmtpAuth, setMissingXmtpAuth] = useState<boolean>(false);
  const pendingMessages = useRef<PendingQueueItem[]>([]);
  const sendingRef = useRef<boolean>(false);

  const sendMessage = async <T extends AllowedContent = string>(
    content: SendMessageContent<T>,
    contentType: ContentTypeId,
    sendOptions?: SendMessageOptions
  ): Promise<boolean> => {
    if (!client || !conversationKey) {
      return false;
    }

    let conversation;

    if (!missingXmtpAuth && !conversations.has(conversationKey)) {
      const conversationId = conversationKey?.split('/')[0];

      const conversationXmtpId =
        parseConversationKey(conversationKey)?.conversationId ?? '';

      conversation =
        conversationXmtpId !== ''
          ? await client.conversations.newConversation(conversationId, {
              conversationId: conversationXmtpId,
              metadata: {}
            })
          : await client.conversations.newConversation(conversationId);

      addConversation(conversationKey, conversation);
    } else {
      conversation = conversations.get(conversationKey);
    }

    if (!conversation) {
      return false;
    }

    // temporary sent date, will display while sending
    const sent = new Date();
    const senderAddress = conversation.clientAddress;

    let prepared: PreparedMessage;

    // allow for passing in an ID if one has been generated previously
    const originalId = sendOptions?.id ?? uuid();
    let id = originalId;

    // add message to queue as pending
    const msg = {
      status: 'pending',
      id,
      content: typeof content === 'string' ? content : undefined,
      contentType,
      options: sendOptions,
      sent,
      senderAddress,
      render: sendOptions?.renderPreview
    } satisfies PendingMessage;
    options?.onQueue?.(msg);

    // if busy sending a message, add to queue to be processed afterwards
    // in order to preserve order
    if (sendingRef.current) {
      const { promise, resolve } = makePromise<boolean>();
      pendingMessages.current.push({ message: msg, resolve });
      return promise;
    }

    sendingRef.current = true;

    // if message hasn't been prepared yet, prepare it
    if (!sendOptions?.preparedMessage) {
      const preparedContent =
        typeof content === 'string' ? content : await content();

      // prepare message to be sent
      prepared = await conversation.prepareMessage(preparedContent, {
        contentType,
        contentFallback: sendOptions?.fallback
      });
    } else {
      // message is already prepared, use existing
      prepared = sendOptions.preparedMessage;
    }

    // get official XMTP message ID
    id = await prepared.messageID();

    // replace generated pending message ID with official one
    // this allows for a better render transition from "pending" to "sent"
    // state as the messages are key'd by ID
    let pendingMessageIndex = -1;
    const pendingMessage = pendingMessages.current.find((m, index) => {
      if (m.message.id === originalId) {
        pendingMessageIndex = index;
        return true;
      }
    });
    if (pendingMessage) {
      pendingMessages.current.splice(pendingMessageIndex, 1, {
        message: {
          ...pendingMessage.message,
          id
        },
        resolve: pendingMessage.resolve
      });
    }

    // update pending message with XMTP ID
    // this callback allows the message ID to be updated externally
    options?.onUpdate?.(originalId, {
      ...msg,
      id
    });

    try {
      // send prepared message
      await prepared.send();
    } catch (error) {
      console.error('Failed to send message', error);

      // update message externally
      options?.onUpdate?.(id, {
        status: 'failed',
        id,
        content,
        contentType,
        sent,
        senderAddress,
        options: sendOptions,
        cancel: () => {
          // remove failed message from queue
          options?.onCancel?.(id);
        },
        retry: async () => {
          // re-send failed message
          await sendMessage(content, contentType, {
            ...options,
            id,
            preparedMessage: prepared
          });
        }
      });

      return false;
    } finally {
      sendingRef.current = false;
      if (pendingMessages.current.length > 0) {
        const pending = pendingMessages.current.shift() as PendingQueueItem;
        // send the next message in the pending queue
        pending.resolve(
          await sendMessage(
            pending.message.content,
            pending.message.contentType,
            {
              ...pending.message.options,
              id: pending.message.id
            }
          )
        );
      }
    }
    return true;
  };

  useEffect(() => {
    const checkUserIsOnXmtp = async () => {
      if (client && !conversations.has(conversationKey)) {
        const conversationId = conversationKey?.split('/')[0];
        const canMessage = await client.canMessage(conversationId);
        setMissingXmtpAuth(!canMessage);

        if (!canMessage || !conversationId) {
          return false;
        }
      }
    };
    checkUserIsOnXmtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey, client]);

  return { sendMessage, missingXmtpAuth };
};

export default useSendOptimisticMessage;
