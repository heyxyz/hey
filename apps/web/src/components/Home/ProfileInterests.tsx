import Interests from '@components/Shared/Interests';
import { Modal } from '@components/UI/Modal';
import { BookmarkIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const ProfileInterests: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (currentProfile?.interests?.length) {
    return null;
  }

  return (
    <Modal
      size="md"
      title="Select Profile Interests"
      icon={<BookmarkIcon className="h-5 w-5 text-brand" />}
      show={!currentProfile?.interests?.length}
    >
      <div className="p-5 max-h-[60vh] w-full no-scrollbar overflow-y-auto">
        <Interests />
      </div>
    </Modal>
  );
};

export default ProfileInterests;
