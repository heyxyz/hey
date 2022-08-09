import { Card } from '@components/UI/Card';
import React, { FC } from 'react';

interface Props {
  type?: string;
}

const HiddenPublication: FC<Props> = ({ type = 'Publication' }) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="py-3 px-4 text-sm italic">{type} was hidden by the author</div>
    </Card>
  );
};

export default HiddenPublication;
