import Search from '@components/Messages/Push/Search';
import Slug from '@components/Shared/Slug';
import useCreateChatProfile from '@components/utils/hooks/push/useCreateChatProfile';
import useCreatePassword from '@components/utils/hooks/push/useCreatePassword';
import useFetchRequests from '@components/utils/hooks/push/useFetchRequests';
import useGetChatProfile from '@components/utils/hooks/push/useGetChatProfile';
import usePushChatSocket from '@components/utils/hooks/push/usePushChatSocket';
import useCreateGroup from '@components/utils/hooks/push/usePushCreateGroupChat';
import usePushDecryption from '@components/utils/hooks/push/usePushDecryption';
import useUpgradeChatProfile from '@components/utils/hooks/push/useUpgradeChatProfile';
import { Trans } from '@lingui/macro';
import type { IFeeds } from '@pushprotocol/restapi';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { BsKey } from 'react-icons/bs';
import { useClickAway } from 'react-use';
import { useAppStore } from 'src/store/app';
import type { ChatTypes } from 'src/store/push-chat';
import { PUSH_TABS, usePushChatStore } from 'src/store/push-chat';
import { Card, Image, Modal } from 'ui';
import { useWalletClient } from 'wagmi';

import { getProfileFromDID, isProfileExist } from './helper';
import PUSHPreviewChats from './PUSHPreviewChats';
import PUSHPreviewRequests from './PUSHPreviewRequest';

const requestLimit: number = 30;
const page: number = 1;

