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
import { t, Trans } from '@lingui/macro';
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
        'xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-4 md:h-[80vh] xl:h-[84vh]',
        className
      )}
    >
      <Card className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between border-b p-5 dark:border-gray-700">
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
              'text-brand-500 tab-bg m-2 ml-4 flex flex-1 cursor-pointer items-center justify-center rounded p-2 font-bold',
              selectedTab === 'Following' ? 'bg-brand-100' : ''
            )}
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            <Trans>Following</Trans>
          </div>
          <div
            onClick={() => setSelectedTab('Requested')}
            className={clsx(
              'text-brand-500 tab-bg m-2 mr-4 flex flex-1 cursor-pointer items-center justify-center rounded p-2 font-bold',
              selectedTab === 'Requested' ? 'bg-brand-100' : ''
            )}
          >
            <Trans>Requested</Trans>
            {requestedCount > 0 && (
              <span className="bg-brand-200 ml-2 rounded-2xl px-3 py-0.5 text-sm font-bold">
                {requestedCount > 99 ? '99+' : requestedCount}
              </span>
            )}
          </div>
        </div>
        {selectedTab === 'Requested' ? (
          <div className="mt-1 bg-yellow-100 p-2 px-5 text-sm text-yellow-800">
            <Trans>These conversations are from Lens profiles that you don't currently follow.</Trans>
          </div>
        ) : null}
        <div className="h-full overflow-y-auto overflow-x-hidden">
          {showAuthenticating ? (
            <div className="flex h-full flex-grow items-center justify-center">
              <Loader message="Awaiting signature to enable DMs" />
            </div>
          ) : showLoading ? (
            <div className="flex h-full flex-grow items-center justify-center">
              <Loader message={t`Loading conversations`} />
            </div>
          ) : profilesError ? (
            <ErrorMessage
              className="m-5"
              title={t`Failed to load messages`}
              error={{ message: ERROR_MESSAGE, name: ERROR_MESSAGE }}
            />
          ) : sortedProfiles.length === 0 ? (
            <button className="h-full w-full justify-items-center" onClick={newMessageClick} type="button">
              <EmptyState
                message={t`Start messaging your Lens frens`}
                icon={<MailIcon className="text-brand h-8 w-8" />}
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
        title={t`New message`}
        icon={<MailIcon className="text-brand h-5 w-5" />}
        size="sm"
        show={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      >
        <div className="w-full px-4 pt-4">
          <Search
            modalWidthClassName="max-w-lg"
            placeholder={t`Search for someone to message...`}
            onProfileSelected={onProfileSelected}
          />
        </div>
        {currentProfile && <Following profile={currentProfile} onProfileSelected={onProfileSelected} />}
      </Modal>
    </GridItemFour>
  );
};

export default PreviewList;
