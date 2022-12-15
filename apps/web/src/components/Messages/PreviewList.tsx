import Preview from '@components/Messages/Preview';
import Following from '@components/Profile/Following';
import Loader from '@components/Shared/Loader';
import Search from '@components/Shared/Navbar/Search';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { GridItemFour } from '@components/UI/GridLayout';
import { Modal } from '@components/UI/Modal';
import useMessagePreviews from '@components/utils/hooks/useMessagePreviews';
import { MailIcon, PlusCircleIcon, UsersIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey } from '@lib/conversationKey';
import clsx from 'clsx';
import { ERROR_MESSAGE } from 'data/constants';
import type { Profile } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
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
  const addProfileAndSelectTab = useMessageStore((state) => state.addProfileAndSelectTab);
  const selectedTab = useMessageStore((state) => state.selectedTab);
  const setSelectedTab = useMessageStore((state) => state.setSelectedTab);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { authenticating, loading, messages, profilesToShow, requestedCount, profilesError } =
    useMessagePreviews();
  const clearMessagesBadge = useMessagePersistStore((state) => state.clearMessagesBadge);

  const sortedProfiles = Array.from(profilesToShow).sort(([keyA], [keyB]) => {
    const messageA = messages.get(keyA);
    const messageB = messages.get(keyB);
    return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0) ? -1 : 1;
  });

  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    clearMessagesBadge(currentProfile.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  const showAuthenticating = currentProfile && authenticating;
  const showLoading = loading && (messages.size === 0 || profilesToShow.size === 0);

  const newMessageClick = () => {
    setShowSearchModal(true);
    Analytics.track(MESSAGES.OPEN_NEW_CONVERSATION);
  };

  const onProfileSelected = (profile: Profile) => {
    const conversationId = buildConversationId(currentProfile?.id, profile.id);
    const conversationKey = buildConversationKey(profile.ownedBy, conversationId);
    addProfileAndSelectTab(conversationKey, profile);
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
        <div className="flex">
          <div
            onClick={() => setSelectedTab('Following')}
            className={clsx(
              'flex flex-1 justify-center font-bold items-center p-2 m-2 ml-4 rounded text-brand-500 tab-bg cursor-pointer',
              selectedTab === 'Following' ? 'bg-brand-100' : ''
            )}
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Following
          </div>
          <div
            onClick={() => setSelectedTab('Requested')}
            className={clsx(
              'flex flex-1 justify-center font-bold items-center p-2 m-2 mr-4 rounded text-brand-500 tab-bg cursor-pointer',
              selectedTab === 'Requested' ? 'bg-brand-100' : ''
            )}
          >
            Requested
            {requestedCount > 0 && (
              <span className="text-sm font-bold ml-2 bg-brand-200 px-3 py-0.5 rounded-2xl">
                {requestedCount > 99 ? '99+' : requestedCount}
              </span>
            )}
          </div>
        </div>
        {selectedTab === 'Requested' ? (
          <div className="p-2 px-5 mt-1 text-sm bg-yellow-100 text-yellow-800">
            These conversations are from Lens profiles that you don't currently follow.
          </div>
        ) : null}
        <div className="h-full overflow-y-auto overflow-x-hidden">
          {showAuthenticating ? (
            <div className="flex h-full flex-grow justify-center items-center">
              <Loader message="Awaiting signature to enable DMs" />
            </div>
          ) : showLoading ? (
            <div className="flex h-full flex-grow justify-center items-center">
              <Loader message="Loading conversations" />
            </div>
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
            sortedProfiles?.map(([key, profile]) => {
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
