import CommunityProfile from '@components/Shared/CommunityProfile';
import { ExclamationIcon, TrashIcon } from '@heroicons/react/outline';
import { Errors } from '@lenster/data/errors';
import type { Community } from '@lenster/types/communities';
import { Button, Card, Modal, Spinner, WarningMessage } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface DeleteProps {
  community: Community;
}

const DeleteSettings: FC<DeleteProps> = ({ community }) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
    } catch (error) {
      return toast.error(Errors.SomethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="space-y-5 p-5">
      <CommunityProfile community={community as Community} />
      <div className="text-lg font-bold text-red-500">
        <Trans>This will delete your Lens Community</Trans>
      </div>
      <p>
        <Trans>
          This will permanently delete your Community on the Lenster. Your
          community members will not be able to access this community. All your
          community data will be wiped out immediately and you won't be able to
          get it back.
        </Trans>
      </p>
      <div className="text-lg font-bold">What else you should know</div>
      <div className="lt-text-gray-500 divide-y text-sm dark:divide-gray-700">
        <p className="pb-3">
          <Trans>
            You cannot restore your Lenster Community if it was accidentally or
            wrongfully deleted.
          </Trans>
        </p>
      </div>
      <Button
        variant="danger"
        icon={
          isLoading ? (
            <Spinner variant="danger" size="xs" />
          ) : (
            <TrashIcon className="h-5 w-5" />
          )
        }
        disabled={isLoading}
        onClick={() => setShowWarningModal(true)}
      >
        {isLoading ? t`Deleting...` : t`Delete your account`}
      </Button>
      <Modal
        title={t`Danger Zone`}
        icon={<ExclamationIcon className="h-5 w-5 text-red-500" />}
        show={showWarningModal}
        onClose={() => setShowWarningModal(false)}
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            title="Are you sure?"
            message={
              <div className="leading-6">
                <Trans>
                  Confirm that you have read all consequences and want to delete
                  your account anyway
                </Trans>
              </div>
            }
          />
          <Button
            variant="danger"
            icon={<TrashIcon className="h-5 w-5" />}
            onClick={async () => {
              setShowWarningModal(false);
              await handleDelete();
            }}
          >
            <Trans>Yes, delete my community</Trans>
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default DeleteSettings;
