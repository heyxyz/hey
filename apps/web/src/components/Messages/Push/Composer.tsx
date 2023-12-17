import type { ChangeEvent, FC } from 'react';

import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Card, Image, Input } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import type Attachment from './Attachment';

interface ComposerProps {
  disabledInput: boolean;
  listRef: React.RefObject<HTMLDivElement>;
  sendMessage: (messageType: MessageType, content: string) => Promise<void>;
}

interface Attachment {
  content: string;
  mime: string;
  name: string;
  size: number;
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  dismissDisabled: boolean;
  onDismiss: () => void;
}

const AttachmentPreview: FC<AttachmentPreviewProps> = ({
  attachment,
  dismissDisabled,
  onDismiss
}) => {
  const formatBytes = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let bytes = size;
    let i;
    for (i = 0; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024;
    }
    return bytes.toFixed(2) + ' ' + units[i];
  };

  return (
    <div className="relative ml-12 inline-block rounded pt-6">
      <button
        className="absolute top-2 rounded-full bg-gray-900 p-1.5 opacity-75"
        disabled={dismissDisabled}
        onClick={onDismiss}
        type="button"
      >
        <XMarkIcon className="h-4 w-4 text-white" />
      </button>

      {attachment.mime.startsWith('image/') ? (
        <Image
          alt="Image"
          className="max-h-48 rounded object-contain"
          src={attachment.content}
        />
      ) : (
        <Card className="p-2">
          <p>
            {attachment.name} ({formatBytes(attachment.size)})
          </p>
        </Card>
      )}
    </div>
  );
};

const Composer: FC<ComposerProps> = ({
  disabledInput,
  listRef,
  sendMessage
}) => {
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSendMessage = !disabledInput && (attachment || message.length > 0);

  const onDismiss = () => {
    setAttachment(null);

    const el = fileInputRef.current;
    if (el) {
      el.value = '';
    }
  };

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    setSending(true);

    if (message.length > 0) {
      await sendMessage(MessageType.TEXT, message);
      setMessage('');
    }

    if (attachment) {
      await sendMessage(
        attachment.mime.startsWith('image/')
          ? MessageType.IMAGE
          : MessageType.FILE,
        attachment.content
      );
      setAttachment(null);
      setMessage('');
    }

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

  const file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = (error) => reject(error);
    });
  };

  const onAttachmentChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const fileEncoded = await file2Base64(file);

      // Push Protocol limit nothing we can do about it
      if (file.size > 1024 * 1024) {
        return toast.error('File size exceeds 1024KB');
      }
      setAttachment({
        content: fileEncoded,
        mime: file.type,
        name: file.name,
        size: file.size
      });
    } else {
      setAttachment(null);
    }
  };

  return (
    <div className="border-t dark:border-gray-700">
      {attachment && !sending ? (
        <AttachmentPreview
          attachment={attachment}
          dismissDisabled={!canSendMessage}
          onDismiss={onDismiss}
        />
      ) : null}
      <div className="flex space-x-4 p-4">
        <label className="flex cursor-pointer items-center">
          <PhotoIcon className="text-brand-500 h-6 w-5" />
          <input
            accept="*"
            className="hidden w-full"
            onChange={onAttachmentChange}
            ref={fileInputRef}
            type="file"
          />
        </label>
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
