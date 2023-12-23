import type { FC } from 'react';

import { ADDRESS_PLACEHOLDER, STATIC_IMAGES_URL } from '@hey/data/constants';
import { Regex } from '@hey/data/regex';
import { INVITE } from '@hey/data/tracking';
import { useInviteMutation } from '@hey/lens';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import plur from 'plur';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { object, string } from 'zod';

const inviteSchema = object({
  address: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(Regex.ethereumAddress, { message: 'Invalid Ethereum address' })
});

interface InviteProps {
  invitesLeft: number;
  refetch: () => void;
}

const Invite: FC<InviteProps> = ({ invitesLeft, refetch }) => {
  const [inviting, setInviting] = useState(false);
  const [totalInvitesLeft, setTotalInvitesLeft] = useState(invitesLeft);

  const form = useZodForm({
    schema: inviteSchema
  });

  const onError = (error: any) => {
    setInviting(false);
    errorToast(error);
  };

  const [inviteAddress] = useInviteMutation({
    onCompleted: async () => {
      // TODO: use apollo cache instead of refetch
      await refetch();
      form.reset();
      setInviting(false);
      setTotalInvitesLeft(totalInvitesLeft - 1);
      Leafwatch.track(INVITE.INVITE);

      return toast.success('Invited successfully!');
    },
    onError
  });

  const invite = async (address: string) => {
    try {
      setInviting(true);

      return await inviteAddress({
        variables: { request: { invites: [address] } }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <img
          alt="Invite"
          className="size-16"
          src={`${STATIC_IMAGES_URL}/emojis/handshake.png`}
        />
        <div className="text-xl">Invite a Fren</div>
        <p className="ld-text-gray-500">
          Send invites to your frens so they can create an Lens account. You can
          invite a user only once.
        </p>
        <div className="pt-2 font-mono text-lg">
          <b>
            {totalInvitesLeft} {plur('invite', totalInvitesLeft)}
          </b>{' '}
          available!
        </div>
      </div>
      {totalInvitesLeft !== 0 ? (
        <Form
          className="mt-5 space-y-4"
          form={form}
          onSubmit={async ({ address }) => {
            await invite(address);
          }}
        >
          <Input
            className="text-sm"
            placeholder={ADDRESS_PLACEHOLDER}
            type="text"
            {...form.register('address')}
          />
          <Button disabled={inviting} type="submit">
            Invite
          </Button>
        </Form>
      ) : null}
    </div>
  );
};

export default Invite;
