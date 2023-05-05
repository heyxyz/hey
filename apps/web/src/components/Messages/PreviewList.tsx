import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import { MESSAGING_PROVIDER } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';
import { useXmtpMessagePersistStore } from 'src/store/xmtp-message';
import { Card, GridItemFour } from 'ui';

import PUSHPreviewList from './Push/PUSHPreview';
import XMTPPreviewList from './Xmtp/XMTPPreview';

interface PreviewListProps {
  className?: string;
  selectedConversationKey?: string;
}

const PreviewList: FC<PreviewListProps> = ({ className, selectedConversationKey }) => {
  const router = useRouter();

  const chatProvider = useMessageStore((state) => state.chatProvider);
  const setChatProvider = useMessageStore((state) => state.setChatProvider);

  const currentProfile = useAppStore((state) => state.currentProfile);
  const clearMessagesBadge = useXmtpMessagePersistStore((state) => state.clearMessagesBadge);

  const changeChatProvider = useCallback(
    (provider: string) => {
      setChatProvider(provider);
      const currentPath = router.pathname; // get the current path
      let newPath = `/messages/${provider}`; // set the new path based on the provider

      // check if the current path already contains the provider
      if (currentPath.includes(provider)) {
        newPath = currentPath; // set the new path to the current path if it already contains the provider
      }

      router.push(newPath); // update the URL with the new path
    },
    [router, setChatProvider]
  );

  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    clearMessagesBadge(currentProfile.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return (
    <GridItemFour
      className={clsx(
        'xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-4 md:h-[80vh] xl:h-[84vh]',
        className
      )}
    >
      <Card className="mb-6 flex justify-between font-bold">
        <div
          onClick={() => changeChatProvider(MESSAGING_PROVIDER.PUSH)}
          className={`flex basis-1/2 cursor-pointer items-center justify-center rounded-l-xl py-2.5 transition-all hover:bg-gray-200 ${
            chatProvider === MESSAGING_PROVIDER.PUSH && 'bg-gray-100'
          }`}
        >
          <img width={16} height={16} className="mx-1" src="/push.svg" alt="push" draggable={false} />
          <Trans>{MESSAGING_PROVIDER.PUSH.toUpperCase()}</Trans>
        </div>
        <div
          onClick={() => changeChatProvider(MESSAGING_PROVIDER.XMTP)}
          className={`flex basis-1/2 cursor-pointer items-center justify-center rounded-r-xl py-2.5 transition-all hover:bg-gray-200 ${
            chatProvider === MESSAGING_PROVIDER.XMTP && 'bg-gray-100'
          }`}
        >
          <img width={20} height={20} className="mx-1" src="/xmtp.svg" alt="xmtp" draggable={false} />
          <Trans>{MESSAGING_PROVIDER.XMTP.toUpperCase()}</Trans>
        </div>
      </Card>

      <div className="flex h-[91.8%] flex-col justify-between">
        {chatProvider === MESSAGING_PROVIDER.XMTP ? (
          <XMTPPreviewList selectedConversationKey={selectedConversationKey} />
        ) : (
          <PUSHPreviewList />
        )}
      </div>
    </GridItemFour>
  );
};

export default PreviewList;
