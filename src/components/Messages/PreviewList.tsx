import Preview from '@components/Messages/Preview';
import Following from '@components/Profile/Following';
import Search from '@components/Shared/Navbar/Search';
import { Card } from '@components/UI/Card';
import { GridItemFour } from '@components/UI/GridLayout';
import { Modal } from '@components/UI/Modal';
import { PageLoading } from '@components/UI/PageLoading';
import useMessagePreviews from '@components/utils/hooks/useMessagePreviews';
import type { Profile } from '@generated/types';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { MailIcon } from '@heroicons/react/outline';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey } from '@lib/conversationKey';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const PreviewList: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { loading, messages, profiles, profilesError } = useMessagePreviews();
  const router = useRouter();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  if (!currentProfile) {
    return <Custom404 />;
  }

  if (profilesError) {
    return <Custom500 />;
  }

  const showLoading = loading && (messages.size === 0 || profiles.size === 0);

  const sortedProfiles = Array.from(profiles).sort(([keyA], [keyB]) => {
    const messageA = messages.get(keyA);
    const messageB = messages.get(keyB);
    return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0) ? -1 : 1;
  });

  const newMessageClick = () => {
    setShowSearchModal(true);
  };

  const onProfileSelected = (profile: Profile) => {
    const conversationId = buildConversationId(currentProfile.id, profile.id);
    const conversationKey = buildConversationKey(profile.ownedBy, conversationId);
    messageProfiles.set(conversationKey, profile);
    setMessageProfiles(new Map(messageProfiles));
    router.push(`/messages/${conversationKey}`);
    setShowSearchModal(false);
  };

  return (
    <GridItemFour className="sm:h-[76vh] md:h-[80vh] xl:h-[84vh]  ">
      <Card className="h-full">
        <div className="flex justify-between items-center p-5 border-b">
          <div className="font-bold">Messages</div>
          <button onClick={newMessageClick} type="button">
            <PlusCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-2">
          {showLoading ? (
            <PageLoading message="Loading conversations" />
          ) : (
            sortedProfiles.map(([key, profile]) => {
              const message = messages.get(key);
              if (!message) {
                return null;
              }

              return <Preview key={key} profile={profile} conversationKey={key} message={message} />;
            })
          )}
        </div>
      </Card>
      <Modal
        title="New message"
        icon={<MailIcon className="w-5 h-5 text-brand" />}
        size="sm"
        show={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      >
        <div className="pb-2">
          <div className="w-full pt-4 px-4">
            <Search placeholder="Search for someone to message..." onProfileSelected={onProfileSelected} />
          </div>
          <Following profile={currentProfile} onProfileSelected={onProfileSelected} />
        </div>
      </Modal>
    </GridItemFour>
  );
};

export default PreviewList;
