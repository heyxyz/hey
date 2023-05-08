import Search from '@components/Shared/Navbar/Search';
import Slug from '@components/Shared/Slug';
import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import { useRef, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { usePushChatStore } from 'src/store/push-chat';
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
type ProgressHookType = {
  level: ProgressType;
};

type memberProfileListType = {
  memberList: Profile[];
  isAddedMembersList?: boolean;
  onAddMembers?: (profile: Profile) => void;
};

const MemberProfileList = ({
  memberList,
  isAddedMembersList = false,
  onAddMembers
}: memberProfileListType) => {
  return (
    <div className="flex flex-col gap-2 py-2">
      {memberList.map((member, i) => (
        //  put styles into a object
        <div
          className={clsx(
            isAddedMembersList ? 'border border-gray-300 ' : 'bg-gray-100',
            'flex flex-row items-center justify-between rounded-xl  px-4 py-2'
          )}
          key={`${member.ownedBy}${i}`}
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

          {!onAddMembers && (
            <div className="w-fit cursor-pointer">
              <img className="h-10 w-9" src="/push/more.svg" alt="plus icon" />
            </div>
          )}
          {/* change to icon for Add + */}
          {onAddMembers && (
            <div
              className="rounded-lg border border-violet-600 px-2 text-violet-600"
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

  const [modalInfo, setModalInfo] = useState<{
    title: string;
    type: string;
  }>({
    title: '',
    type: ProgressType.INITIATE
  });

  const isModalInputsEmpty = (): boolean => {
    //add error message for min length of group name and description
    if (step === 1 && (!groupDescription || !groupName || !groupType)) {
      return true;
    }
    if (step === 2 && !members.length) {
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
    setModalClosable(true);
  };

  const handleCreateGroupCall = async () => {
    if (!signer || !currentProfile) {
      return;
    }
    try {
      const memberAddressList = members.map((member) => member.ownedBy);
      //add dummy group image if image not uploaded

      //sdk call for create group

      // await PushAPI.chat.createGroup({
      //   groupName,
      //   groupDescription: groupDescription as string,
      //   members: memberAddressList,
      //   groupImage: groupImage as string,
      //   admins: [],
      //   isPublic: true,
      //   signer: signer,
      //   pgpPrivateKey: decryptedPgpPvtKey as string //decrypted private key
      //   env:PUSH_ENV
      // });
      setShowCreateGroupModal(false);
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
      handleCreateGroupCall();
      setModalClosable(false);
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
      !members.some((member) => member.ownedBy === profile.ownedBy) &&
      members.length < 9 &&
      profile.ownedBy !== currentProfile?.ownedBy
    ) {
      setMembers((prevMembers) => [...prevMembers, profile]);
    }
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
              <div className="rounded-4xl my-4 w-fit cursor-pointer bg-gray-100 p-10">
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
        <div className="relative flex w-full flex-col px-8 py-6">
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
          <div className="mb-4 mt-1  text-center text-xl font-medium">{modalInfo.title}</div>
          <div className="flex flex-row justify-between pt-4 text-base">
            <span className="font-medium">Add users</span>
            <span className="text-sm text-slate-500">{`0${
              members?.length ? members?.length : ''
            } / 09 Members`}</span>
          </div>
          <div className="w-full pt-4">
            <Search
              modalWidthClassName="max-w-xs"
              placeholder={`Search for someone to message...`}
              onProfileSelected={onProfileSelected}
              zIndex="z-10"
            />
          </div>
          {!!searchedMembers && !!searchedMembers.length && (
            <MemberProfileList memberList={searchedMembers} onAddMembers={onAddMembers} />
          )}
          <div className="mt-5">
            {!!members && !!members.length && <MemberProfileList memberList={members} />}
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
