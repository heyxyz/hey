import { Image } from 'ui';
import type { Attachment } from 'xmtp-content-type-remote-attachment';

type AttachmentViewProps = {
  attachment: Attachment;
};

function isImage(mimeType: string): boolean {
  return ['image/png', 'image/jpeg', 'image/gif'].includes(mimeType);
}

function contentFor(attachment: Attachment): JSX.Element {
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
    return <Image className="max-h-48 rounded object-contain" src={objectURL} alt="" />;
  }

  return (
    <a target="_blank" href={objectURL}>
      {attachment.filename}
    </a>
  );
}

const AttachmentView = ({ attachment }: AttachmentViewProps): JSX.Element => {
  return contentFor(attachment);
};

export default AttachmentView;
