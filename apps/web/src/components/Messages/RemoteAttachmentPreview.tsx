import { Spinner } from '@components/UI/Spinner';
import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import type { Profile } from 'lens';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAttachmentCacheStore, useAttachmentStore } from 'src/store/attachment';
import type { Attachment, RemoteAttachment } from 'xmtp-content-type-remote-attachment';
import { RemoteAttachmentCodec } from 'xmtp-content-type-remote-attachment';

import AttachmentView from './AttachmentView';

type RemoteAttachmentPreviewProps = {
  remoteAttachment: RemoteAttachment;
  profile: Profile | undefined;
  sentByMe: boolean;
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

const RemoteAttachmentPreview = ({
  remoteAttachment,
  profile,
  sentByMe
}: RemoteAttachmentPreviewProps): JSX.Element => {
  const [status, setStatus] = useState<Status>('unloaded');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const { client } = useXmtpClient();
  const loadedAttachmentURLs = useAttachmentStore((state) => state.loadedAttachmentURLs);
  const addLoadedAttachmentURL = useAttachmentStore((state) => state.addLoadedAttachmentURL);
  const cachedAttachments = useAttachmentCacheStore((state) => state.cachedAttachments);
  const cacheAttachment = useAttachmentCacheStore((state) => state.cacheAttachment);

  const redactionReason = useMemo<string | null>(() => {
    const cached = cachedAttachments.get(remoteAttachment.url);

    // We've already got it, no need to show loading
    if (cached) {
      return null;
    }

    if (profile && !profile.isFollowedByMe && !sentByMe) {
      return 'Attachments are not loaded automatically from people you don’t follow.';
    }

    // if it's bigger than 100 megabytes
    if (remoteAttachment.contentLength > 104857600 && !sentByMe) {
      return 'Large attachments are not loaded automatically.';
    }

    return null;
  }, [profile, sentByMe, cachedAttachments, remoteAttachment]);

  const load = useCallback(
    async function () {
      const cachedAttachment = cachedAttachments.get(remoteAttachment.url);

      if (cachedAttachment) {
        setAttachment(cachedAttachment);
        setStatus('loaded');
        return;
      }

      setStatus('loading');

      if (!client) {
        return;
      }

      const attachment: Attachment = await RemoteAttachmentCodec.load(remoteAttachment, client);

      setAttachment(attachment);
      setStatus('loaded');

      cacheAttachment(remoteAttachment.url, attachment);
      addLoadedAttachmentURL(remoteAttachment.url);
    },
    [client, remoteAttachment, addLoadedAttachmentURL, cachedAttachments, cacheAttachment]
  );

  useEffect(() => {
    async function loadInitial() {
      if (!redactionReason) {
        await load();
      }
    }

    loadInitial();
  }, [load, client, remoteAttachment, loadedAttachmentURLs, profile, cachedAttachments, redactionReason]);

  return (
    <div className="mt-1 space-y-1">
      {attachment && <AttachmentView attachment={attachment} />}
      {status === 'loading' && <Spinner className="h-48 w-48" />}
      {status === 'unloaded' && (
        <div className="space-y-2 text-sm">
          <p>
            {remoteAttachment.filename} - {humanFileSize(remoteAttachment.contentLength)}
          </p>
          <p className="text-gray-500">{redactionReason}</p>
          <button className="text-brand-700 inline-block text-xs" onClick={load}>
            View
          </button>
        </div>
      )}
    </div>
  );
};

export default RemoteAttachmentPreview;
