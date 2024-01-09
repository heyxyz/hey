import type { PushTabs } from 'src/store/persisted/usePushChatStore';

import Search from '@components/Shared/Navbar/Search';
import formatAddress from '@hey/lib/formatAddress';
import getAvatar from '@hey/lib/getAvatar';
import { Card, Image } from '@hey/ui';
import * as Tabs from '@radix-ui/react-tabs';
import clsx from 'clsx';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import PUSHPreviewChats from './ChatsTabs';
import PUSHPreviewRequests from './RequestsTab';

const ChatTabs = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const activeTab = usePushChatStore((state) => state.activeTab);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);

  const getTabClassName = (tabName: PushTabs) =>
    clsx(
      'w-full cursor-pointer border-b-4 pb-3.5 text-center font-bold relative',
      {
        'border-b-brand-500': activeTab === tabName,
        'border-b-transparent text-gray-500': activeTab !== tabName
      }
    );

  return (
    <Card className="mb-4 h-full p-4">
      <Tabs.Root
        className="flex h-full flex-col"
        defaultValue={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as PushTabs);
        }}
      >
        <div className="flex gap-x-5">
          <Tabs.List className="flex w-full gap-x-5">
            <Tabs.Trigger className={getTabClassName('CHATS')} value="CHATS">
              Chats
            </Tabs.Trigger>

            <Tabs.Trigger
              className={getTabClassName('REQUESTS')}
              value="REQUESTS"
            >
              Requests
              <div className=" bg-brand-500 absolute right-0 top-0 flex h-5 w-7 justify-center rounded-full text-sm text-white">
                {Object.keys(requestsFeed).length}
              </div>
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <div className="my-4 flex">
          <Search />
        </div>

        <Tabs.Content className="h-full" value="CHATS">
          <PUSHPreviewChats />
        </Tabs.Content>

        <Tabs.Content className="h-full" value="REQUESTS">
          <PUSHPreviewRequests />
        </Tabs.Content>

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
              <p className="text-base">@{currentProfile?.handle?.localName}</p>
              <p className="text-sm text-gray-500">
                {formatAddress(currentProfile?.ownedBy?.address)}
              </p>
            </div>
          </div>
        </div>
      </Tabs.Root>
    </Card>
  );
};

export default ChatTabs;
