import Follow from '@components/Shared/Follow';
import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import useGroupInfoModal from '@components/utils/hooks/push/useGroupInfoModal';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import type { GroupDTO, IFeeds } from '@pushprotocol/restapi';
import type { Profile } from 'lens';
import React, { useEffect, useRef, useState } from 'react';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Image, Modal } from 'ui';

interface MessageHeaderProps {
  profile?: Profile;
  groupInfo?: GroupDTO;
  setGroupInfo?: (groupInfo: GroupDTO) => void;
  selectedChat: IFeeds;
}

export default function MessageHeader({
  profile,
  groupInfo,
  setGroupInfo,
  selectedChat
}: MessageHeaderProps) {
  // get the connected profile
  const [following, setFollowing] = useState(false);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const [showModal, setShowModal] = useState(false);
  const showGroupInfoModal = usePushChatStore(
    (state) => state.showGroupInfoModal
  );
  const setShowGroupInfoModal = usePushChatStore(
    (state) => state.setShowGroupInfoModal
  );

  const downRef = useRef(null);
  useOnClickOutside(downRef, () => {
    setShowModal(false);
  });

  useEffect(() => {
    if (selectedChatType === CHAT_TYPES.GROUP) {
      return;
    }
    const profile = lensProfiles.get(selectedChatId);
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [lensProfiles, selectedChatId, selectedChatType]);

  const {
    groupInfoModal,
    modalContent: groupInfoModalContent,
    isModalClosable: isGroupInfoModalClosable
  } = useGroupInfoModal({
    groupInfo: groupInfo,
    setGroupInfo: setGroupInfo
  });

  const handleGroupInfo = async () => {
    try {
      groupInfoModal();
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5 dark:border-b-[#3F3F46]">
      <div className="flex items-center">
        {profile && <UserProfile profile={profile as Profile} />}{' '}
        {groupInfo && (
          <div className="flex items-center space-x-3">
            <Image
              src={groupInfo.groupImage!}
              loading="lazy"
              className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
              alt={groupInfo.groupName}
            />
            <p className="bold text-base leading-6">{groupInfo.groupName}</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4	">
        <img
          className="cursor-pointer"
          src="/push/video.svg"
          alt="video icon"
        />
        {profile &&
          (following ? (
            <Unfollow profile={profile!} setFollowing={setFollowing} showText />
          ) : (
            <Follow profile={profile!} setFollowing={setFollowing} showText />
          ))}
        {groupInfo && (
          <div
            className="w-fit cursor-pointer"
            onClick={() =>
              showModal === false ? setShowModal(true) : setShowModal(false)
            }
          >
            <Image
              className="h-10 w-9 dark:hidden"
              src="/push/more.svg"
              alt="group info settings"
            />

            <Image
              className="hidden h-10 w-9 dark:flex"
              src="/push/darkmodemore.svg"
              alt="group info settings"
            />
          </div>
        )}
        {groupInfo && showModal && (
          <div
            ref={downRef}
            className="absolute top-36 ml-[-80px] flex w-40 cursor-pointer items-center rounded-2xl border border-[#BAC4D6] bg-white p-2 px-4 dark:border-[#3F3F46] dark:bg-gray-700"
            onClick={handleGroupInfo}
          >
            <div>
              <Image
                className="mr-2 h-6 w-6"
                src="/push/Info.svg"
                alt="group info settings"
              />
            </div>
            <div className="items-center text-[17px] font-[400] text-[#657795]">
              Group Info
            </div>
          </div>
        )}
        <Modal
          show={showGroupInfoModal}
          onClose={
            isGroupInfoModalClosable
              ? () => setShowGroupInfoModal(false)
              : () => {}
          }
        >
          {groupInfoModalContent}
        </Modal>
      </div>
    </section>
  );
}
