import { Button } from '@components/UI/Button';
import { LensterPublication } from '@generated/lenstertypes';
import { ShieldCheckIcon } from '@heroicons/react/outline';
import React, { FC } from 'react';

interface Props {
  publication: LensterPublication;
}

const ModAction: FC<Props> = ({ publication }) => {
  return (
    <Button
      onClick={(event) => {
        event.stopPropagation();
      }}
      icon={<ShieldCheckIcon className="h-4 w-4" />}
      className="text-sm mt-3"
    >
      Report
    </Button>
  );
};

export default ModAction;
