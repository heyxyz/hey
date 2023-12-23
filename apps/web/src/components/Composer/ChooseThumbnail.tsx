import type { ChangeEvent, FC } from 'react';

import ThumbnailsShimmer from '@components/Shared/Shimmer/ThumbnailsShimmer';
import { CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { generateVideoThumbnails } from '@hey/lib/generateVideoThumbnails';
import getFileFromDataURL from '@hey/lib/getFileFromDataURL';
import { Spinner } from '@hey/ui';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import { useUpdateEffect } from 'usehooks-ts';

const DEFAULT_THUMBNAIL_INDEX = 0;
export const THUMBNAIL_GENERATE_COUNT = 4;

interface Thumbnail {
  blobUrl: string;
  ipfsUrl: string;
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
    const result = await uploadFileToIPFS(fileToUpload);
    if (!result.uri) {
      toast.error('Failed to upload thumbnail');
    }
    setVideoThumbnail({
      type: fileToUpload.type || 'image/jpeg',
      uploading: false,
      url: result.uri
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
            return toast.error('Please upload a custom thumbnail');
          }
          const ipfsResult = await uploadThumbnailToIpfs(file);
          setThumbnails(
            thumbnails.map((thumbnail, i) => {
              if (i === index) {
                thumbnail.ipfsUrl = ipfsResult.uri;
              }
              return thumbnail;
            })
          );
        }
      );
    } else {
      setVideoThumbnail({
        uploading: false,
        url: thumbnails[index]?.ipfsUrl
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
        thumbnailList.push({ blobUrl: thumbnailBlob, ipfsUrl: '' });
      }
      setThumbnails(thumbnailList);
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX);
    } catch {}
  };

  useUpdateEffect(() => {
    onSelectThumbnail(selectedThumbnailIndex);
  }, [selectedThumbnailIndex]);

  useEffect(() => {
    if (file) {
      generateThumbnails(file);
    }
    return () => {
      setSelectedThumbnailIndex(-1);
      setThumbnails([]);
    };
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
          { blobUrl: preview, ipfsUrl: result.uri },
          ...thumbnails
        ]);
        setSelectedThumbnailIndex(0);
      } catch {
        toast.error('Failed to upload thumbnail');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const isUploading = videoThumbnail.uploading;

  return (
    <div className="mt-5">
      <b>Choose Thumbnail</b>
      <div className="mt-1 grid grid-cols-3 gap-3 py-0.5 md:grid-cols-5">
        <label
          className="flex h-24 w-full max-w-32 flex-none cursor-pointer flex-col items-center justify-center rounded-xl border dark:border-gray-700"
          htmlFor="chooseThumbnail"
        >
          <input
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            id="chooseThumbnail"
            onChange={handleUpload}
            type="file"
          />
          {imageUploading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <PhotoIcon className="mb-1 size-5" />
              <span className="text-sm">Upload</span>
            </>
          )}
        </label>
        {!thumbnails.length ? <ThumbnailsShimmer /> : null}
        {thumbnails.map(({ blobUrl, ipfsUrl }, index) => {
          const isSelected = selectedThumbnailIndex === index;
          const isUploaded = ipfsUrl === videoThumbnail.url;

          return (
            <button
              className="relative"
              disabled={isUploading}
              key={`${blobUrl}_${index}`}
              onClick={() => onSelectThumbnail(index)}
              type="button"
            >
              <img
                alt="thumbnail"
                className="h-24 w-full rounded-xl border object-cover dark:border-gray-700"
                draggable={false}
                src={blobUrl}
              />
              {ipfsUrl && isSelected && isUploaded ? (
                <div className="absolute inset-0 grid place-items-center rounded-xl bg-gray-100/10">
                  <CheckCircleIcon className="size-6 text-green-500" />
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
