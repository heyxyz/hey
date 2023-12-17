import type { IMessageIPFS, IMessageIPFSWithCID } from '@pushprotocol/restapi';

import { Image } from '@hey/ui';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import Link from 'next/link';
import { type FC } from 'react';

interface AttachmentProps {
  message: IMessageIPFS | IMessageIPFSWithCID;
}

const isImage = (messageType: string): boolean =>
  messageType === MessageType.IMAGE;

const isFile = (messageType: string): boolean =>
  messageType === MessageType.FILE;

const handleFile = (base64Str: string, filename: string, type: string) => {
  const file = new File(
    [Uint8Array.from(atob(base64Str), (m) => m.codePointAt(0) || 0)],
    filename,
    { type }
  );
  return { name: file.name, size: file.size };
};

const Attachment: FC<AttachmentProps> = ({ message }) => {
  const objectURL = atob(message.messageContent);

  if (isImage(message.messageType)) {
    return (
      <Image
        alt="Image"
        className="max-h-48 rounded object-contain"
        src={objectURL}
      />
    );
  }

  if (isFile(message.messageType)) {
    const fileData = handleFile(objectURL, 'attachment', '');
    return (
      <div>
        <p>Attachment ({fileData.size} bytes)</p>
        <Link href={objectURL} rel="noreferrer noopener" target="_blank">
          Download
        </Link>
      </div>
    );
  }

  return (
    <Link href={objectURL} rel="noreferrer noopener" target="_blank">
      Download
    </Link>
  );
};

export default Attachment;
