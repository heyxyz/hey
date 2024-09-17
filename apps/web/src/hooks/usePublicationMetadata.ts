import getUserLocale from "@helpers/getUserLocale";
import { APP_NAME } from "@hey/data/constants";
import {
  audio,
  image,
  liveStream,
  textOnly,
  video
} from "@lens-protocol/metadata";
import { useCallback } from "react";
import { usePublicationAttachmentStore } from "src/store/non-persisted/publication/usePublicationAttachmentStore";
import { usePublicationAttributesStore } from "src/store/non-persisted/publication/usePublicationAttributesStore";
import { usePublicationAudioStore } from "src/store/non-persisted/publication/usePublicationAudioStore";
import { usePublicationLicenseStore } from "src/store/non-persisted/publication/usePublicationLicenseStore";
import { usePublicationLiveStore } from "src/store/non-persisted/publication/usePublicationLiveStore";
import { usePublicationStore } from "src/store/non-persisted/publication/usePublicationStore";
import { usePublicationVideoStore } from "src/store/non-persisted/publication/usePublicationVideoStore";
import { v4 as uuid } from "uuid";

interface UsePublicationMetadataProps {
  baseMetadata: any;
}

const usePublicationMetadata = () => {
  const { tags } = usePublicationStore();
  const { videoDurationInSeconds, videoThumbnail } = usePublicationVideoStore();
  const { audioPublication } = usePublicationAudioStore();
  const { license } = usePublicationLicenseStore();
  const { attachments } = usePublicationAttachmentStore((state) => state);
  const { liveVideoConfig, showLiveVideoEditor } = usePublicationLiveStore();
  const { attributes } = usePublicationAttributesStore();

  const getMetadata = useCallback(
    ({ baseMetadata }: UsePublicationMetadataProps) => {
      const hasAttachments = attachments.length;
      const isImage = attachments[0]?.type === "Image";
      const isAudio = attachments[0]?.type === "Audio";
      const isVideo = attachments[0]?.type === "Video";
      const isLiveStream = Boolean(showLiveVideoEditor && liveVideoConfig.id);

      const localBaseMetadata = {
        appId: APP_NAME,
        attributes:
          (attributes || [])?.length > 0 || baseMetadata.attributes?.length > 0
            ? [...(baseMetadata.attributes || []), ...(attributes || [])]
            : undefined,
        id: uuid(),
        locale: getUserLocale(),
        tags: tags || undefined
      };

      // Slice the first attachment because we upload the asset
      const attachmentsToBeUploaded = attachments
        .map((attachment) => ({
          item: attachment.uri,
          type: attachment.mimeType
        }))
        .slice(1);

      switch (true) {
        case isLiveStream:
          return liveStream({
            ...baseMetadata,
            ...localBaseMetadata,
            liveUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
            playbackUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
            startsAt: new Date().toISOString()
          });
        case !hasAttachments:
          return textOnly({
            ...baseMetadata,
            ...localBaseMetadata
          });
        case isImage:
          return image({
            ...baseMetadata,
            ...localBaseMetadata,
            ...(attachmentsToBeUploaded.length > 0 && {
              attachments: attachmentsToBeUploaded
            }),
            image: {
              ...(license && { license }),
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType
            }
          });
        case isAudio:
          return audio({
            ...baseMetadata,
            ...localBaseMetadata,
            ...(attachmentsToBeUploaded.length > 0 && {
              attachments: attachmentsToBeUploaded
            }),
            audio: {
              ...(audioPublication.artist && {
                artist: audioPublication.artist
              }),
              cover: audioPublication.cover,
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType,
              ...(license && { license })
            }
          });
        case isVideo:
          return video({
            ...baseMetadata,
            ...localBaseMetadata,
            ...(attachmentsToBeUploaded.length > 0 && {
              attachments: attachmentsToBeUploaded
            }),
            video: {
              cover: videoThumbnail.url,
              duration: Number.parseInt(videoDurationInSeconds),
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType,
              ...(license && { license })
            }
          });
        default:
          return null;
      }
    },
    [
      attributes,
      attachments,
      videoDurationInSeconds,
      audioPublication,
      videoThumbnail,
      showLiveVideoEditor,
      liveVideoConfig,
      license,
      tags
    ]
  );

  return getMetadata;
};

export default usePublicationMetadata;
