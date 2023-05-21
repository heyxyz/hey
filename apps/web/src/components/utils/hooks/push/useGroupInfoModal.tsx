import Search from '@components/Shared/Navbar/Search';
import { XIcon } from '@heroicons/react/outline';
import type { GroupDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { LENSHUB_PROXY } from 'data/constants';
import type { Profile } from 'lens';
import router from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { Button, Image } from 'ui';

import useFetchLensProfiles from './useFetchLensProfiles';
import { MemberProfileList } from './usePushCreateGroupChat';

type GroupInfoModalProps = {
  groupInfo?: GroupDTO;
  setGroupInfo?: (groupInfo: GroupDTO) => void;
};

type MembersType = {
  totalMembers: Array<string>;
  totalAdminAddress: Array<string>;
};

enum ProgressType {
  INITIATE = 'INITIATE',
  ERROR = 'ERROR'
}

type modalInfoType = {
  type: string;
};
const initModalInfo: modalInfoType = {
  type: ProgressType.INITIATE
};

const useGroupInfoModal = (options: GroupInfoModalProps) => {
  const { groupInfo, setGroupInfo } = options;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const { loadLensProfiles } = useFetchLensProfiles();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const setShowGroupInfoModal = usePushChatStore(
    (state) => state.setShowGroupInfoModal
  );
  const showGroupInfoModal = usePushChatStore(
    (state) => state.showGroupInfoModal
  );

  const [chatProfile, setChatProfile] = useState<Profile[]>([]);
  const [adminAddressesinPendingMembers, setAdminAddressesinPendingMembers] =
    useState<Profile[]>([]);
  const [showPendingMembers, setShowPendingMembers] = useState<boolean>(false);
  const [acceptedMembers, setAcceptedMembers] = useState<Profile[]>([]);
  const [toCheckAdmin, setToCheckAdmin] = useState<Profile[]>([]);
  const [showSearchMembers, setShowSearchMembers] = useState<boolean>(false);
  const [showSearchedMemberToAdd, setShowSearchedMemberToAdd] = useState<
    Array<Profile>
  >([]);
  const [adminAddresses, setAdminAddresses] = useState<Profile[]>([]);
  const [updatedMembers, setUpdatedMembers] = useState<Profile[]>([]);
  const [adding, setAdding] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<modalInfoType>(initModalInfo);
  const [modalClosable, setModalClosable] = useState<boolean>(true);

  const reset = useCallback(() => {
    setShowSearchMembers(false);
    setShowSearchedMemberToAdd([]);
    setUpdatedMembers([]);
    setAdminAddresses([]);
    setShowPendingMembers(false);
    setAdding(false);
  }, []);

  // const handleProgress = useCallback(
  //   (progress: ProgressHookType) => {
  //     setStep((step) => step + 1);
  //     setModalInfo({
  //       title: progress.progressTitle,
  //       info: progress.progressInfo,
  //       type: progress.level
  //     });
  //     if (progress.level === 'INFO') {
  //       setModalClosable(false);
  //     } else {
  //       if (progress.level === 'SUCCESS') {
  //         const timeout = 2000; // after this time, modal will be closed
  //         setTimeout(() => {
  //           setShowCreateChatProfileModal(false);
  //         }, timeout);
  //       }
  //       setModalClosable(true);
  //     }
  //   },
  //   [setShowCreateChatProfileModal]
  // );

  const handleGoback = () => {
    setShowSearchMembers(false);
    setShowSearchedMemberToAdd([]);
    setUpdatedMembers([]);
    setShowPendingMembers(false);
  };

  const handleUpdateGroup = async ({
    totalMembers,
    totalAdminAddress
  }: MembersType) => {
    if (!currentProfile || !decryptedPgpPvtKey) {
      return;
    }

    try {
      const response = await PushAPI.chat.updateGroup({
        groupName: groupInfo?.groupName || '',
        chatId: groupInfo?.chatId || '',
        groupDescription: groupInfo?.groupDescription as string,
        members: totalMembers,
        groupImage: groupInfo?.groupImage ? groupInfo?.groupImage : '',
        admins: totalAdminAddress, // pass the adminAddresses array here
        account: groupInfo?.groupCreator,
        pgpPrivateKey: decryptedPgpPvtKey, //decrypted private key
        env: PUSH_ENV
      });
      if (response && setGroupInfo && showGroupInfoModal) {
        setGroupInfo(response);
      }
      // handleCloseall();
      return response;
    } catch (error: Error | any) {
      console.log(error.message);
      // setAdding(false);
      toast.error(error.message);
    }
  };

  const updateGroupMembers = async () => {
    setAdding(true);

    const mapOfaddress = updatedMembers?.map(
      (member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`
    );

    const alreadyMembers = groupInfo?.members
      .filter((member) => member.wallet !== currentProfile?.id)
      .map((member) => member.wallet) as String[];

    const alreadyPendingmembers = groupInfo?.pendingMembers.map(
      (member) => member.wallet
    ) as String[];

    const tryingAdminMembers = groupInfo?.members
      ?.filter((member) => member.isAdmin === true)
      .map((member) => member.wallet) as String[];

    const tryingAdminPendingMembers = groupInfo?.pendingMembers
      ?.filter((member) => member.isAdmin === true)
      .map((member) => member.wallet) as String[];

    const adminMembers = adminAddresses?.map(
      (member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`
    );

    const onlyTotalMembers = [
      ...mapOfaddress,
      ...alreadyMembers,
      ...alreadyPendingmembers
    ] as Array<string>;
    const onlyAdminAddress = [
      ...adminMembers,
      ...tryingAdminMembers,
      ...tryingAdminPendingMembers
    ] as Array<string>;

    // eslint-disable-next-line no-use-before-define
    try {
      let getResponse = await handleUpdateGroup({
        totalMembers: onlyTotalMembers,
        totalAdminAddress: onlyAdminAddress
      });
      if (getResponse) {
        toast.success('Group updated successfully');
        setAdding(false);
        reset();
        setShowGroupInfoModal(false);
      }
    } catch (error) {}
  };

  // ask Nilesh about this
  const isAccountOwnerAdmin = groupInfo?.members?.some(
    (member) => member?.wallet === connectedProfile?.did && member?.isAdmin
  );

  const pendingMemberisAdmin = useCallback(async () => {
    const pendingMembersAdminlist = groupInfo?.members
      ? groupInfo?.members
          .filter((member) => member.isAdmin === true)
          .map((member) => member.wallet.split(':')[4])
      : [];
    for (const member of pendingMembersAdminlist) {
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      setAdminAddressesinPendingMembers((current) => [...current, lensProfile]);
    }
  }, [groupInfo]);

  const acceptedMember = useCallback(async () => {
    let membersList = [];
    let allPendingMembersList = [];
    await pendingMemberisAdmin();

    //members list
    const acceptedMembersList = groupInfo?.members
      ? groupInfo?.members.map((member) => member.wallet.split(':')[4])
      : [];

    for (const member of acceptedMembersList) {
      let checkList = acceptedMembers.some((item) => item.id === member);
      if (checkList) {
        return;
      }
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      setAcceptedMembers((current) => [...current, lensProfile]);
      membersList.push(lensProfile);
    }

    // admin list
    const MembersAdminlist = groupInfo?.members
      ? groupInfo?.members
          .filter((member) => member.isAdmin === true)
          .map((member) => member.wallet.split(':')[4])
      : [];
    for (const member of MembersAdminlist) {
      let checkList = toCheckAdmin?.some((item) => item.id === member);
      if (checkList) {
        return;
      }
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      setToCheckAdmin((current) => [...current, lensProfile]);
      // toCheckAdmin.push(lensProfile);
    }

    // pending members list
    const pendingMembersList = groupInfo
      ? groupInfo?.pendingMembers.map((member) => member.wallet.split(':')[4])
      : [];
    for (const member of pendingMembersList) {
      let checkList = chatProfile?.some((item) => item.id === member);
      if (checkList) {
        return;
      }
      const result = await loadLensProfiles([member]);
      const lensProfile: any = result?.get(member);
      setChatProfile((current) => [...current, lensProfile]);
      allPendingMembersList.push(lensProfile);
    }

    const trying2 = membersList
      ? membersList.map(
          (member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`
        )
      : [];

    const trying3 = allPendingMembersList
      ? allPendingMembersList.map(
          (member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`
        )
      : [];

    // eslint-disable-next-line no-use-before-define

    let getResponse = await handleUpdateGroup({
      totalMembers: [...trying2, ...trying3],
      totalAdminAddress: [...trying2]
    });
  }, [groupInfo]);

  const handleShowAllPendingMembers = () => {
    if (showPendingMembers) {
      setShowPendingMembers(false);
    } else {
      // isUserAdminaddress();
      setShowPendingMembers(true);
    }
  };

  const onProfileSelected = (profile: Profile) => {
    setShowSearchedMemberToAdd((prevMembers) => [...prevMembers, profile]);
  };

  const onAddMembers = (profile: Profile) => {
    setShowSearchedMemberToAdd(
      showSearchedMemberToAdd.filter((member) => member !== profile)
    );
    if (
      !groupInfo?.pendingMembers.some((member) =>
        member.wallet.includes(profile.id)
      ) &&
      !groupInfo?.members.some((member) =>
        member.wallet.includes(profile.id)
      ) &&
      !updatedMembers.some((member) => member.id === profile.id) &&
      updatedMembers.length < 9
    ) {
      setUpdatedMembers((prevMembers) => [...prevMembers, profile]);
      setChatProfile((prevMembers) => [...prevMembers, profile]);
    }
  };

  const onRemoveMembers = (profile: Profile) => {
    setUpdatedMembers(updatedMembers.filter((member) => member !== profile));
  };

  const onMakeAdmin = (profile: Profile) => {
    const newMembers = updatedMembers.map((member) => {
      if (member.id === profile.id) {
        return {
          ...member,
          isAdmin: true
        };
      }
      return member;
    });
    setUpdatedMembers(newMembers);
    setAdminAddresses((prevMembers) => [...prevMembers, profile]);
  };

  const removeAdmin = (profile: Profile) => {
    const newMembers = updatedMembers.map((member) => {
      if (member.id === profile.id) {
        return {
          ...member,
          isAdmin: false
        };
      }
      return member;
    });
    setAdminAddresses(
      adminAddresses.filter((member) => member.id !== profile.id)
    );
    setUpdatedMembers(newMembers);
  };

  const removeUserAdmin = (profile: Profile) => {
    const updatedAdminAddress = adminAddresses?.filter(
      (admin) => admin.id !== profile.id
    );
    setAdminAddresses(updatedAdminAddress);
    const newMembers = updatedMembers?.filter((member) => {
      if (member.id === profile.id) {
        return false;
      }
      return true;
    });
    setUpdatedMembers(newMembers);
  };

  const messageUser = (profile: Profile) => {
    router.push(`/messages/push/chat/${profile.id}`);
  };

  const onRemoveUpdateMembers = (profile: Profile) => {
    if (!groupInfo) {
      return;
    }

    const indexToRemove = groupInfo.members.findIndex((member) =>
      member.wallet.includes(profile.id)
    );
    if (indexToRemove !== -1) {
      groupInfo.pendingMembers.splice(indexToRemove, 1);
      setChatProfile(chatProfile.filter((member) => member.id !== profile.id));
      setAcceptedMembers(
        acceptedMembers.filter((member) => member.id !== profile.id)
      );
    }
  };

  const onMakeAdminUpdateMembers = (profile: Profile) => {
    if (!groupInfo) {
      return;
    }
    const indexToMakeAdmin = groupInfo.members.findIndex(
      (member) => member.wallet.includes(profile.id) && !member.isAdmin
    );
    if (indexToMakeAdmin !== -1) {
      groupInfo.members[indexToMakeAdmin].isAdmin = true;
      setAdminAddressesinPendingMembers((prevMembers) => [
        ...prevMembers,
        profile
      ]);
    } else {
      alert('User is already an admin');
    }
  };

  const onRemoveAdminUpdateMembers = (profile: Profile) => {
    if (!groupInfo) {
      return;
    }
    const indexToRemoveAdmin = groupInfo.members.findIndex(
      (member) => member.wallet.includes(profile.id) && member.isAdmin
    );
    if (indexToRemoveAdmin !== -1) {
      groupInfo.members[indexToRemoveAdmin].isAdmin = false;
      setAdminAddressesinPendingMembers(
        adminAddressesinPendingMembers.filter(
          (member) => member.id !== profile.id
        )
      );
    } else {
      alert('User is not an admin');
    }
  };

  const onRemoveUserAdmin = (profile: Profile) => {
    if (!groupInfo) {
      return;
    }
    const indexToRemove = groupInfo.members.findIndex((member) =>
      member.wallet.includes(profile.id)
    );
    if (indexToRemove !== -1) {
      groupInfo?.members.splice(indexToRemove, 1);
      setAcceptedMembers(
        acceptedMembers.filter((member) => member.id !== profile.id)
      );
    }
  };
  useEffect(() => {
    if (!groupInfo) {
      return;
    }
    acceptedMember();
  }, [groupInfo]);

  const groupInfoModal = useCallback(async () => {
    setShowGroupInfoModal(true);
  }, []);

  let modalContent: JSX.Element;
  switch (modalInfo.type) {
    case ProgressType.INITIATE:
      modalContent = (
        <div>
          <div className="flex items-center justify-center pt-4 text-center text-lg font-[500]">
            {showSearchMembers && (
              <Image
                onClick={handleGoback}
                className="absolute left-9 cursor-pointer"
                src="/push/ArrowLeft.svg"
                alt="new"
              />
            )}
            <Image
              onClick={() => setShowGroupInfoModal(false)}
              className="absolute right-9 cursor-pointer"
              src="/push/X.svg"
              alt="new"
            />
            {!showSearchMembers ? `Group Info` : `Edit Group`}
          </div>
          {!showSearchMembers && (
            <div>
              <div className="ml-9 mt-4 flex">
                <Image
                  className="h-12 w-12 rounded-full"
                  src={groupInfo?.groupImage!}
                  alt={'group name'}
                />
                <div className="relative left-4 top-1 w-[200px]">
                  <p className="text-[15px] font-[500]">
                    {groupInfo?.groupName}
                  </p>
                  {groupInfo && (
                    <p className="text-[13px] font-[400] text-[#27272A] dark:text-white">
                      {groupInfo?.members.length +
                        (groupInfo?.pendingMembers
                          ? groupInfo?.pendingMembers.length
                          : 0)}{' '}
                      members
                    </p>
                  )}
                </div>
              </div>
              <div className="ml-9 mt-6">
                <div className="flex text-[15px] font-[500]">
                  Group Description
                </div>
                <div className="text-[13px] font-[400] text-[#27272A] dark:text-white">
                  {groupInfo?.groupDescription}
                </div>
              </div>
              <div className="ml-9 mt-6 flex h-[62px] w-[85%] flex-row items-center rounded-2xl border border-[#D7D7D7] dark:border-[#3F3F46]">
                <div className="ml-[20px]">
                  <Image src="/push/lock.svg" alt="lock" />
                </div>
                <div className="ml-4">
                  <div>
                    <p className="text-[15px] font-[500]">
                      {groupInfo?.isPublic === true ? `Public` : `Private`}
                    </p>
                  </div>
                  <div className="text-[13px] font-[300] text-[#82828A]">
                    {groupInfo?.isPublic === true
                      ? `Chats are not encrypted`
                      : `Chats are encrypted`}
                  </div>
                </div>
              </div>
              {isAccountOwnerAdmin && (
                <div
                  className="ml-9 mt-3 flex h-[62px] w-[85%] cursor-pointer rounded-2xl border border-[#D7D7D7] dark:border-[#3F3F46]"
                  onClick={() => {
                    setShowSearchMembers(true);
                    setShowPendingMembers(false);
                  }}
                >
                  <div className="flex w-full items-center justify-center">
                    <div className="flex items-center justify-center text-center text-[15px] font-[500]">
                      <Image src="/push/Add.svg" className="mr-2" alt="lock" />
                      Add more wallets
                    </div>
                  </div>
                </div>
              )}
              <div className="ml-9 mt-3 max-h-[50vh] min-h-[60px] w-[85%] cursor-pointer rounded-2xl border border-[#D7D7D7] text-lg font-normal dark:border-[#3F3F46] ">
                <div onClick={handleShowAllPendingMembers}>
                  <div className="ml-4 mt-4 flex w-[200px] pb-4">
                    <div className="text-[15px] font-[500]">
                      Pending requests
                    </div>
                    <div className="bg-brand-500 absolute left-44 ml-2 mt-0 h-fit rounded-lg pl-3 pr-3 text-[14px] font-[500] text-white">
                      {groupInfo?.pendingMembers.length}
                    </div>
                  </div>
                  <div>
                    <Image
                      className={`mt-[-40px] cursor-pointer ${
                        showPendingMembers
                          ? 'ml-[380px] rotate-180'
                          : 'ml-[380px]'
                      }`}
                      src="/push/CaretRight.svg"
                      alt="arrow"
                    />
                  </div>
                </div>
                <div className=" z-50 max-h-[12rem] w-[100%] items-center justify-center overflow-auto bg-transparent">
                  {showPendingMembers && (
                    <MemberProfileList
                      isOwner={[]}
                      memberList={chatProfile}
                      adminAddress={adminAddressesinPendingMembers}
                    />
                  )}
                </div>
              </div>

              <div className="ml-[36px] mt-[10px] w-[85%] items-center justify-center">
                <MemberProfileList
                  isOwner={toCheckAdmin}
                  memberList={acceptedMembers}
                  adminAddress={adminAddressesinPendingMembers}
                  onMakeAdmin={onMakeAdminUpdateMembers}
                  onRemoveMembers={onRemoveUpdateMembers}
                  removeAdmin={onRemoveAdminUpdateMembers}
                  removeUserAdmin={onRemoveUserAdmin}
                  messageUser={messageUser}
                />
              </div>
              {isAccountOwnerAdmin && (
                <div className="mb-4 mt-4 flex items-center justify-center">
                  <Button onClick={updateGroupMembers} className="h-12 w-64">
                    {adding ? `Updating Members...` : `Update Members`}
                  </Button>
                </div>
              )}
            </div>
          )}
          {showSearchMembers && (
            <div className="flex w-full justify-center pb-4 pt-4">
              <div className="flex w-[300px] items-center">
                <Search
                  modalWidthClassName="max-w-xs"
                  placeholder={`Search for someone to message...`}
                  onProfileSelected={onProfileSelected}
                  zIndex="z-10"
                />
              </div>
            </div>
          )}
          <div className="">
            <div className="ml-[85px] w-[350px]">
              {showSearchMembers && (
                <MemberProfileList
                  isOwner={toCheckAdmin}
                  removeUserAdmin={onRemoveUserAdmin}
                  memberList={showSearchedMemberToAdd}
                  onAddMembers={onAddMembers}
                  adminAddress={adminAddresses}
                  onMakeAdmin={onMakeAdmin}
                  onRemoveMembers={onRemoveMembers}
                  removeAdmin={removeAdmin}
                />
              )}
            </div>
            <div className=" ml-[85px] w-[350px]">
              {updatedMembers && (
                <MemberProfileList
                  isOwner={toCheckAdmin}
                  removeUserAdmin={removeUserAdmin}
                  removeAdmin={removeAdmin}
                  adminAddress={adminAddresses}
                  messageUser={messageUser}
                  memberList={updatedMembers}
                  onMakeAdmin={onMakeAdmin}
                  onRemoveMembers={onRemoveMembers}
                />
              )}
            </div>
            {showSearchMembers && isAccountOwnerAdmin && (
              <div className="mb-4 mt-2 flex items-center justify-center">
                <Button
                  onClick={updateGroupMembers}
                  className="bottom-16 h-12 w-64"
                >
                  {adding ? `Adding...` : `Add Members`}
                </Button>
              </div>
            )}
          </div>
        </div>
      );
      break;
    case ProgressType.ERROR:
      modalContent = (
        <div className="flex w-full flex-col px-4 py-6">
          <div className="flex items-center justify-center pb-4 text-center text-sm font-medium text-[#EF4444]">
            <Image
              src="/xcircle.png"
              loading="lazy"
              className="mr-2 h-7 w-7 rounded-full"
              alt="Check circle"
            />{' '}
            Error: Redirecting...
          </div>
        </div>
      );
      break;
    default:
      modalContent = (
        <div className="relative flex w-full flex-col px-4 py-6">
          <button
            type="button"
            className="absolute right-0 top-0 p-1 pr-4 pt-6 text-[#82828A] dark:text-gray-100"
            onClick={() => setShowGroupInfoModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      );
  }

  return { groupInfoModal, modalContent, isModalClosable: modalClosable };
};
export default useGroupInfoModal;
