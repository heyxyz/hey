import { TicketIcon } from '@heroicons/react/outline';
import { INVITE_WORKER_URL } from '@lenster/data/constants';
import { Regex } from '@lenster/data/regex';
import { INVITE } from '@lenster/data/tracking';
import { Button, EmptyState, Form, Input, useZodForm } from '@lenster/ui';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { object, string } from 'zod';

const inviteSchema = object({
  address: string()
    .max(42, { message: t`Ethereum address should be within 42 characters` })
    .regex(Regex.ethereumAddress, { message: t`Invalid Ethereum address` })
});

interface InviteProps {
  invitesLeft: number;
  refetch: () => void;
}

const Invite: FC<InviteProps> = ({ invitesLeft, refetch }) => {
  const form = useZodForm({
    schema: inviteSchema
  });

  if (invitesLeft === 0) {
    return (
      <EmptyState
        message={
          <div>
            <Trans>You don't have any invites left!</Trans>
          </div>
        }
        icon={<TicketIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  const invite = async (address: string) => {
    try {
      const data = await axios.post(INVITE_WORKER_URL, {
        address,
        ...getBasicWorkerPayload()
      });

      if (!data.data.alreadyInvited) {
        await refetch();
        form.reset();
        Leafwatch.track(INVITE.INVITE);

        return toast.success(t`Invited successfully!`);
      }

      return toast.error(t`Address already invited!`);
    } catch {
      return toast.error(t`Failed to invite!`);
    }
  };

  return (
    <div>
      <div className="text-lg">
        <Trans>
          You have <b>{invitesLeft} invites</b> left!
        </Trans>
      </div>
      <Form
        form={form}
        className="mt-5 space-y-4"
        onSubmit={async ({ address }) => {
          await invite(address);
        }}
      >
        <Input
          className="text-sm"
          label={t`Enter Ethereum address`}
          type="text"
          placeholder="0x3A5bd...5e3"
          {...form.register('address')}
        />
        <Button type="submit">Invite</Button>
      </Form>
    </div>
  );
};

export default Invite;
