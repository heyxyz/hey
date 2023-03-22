import { LS_KEYS } from 'data/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AttachmentState {
  loadedAttachmentURLs: string[];
  addLoadedAttachmentURL: (attachmentURL: string) => void;
}

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
    { name: LS_KEYS.ATTACHMENT_STORE }
  )
);
