import type { IMessageIPFS, IMessageIPFSWithCID } from '@pushprotocol/restapi';

import Oembed from '@components/Shared/Oembed';
import Video from '@components/Shared/Video';
import { ATTACHMENT } from '@hey/data/constants';
import imageKit from '@hey/lib/imageKit';
import { Button, Card, Image, LightBox } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { type FC, useEffect, useState } from 'react';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

interface AttachmentProps {
  message: IMessageIPFS | IMessageIPFSWithCID;
}

const handleFile = (base64Str: string, filename: string, type: string) => {
  const file = new File(
    [Uint8Array.from(atob(base64Str), (m) => m.codePointAt(0) || 0)],
    filename,
    { type }
  );
  return { name: file.name, size: file.size };
};

const Attachment: FC<AttachmentProps> = ({ message }) => {
  const [contentType, setContentType] = useState<null | string>(null);
  const [expandedImage, setExpandedImage] = useState<null | string>(null);
  const mediaEmbedContentTypes = usePushChatStore(
    (state) => state.mediaEmbedContentTypes
  );
  const setMediaEmbedContentType = usePushChatStore(
    (state) => state.setMediaEmbedContentType
  );

  const attachmentURI =
    typeof message.messageObj === 'string'
      ? message.messageObj
      : (message.messageObj?.content as string);

  useEffect(() => {
    if (message.messageType === MessageType.MEDIA_EMBED) {
      if (mediaEmbedContentTypes[attachmentURI]) {
        setContentType(mediaEmbedContentTypes[attachmentURI]);
      } else {
        fetch(attachmentURI, { method: 'HEAD' })
          .then((response) => {
            const contentType = response.headers.get('Content-Type');
            setContentType(contentType);
            setMediaEmbedContentType(attachmentURI, contentType);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  }, [attachmentURI]);

  const renderFile = () => {
    const fileData = handleFile(attachmentURI, 'attachment', '');
    return (
      <Card className="flex flex-col gap-2">
        <p>Attachment ({fileData.size} bytes)</p>
        <Button
          onClick={() => {
            const link = document.createElement('a');
            link.href = attachmentURI;
            link.download = fileData.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download
        </Button>
      </Card>
    );
  };

  const renderImage = () => {
    const uri =
      typeof message.messageObj === 'string'
        ? message.messageObj
        : (message.messageObj?.content as string);
    return (
      <>
        <Image
          alt={imageKit(uri, ATTACHMENT)}
          className="cursor-pointer rounded-lg border bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
          height={1000}
          loading="lazy"
          onClick={() => {
            setExpandedImage(uri);
          }}
          onError={({ currentTarget }) => {
            currentTarget.src = uri;
          }}
          src={imageKit(uri, ATTACHMENT)}
          width={1000}
        />
        <LightBox
          onClose={() => setExpandedImage(null)}
          show={Boolean(expandedImage)}
          url={expandedImage}
        />
      </>
    );
  };

  const renderMedia = () => {
    if (contentType?.startsWith('video/')) {
      return <Video src={attachmentURI} />;
    }
    if (contentType?.startsWith('image/')) {
      return renderImage();
    }
    return (
      <Oembed className="sm:w-full" onData={() => {}} url={attachmentURI} />
    );
  };

  const renderers = {
    [MessageType.FILE]: renderFile,
    [MessageType.IMAGE]: renderImage,
    [MessageType.MEDIA_EMBED]: renderMedia
  } as { [key in MessageType]?: () => JSX.Element };

  const renderContent = renderers[message.messageType as MessageType];

  return renderContent ? (
    <div className="max-w-[280px]">{renderContent()}</div>
  ) : null;
};

export default Attachment;
