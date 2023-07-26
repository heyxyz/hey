import { PencilIcon } from '@heroicons/react/outline';
import { COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
import type { Community } from '@lenster/types/communities';
import {
  Button,
  Card,
  Form,
  Input,
  Spinner,
  TextArea,
  useZodForm
} from '@lenster/ui';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { object, string, union } from 'zod';

const editProfileSchema = object({
  name: string()
    .max(100, {
      message: t`Name should not exceed 100 characters`
    })
    .regex(Regex.profileNameValidator, {
      message: t`Community name must not contain restricted symbols`
    }),
  slug: string().min(1, { message: t`Slug should not be empty` }),
  website: union([
    string().regex(Regex.url, { message: t`Invalid website` }),
    string().max(0)
  ]),
  twitter: string().max(100, {
    message: t`Twitter should not exceed 100 characters`
  }),
  description: string().max(260, {
    message: t`description should not exceed 260 characters`
  })
});

interface ProfileSettingsFormProps {
  community: Community;
}

const ProfileSettingsForm: FC<ProfileSettingsFormProps> = ({ community }) => {
  const { push } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [submitting, setSubmitting] = useState(false);

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      name: community?.name ?? '',
      slug: community?.slug ?? '',
      website: community?.website,
      twitter: community?.twitter?.replace(/(https:\/\/)?twitter\.com\//, ''),
      description: community?.description ?? ''
    }
  });

  const editProfile = async (
    name: string,
    slug: string,
    website?: string | null,
    twitter?: string | null,
    description?: string | null
  ) => {
    setSubmitting(true);
    try {
      const { data } = await axios(
        `${COMMUNITIES_WORKER_URL}/community/createOrUpdate`,
        {
          method: 'POST',
          data: {
            id: community?.id,
            name,
            slug,
            website,
            twitter,
            description,
            profileId: currentProfile?.id,
            ...getBasicWorkerPayload()
          }
        }
      );

      if (data.id) {
        toast.success(t`Community updated`);
      }
    } catch (error) {
      toast.error(Errors.SomethingWentWrong);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-5">
      <Form
        form={form}
        className="space-y-4"
        onSubmit={({ name, slug, website, twitter, description }) => {
          editProfile(name, slug, website, twitter, description);
        }}
      >
        <Input label={t`Id`} type="text" value={community?.id} disabled />
        <Input
          label={t`Name`}
          type="text"
          placeholder="Azuki"
          {...form.register('name')}
        />
        <Input label={t`Slug`} type="text" value={community?.slug} disabled />
        <Input
          label={t`Website`}
          type="text"
          placeholder="https://hooli.com"
          {...form.register('website')}
        />
        <Input
          label={t`Twitter`}
          type="text"
          prefix="https://twitter.com"
          placeholder="gavin"
          {...form.register('twitter')}
        />
        <TextArea
          label={t`Description`}
          placeholder={t`Describe your community`}
          {...form.register('description')}
        />
        <Button
          className="ml-auto"
          type="submit"
          disabled={submitting}
          icon={
            submitting ? (
              <Spinner size="xs" />
            ) : (
              <PencilIcon className="h-4 w-4" />
            )
          }
        >
          <Trans>Save</Trans>
        </Button>
      </Form>
    </Card>
  );
};

export default ProfileSettingsForm;
