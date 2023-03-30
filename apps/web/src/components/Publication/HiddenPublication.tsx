import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { Card } from 'ui';

interface HiddenPublicationProps {
  type?: string;
}

const HiddenPublication: FC<HiddenPublicationProps> = ({ type = 'Publication' }) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="px-4 py-3 text-sm">
        <Trans>{type} was hidden by the author</Trans>
      </div>
    </Card>
  );
};

export default HiddenPublication;
