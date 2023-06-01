import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import type { Profile } from '@lenster/lens';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useAttachmentCachePersistStore,
  useAttachmentStore
} from 'src/store/attachment';
import { Spinner } from 'ui';
import type {
  Attachment as TAttachment,
  RemoteAttachment
} from 'xmtp-content-type-remote-attachment';
import { RemoteAttachmentCodec } from 'xmtp-content-type-remote-attachment';

import Attachment from './AttachmentView';

interface RemoteAttachmentPreviewProps {
  remoteAttachment: RemoteAttachment;
  profile: Profile | undefined;
  sentByMe: boolean;
}

enum Status {
  UNLOADED = 'unloaded',
  LOADING = 'loading',
  LOADED = 'loaded'
}

const RemoteAttachmentPreview: FC<RemoteAttachmentPreviewProps> = ({
  remoteAttachment,
  profile,
  sentByMe
}) => {
  const [status, setStatus] = useState<Status>(Status.UNLOADED);
  const [attachment, setAttachment] = useState<TAttachment | null>(null);
  const { client } = useXmtpClient();
  const loadedAttachmentURLs = useAttachmentStore(
    (state) => state.loadedAttachmentURLs
  );
  const addLoadedAttachmentURL = useAttachmentStore(
    (state) => state.addLoadedAttachmentURL
  );
  const cachedAttachments = useAttachmentCachePersistStore(
    (state) => state.cachedAttachments
  );
  const cacheAttachment = useAttachmentCachePersistStore(
    (state) => state.cacheAttachment
  );

  const redactionReason = useMemo<string | null>(() => {
    const cached = cachedAttachments.get(remoteAttachment.url);

    // We've already got it, no need to show loading
    if (cached) {
      return null;
    }

    if (profile && !profile.isFollowedByMe && !sentByMe) {
      return t`Attachments are not loaded automatically from people you don’t follow.`;
    }

    // if it's bigger than 100 megabytes
    if (remoteAttachment.contentLength > 104857600 && !sentByMe) {
      return t`Large attachments are not loaded automatically.`;
    }

    return null;
  }, [profile, sentByMe, cachedAttachments, remoteAttachment]);

  const load = useCallback(
    async function () {
      const cachedAttachment = cachedAttachments.get(remoteAttachment.url);

      if (cachedAttachment) {
        setAttachment(cachedAttachment);
        setStatus(Status.LOADED);
        return;
      }

      setStatus(Status.LOADING);

      if (!client) {
        return;
      }

      const attachment: TAttachment = await RemoteAttachmentCodec.load(
        remoteAttachment,
        client
      );

      setAttachment(attachment);
      setStatus(Status.LOADED);

      cacheAttachment(remoteAttachment.url, attachment);
      addLoadedAttachmentURL(remoteAttachment.url);
    },
    [
      client,
      remoteAttachment,
      addLoadedAttachmentURL,
      cachedAttachments,
      cacheAttachment
    ]
  );

  useEffect(() => {
    async function loadInitial() {
      if (!redactionReason) {
        await load();
      }
    }

    loadInitial();
  }, [
    load,
    client,
    remoteAttachment,
    loadedAttachmentURLs,
    profile,
    cachedAttachments,
    redactionReason
  ]);

  return (
    <div className="mt-1 space-y-1">
      {attachment ? <Attachment attachment={attachment} /> : null}
      {status === Status.LOADING && (
        <Spinner className="mx-28 my-4 h-48 w-48" size="sm" />
      )}
      {status === Status.UNLOADED && (
        <div className="space-y-2 text-sm">
          <p className="text-gray-500">{redactionReason}</p>
          <button
            className="text-brand-700 inline-block text-xs"
            onClick={load}
          >
            View
          </button>
        </div>
      )}
    </div>
  );
};

export default RemoteAttachmentPreview;
