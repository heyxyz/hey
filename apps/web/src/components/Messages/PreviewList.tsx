import Preview from '@components/Messages/Preview';
import Following from '@components/Profile/Following';
import Loader from '@components/Shared/Loader';
import Search from '@components/Shared/Navbar/Search';
import { EnvelopeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data/errors';
import { MESSAGES } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import { Card, ErrorMessage, GridItemFour, Modal } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import type { FC } from 'react';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useMessageDb } from 'src/hooks/useMessageDb';
import { useAppStore } from 'src/store/useAppStore';
import { useMessageStore } from 'src/store/useMessageStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

interface PreviewListProps {
  selectedConversationKey?: string;
  messages: Map<string, DecodedMessage>;
  profilesToShow: Map<string, Profile>;
  authenticating?: boolean;
  profilesError: Error | undefined;
  loading: boolean;
  previewsLoading: boolean;
  previewsProgress: number;
}

const PreviewList: FC<PreviewListProps> = ({
  selectedConversationKey,
  messages,
  profilesToShow,
  authenticating,
  profilesError,
  loading,
  previewsLoading,
  previewsProgress
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = usePreferencesStore((state) => state.staffMode);
  const { ensNames, setConversationKey } = useMessageStore();

  const [showSearchModal, setShowSearchModal] = useState(false);
  const { persistProfile } = useMessageDb();

  const showAuthenticating = currentProfile && authenticating;

  const showLoading =
    loading && (messages.size === 0 || profilesToShow.size === 0);

  const newMessageClick = () => {
    setShowSearchModal(true);
    Leafwatch.track(MESSAGES.OPEN_NEW_CONVERSATION);
  };

  const onProfileSelected = async (profile: Profile) => {
    const conversationKey = profile.ownedBy.address.toLowerCase();
    await persistProfile(conversationKey, profile);
    setConversationKey(conversationKey);
    setShowSearchModal(false);
  };

  const sortedProfiles = Array.from(profilesToShow).sort(([keyA], [keyB]) => {
    const messageA = messages.get(keyA);
    const messageB = messages.get(keyB);
    return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0)
      ? -1
      : 1;
  });

  return (
    <GridItemFour
      className={cn(
        staffMode ? 'h-[calc(100vh-9.78rem)]' : 'h-[calc(100vh-8rem)]',
        'xs:mx-2 mb-0 sm:mx-2 md:col-span-4'
      )}
    >
      <Card className="flex h-full flex-col justify-between">
        <div className="divider relative flex items-center justify-between p-5">
          <div className="font-bold">Messages</div>
          {currentProfile && !showAuthenticating && !showLoading ? (
            <button onClick={newMessageClick} type="button">
              <PlusCircleIcon className="h-6 w-6" />
            </button>
          ) : null}
          {previewsLoading ? (
            <progress
              className="absolute -bottom-1 left-0 h-1 w-full appearance-none border-none bg-transparent"
              value={previewsProgress}
              max={100}
            />
          ) : null}
        </div>
        <div className="h-full overflow-y-auto overflow-x-hidden">
          {showAuthenticating ? (
            <div className="flex h-full grow items-center justify-center">
              <Loader message="Awaiting signature to enable DMs" />
            </div>
          ) : showLoading ? (
            <div className="flex h-full grow items-center justify-center">
              <Loader message="Loading conversations" />
            </div>
          ) : profilesError ? (
            <ErrorMessage
              className="m-5"
              title="Failed to load messages"
              error={{
                message: Errors.SomethingWentWrong,
                name: Errors.SomethingWentWrong
              }}
            />
          ) : sortedProfiles.length === 0 ? (
            <button
              className="h-full w-full justify-items-center"
              onClick={newMessageClick}
              type="button"
            >
              <div className="grid justify-items-center space-y-2 p-5">
                <div>
                  <EnvelopeIcon className="text-brand h-8 w-8" />
                </div>
                <div>Start messaging your Lens frens</div>
              </div>
            </button>
          ) : (
            <Virtuoso
              className="h-full"
              data={sortedProfiles}
              itemContent={(_, [key, profile]) => {
                const message = messages.get(key);
                return (
                  <Preview
                    ensName={ensNames.get(key)}
                    isSelected={key === selectedConversationKey}
                    key={key}
                    profile={profile}
                    conversationKey={key}
                    message={message}
                  />
                );
              }}
            />
          )}
        </div>
      </Card>
      <Modal
        title="New message"
        icon={<EnvelopeIcon className="text-brand h-5 w-5" />}
        size="sm"
        show={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      >
        <div className="w-full px-4 pt-4">
          <Search
            modalWidthClassName="max-w-lg"
            placeholder="Search for someone to message..."
            onProfileSelected={onProfileSelected}
          />
        </div>
        {currentProfile ? (
          <Following
            profile={currentProfile}
            onProfileSelected={onProfileSelected}
          />
        ) : null}
      </Modal>
    </GridItemFour>
  );
};

export default PreviewList;
