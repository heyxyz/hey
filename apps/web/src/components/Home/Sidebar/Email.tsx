import type { FC } from 'react';

import EmailForm from '@components/Settings/Account/Email/EmailForm';
import { Card } from '@hey/ui';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

const Email: FC = () => {
  const { email } = usePreferencesStore();

  if (email) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <p className="text-lg font-semibold">Set Email</p>
      <p className="text-sm leading-[22px]">
        You will receive updates on new features and promotions from Hey to your
        email address
      </p>
      <EmailForm fullWidthButton hideLabel />
    </Card>
  );
};

export default Email;
