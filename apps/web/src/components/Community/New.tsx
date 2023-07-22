import MetaTags from '@components/Common/MetaTags';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { PlusIcon } from '@heroicons/react/outline';
import { APP_NAME, COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import { Errors } from '@lenster/data/errors';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { Localstorage } from '@lenster/data/storage';
import { PAGEVIEW } from '@lenster/data/tracking';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
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
} from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';
import { object, string } from 'zod';

const newContactSchema = object({
  name: string().min(1, { message: t`Name should not be empty` }),
  slug: string().min(1, { message: t`Slug should not be empty` }),
  description: string()
});

const NewCommunity: FC = () => {
  const { push } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [submitting, setSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const isCommunitiesEnabled = isFeatureEnabled(FeatureFlag.Communities);

  const form = useZodForm({
    schema: newContactSchema
  });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'new community' });
  });

  if (!currentProfile || !isCommunitiesEnabled) {
    return <Custom404 />;
  }

  const createCommunity = async (
    name: string,
    slug: string,
    description: string
  ) => {
    setSubmitting(true);
    try {
      const { data } = await axios(`${COMMUNITIES_WORKER_URL}/create`, {
        method: 'POST',
        data: {
          name,
          slug,
          description,
          avatar: avatar || `https://avatar.tobi.sh/${slug}`,
          admin: currentProfile.id,
          accessToken: localStorage.getItem(Localstorage.AccessToken)
        }
      });

      if (data.id) {
        push(`/c/${slug}`);
      }
    } catch {
      toast.error(Errors.SomethingWentWrong);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GridLayout>
      <MetaTags title={t`New Community • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          heading={t`Create a new community`}
          description={t`Create a new community and start sharing with the world.`}
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <Form
            form={form}
            className="space-y-4 p-5"
            onSubmit={({ name, slug, description }) => {
              createCommunity(name, slug, description);
            }}
          >
            <Input
              label={t`Community Name`}
              placeholder="Azuki"
              {...form.register('name')}
            />
            <Input
              label={t`Slug`}
              placeholder="azuki"
              {...form.register('slug')}
            />
            <TextArea
              label={t`Description`}
              placeholder={t`Describe your community`}
              {...form.register('description')}
            />
            <div className="ml-auto">
              <Button
                type="submit"
                disabled={submitting}
                icon={
                  submitting ? (
                    <Spinner size="xs" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )
                }
              >
                <Trans>Create Community</Trans>
              </Button>
            </div>
          </Form>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default NewCommunity;
