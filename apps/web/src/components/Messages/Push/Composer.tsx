import type { IGif } from '@hey/types/giphy';
import type { NewAttachment } from '@hey/types/misc';
import type { FC } from 'react';

import FileUpload from '@components/Composer/Actions/Attachment';
import Gif from '@components/Composer/Actions/Gif';
import NewAttachments from '@components/Composer/NewAttachments';
import EmojiPicker from '@components/Shared/EmojiPicker';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Card, Input } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { useState } from 'react';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import Attachment from './Attachment';

const ReplyMessage = () => {
  const { replyToMessage, setReplyToMessage } = usePushChatStore();
  const { recipientProfile } = usePushChatStore();
  return replyToMessage ? (
    <div className="flex items-center justify-between p-2">
      <Card className="relative flex w-full flex-row items-center justify-between overflow-hidden p-2">
        <div className="bg-brand-500 absolute left-0 top-0 h-full w-[6px]" />
        <div className="ml-2 flex flex-col justify-center">
          <span className="text-brand-500 font-md text-md">
            {recipientProfile?.handle?.localName}
          </span>
          <div className="flex items-center">
            <PhotoIcon className="text-brand-500 h-4 w-4" />
            <span className="ml-1">{replyToMessage.messageType}</span>
          </div>
        </div>
        {replyToMessage.messageType === MessageType.TEXT ? (
          <p>{replyToMessage.messageContent}</p>
        ) : (
          <div className="w-[160px]">
            <Attachment message={replyToMessage} />
          </div>
        )}
      </Card>
      <button
        className="ml-2 rounded-full bg-gray-900 p-1.5 opacity-75"
        onClick={() => setReplyToMessage(null)}
        type="button"
      >
        <XMarkIcon className=" h-4 w-4 text-white" />
      </button>
    </div>
  ) : null;
};

interface ComposerProps {
  disabledInput: boolean;
  listRef: React.RefObject<HTMLDivElement>;
  sendMessage: (
    messageType: MessageType,
    content: string,
    reference?: string
  ) => Promise<void>;
}

const Composer: FC<ComposerProps> = ({
  disabledInput,
  listRef,
  sendMessage
}) => {
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const attachments = usePublicationStore((state) => state.attachments);
  const addAttachments = usePublicationStore((state) => state.addAttachments);
  const { replyToMessage } = usePushChatStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const { handleUploadAttachments } = useUploadAttachments();

  const canSendMessage =
    !disabledInput && (attachments.length > 0 || message.length > 0);

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

    if (message.length > 0) {
      const messageType = isURL(message)
        ? MessageType.MEDIA_EMBED
        : MessageType.TEXT;
      await sendMessage(
        messageType,
        message,
        replyToMessage?.link ?? undefined
      );
      setMessage('');
    }

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

    listRef.current?.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: listRef.current.scrollHeight
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
    setShowEmojiPicker(false);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full border-t bg-gray-100 dark:border-gray-700">
      {attachments.length > 0 && !sending ? (
        <div className="mx-3 !max-w-[340px]">
          <NewAttachments attachments={attachments} />
        </div>
      ) : null}
      <div>
        <ReplyMessage />
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
          disabled={disabledInput}
          onChange={(event) => onChangeCallback(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Type Something`}
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
