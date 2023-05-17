import { Localstorage } from 'data/storage';
import { del, get, set } from 'idb-keyval';
import type { Attachment } from 'xmtp-content-type-remote-attachment';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AttachmentState {
  loadedAttachmentURLs: string[];
  addLoadedAttachmentURL: (attachmentURL: string) => void;
}

interface AttachmentCachePersistState {
  cachedAttachments: Map<string, Attachment>;
  cacheAttachment: (url: string, attachment: Attachment) => void;
}

const replacer = (key: String, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value]
    };
  }

  return value;
};

const reviver = (key: string, value: any) => {
  if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
    return new Map(value.value);
  }

  return value;
};

export const useAttachmentCachePersistStore = create(
  persist<AttachmentCachePersistState>(
    (set) => ({
      cachedAttachments: new Map<string, Attachment>(),
      cacheAttachment: (url: string, attachment: Attachment) => {
        set((state) => {
          const { cachedAttachments } = state;
          cachedAttachments.set(url, attachment);
          return { cachedAttachments };
        });
      }
    }),
    {
      name: Localstorage.AttachmentCache,
      storage: {
        async getItem(name) {
          return JSON.parse((await get(name)) || '{}', reviver);
        },
        async setItem(name, value) {
          const str = JSON.stringify(
            {
              state: {
                ...value.state,
                cachedAttachments: value.state.cachedAttachments
              }
            },
            replacer
          );

          await set(name, str);
        },
        async removeItem(name) {
          await del(name);
        }
      }
    }
  )
);

export const useAttachmentStore = create(
  persist<AttachmentState>(
    (set) => ({
      loadedAttachmentURLs: [],
      addLoadedAttachmentURL: (attachmentURL: string) =>
        set((state) => {
          const { loadedAttachmentURLs } = state;
          loadedAttachmentURLs.push(attachmentURL);
          return { loadedAttachmentURLs };
        })
    }),
    {
      name: Localstorage.AttachmentStore
    }
  )
);
