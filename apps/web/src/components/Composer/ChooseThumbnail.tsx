import { PhotographIcon } from '@heroicons/react/outline';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { generateVideoThumbnails } from 'lib/generateVideoThumbnails';
import getFileFromDataURL from 'lib/getFileFromDataURL';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { ChangeEvent, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';
import type { LensterAttachment } from 'src/types';
import { Spinner } from 'ui';

const DEFAULT_THUMBNAIL_INDEX = 0;
export const THUMBNAIL_GENERATE_COUNT = 7;

interface Thumbnail {
  blobUrl: string;
  ipfsUrl: string;
  mimeType: string;
}

const ChooseThumbnail: FC = () => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1);
  const attachments = usePublicationStore((state) => state.attachments);
  const videoThumbnail = usePublicationStore((state) => state.videoThumbnail);
  const setVideoThumbnail = usePublicationStore((state) => state.setVideoThumbnail);
  const { file } = attachments[0];

  const uploadThumbnailToIpfs = async (fileToUpload: File) => {
    setVideoThumbnail({ uploading: true });
    const result: LensterAttachment = await uploadFileToIPFS(fileToUpload);
    if (!result.item) {
      toast.error(t`Failed to upload thumbnail`);
    }
    setVideoThumbnail({
      url: result.item,
      type: fileToUpload.type || 'image/jpeg',
      uploading: false
    });

    return result;
  };

  const onSelectThumbnail = async (index: number) => {
    setSelectedThumbnailIndex(index);
    if (thumbnails[index]?.ipfsUrl === '') {
      setVideoThumbnail({ uploading: true });
      getFileFromDataURL(thumbnails[index].blobUrl, 'thumbnail.jpeg', async (file: any) => {
        if (!file) {
          return toast.error(t`Please upload a custom thumbnail`);
        }
        const ipfsResult = await uploadThumbnailToIpfs(file);
        setThumbnails(
          thumbnails.map((thumbnail, i) => {
            if (i === index) {
              thumbnail.ipfsUrl = ipfsResult.item;
            }
            return thumbnail;
          })
        );
      });
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
      const thumbnailArray = await generateVideoThumbnails(fileToGenerate, THUMBNAIL_GENERATE_COUNT);
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
    } catch {}
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
      setSelectedThumbnailIndex(-1);
      toast.loading(t`Uploading thumbnail`);
      const file = e.target.files[0];
      const result = await uploadThumbnailToIpfs(file);
      const preview = window.URL?.createObjectURL(file);
      setThumbnails([
        {
          blobUrl: preview,
          ipfsUrl: result.item,
          mimeType: file.type || 'image/jpeg'
        },
        ...thumbnails
      ]);
      setSelectedThumbnailIndex(0);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 place-items-start gap-3 py-0.5 md:grid-cols-3 lg:grid-cols-4">
        <label
          htmlFor="chooseThumbnail"
          className="max-w-32 flex h-16 w-full flex-none cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-300 opacity-80 focus:outline-none dark:border-gray-700"
        >
          <input
            id="chooseThumbnail"
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            onChange={handleUpload}
          />
          <PhotographIcon className="mb-1 h-4 w-4 flex-none" />
          <span className="text-xs">Upload</span>
        </label>
        {!thumbnails.length && <div>Loading thumbnails...</div>}
        {thumbnails.map((thumbnail, idx) => {
          return (
            <button
              key={idx}
              type="button"
              disabled={videoThumbnail.uploading}
              onClick={() => onSelectThumbnail(idx)}
              className={clsx(
                'relative w-full flex-none overflow-hidden rounded-lg ring-1 ring-white focus:outline-none dark:ring-black',
                {
                  '!ring !ring-indigo-500':
                    thumbnail.ipfsUrl &&
                    selectedThumbnailIndex === idx &&
                    thumbnail.ipfsUrl === videoThumbnail.url
                }
              )}
            >
              <img
                className="h-16 w-full rounded-lg object-cover md:w-32"
                src={sanitizeDStorageUrl(thumbnail.blobUrl)}
                alt="thumbnail"
                draggable={false}
              />
              {videoThumbnail.uploading && selectedThumbnailIndex === idx && (
                <div className="absolute inset-0 grid place-items-center bg-gray-100 bg-opacity-10 backdrop-blur-md">
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
