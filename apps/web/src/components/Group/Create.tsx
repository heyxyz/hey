import type { Area } from '@hey/image-cropper/types';
import type { NextPage } from 'next';
import type { ChangeEvent } from 'react';

import ChooseFile from '@components/Shared/ChooseFile';
import ImageCropperController from '@components/Shared/ImageCropperController';
import SettingsHelper from '@components/Shared/SettingsHelper';
import {
  CheckIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { Regex } from '@hey/data/regex';
import { PAGEVIEW } from '@hey/data/tracking';
import { getCroppedImg } from '@hey/image-cropper/cropUtils';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import {
  Button,
  Card,
  ErrorMessage,
  Form,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Image,
  Input,
  Modal,
  Spinner,
  TextArea,
  useZodForm
} from '@hey/ui';
import errorToast from '@lib/errorToast';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { Leafwatch } from '@lib/leafwatch';
import uploadCroppedImage, { readFile } from '@lib/profilePictureUtils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Custom404 from 'src/pages/404';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { object, string } from 'zod';

const newGroupSchema = object({
  description: string().max(5000),
  discord: string().max(50).regex(Regex.url).optional(),
  instagram: string().min(3).max(32).regex(Regex.handle).optional(),
  lens: string().min(3).max(32).regex(Regex.handle).optional(),
  name: string().min(1).max(50),
  slug: string().min(3).max(32).regex(Regex.handle),
  x: string().min(3).max(32).regex(Regex.handle).optional()
});

const CreateGroup: NextPage = () => {
  const { push } = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const [submitting, setSubmitting] = useState(false);
  const [groupPictureIpfsUrl, setGroupPictureIpfsUrl] = useState<string>(
    `ipfs://bafkreiahgtmtuhm3m5h5llnwrk26jmw2cnitsr7zcydcscd46zv55sfvbu`
  );
  const [groupPictureSrc, setGroupPictureSrc] = useState('');
  const [showGroupPictureCropModal, setShowGroupPictureCropModal] =
    useState(false);
  const [croppedGroupPictureAreaPixels, setCroppedGroupPictureAreaPixels] =
    useState<Area | null>(null);
  const [uploadedGroupPictureUrl, setUploadedGroupPictureUrl] = useState('');
  const [uploadingGroupPicture, setUploadingGroupPicture] = useState(false);

  const form = useZodForm({
    schema: newGroupSchema
  });

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'create-group' });
  }, []);

  const slug = form.watch('slug');
  const canCheck = Boolean(slug && slug.length > 3);

  const { data: isSlugAvailable } = useQuery({
    enabled: canCheck,
    queryFn: async () => {
      const { data } = await axios.get(`${HEY_API_URL}/groups/get`, {
        params: { slug: form.watch('slug') }
      });

      return !data.success;
    },
    queryKey: ['group', form.watch('slug')],
    retry: false
  });

  if (!currentProfile) {
    return <Custom404 />;
  }

  const uploadAndSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        groupPictureSrc,
        croppedGroupPictureAreaPixels
      );

      if (!croppedImage) {
        return toast.error(Errors.SomethingWentWrong);
      }

      setUploadingGroupPicture(true);

      const ipfsUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL('image/png');

      setGroupPictureIpfsUrl(ipfsUrl);
      setUploadedGroupPictureUrl(dataUrl);
    } catch (error) {
      errorToast(error);
    } finally {
      setShowGroupPictureCropModal(false);
      setUploadingGroupPicture(false);
    }
  };

  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      setGroupPictureSrc(await readFile(file));
      setShowGroupPictureCropModal(true);
    }
  };

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
          avatar: groupPictureIpfsUrl,
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
    } catch (error) {
      setSubmitting(false);
      return toast.error(Errors.NoPermission);
    } finally {
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
        {!isFeatureAvailable('create-group') && (
          <ErrorMessage
            className="mb-5"
            error={{
              message: 'Request here for access: https://tally.so/r/3XWlKd',
              name: 'NoPermission'
            }}
            title="You don't have permission to create a group."
          />
        )}
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
            <div className="space-y-2">
              <Input
                label="Slug"
                placeholder="piedpiper"
                prefix="hey.com/g/"
                {...form.register('slug')}
              />
              {canCheck ? (
                isSlugAvailable === false ? (
                  <div className="flex items-center space-x-1 text-sm text-red-500">
                    <FaceFrownIcon className="size-4" />
                    <b>Handle not available!</b>
                  </div>
                ) : isSlugAvailable === true ? (
                  <div className="flex items-center space-x-1 text-sm text-green-500">
                    <CheckIcon className="size-4" />
                    <b>You're in luck - it's available!</b>
                  </div>
                ) : null
              ) : (
                <div className="ld-text-gray-500 flex items-center space-x-1 text-sm">
                  <FaceSmileIcon className="size-4" />
                  <b>Hope you will get a good one!</b>
                </div>
              )}
            </div>
            <Input
              label="Name"
              placeholder="Pied Piper"
              {...form.register('name')}
            />
            <TextArea
              label="Description"
              placeholder="What is this group about?"
              rows={5}
              {...form.register('description')}
            />
            <Input
              label="Lens"
              placeholder="piedpiper"
              {...form.register('lens')}
            />
            <Input
              label="Instagram"
              placeholder="piedpiper"
              {...form.register('instagram')}
            />
            <Input
              label="Discord"
              placeholder="https://discord.gg/piedpiper"
              {...form.register('discord')}
            />
            <div className="space-y-1.5">
              <div className="label">Avatar</div>
              <div className="space-y-3">
                <Image
                  alt="Group picture crop preview"
                  className="max-w-xs rounded-lg"
                  onError={({ currentTarget }) => {
                    currentTarget.src =
                      sanitizeDStorageUrl(groupPictureIpfsUrl);
                  }}
                  src={
                    uploadedGroupPictureUrl ||
                    sanitizeDStorageUrl(groupPictureIpfsUrl)
                  }
                />
                <ChooseFile onChange={(event) => onFileChange(event)} />
              </div>
            </div>
            <Modal
              onClose={
                submitting
                  ? undefined
                  : () => {
                      setGroupPictureSrc('');
                      setShowGroupPictureCropModal(false);
                    }
              }
              show={showGroupPictureCropModal}
              size="sm"
              title="Crop group picture"
            >
              <div className="p-5 text-right">
                <ImageCropperController
                  imageSrc={groupPictureSrc}
                  setCroppedAreaPixels={setCroppedGroupPictureAreaPixels}
                  targetSize={{ height: 300, width: 300 }}
                />
                <Button
                  disabled={uploadingGroupPicture || !groupPictureSrc}
                  icon={
                    uploadingGroupPicture ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilIcon className="size-4" />
                    )
                  }
                  onClick={() => uploadAndSave()}
                  type="submit"
                >
                  Upload
                </Button>
              </div>
            </Modal>
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
