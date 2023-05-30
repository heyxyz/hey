import ThumbnailsShimmer from '@components/Shared/Shimmer/ThumbnailsShimmer';
import { CheckCircleIcon, PhotographIcon } from '@heroicons/react/outline';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { t, Trans } from '@lingui/macro';
import { generateVideoThumbnails } from 'lib/generateVideoThumbnails';
import getFileFromDataURL from 'lib/getFileFromDataURL';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';
import type { MediaSetWithoutOnChain } from 'src/types';
import { Spinner } from 'ui';

const DEFAULT_THUMBNAIL_INDEX = 0;
export const THUMBNAIL_GENERATE_COUNT = 4;

interface Thumbnail {
  blobUrl: string;
  ipfsUrl: string;
  mimeType: string;
}

const ChooseThumbnail: FC = () => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1);
  const attachments = usePublicationStore((state) => state.attachments);
  const videoThumbnail = usePublicationStore((state) => state.videoThumbnail);
  const setVideoThumbnail = usePublicationStore(
    (state) => state.setVideoThumbnail
  );
  const { file } = attachments[0];

  const uploadThumbnailToIpfs = async (fileToUpload: File) => {
    setVideoThumbnail({ uploading: true });
    const result: MediaSetWithoutOnChain = await uploadFileToIPFS(fileToUpload);
    if (!result.original.url) {
      toast.error(t`Failed to upload thumbnail`);
    }
    setVideoThumbnail({
      url: result.original.url,
      type: fileToUpload.type || 'image/jpeg',
      uploading: false
    });

    return result;
  };

  const onSelectThumbnail = async (index: number) => {
    setSelectedThumbnailIndex(index);
    if (thumbnails[index]?.ipfsUrl === '') {
      setVideoThumbnail({ uploading: true });
      getFileFromDataURL(
        thumbnails[index].blobUrl,
        'thumbnail.jpeg',
        async (file: any) => {
          if (!file) {
            return toast.error(t`Please upload a custom thumbnail`);
          }
          const ipfsResult = await uploadThumbnailToIpfs(file);
          setThumbnails(
            thumbnails.map((thumbnail, i) => {
              if (i === index) {
                thumbnail.ipfsUrl = ipfsResult.original.url;
              }
              return thumbnail;
            })
          );
        }
      );
    } else {
      setVideoThumbnail({
        url: thumbnails[index]?.ipfsUrl,
        type: thumbnails[index]?.mimeType || 'image/jpeg',
        uploading: false
      });
    }
  };

  const generateThumbnails = async (fileToGenerate: File) => {
    try {
      const thumbnailArray = await generateVideoThumbnails(
        fileToGenerate,
        THUMBNAIL_GENERATE_COUNT
      );
      const thumbnailList: Thumbnail[] = [];
      for (const thumbnailBlob of thumbnailArray) {
        thumbnailList.push({
          blobUrl: thumbnailBlob,
          ipfsUrl: '',
          mimeType: 'image/jpeg'
        });
      }
      setThumbnails(thumbnailList);
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX);
    } catch (error) {
      console.error('Failed to generate thumbnails', error);
    }
  };

  useEffect(() => {
    onSelectThumbnail(selectedThumbnailIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThumbnailIndex]);

  useEffect(() => {
    if (file) {
      generateThumbnails(file);
    }
    return () => {
      setSelectedThumbnailIndex(-1);
      setThumbnails([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setImageUploading(true);
        setSelectedThumbnailIndex(-1);
        const file = e.target.files[0];
        const result = await uploadThumbnailToIpfs(file);
        const preview = window.URL?.createObjectURL(file);
        setThumbnails([
          {
            blobUrl: preview,
            ipfsUrl: result.original.url,
            mimeType: file.type || 'image/jpeg'
          },
          ...thumbnails
        ]);
        setSelectedThumbnailIndex(0);
      } catch (error) {
        console.error('Failed to upload thumbnail', error);
        toast.error(t`Failed to upload thumbnail`);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const isUploading = videoThumbnail.uploading;

  return (
    <div className="mt-5">
      <b>
        <Trans>Choose Thumbnail</Trans>
      </b>
      <div className="mt-1 grid grid-cols-3 gap-3 py-0.5 md:grid-cols-5">
        <label
          htmlFor="chooseThumbnail"
          className="max-w-32 flex h-24 w-full flex-none cursor-pointer flex-col items-center justify-center rounded-xl border dark:border-gray-700"
        >
          <input
            id="chooseThumbnail"
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            onChange={handleUpload}
          />
          {imageUploading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <PhotographIcon className="mb-1 h-5 w-5" />
              <span className="text-sm">
                <Trans>Upload</Trans>
              </span>
            </>
          )}
        </label>
        {!thumbnails.length ? <ThumbnailsShimmer /> : null}
        {thumbnails.map(({ blobUrl, ipfsUrl }, index) => {
          const isSelected = selectedThumbnailIndex === index;
          const isUploaded = ipfsUrl === videoThumbnail.url;

          return (
            <button
              key={`${blobUrl}_${index}`}
              type="button"
              disabled={isUploading}
              onClick={() => onSelectThumbnail(index)}
              className="relative"
            >
              <img
                className="h-24 w-full rounded-xl border object-cover dark:border-gray-700"
                src={blobUrl}
                alt="thumbnail"
                draggable={false}
              />
              {ipfsUrl && isSelected && isUploaded ? (
                <div className="absolute inset-0 grid place-items-center rounded-xl bg-gray-100/10">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
              ) : null}
              {isUploading && isSelected && (
                <div className="absolute inset-0 grid place-items-center rounded-xl bg-gray-100/10 backdrop-blur-md">
                  <Spinner size="sm" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseThumbnail;
