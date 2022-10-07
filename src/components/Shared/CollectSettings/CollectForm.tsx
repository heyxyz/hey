import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { EnabledModulesDocument } from '@generated/types';
import { Dispatch, FC } from 'react';

interface Props {
  setShowModal: Dispatch<boolean>;
}

const CollectForm: FC<Props> = ({ setShowModal }) => {
  const { error, data, loading } = useQuery(EnabledModulesDocument);

  if (loading) {
    return (
      <div className="py-3.5 px-5 space-y-2 font-bold text-center">
        <Spinner size="md" className="mx-auto" />
        <div>Loading collect settings</div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage className="p-5" title="Failed to load modules" error={error} />;
  }

  return <div className="py-3.5 px-5 space-y-3">gm</div>;
};

export default CollectForm;
