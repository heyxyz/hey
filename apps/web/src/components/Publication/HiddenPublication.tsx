import { Card } from '@components/UI/Card';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

interface HiddenPublicationProps {
  type?: string;
}

const HiddenPublication: FC<HiddenPublicationProps> = ({ type = 'Publication' }) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="py-3 px-4 text-sm">
        <Trans>{type} was hidden by the author</Trans>
      </div>
    </Card>
  );
};

export default HiddenPublication;
