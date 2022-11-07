import Preview from '@components/Messages/Preview';
import Following from '@components/Profile/Following';
import Search from '@components/Shared/Navbar/Search';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { GridItemFour } from '@components/UI/GridLayout';
import { Modal } from '@components/UI/Modal';
import { PageLoading } from '@components/UI/PageLoading';
import useMessagePreviews from '@components/utils/hooks/useMessagePreviews';
import type { Profile } from '@generated/types';
import { MailIcon, PlusCircleIcon } from '@heroicons/react/outline';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey } from '@lib/conversationKey';
import { Leafwatch } from '@lib/leafwatch';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { ERROR_MESSAGE } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useMessagePersistStore, useMessageStore } from 'src/store/message';
import { MESSAGES } from 'src/tracking';

interface Props {
  className?: string;
  selectedConversationKey?: string;
}

const PreviewList: FC<Props> = ({ className, selectedConversationKey }) => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { authenticating, loading, messages, profiles, profilesError } = useMessagePreviews();
  const clearMessagesBadge = useMessagePersistStore((state) => state.clearMessagesBadge);

  const sortedProfiles = Array.from(profiles).sort(([keyA], [keyB]) => {
    const messageA = messages.get(keyA);
    const messageB = messages.get(keyB);
    return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0) ? -1 : 1;
  });

  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    const profileKeys = Array.from(profiles.keys());
    const messageKeys = Array.from(messages.keys());
    const hasPreviews = profileKeys.some((item) => messageKeys.includes(item));
    if (hasPreviews) {
      clearMessagesBadge(currentProfile.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, profiles, messages]);

  const showAuthenticating = currentProfile && authenticating;
  const showLoading = loading && (messages.size === 0 || profiles.size === 0);

  const newMessageClick = () => {
    setShowSearchModal(true);
    Leafwatch.track(MESSAGES.OPEN_NEW_CONVERSATION);
  };

  const onProfileSelected = (profile: Profile) => {
    const conversationId = buildConversationId(currentProfile?.id, profile.id);
    const conversationKey = buildConversationKey(profile.ownedBy, conversationId);
    messageProfiles.set(conversationKey, profile);
    setMessageProfiles(new Map(messageProfiles));
    router.push(`/messages/${conversationKey}`);
    setShowSearchModal(false);
  };

  return (
    <GridItemFour
      className={clsx(
        'xs:h-[85vh] sm:h-[76vh] md:h-[80vh] xl:h-[84vh] mb-0 md:col-span-4 sm:mx-2 xs:mx-2',
        className
      )}
    >
      <Card className="h-full flex justify-between flex-col">
        <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
          <div className="font-bold">Messages</div>
          {currentProfile && !showAuthenticating && !showLoading && (
            <button onClick={newMessageClick} type="button">
              <PlusCircleIcon className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className="h-full overflow-y-auto overflow-x-hidden">
          {showAuthenticating ? (
            <PageLoading message="Awaiting signature to enable DMs" />
          ) : showLoading ? (
            <PageLoading message="Loading conversations" />
          ) : profilesError ? (
            <ErrorMessage
              className="m-5"
              title="Failed to load messages"
              error={{ message: ERROR_MESSAGE, name: ERROR_MESSAGE }}
            />
          ) : sortedProfiles.length === 0 ? (
            <button className="w-full h-full justify-items-center" onClick={newMessageClick} type="button">
              <EmptyState
                message={<div>Start messaging your Lens frens</div>}
                icon={<MailIcon className="w-8 h-8 text-brand" />}
                hideCard
              />
            </button>
          ) : (
            sortedProfiles.map(([key, profile]) => {
              const message = messages.get(key);
              if (!message) {
                return null;
              }

              return (
                <Preview
                  isSelected={key === selectedConversationKey}
                  key={key}
                  profile={profile}
                  conversationKey={key}
                  message={message}
                />
              );
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
        <div className="w-full pt-4 px-4">
          <Search
            modalWidthClassName="max-w-lg"
            placeholder="Search for someone to message..."
            onProfileSelected={onProfileSelected}
          />
        </div>
        {currentProfile && <Following profile={currentProfile} onProfileSelected={onProfileSelected} />}
      </Modal>
    </GridItemFour>
  );
};

export default PreviewList;
