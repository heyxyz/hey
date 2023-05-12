import Search from '@components/Messages/Push/Search';
import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
import useFetchRequests from '@components/utils/hooks/push/useFetchRequests';
import useGetChatProfile from '@components/utils/hooks/push/useGetChatProfile';
import usePushChatSocket from '@components/utils/hooks/push/usePushChatSocket';
import useCreateGroup from '@components/utils/hooks/push/usePushCreateGroupChat';
import usePushDecryption from '@components/utils/hooks/push/usePushDecryption';
import useUpgradeChatProfile from '@components/utils/hooks/push/useUpgradeChatProfile';
import { Trans } from '@lingui/macro';
import type { IFeeds } from '@pushprotocol/restapi';
import type { Profile } from 'lens';
import router from 'next/router';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Card, Image, Modal } from 'ui';

import { getProfileFromDID } from './helper';
import PUSHPreviewChats from './PUSHPreviewChats';
import PUSHPreviewRequests from './PUSHPreviewRequest';

const requestLimit: number = 30;
const page: number = 1;

const PUSHPreview = () => {
  const { fetchChatProfile } = useGetChatProfile();
  const resetPushChatStore = usePushChatStore((state) => state.resetPushChatStore);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const activeTab = usePushChatStore((state) => state.activeTab);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const setShowCreateGroupModal = usePushChatStore((state) => state.setShowCreateGroupModal);
  const showCreateGroupModal = usePushChatStore((state) => state.showCreateGroupModal);
  const showCreateChatProfileModal = usePushChatStore((state) => state.showCreateChatProfileModal);
  const setShowCreateChatProfileModal = usePushChatStore((state) => state.setShowCreateChatProfileModal);
  const showUpgradeChatProfileModal = usePushChatStore((state) => state.showUpgradeChatProfileModal);
  const showDecryptionModal = usePushChatStore((state) => state.showDecryptionModal);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  const setShowUpgradeChatProfileModal = usePushChatStore((state) => state.setShowUpgradeChatProfileModal);
  const setShowDecryptionModal = usePushChatStore((state) => state.setShowDecryptionModal);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const { modalContent: createChatProfileModalContent, isModalClosable: isCreateChatProfileModalClosable } =
    useCreateChatProfile();
  const {
    createGroup,
    modalContent: createGroupModalContent,
    isModalClosable: isCreateModalClosable
  } = useCreateGroup();
  const {
    upgradeChatProfile,
    modalContent: upgradeChatProfileModalContent,
    isModalClosable: isUpgradeChatProfileModalClosable
  } = useUpgradeChatProfile();
  const {
    decryptKey,
    modalContent: decryptionModalContent,
    isModalClosable: isDecryptionModalClosable
  } = usePushDecryption();

  // connect Push CHAT Socket
  usePushChatSocket();

  const { fetchRequests } = useFetchRequests();

  useEffect(() => {
    if (!currentProfile) {
      return;
    }

    const connectPushChatProfile = async () => {
      if (!connectedProfile) {
        await fetchChatProfile({
          profileId: currentProfile.id
        });
        return;
      }
      if (decryptedPgpPvtKey) {
        return;
      }
      if (connectedProfile && connectedProfile?.encryptedPrivateKey && connectedProfile?.nftOwner) {
        const nftProfileOwnerAddress = connectedProfile.nftOwner.split(':')[1];
        const { ownedBy } = currentProfile;
        if (ownedBy.toLowerCase() === nftProfileOwnerAddress.toLocaleLowerCase()) {
          await decryptKey({ encryptedText: connectedProfile?.encryptedPrivateKey });
        } else {
          await upgradeChatProfile();
        }
      }
    };
    connectPushChatProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedProfile, currentProfile]);

  useEffect(() => {
    // only for user who has requests but hasn't created user in push chat yet
    if (Object.keys(requestsFeed).length) {
      return;
    }

    (async function () {
      if (connectedProfile && !connectedProfile?.encryptedPrivateKey) {
        let feeds = await fetchRequests({ page, requestLimit });
        let firstFeeds: { [key: string]: IFeeds } = { ...feeds };
        setRequestsFeed(firstFeeds);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedProfile]);

  useEffect(() => {
    if (Object.keys(requestsFeed).length) {
      return;
    }

    (async function () {
      // only run this hook when there's a descryted key availabe in storage
      if (!decryptedPgpPvtKey) {
        return;
      }
      let feeds = await fetchRequests({ page, requestLimit });
      let firstFeeds: { [key: string]: IFeeds } = { ...feeds };
      // setRequestsFeed(firstFeeds);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedPgpPvtKey]);

  // useEffect(() => {
  //   //set selected chat preview
  //   //find in inbox or reuqests  or new chat and switch tab as per that and set css for selected chat
  //   if (selectedChatId in chatsFeed) {
  //     setActiveTab(PUSH_TABS.CHATS);
  //   }
  //   if (selectedChatId in requestsFeed) {
  //     setActiveTab(PUSH_TABS.REQUESTS);
  //   }
  // }, [selectedChatId, selectedChatType, requestsFeed, chatsFeed]);

  useEffect(() => {
    if (connectedProfile && connectedProfile.did && currentProfile?.id) {
      const selectedProfilePushId = getProfileFromDID(connectedProfile?.did);
      if (selectedProfilePushId && currentProfile?.id !== selectedProfilePushId) {
        resetPushChatStore();
        router.push('/messages/push');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, connectedProfile]);

  const onProfileSelected = (profile: Profile) => {
    router.push(`/messages/push/chat/${profile.id}`);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <Card className="flex h-full flex-col p-4 pt-7">
        {/* section for header */}
        <section className="mb-4">
          <div className="mb-6 flex gap-x-5 border-b border-b-gray-300">
            <div
              onClick={() => setActiveTab(PUSH_TABS.CHATS)}
              className={`w-6/12 cursor-pointer border-b-4 pb-3.5 text-center  font-bold ${
                activeTab === PUSH_TABS.CHATS ? 'border-b-brand-500' : 'border-b-transparent text-gray-500'
              }`}
            >
              <Trans>Chats</Trans>
            </div>
            <div
              onClick={() => setActiveTab(PUSH_TABS.REQUESTS)}
              className={`align-items-center flex w-6/12 cursor-pointer justify-center gap-x-1.5 border-b-4 pb-3.5 font-bold ${
                activeTab === PUSH_TABS.REQUESTS ? 'border-b-brand-500' : 'border-b-transparent text-gray-500'
              }`}
            >
              <Trans>Requests</Trans>
              <div className=" bg-brand-500 flex h-5 w-7 justify-center rounded-full text-sm text-white">
                {Object.keys(requestsFeed).length}
              </div>
            </div>
          </div>

          <div className="flex gap-x-2">
            <Search
              placeholder="Search lens handle"
              modalWidthClassName="w-80"
              onProfileSelected={onProfileSelected}
            />
          </div>
        </section>
        <div onClick={createGroup} className="ml-0 flex cursor-pointer px-4 pb-4">
          <Image src="/push/creategroup.svg" alt="create group" className="mr-2 h-5" />
          <button className="text-base font-medium">Create Group</button>
        </div>
        {/* section for header */}
        {/* section for chats */}
        {activeTab === PUSH_TABS.CHATS && <PUSHPreviewChats />}
        {/* section for chats */}
        {/* sections for requests */}
        {activeTab === PUSH_TABS.REQUESTS && <PUSHPreviewRequests />}
        {/* sections for requests */}
      </Card>
      {/* <button onClick={createChatProfile}>Create Profile</button> */}
      <Modal
        size="xs"
        show={showCreateGroupModal}
        onClose={isCreateModalClosable ? () => setShowCreateGroupModal(false) : () => {}}
      >
        {createGroupModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showCreateChatProfileModal}
        onClose={isCreateChatProfileModalClosable ? () => setShowCreateChatProfileModal(false) : () => {}}
      >
        {createChatProfileModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showUpgradeChatProfileModal}
        onClose={isUpgradeChatProfileModalClosable ? () => setShowUpgradeChatProfileModal(false) : () => {}}
      >
        {upgradeChatProfileModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showDecryptionModal}
        onClose={isDecryptionModalClosable ? () => setShowDecryptionModal(false) : () => {}}
      >
        {decryptionModalContent}
      </Modal>
    </div>
  );
};

export default PUSHPreview;
