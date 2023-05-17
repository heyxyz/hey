import useWindowSize from '@components/utils/hooks/useWindowSize';
import { ArrowRightIcon, PhotographIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { Mixpanel } from '@lib/mixpanel';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import type { ContentTypeId } from '@xmtp/xmtp-js';
import { ContentTypeText } from '@xmtp/xmtp-js';
import { IPFS_GATEWAY, MIN_WIDTH_DESKTOP } from 'data/constants';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAttachmentCachePersistStore,
  useAttachmentStore
} from 'src/store/attachment';
import { useMessagePersistStore } from 'src/store/message';
import { MESSAGES } from 'src/tracking';
import { Button, Input, Spinner } from 'ui';
import type {
  Attachment as TAttachment,
  RemoteAttachment
} from 'xmtp-content-type-remote-attachment';
import {
  AttachmentCodec,
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec
} from 'xmtp-content-type-remote-attachment';

import Attachment from './AttachmentView';

interface ComposerProps {
  sendMessage: (
    content: string | RemoteAttachment,
    contentType: ContentTypeId,
    fallback?: string
  ) => Promise<boolean>;
  conversationKey: string;
  disabledInput: boolean;
}

interface AttachmentPreviewProps {
  onDismiss: () => void;
  dismissDisabled: boolean;
  attachment: TAttachment;
}

const AttachmentPreview: FC<AttachmentPreviewProps> = ({
  onDismiss,
  dismissDisabled,
  attachment
}) => {
  return (
    <div className="relative ml-12 inline-block rounded pt-6">
      <button
        disabled={dismissDisabled}
        type="button"
        className="absolute top-2 rounded-full bg-gray-900 p-1.5 opacity-75"
        onClick={onDismiss}
      >
        <XIcon className="h-4 w-4 text-white" />
      </button>
      <Attachment attachment={attachment} />
    </div>
  );
};

const Composer: FC<ComposerProps> = ({
  sendMessage,
  conversationKey,
  disabledInput
}) => {
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<TAttachment | null>(null);
  const { width } = useWindowSize();
  const unsentMessage = useMessagePersistStore((state) =>
    state.unsentMessages.get(conversationKey)
  );
  const setUnsentMessage = useMessagePersistStore(
    (state) => state.setUnsentMessage
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addLoadedAttachmentURL = useAttachmentStore(
    (state) => state.addLoadedAttachmentURL
  );
  const cacheAttachment = useAttachmentCachePersistStore(
    (state) => state.cacheAttachment
  );

  const canSendMessage =
    !sending && (attachment || (!disabledInput && message.length > 0));

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    setSending(true);

    if (attachment) {
      const encryptedEncodedContent =
        await RemoteAttachmentCodec.encodeEncrypted(
          attachment,
          new AttachmentCodec()
        );

      const file = new File(
        [encryptedEncodedContent.payload],
        'XMTPEncryptedContent',
        {
          type: attachment.mimeType
        }
      );

      const uploadedAttachment = await uploadFileToIPFS(file);
      const cid = sanitizeDStorageUrl(uploadedAttachment?.original.url);
      const url = `${IPFS_GATEWAY}${cid}`;

      const remoteAttachment: RemoteAttachment = {
        url,
        contentDigest: encryptedEncodedContent.digest,
        salt: encryptedEncodedContent.salt,
        nonce: encryptedEncodedContent.nonce,
        secret: encryptedEncodedContent.secret,
        scheme: 'https://',
        filename: attachment.filename,
        contentLength: attachment.data.byteLength
      };

      // Since we're sending this, we should always load it
      addLoadedAttachmentURL(url);
      cacheAttachment(url, attachment);

      const sentAttachment = await sendMessage(
        remoteAttachment,
        ContentTypeRemoteAttachment,
        `[Attachment] Cannot display "${attachment.filename}". This app does not support attachments yet.`
      );

      if (sentAttachment) {
        setAttachment(null);
        Mixpanel.track(MESSAGES.SEND);
      } else {
        toast.error(t`Error sending attachment`);
      }
    }

    if (message.length > 0) {
      const sentMessage = await sendMessage(message, ContentTypeText);

      if (sentMessage) {
        setMessage('');
        setUnsentMessage(conversationKey, null);
        Mixpanel.track(MESSAGES.SEND);
      } else {
        toast.error(t`Error sending message`);
      }
    }

    setSending(false);
  };

  useEffect(() => {
    setMessage(unsentMessage ?? '');
  }, [unsentMessage]);

  const onChangeCallback = (value: string) => {
    setUnsentMessage(conversationKey, value);
    setMessage(value);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const onAttachmentChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      const fileReader = new FileReader();
      fileReader.addEventListener('load', async function () {
        const data = fileReader.result;

        if (!(data instanceof ArrayBuffer)) {
          return;
        }

        const attachment: TAttachment = {
          filename: file.name,
          mimeType: file.type,
          data: new Uint8Array(data)
        };

        setAttachment(attachment);
      });

      fileReader.readAsArrayBuffer(file);
    } else {
      setAttachment(null);
    }
  };

  const onDismiss = () => {
    setAttachment(null);

    const el = fileInputRef.current;
    if (el) {
      el.value = '';
    }
  };

  return (
    <div className="bg-brand-100/75">
      {attachment ? (
        <AttachmentPreview
          onDismiss={onDismiss}
          dismissDisabled={!canSendMessage}
          attachment={attachment}
        />
      ) : null}
      <div className="flex space-x-4 p-4">
        <label className="flex cursor-pointer items-center">
          <PhotographIcon className="text-brand-900 h-6 w-5" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            className="hidden w-full"
            onChange={onAttachmentChange}
          />
        </label>

        <Input
          type="text"
          placeholder={t`Type Something`}
          value={message}
          disabled={disabledInput}
          onKeyDown={handleKeyDown}
          onChange={(event) => onChangeCallback(event.target.value)}
        />
        <Button
          disabled={!canSendMessage}
          onClick={handleSend}
          variant="primary"
          aria-label="Send message"
        >
          <div className="flex items-center space-x-2">
            {Number(width) > MIN_WIDTH_DESKTOP ? (
              <span>
                <Trans>Send</Trans>
              </span>
            ) : null}
            {sending ? (
              <Spinner size="sm" className="h-5 w-5" />
            ) : (
              <ArrowRightIcon className="h-5 w-5" />
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Composer;