const PUSHPreview = () => {
  const containerRef = useRef(null);
  const { data: walletClient } = useWalletClient();
  const { fetchChatProfile } = useGetChatProfile();
  const resetPushChatStore = usePushChatStore(
    (state) => state.resetPushChatStore
  );
  const currentProfile = useAppStore((state) => state.currentProfile);
  const activeTab = usePushChatStore((state) => state.activeTab);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const setActiveTab = usePushChatStore((state) => state.setActiveTab);
  const setShowCreateGroupModal = usePushChatStore(
    (state) => state.setShowCreateGroupModal
  );
  const showCreateGroupModal = usePushChatStore(
    (state) => state.showCreateGroupModal
  );
  const showCreateChatProfileModal = usePushChatStore(
    (state) => state.showCreateChatProfileModal
  );
  const setShowCreateChatProfileModal = usePushChatStore(
    (state) => state.setShowCreateChatProfileModal
  );
  const showUpgradeChatProfileModal = usePushChatStore(
    (state) => state.showUpgradeChatProfileModal
  );
  const showDecryptionModal = usePushChatStore(
    (state) => state.showDecryptionModal
  );
  const setShowUpgradeChatProfileModal = usePushChatStore(
    (state) => state.setShowUpgradeChatProfileModal
  );
  const setShowDecryptionModal = usePushChatStore(
    (state) => state.setShowDecryptionModal
  );
  const showCreatePasswordModal = usePushChatStore(
    (state) => state.showCreatePasswordModal
  );
  const setShowCreatePasswordModal = usePushChatStore(
    (state) => state.setShowCreatePasswordModal
  );
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  const {
    createChatProfile,
    modalContent: createChatProfileModalContent,
    isModalClosable: isCreateChatProfileModalClosable
  } = useCreateChatProfile();
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
  const {
    createPassword,
    modalContent: createPasswordModalContent,
    isModalClosable: isCreatePasswordModalClosable
  } = useCreatePassword();

  // connect Push CHAT Socket
  usePushChatSocket();

  const { fetchRequests } = useFetchRequests();

  useEffect(() => {
    if (!currentProfile || !walletClient) {
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
      if (
        connectedProfile &&
        connectedProfile?.encryptedPrivateKey &&
        connectedProfile?.nftOwner
      ) {
        const nftProfileOwnerAddress = connectedProfile.nftOwner.split(':')[1];
        const { ownedBy } = currentProfile;
        if (
          ownedBy.toLowerCase() === nftProfileOwnerAddress.toLocaleLowerCase()
        ) {
          await decryptKey({
            encryptedText: connectedProfile?.encryptedPrivateKey
          });
        } else {
          await upgradeChatProfile();
        }
      }
    };
    connectPushChatProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedProfile, currentProfile, walletClient]);

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
      setRequestsFeed(firstFeeds);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedPgpPvtKey]);

  const closeDropdown = () => {
    setShowDropdown(false);
  };
  useClickAway(containerRef, () => closeDropdown());

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
      if (
        selectedProfilePushId &&
        currentProfile?.id !== selectedProfilePushId
      ) {
        resetPushChatStore();
        router.push('/messages/push');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, connectedProfile]);

  const onProfileSelected = (type: ChatTypes, chatId: string) => {
    router.push(`/messages/push/${type}/${chatId}`);
  };

  const handleCreateGroup = async () => {
    try {
      if (!isProfileExist(connectedProfile)) {
        await createChatProfile();
      }
      if (decryptedPgpPvtKey) {
        createGroup();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountPassword = async () => {
    try {
      // if (!isProfileExist(connectedProfile)) {
      //   await createChatProfile();
      // }
      if (decryptedPgpPvtKey) {
        createPassword();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between" ref={containerRef}>
      <Card className="flex h-full flex-col p-4 pt-7">
        {/* section for header */}
        <section className="mb-4">
          <div className="mb-6 flex gap-x-5 border-b border-b-gray-300">
            <div
              onClick={() => setActiveTab(PUSH_TABS.CHATS)}
              className={`w-6/12 cursor-pointer border-b-4 pb-3.5 text-center  font-bold ${
                activeTab === PUSH_TABS.CHATS
                  ? 'border-b-brand-500'
                  : 'border-b-transparent text-gray-500'
              }`}
            >
              <Trans>Chats</Trans>
            </div>
            <div
              onClick={() => setActiveTab(PUSH_TABS.REQUESTS)}
              className={`align-items-center flex w-6/12 cursor-pointer justify-center gap-x-1.5 border-b-4 pb-3.5 font-bold ${
                activeTab === PUSH_TABS.REQUESTS
                  ? 'border-b-brand-500'
                  : 'border-b-transparent text-gray-500'
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
        <div
          onClick={handleCreateGroup}
          className="ml-0 flex cursor-pointer px-4 pb-4"
        >
          <Image
            src="/push/creategroup.svg"
            alt="create group"
            className="mr-2 h-5"
          />
          <button className="text-base font-medium">Create Group</button>
        </div>

        {/* <div className="flex-1 h-auto overflow-y-scroll"> */}
        <div className="z-10 h-full flex-1 overflow-y-scroll">
          {/* section for header */}
          {/* section for chats */}
          {activeTab === PUSH_TABS.CHATS && <PUSHPreviewChats />}
          {/* section for chats */}
          {/* sections for requests */}
          {activeTab === PUSH_TABS.REQUESTS && <PUSHPreviewRequests />}
          {/* sections for requests */}
        </div>

        {decryptedPgpPvtKey && (
          <div className="relative flex flex-row items-center border-t-2 border-[#E4E8EF] pt-2">
            {showDropdown && (
              <div
                className="absolute -top-8 right-0 z-20 flex cursor-pointer flex-row rounded-2xl border-2 border-gray-200 bg-white px-6 py-3"
                onClick={handleAccountPassword}
              >
                <BsKey
                  size={27}
                  style={{ transform: 'scaleX(-1)', rotate: '-45deg' }}
                />
                <div className="ml-2">Account Password</div>
              </div>
            )}
            <div className="flex flex-row items-center space-x-3">
              <Image
                src={getAvatar(currentProfile)}
                loading="lazy"
                className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
                height={40}
                width={40}
                alt="Profile Picture"
              />
              <div className="flex flex-col">
                <p className="text-base">
                  {currentProfile?.name ?? formatHandle(currentProfile?.handle)}
                </p>
                <Slug
                  className="text-sm"
                  slug={formatHandle(currentProfile?.handle)}
                  prefix="@"
                />
              </div>
            </div>

            <div
              className="relative ml-auto h-fit w-fit cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <BiDotsVerticalRounded size={27} />
            </div>
          </div>
        )}
      </Card>
      {/* <button onClick={createChatProfile}>Create Profile</button> */}

      <Modal
        size="xs"
        show={showCreateGroupModal}
        onClose={
          isCreateModalClosable
            ? () => setShowCreateGroupModal(false)
            : () => {}
        }
      >
        {createGroupModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showCreateChatProfileModal}
        onClose={
          isCreateChatProfileModalClosable
            ? () => setShowCreateChatProfileModal(false)
            : () => {}
        }
      >
        {createChatProfileModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showUpgradeChatProfileModal}
        onClose={
          isUpgradeChatProfileModalClosable
            ? () => setShowUpgradeChatProfileModal(false)
            : () => {}
        }
      >
        {upgradeChatProfileModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showDecryptionModal}
        onClose={
          isDecryptionModalClosable
            ? () => setShowDecryptionModal(false)
            : () => {}
        }
      >
        {decryptionModalContent}
      </Modal>
      <Modal
        size="xs"
        show={showCreatePasswordModal}
        onClose={
          isCreatePasswordModalClosable
            ? () => setShowCreatePasswordModal(false)
            : () => {}
        }
      >
        {createPasswordModalContent}
      </Modal>
    </div>
  );
};

export default PUSHPreview;
