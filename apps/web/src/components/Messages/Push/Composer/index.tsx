import type { IGif } from '@hey/types/giphy';
import type { NewAttachment } from '@hey/types/misc';
import type { Message } from '@pushprotocol/restapi';
import type { FC } from 'react';

import FileUpload from '@components/Composer/Actions/Attachment';
import Gif from '@components/Composer/Actions/Gif';
import NewAttachments from '@components/Composer/NewAttachments';
import EmojiPicker from '@components/Shared/EmojiPicker';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import { Button, Input } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { useState } from 'react';
import toast from 'react-hot-toast';
import usePushHooks from 'src/hooks/messaging/push/usePush';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import { computeSendPayload, createTemporaryMessage } from '../helper';
import ReplyPreview from './ReplyPreview';

const Composer: FC = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const { decryptConversation, useSendMessage } = usePushHooks();
  const { mutateAsync: sendMessage } = useSendMessage();

  const currentProfile = useProfileStore((state) => state.currentProfile);
  const attachments = usePublicationAttachmentStore(
    (state) => state.attachments
  );
  const addAttachments = usePublicationAttachmentStore(
    (state) => state.addAttachments
  );
  const removeAttachments = usePublicationAttachmentStore(
    (state) => state.removeAttachments
  );
  const isUploading = usePublicationAttachmentStore(
    (state) => state.isUploading
  );
  const replyToMessage = usePushChatStore((state) => state.replyToMessage);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const setReplyToMessage = usePushChatStore(
    (state) => state.setReplyToMessage
  );

  const canSendMessage = attachments.length > 0 || message.length > 0;

  const isURL = (input: string) => {
    let url;
    try {
      url = new URL(input);
    } catch (error) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  };

  const sendMessageAndHandleResponse = async (messageContent: Message) => {
    try {
      const tempMessage = createTemporaryMessage(
        messageContent,
        currentProfile?.id!
      );
      setRecipientChat([tempMessage]);
      setReplyToMessage(null);

      const sentMessage = await sendMessage(messageContent);
      const decryptedMessage = await decryptConversation(sentMessage);
      setRecipientChat([decryptedMessage], tempMessage.cid);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }

    const reference = replyToMessage?.cid ?? null;

    if (attachments.length > 0) {
      for (const attachment of attachments) {
        const sanitizedUrl = sanitizeDStorageUrl(attachment.uri);
        const messageContent = computeSendPayload({
          content: {
            content: sanitizedUrl,
            type: MessageType.MEDIA_EMBED
          },
          ...(reference !== null && {
            reference: reference,
            type: MessageType.REPLY
          })
        });
        removeAttachments([attachment!.id!]);
        await sendMessageAndHandleResponse(messageContent);
      }
    }

    const messageType = isURL(message)
      ? MessageType.MEDIA_EMBED
      : MessageType.TEXT;

    const messageContent = computeSendPayload({
      content: { content: message, type: messageType },
      ...(reference !== null && {
        reference: reference,
        type: MessageType.REPLY
      })
    });
    setMessage('');
    await sendMessageAndHandleResponse(messageContent);
  };

  const onChangeCallback = (value: string) => {
    setMessage(value);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment: NewAttachment = {
      mimeType: 'image/gif',
      previewUri: gif.images.original.url,
      type: 'Image',
      uri: gif.images.original.url
    };
    addAttachments([attachment]);
  };

  const setEmoji = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  return (
    <div className=" w-full border-t bg-gray-100 dark:border-gray-700">
      {attachments.length > 0 ? (
        <div className="mx-3 !max-w-[340px]">
          <NewAttachments attachments={attachments} />
        </div>
      ) : null}
      <div>
        <ReplyPreview />
      </div>
      <div className="flex space-x-4 p-4">
        <div className="flex items-center space-x-4">
          <FileUpload />
          <Gif setGifAttachment={setGifAttachment} />
          <EmojiPicker
            emojiClassName="text-brand-500"
            setEmoji={setEmoji}
            setShowEmojiPicker={setShowEmojiPicker}
            showEmojiPicker={showEmojiPicker}
          />
        </div>

        <Input
          onChange={(event) => onChangeCallback(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={'Type Something'}
          type="text"
          value={message}
        />
        <Button
          aria-label="Send message"
          disabled={!canSendMessage || isUploading}
          onClick={handleSend}
          variant="primary"
        >
          <div className="flex items-center space-x-2">
            <span>Send</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Composer;
