import type { FC } from 'react';

import { APP_NAME } from '@hey/data/constants';
import { Card, CardHeader } from '@hey/ui';

import EmailForm from './EmailForm';

const Email: FC = () => {
  return (
    <Card>
      <CardHeader
        body={`You will receive updates on new features and promotions from ${APP_NAME} to your email address`}
        title="Set Email"
      />
      <div className="m-5">
        <EmailForm />
      </div>
    </Card>
  );
};

export default Email;
