import type { NextPage } from 'next';

import SettingsHelper from '@components/Shared/SettingsHelper';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { Regex } from '@hey/data/regex';
import { PAGEVIEW } from '@hey/data/tracking';
import {
  Button,
  Card,
  Form,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Input,
  Spinner,
  TextArea,
  useZodForm
} from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useEffectOnce } from 'usehooks-ts';
import { object, string } from 'zod';

const newGroupSchema = object({
  description: string().max(5000),
  discord: string().max(50).regex(Regex.url).optional(),
  instagram: string().max(32).regex(Regex.handle).optional(),
  lens: string().max(32).regex(Regex.handle).optional(),
  name: string().min(1).max(50),
  slug: string().min(5).max(32).regex(Regex.handle),
  x: string().max(32).regex(Regex.handle).optional()
});

const CreateGroup: NextPage = () => {
  const { push } = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(
    'https://pbs.twimg.com/profile_images/1407865444430614528/HCEKSw0T_400x400.jpg'
  );

  const form = useZodForm({
    schema: newGroupSchema
  });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'create-group' });
  });

  const { data: isSlugAvailable } = useQuery({
    enabled: form.watch('slug') !== '',
    queryFn: async () => {
      const { data } = await axios.get(`${HEY_API_URL}/groups/get`, {
        params: { slug: form.watch('slug') }
      });

      return !data.success;
    },
    queryKey: ['group', form.watch('slug')],
    retry: false
  });

  const createGroup = async (
    description: string,
    discord: string | undefined,
    instagram: string | undefined,
    lens: string | undefined,
    name: string,
    slug: string
  ) => {
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${HEY_API_URL}/groups/create`,
        {
          avatar,
          description,
          discord,
          instagram,
          lens,
          name,
          slug
        },
        { headers: getAuthApiHeaders() }
      );

      if (data.success) {
        toast.success('Group created!');
        push(`/g/${slug}`);
        return;
      } else {
        toast.error(data?.message || Errors.SomethingWentWrong);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GridLayout>
      <GridItemFour>
        <SettingsHelper
          description={`Create a new group on ${APP_NAME}.`}
          heading="Create Group"
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <Form
            className="space-y-4 p-5"
            form={form}
            onSubmit={async ({
              description,
              discord,
              instagram,
              lens,
              name,
              slug
            }) => {
              await createGroup(
                description,
                discord,
                instagram,
                lens,
                name,
                slug
              );
            }}
          >
            <Input
              label="Slug"
              placeholder="piedpiper"
              prefix="hey.com/g/"
              {...form.register('slug')}
            />
            <Input
              label="Name"
              placeholder="Pied Piper"
              {...form.register('name')}
            />
            <Input
              label="Instagram"
              placeholder="piedpiper"
              {...form.register('instagram')}
            />
            <Input
              label="Lens"
              placeholder="piedpiper"
              {...form.register('lens')}
            />
            <Input
              label="Discord"
              placeholder="https://discord.gg/piedpiper"
              {...form.register('discord')}
            />
            <TextArea
              label="Description"
              placeholder="What is this group about?"
              rows={5}
              {...form.register('description')}
            />
            <div className="ml-auto">
              <Button
                disabled={submitting || !isSlugAvailable}
                icon={
                  submitting ? (
                    <Spinner size="xs" />
                  ) : (
                    <PencilIcon className="size-5" />
                  )
                }
                type="submit"
              >
                Create
              </Button>
            </div>
          </Form>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default CreateGroup;
