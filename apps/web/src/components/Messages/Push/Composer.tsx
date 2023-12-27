import type { IGif } from '@hey/types/giphy';
import type { NewAttachment } from '@hey/types/misc';
import type { FC } from 'react';

import FileUpload from '@components/Composer/Actions/Attachment';
import Gif from '@components/Composer/Actions/Gif';
import NewAttachments from '@components/Composer/NewAttachments';
import EmojiPicker from '@components/Shared/EmojiPicker';
import { Button, Input } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { useState } from 'react';
import usePushHooks from 'src/hooks/messaging/push/usePush';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import ReplyMessagePreview from './ReplyMessagePreview';

const Composer: FC<> = () => {
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const attachments = usePublicationStore((state) => state.attachments);
  const addAttachments = usePublicationStore((state) => state.addAttachments);
  const { useSendMessage } = usePushHooks();
  const { replyToMessage } = usePushChatStore();
  const { setRecipientChat } = usePushChatStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { handleUploadAttachments } = useUploadAttachments();

  const { mutateAsync: sendMessage } = useSendMessage();

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

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    setSending(true);

    const x = await handleUploadAttachments(attachments);
    console.log(x);

    const messageType = isURL(message)
      ? MessageType.MEDIA_EMBED
      : MessageType.TEXT;

    const reference = replyToMessage?.link ?? undefined;

    const sentMessage = await sendMessage({
      content: message,
      reference: reference,
      type: messageType
    });

    setRecipientChat({
      ...sentMessage,
      messageContent: message
    });

    setMessage('');

    // if (attachment) {
    //   await sendMessage(
    //     attachment.mime.startsWith('image/')
    //       ? MessageType.IMAGE
    //       : MessageType.FILE,
    //     attachment.content
    //   );
    //   setAttachment(null);
    //   setMessage('');
    // }
    const messageList = document.getElementById('messages-list');
    messageList?.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: messageList.scrollHeight
    });

    setSending(false);
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
      {attachments.length > 0 && !sending ? (
        <div className="mx-3 !max-w-[340px]">
          <NewAttachments attachments={attachments} />
        </div>
      ) : null}
      <div>
        <ReplyMessagePreview />
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
          disabled={!canSendMessage}
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
