import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import { useCallback, useEffect, useState } from 'react';
import { useAttachmentStore } from 'src/store/attachment';
import { Button } from 'ui';
import type { Attachment, RemoteAttachment } from 'xmtp-content-type-remote-attachment';
import { RemoteAttachmentCodec } from 'xmtp-content-type-remote-attachment';

import AttachmentView from './AttachmentView';

type RemoteAttachmentPreviewProps = {
  remoteAttachment: RemoteAttachment;
};

function humanFileSize(bytes: number) {
  const thresh = 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let u = -1;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * 10) / 10 >= thresh && u < units.length - 1);

  return bytes.toFixed(1) + ' ' + units[u];
}

type Status = 'unloaded' | 'loading' | 'loaded';

const RemoteAttachmentPreview = ({ remoteAttachment }: RemoteAttachmentPreviewProps): JSX.Element => {
  const [status, setStatus] = useState<Status>('unloaded');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const { client } = useXmtpClient();
  const loadedAttachmentURLs = useAttachmentStore((state) => state.loadedAttachmentURLs);
  const addLoadedAttachmentURL = useAttachmentStore((state) => state.addLoadedAttachmentURL);

  const load = useCallback(
    async function () {
      setStatus('loading');

      if (!client) {
        return;
      }

      const attachment: Attachment = await RemoteAttachmentCodec.load(remoteAttachment, client);

      setAttachment(attachment);
      setStatus('loaded');

      addLoadedAttachmentURL(remoteAttachment.url);
    },
    [client, remoteAttachment, addLoadedAttachmentURL]
  );

  useEffect(() => {
    async function loadInitial() {
      if (loadedAttachmentURLs.includes(remoteAttachment.url)) {
        await load();
      }
    }

    loadInitial();
  }, [load, client, remoteAttachment, loadedAttachmentURLs]);

  return (
    <div className="mt-1 space-y-1">
      {attachment && <AttachmentView attachment={attachment} />}

      <p className="space-x-2">
        <span>
          {remoteAttachment.filename} - {humanFileSize(remoteAttachment.contentLength)}
        </span>

        {status !== 'loaded' && (
          <Button size="sm" onClick={load}>
            {status == 'loading' ? 'Loading…' : 'Load'}
          </Button>
        )}
      </p>
    </div>
  );
};

export default RemoteAttachmentPreview;
