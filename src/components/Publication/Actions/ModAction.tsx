import { Button } from '@components/UI/Button';
import { LensterPublication } from '@generated/lenstertypes';
import { ShieldCheckIcon } from '@heroicons/react/outline';
import React, { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface Props {
  publication: LensterPublication;
}

const ModAction: FC<Props> = ({ publication }) => {
  const setShowReportModal = useGlobalModalStateStore((state) => state.setShowReportModal);

  return (
    <Button
      onClick={(event) => {
        event.stopPropagation();
        setShowReportModal(true, publication);
      }}
      icon={<ShieldCheckIcon className="h-4 w-4" />}
      className="text-sm mt-3"
    >
      Report
    </Button>
  );
};

export default ModAction;
