import type { PushTabs } from 'src/store/persisted/usePushChatStore';

import Search from '@components/Shared/Navbar/Search';
import Slug from '@components/Shared/Slug';
import formatAddress from '@hey/lib/formatAddress';
import getAvatar from '@hey/lib/getAvatar';
import { Card, Image } from '@hey/ui';
import clsx from 'clsx';
// import { PUSH_TABS, usePushChatSocket } from '@pushprotocol/uiweb';
import { useRef } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_TABS,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';

import PUSHPreviewChats from './ChatsTabs';
import PUSHPreviewRequests from './RequestsTab';

const Tabs = () => {
  const containerRef = useRef(null);
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const activeTab = usePushChatStore((state) => state.activeTab);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);

  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const onProfileSelected = (chatId: string) => {};

  const Tab = ({
    activeTab,
    children,
    className,
    setActiveTab,
    tabType
  }: {
    activeTab: PushTabs;
    children: React.ReactNode;
    className?: string;
    setActiveTab: (tabName: PushTabs) => void;
    tabType: PushTabs;
  }) => (
    <div
      className={clsx(
        'w-6/12 cursor-pointer border-b-4 pb-3.5 text-center font-bold',
        {
          'border-b-brand-500': activeTab === tabType,
          'border-b-transparent text-gray-500': activeTab !== tabType
        },
        className
      )}
      onClick={() => setActiveTab(tabType)}
    >
      {children}
    </div>
  );

  return (
    <div className="flex h-full flex-col justify-between" ref={containerRef}>
      <Card className="flex h-full flex-col p-4 pt-7">
        <section className="mb-4">
          <div className="mb-6 flex gap-x-5 border-b border-b-gray-300">
            <div className="flex w-full gap-x-5 border-b-gray-300">
              <Tab
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabType={PUSH_TABS.CHATS}
              >
                <span>Chats</span>
              </Tab>
              <Tab
                activeTab={activeTab}
                className="align-items-center flex justify-center gap-x-1.5"
                setActiveTab={setActiveTab}
                tabType={PUSH_TABS.REQUESTS}
              >
                <span>Requests</span>
                <div className=" bg-brand-500 flex h-5 w-7 justify-center rounded-full text-sm text-white">
                  {Object.keys(requestsFeed).length}
                </div>
              </Tab>
            </div>
          </div>

          <div className="flex gap-x-2">
            <Search />
          </div>
        </section>

        <div className="relative flex-1">
          {activeTab === PUSH_TABS.CHATS ? (
            <PUSHPreviewChats />
          ) : activeTab === PUSH_TABS.REQUESTS ? (
            <PUSHPreviewRequests />
          ) : null}
        </div>

        <div className="flex flex-row items-center border-t-2 border-[#E4E8EF] pt-2">
          <div className="flex flex-row items-center space-x-3">
            <Image
              alt="Profile Picture"
              className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              loading="lazy"
              src={getAvatar(currentProfile)}
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-base">
                {formatAddress(currentProfile?.ownedBy?.address)}
              </p>
              <Slug
                className="text-sm"
                slug={
                  currentProfile?.handle?.suggestedFormatted?.localName ?? ''
                }
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tabs;
