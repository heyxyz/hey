import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import useWindowSize from '@components/utils/hooks/useWindowSize';
import { ArrowRightIcon, PhotographIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import type { ContentTypeId } from '@xmtp/xmtp-js';
import { ContentTypeText } from '@xmtp/xmtp-js';
import { MIN_WIDTH_DESKTOP } from 'data/constants';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAttachmentCacheStore, useAttachmentStore } from 'src/store/attachment';
import { useMessagePersistStore } from 'src/store/message';
import { MESSAGES } from 'src/tracking';
import { Button } from 'ui';
import type { Attachment, RemoteAttachment } from 'xmtp-content-type-remote-attachment';
import {
  AttachmentCodec,
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec
} from 'xmtp-content-type-remote-attachment';

import AttachmentView from './AttachmentView';

interface ComposerProps {
  sendMessage: (content: any, contentType: ContentTypeId) => Promise<boolean>;
  conversationKey: string;
  disabledInput: boolean;
}

const AttachmentComposerPreview = ({
  onDismiss,
  attachment
}: {
  onDismiss: () => void;
  attachment: Attachment;
}): JSX.Element => {
  return (
    <div className="relative ml-12 inline-block rounded pt-6">
      <Button className="absolute top-4 right-4" size="sm" onClick={onDismiss}>
        Remove
      </Button>
      <AttachmentView attachment={attachment} />
    </div>
  );
};

const Composer: FC<ComposerProps> = ({ sendMessage, conversationKey, disabledInput }) => {
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const { width } = useWindowSize();
  const unsentMessage = useMessagePersistStore((state) => state.unsentMessages.get(conversationKey));
  const setUnsentMessage = useMessagePersistStore((state) => state.setUnsentMessage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addLoadedAttachmentURL = useAttachmentStore((state) => state.addLoadedAttachmentURL);
  const cacheAttachment = useAttachmentCacheStore((state) => state.cacheAttachment);

  const canSendMessage = !disabledInput && !sending && (message.length > 0 || attachment);

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    setSending(true);

    var sent: boolean;
    if (attachment) {
      const encryptedEncodedContent = await RemoteAttachmentCodec.encodeEncrypted(
        attachment,
        new AttachmentCodec()
      );

      const file = new File([encryptedEncodedContent.payload], 'XMTPEncryptedContent', {
        type: attachment.mimeType
      });

      const lensterAttachment = await uploadFileToIPFS(file);
      const cid = lensterAttachment?.item.replace('ipfs://', '');
      const url = `https://${cid}.ipfs.w3s.link`;

      const remoteAttachment: RemoteAttachment = {
        url: url,
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

      sent = await sendMessage(remoteAttachment, ContentTypeRemoteAttachment);
    } else {
      sent = await sendMessage(message, ContentTypeText);
    }
    if (sent) {
      setAttachment(null);
      setMessage('');
      setUnsentMessage(conversationKey, null);
      Mixpanel.track(MESSAGES.SEND);
    } else {
      toast.error(t`Error sending message`);
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

        const attachment: Attachment = {
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

  function onDismiss() {
    setAttachment(null);

    const el = fileInputRef?.current;
    if (el) {
      el.value = '';
    }
  }

  return (
    <div className="bg-brand-100/75">
      {attachment && <AttachmentComposerPreview onDismiss={onDismiss} attachment={attachment} />}
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
          disabled={disabledInput || attachment != null}
          onKeyDown={handleKeyDown}
          onChange={(event) => onChangeCallback(event.target.value)}
        />
        <Button disabled={!canSendMessage} onClick={handleSend} variant="primary" aria-label="Send message">
          <div className="flex items-center space-x-2">
            {Number(width) > MIN_WIDTH_DESKTOP ? (
              <span>
                <Trans>Send</Trans>
              </span>
            ) : null}
            {!sending && <ArrowRightIcon className="h-5 w-5" />}
            {sending && <Spinner size="sm" className="h-5 w-5" />}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Composer;
