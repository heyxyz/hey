import { INVITE_WORKER_URL, STATIC_IMAGES_URL } from '@lenster/data/constants';
import { Regex } from '@lenster/data/regex';
import { INVITE } from '@lenster/data/tracking';
import { Button, Form, Input, useZodForm } from '@lenster/ui';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import { Leafwatch } from '@lib/leafwatch';
import { Plural, t, Trans } from '@lingui/macro';
import axios from 'axios';
import { type FC, useState } from 'react';
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
  const [inviting, setInviting] = useState(false);

  const form = useZodForm({
    schema: inviteSchema
  });

  const invite = async (address: string) => {
    try {
      setInviting(true);
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
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <img
          src={`${STATIC_IMAGES_URL}/emojis/handshake.png`}
          alt="Invite"
          className="h-16 w-16"
        />
        <div className="text-xl">Invite a Fren</div>
        <p className="lt-text-gray-500">
          <Trans>
            Send invites to your frens so they can create an Lens account. You
            can invite a user only once.
          </Trans>
        </p>
        <div className="pt-2 font-mono text-lg">
          <Trans>
            <b>
              {invitesLeft}{' '}
              <Plural
                value={invitesLeft}
                zero="invite"
                one="invite"
                other="invites"
              />
            </b>{' '}
            available!
          </Trans>
        </div>
      </div>
      {invitesLeft !== 0 ? (
        <Form
          form={form}
          className="mt-5 space-y-4"
          onSubmit={async ({ address }) => {
            await invite(address);
          }}
        >
          <Input
            className="text-sm"
            type="text"
            placeholder="0x3A5bd...5e3"
            {...form.register('address')}
          />
          <Button type="submit" disabled={inviting}>
            <Trans>Invite</Trans>
          </Button>
        </Form>
      ) : null}
    </div>
  );
};

export default Invite;
