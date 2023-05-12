import type { FC } from 'react';
import { Image } from 'ui';
import type { Attachment } from 'xmtp-content-type-remote-attachment';

interface AttachmentViewProps {
  attachment: Attachment;
}

const isImage = (mimeType: string): boolean =>
  ['image/png', 'image/jpeg', 'image/gif'].includes(mimeType);

const contentFor = (attachment: Attachment): JSX.Element => {
  // The attachment.data gets turned into an object when it's serialized
  // via JSON.stringify in the store persistence. This check restores it
  // to the correct type.
  if (!(attachment.data instanceof Uint8Array)) {
    attachment.data = Uint8Array.from(Object.values(attachment.data));
  }

  const objectURL = URL.createObjectURL(
    new Blob([Buffer.from(attachment.data)], {
      type: attachment.mimeType
    })
  );

  if (isImage(attachment.mimeType)) {
    return (
      <Image
        className="max-h-48 rounded object-contain"
        src={objectURL}
        alt={attachment.filename}
      />
    );
  }

  return (
    <a target="_blank" href={objectURL}>
      {attachment.filename}
    </a>
  );
};

const AttachmentView: FC<AttachmentViewProps> = ({ attachment }) =>
  contentFor(attachment);

export default AttachmentView;
