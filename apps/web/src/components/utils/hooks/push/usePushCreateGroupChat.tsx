import Search from '@components/Shared/Navbar/Search';
import Slug from '@components/Shared/Slug';
import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline';
import * as PushAPI from '@pushprotocol/restapi';
import clsx from 'clsx';
import { LENSHUB_PROXY } from 'data/constants';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import router from 'next/router';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV, usePushChatStore } from 'src/store/push-chat';
import { Button, Image, Input } from 'ui';
import { useSigner } from 'wagmi';

type handleSetPassFunc = () => void;
enum ProgressType {
  INITIATE = 'INITIATE',
  ADDMEMBERS = 'ADDMEMBERS',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARN = 'WARN'
}

type groupOptionsType = {
  id: number;
  title: string;
  subTitle: string;
  value: boolean;
};

const groupOptions: Array<groupOptionsType> = [
  {
    id: 1,
    title: 'Public',
    subTitle: 'Chats are not encrypted',
    value: true
  },
  {
    id: 2,
    title: 'Private',
    subTitle: 'Chats are encrypted',
    value: false
  }
];

const randomGroupImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==`;

type ProgressHookType = {
  level: ProgressType;
};

type memberProfileListType = {
  memberList: Profile[];
  isAddedMembersList?: boolean;
  onAddMembers?: (profile: Profile) => void;
  onRemoveMembers?: (profile: Profile) => void;
  onMakeAdmin?: (profile: Profile) => void;
  adminAddress: Profile[];
  removeAdmin?: (profile: Profile) => void;
  removeUserAdmin?: (profile: Profile) => void;
};

const MemberProfileList = ({
  memberList,
  isAddedMembersList = false,
  onAddMembers,
  onRemoveMembers,
  onMakeAdmin,
  adminAddress,
  removeAdmin,
  removeUserAdmin
}: memberProfileListType) => {
  // have used this state instead of boolean since if I used boolean than I still had to check if the user id is equal to the id selected to make it unique and open only that modal which is suppose to open and not open every modal
  const [showModalgroupOptions, setShowModalgroupOptions] = useState(-1);
  const [showModalAdmingroupOptions, setShowModalAdmingroupOptions] = useState(-2);

  const handleRemoveClick = (profile: Profile) => {
    if (onRemoveMembers) {
      onRemoveMembers(profile);
      setShowModalgroupOptions(-1);
    }
  };

  const handleMakeAdmin = (profile: Profile) => {
    if (onMakeAdmin) {
      onMakeAdmin(profile);
      setShowModalAdmingroupOptions(-2);
      setShowModalgroupOptions(-1);
    }
  };

  const handleRemoveAdmin = (profile: Profile) => {
    if (removeAdmin) {
      removeAdmin(profile);
      setShowModalAdmingroupOptions(-2);
    }
  };

  const handleRemoveUseradmin = (profile: Profile) => {
    if (removeUserAdmin) {
      removeUserAdmin(profile);
      setShowModalAdmingroupOptions(-2);
    }
  };

  const handleRemoveModal = () => {
    if (showModalAdmingroupOptions !== -2) {
      setShowModalAdmingroupOptions(-2);
    } else if (showModalgroupOptions !== -1) {
      setShowModalgroupOptions(-1);
    }
  };

  const setShowCreateGroupModal = usePushChatStore((s) => s.setShowCreateGroupModal);

  const onProfileSelected = (profile: Profile) => {
    setShowCreateGroupModal(false);
    router.push(`/messages/push/chat/${profile.id}`);
  };
  const isAdmin = (member: Profile) => {
    const isAdmin = adminAddress.some((admin) => admin.id === member.id);
    return isAdmin;
  };

  return (
    <div className="flex flex-col gap-2 py-2" onClick={handleRemoveModal}>
      {memberList.map((member, i) => (
        //  put styles into a object
        <div
          className={clsx(
            isAddedMembersList ? 'border border-gray-300 ' : 'bg-gray-100',
            'flex flex-row items-center justify-between rounded-xl  px-2 py-2'
          )}
          key={`${member.id}${i}`}
        >
          <div className="flex flex-row items-center">
            <Image
              onError={({ currentTarget }) => {
                currentTarget.src = getAvatar(member, false);
              }}
              src={getAvatar(member)}
              className="mr-2 h-14 w-14 rounded-full border bg-gray-200 dark:border-gray-700"
              alt={formatHandle(member?.handle)}
            />

            <div className="flex flex-col">
              <p className="truncate font-bold">{member?.name ?? formatHandle(member?.handle)}</p>
              <Slug className="text-sm" slug={formatHandle(member?.handle)} prefix="@" />
            </div>
          </div>
          {isAdmin(member) && !onAddMembers ? (
            <div className="absolute left-[250px] rounded-lg bg-[#E5DAFF] pb-1 pl-2.5 pr-2.5 pt-1 text-xs text-[#8B5CF6]">
              Admin
            </div>
          ) : (
            <div />
          )}
          {!onAddMembers && (
            <div className="relative flex">
              <div
                className="w-fit cursor-pointer"
                onClick={() => setShowModalgroupOptions(showModalgroupOptions === i ? -1 : i)}
              >
                <img className="h-10 w-9" src="/push/more.svg" alt="more icon" />
              </div>
              {showModalgroupOptions === i && (
                <div
                  key={`${member.id}${i}`}
                  className="absolute right-[-16px] z-50 mt-[-17px] w-[260px] rounded-lg border border-gray-300 bg-white p-4 p-4"
                >
                  <div
                    className="flex cursor-pointer p-[8px] text-lg font-medium"
                    onClick={() => onProfileSelected(member)}
                  >
                    <Image
                      src="/push/createmessage.svg"
                      className="mt-[4px] h-[21px] pr-[10px]"
                      alt="remove icon"
                    />
                    <div className="text-lg font-[450]">Message user</div>
                  </div>
                  <div
                    className="flex cursor-pointer p-[8px] text-lg font-medium"
                    onClick={() => (isAdmin(member) ? handleRemoveAdmin(member) : handleMakeAdmin(member))}
                  >
                    <Image
                      src={isAdmin(member) ? '/push/dismissadmin.svg' : '/push/Shield.svg'}
                      className="h-[25px] pr-[10px]"
                      alt="admin icon"
                    />
                    <div className="text-lg font-[450]">
                      {isAdmin(member) ? `Dismiss as admin` : `Make group admin`}
                    </div>
                  </div>
                  <div
                    className="flex cursor-pointer p-[8px] text-lg font-medium"
                    onClick={() =>
                      isAdmin(member) ? handleRemoveUseradmin(member) : handleRemoveClick(member)
                    }
                  >
                    <Image src="/push/MinusCircle.svg" className="h-[25px] pr-[10px]" alt="remove icon" />
                    <div className="text-lg font-[450] text-red-600">Remove</div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* change to icon for Add + */}
          {onAddMembers && (
            <div
              className="cursor-pointer rounded-lg border border-violet-600 px-2 text-violet-600"
              onClick={() => onAddMembers(member)}
            >
              <span className="text-sm">Add</span> <span className="text-base">+</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const useCreateGroup = () => {
  const { data: signer } = useSigner();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowCreateGroupModal = usePushChatStore((state) => state.setShowCreateGroupModal);
  const [step, setStep] = useState<number>(1);
  const [modalClosable, setModalClosable] = useState<boolean>(true);
  const [groupName, setGroupName] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [groupType, setGroupType] = useState<groupOptionsType | null>(null);
  const [searchedMembers, setSearchedMembers] = useState<Array<Profile>>([]);
  const [members, setMembers] = useState<Array<Profile>>([]);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const [adminAddresses, setAdminAddresses] = useState<Profile[]>([]);

  const [modalInfo, setModalInfo] = useState<{
    title: string;
    type: string;
  }>({
    title: '',
    type: ProgressType.INITIATE
  });

  const memberAddressList = members
    .filter((member) => !adminAddresses.some((admin) => admin.id === member.id))
    .map((member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`);

  const isModalInputsEmpty = (): boolean => {
    //add error message for min length of group name and description
    if (step === 1 && (!groupDescription || !groupName || !groupType)) {
      return true;
    }
    if (step === 2 && !memberAddressList.length) {
      return true;
    }

    return false;
  };

  const handleProgress = (progress: ProgressHookType) => {
    setStep((step) => step + 1);
    setModalInfo({
      title: 'Create Group',
      type: progress.level
    });

    if (progress.level === 'SUCCESS') {
      const timeout = 2000; // after this time, modal will be closed
      setTimeout(() => {
        setShowCreateGroupModal(false);
      }, timeout);
    }
  };

  const initiateProcess = () => {
    setStep(1);
    setModalInfo({
      title: 'Create Group',
      type: ProgressType.INITIATE
    });
  };

  const handleCreateGroupCall = async () => {
    if (!signer || !currentProfile || !decryptedPgpPvtKey) {
      return;
    }

    try {
      const adminAddressList = adminAddresses.map(
        (member) => `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${member.id}`
      );

      //sdk call for create group
      try {
        const response = await PushAPI.chat.createGroup({
          groupName,
          groupDescription: groupDescription,
          members: memberAddressList,
          groupImage: groupImage ?? randomGroupImage,
          admins: adminAddressList, // pass the adminAddresses array here
          isPublic: groupType?.value ?? true,
          account: `nft:eip155:${CHAIN_ID}:${LENSHUB_PROXY}:${currentProfile.id}`,
          pgpPrivateKey: decryptedPgpPvtKey, //decrypted private key
          env: PUSH_ENV
        });
        console.log(response);
        if (response) {
          toast.success(`Successfully created group`);
        }
        setShowCreateGroupModal(false);
        if (response) {
          router.push(`/messages/push/group/${response.chatId}`);
        }
      } catch (error: Error | any) {
        console.log(error.message);
        setModalClosable(true);
        if (error.message === `Group name ${groupName} already exists`) {
          toast.error(`Group name ${groupName} already exists`);
        }
      }
    } catch (error) {
      console.log(error);
      setModalClosable(true);
      // // handle error here
      // const timeout = 3000; // after this time, show modal state to 1st step
      // setTimeout(() => {
      //   initiateProcess();
      // }, timeout);
    }
  };

  const handleChange = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }
    if (!e.target.files) {
      return;
    }
    if ((e.target as HTMLInputElement).files && ((e.target as HTMLInputElement).files as FileList).length) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onloadend = function () {
        setGroupImage(reader.result as string);
      };
    }
  };

  const handleNext: handleSetPassFunc = async () => {
    if (step === 1 && !isModalInputsEmpty()) {
      handleProgress({ level: ProgressType.ADDMEMBERS });
    }
    if (step === 2 && !isModalInputsEmpty()) {
      try {
        handleCreateGroupCall();
        setModalClosable(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePrevious = (progress: ProgressHookType) => {
    setStep((step) => step - 1);
    setModalInfo({
      title: 'Create Group',
      type: progress.level
    });
  };

  const resetStates = () => {
    setGroupImage(null);
    setGroupDescription('');
    setGroupName('');
    setGroupType(null);
    setMembers([]);
    setSearchedMembers([]);
    setAdminAddresses([]);
    setModalClosable(true);
  };
  const createGroup = async () => {
    setShowCreateGroupModal(true);
    resetStates();
    initiateProcess();
  };

  const onProfileSelected = (profile: Profile) => {
    setSearchedMembers((prevMembers) => [...prevMembers, profile]);
  };

  const onAddMembers = (profile: Profile) => {
    setSearchedMembers(searchedMembers.filter((item) => item !== profile));

    //add error message for these conditons
    if (
      !members.some((member) => member.id === profile.id) &&
      memberAddressList.length + adminAddresses.length < 9 &&
      !adminAddresses.some((member) => member.id === profile.id) &&
      profile.id !== currentProfile?.id
    ) {
      setMembers((prevMembers) => [...prevMembers, profile]);
    }
  };

  const onRemoveMembers = (profile: Profile) => {
    setMembers(members.filter((item) => item !== profile));
  };

  const onMakeadmin = (profile: Profile) => {
    // Check if the user is already an admin
    if (adminAddresses.some((admin) => admin.id === profile.id)) {
      return;
    }

    // Update the member's `isAdmin` property to true
    const updatedMembers = members.map((member) => {
      if (member.id === profile.id) {
        return {
          ...member,
          isAdmin: true
        };
      }
      return member;
    });
    // Update the state with the updated members list
    setMembers(updatedMembers);
    // Add the user to the `adminAddresses` array
    setAdminAddresses((adminAddresses) => [...adminAddresses, profile]);
  };

  const removeAdmin = (profile: Profile) => {
    // Update the member's `isAdmin` property to false
    const updatedMembers = members.map((member) => {
      if (member.id === profile.id) {
        return {
          ...member,
          isAdmin: false
        };
      }
      return member;
    });
    // Update the state with the updated members list
    setMembers(updatedMembers);
    // Remove the user from the `adminAddresses` array
    setAdminAddresses(adminAddresses.filter((admin) => admin.id !== profile.id));
  };

  const removeUserAdmin = (profile: Profile) => {
    // Remove the user from the `adminAddresses` array
    const updatedAdminAddresses = adminAddresses.filter((admin) => admin.id !== profile.id);
    setAdminAddresses(updatedAdminAddresses);

    // Update the member's `isAdmin` property to false and remove from the `members` array
    const updatedMembers = members.filter((member) => {
      if (member.id === profile.id) {
        return false;
      }
      return true;
    });
    setMembers(updatedMembers);
  };

  const handleUpload = () => {
    if (fileUploadInputRef.current) {
      fileUploadInputRef.current.click();
    }
  };

  let modalContent: JSX.Element;
  switch (modalInfo.type) {
    case ProgressType.INITIATE:
      modalContent = (
        <div className="relative flex w-full flex-col px-8 py-6">
          <button
            type="button"
            className="absolute right-0 top-0 p-1 pr-4 pt-8 text-[#82828A] dark:text-gray-100"
            onClick={() => setShowCreateGroupModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="mb-4 mt-1  text-center text-xl font-medium">{modalInfo.title}</div>

          <div onClick={handleUpload} className=" w-fit cursor-pointer self-center">
            {!!!groupImage && (
              <div className="my-4 w-fit cursor-pointer rounded-[2.5rem] bg-gray-100 p-10">
                <img className="h-11 w-11" src="/push/uploadImage.svg" alt="plus icon" />
              </div>
            )}
            {!!groupImage && (
              <div className="my-4 h-28 w-28 cursor-pointer overflow-hidden rounded-3xl">
                <img className="h-full w-full" src={groupImage} alt="group image" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileUploadInputRef}
              onChange={(e) => handleChange(e as unknown as Event)}
            />
          </div>

          <div className="my-4">
            <div className="flex items-center justify-between">
              <div className="pb-2 text-base font-medium">Group Name</div>
              <span className="text-sm text-slate-500">{50 - groupName.length}</span>
            </div>
            <Input
              type="text"
              className="px-4 py-4 text-sm"
              value={groupName}
              autoComplete="off"
              onChange={(e) => setGroupName(e.target.value.slice(0, 50))}
            />
          </div>
          <div className="my-4">
            <div className="flex items-center justify-between">
              <div className="pb-2 text-base font-medium">Group Description</div>
              <span className="text-sm text-slate-500">{150 - groupDescription.length}</span>
            </div>
            <Input
              type="text"
              className="px-4 py-4 text-sm"
              value={groupDescription}
              autoComplete="off"
              onChange={(e) => setGroupDescription(e.target.value.slice(0, 150))}
            />
          </div>
          <div className="my-4 flex flex-row justify-center">
            {groupOptions.map((option) => (
              <div
                className={clsx(
                  option.id === 1 ? 'rounded-l-xl' : 'rounded-r-xl border-l-0',
                  groupType?.id === option.id ? 'bg-gray-100' : 'transparent',
                  'justigy-center flex w-1/2 cursor-pointer flex-col items-center border  border-gray-300 px-2 py-2 hover:bg-gray-100'
                )}
                key={option.id}
                onClick={() => setGroupType(option)}
              >
                <p className="text-base font-medium">{option?.title}</p>
                <p className="text-center text-xs font-thin text-gray-400">{option?.subTitle}</p>
              </div>
            ))}
          </div>
          <Button
            className="mb-2 mt-4 self-center border-2 text-center"
            variant="primary"
            disabled={isModalInputsEmpty()}
            onClick={handleNext}
          >
            <span className="px-8">Next</span>
          </Button>
        </div>
      );
      break;
    case ProgressType.ADDMEMBERS:
      modalContent = (
        <div className="relative flex max-h-[700px] w-full flex-col overflow-auto px-8 py-6">
          <button
            type="button"
            className="absolute left-0 top-0 p-1 pl-4 pt-7 text-[#82828A] dark:text-gray-100"
            onClick={() => handlePrevious({ level: ProgressType.INITIATE })}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-0 top-0 p-1 pr-4 pt-6 text-[#82828A] dark:text-gray-100"
            onClick={() => setShowCreateGroupModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="mb-4 mt-1 text-center text-xl font-medium">{modalInfo.title}</div>
          <div className="flex flex-row justify-between pt-4 text-base">
            <span className="font-medium">Add users</span>
            <span className="text-sm text-slate-500">{`0${
              memberAddressList?.length || adminAddresses.length
                ? memberAddressList?.length + adminAddresses.length
                : ''
            } / 09 Members`}</span>
          </div>
          <div className="h-fit w-full pt-4">
            <Search
              modalWidthClassName="max-w-xs"
              placeholder={`Search for someone to message...`}
              onProfileSelected={onProfileSelected}
              zIndex="z-10"
            />
          </div>
          {searchedMembers && (
            <MemberProfileList
              memberList={searchedMembers}
              adminAddress={adminAddresses}
              onAddMembers={onAddMembers}
              onMakeAdmin={onMakeadmin}
              removeAdmin={removeAdmin}
              removeUserAdmin={removeUserAdmin}
            />
          )}
          <div className="mt-5">
            {!!members && !!members.length && (
              <MemberProfileList
                memberList={members}
                adminAddress={adminAddresses}
                removeUserAdmin={removeUserAdmin}
                removeAdmin={removeAdmin}
                onMakeAdmin={onMakeadmin}
                onRemoveMembers={onRemoveMembers}
              />
            )}
          </div>
          <Button
            className="mb-2 mt-4 self-center border-2 text-center"
            variant="primary"
            disabled={isModalInputsEmpty()}
            onClick={handleNext}
          >
            <span className="px-8">{modalClosable ? 'Create Group' : 'Creating Group...'}</span>
          </Button>
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
            onClick={() => setShowCreateGroupModal(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="pb-4 text-center text-base font-medium">{modalInfo.title}</div>
        </div>
      );
  }

  return { createGroup, modalContent, isModalClosable: modalClosable };
};

export default useCreateGroup;
