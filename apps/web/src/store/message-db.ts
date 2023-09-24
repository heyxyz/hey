import type { Profile } from '@lenster/lens';
import type { Table } from 'dexie';
import Dexie from 'dexie';

export interface PreviewMessage {
  conversationKey: string;
  myProfileId: string;
  sent: Date;
  messageBytes: Uint8Array;
}

export type LensProfile = Profile & {
  myProfileId: string;
  conversationKey: string;
};

export class MessageDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  previewMessages!: Table<PreviewMessage>;
  lensProfiles!: Table<LensProfile>;

  constructor() {
    super('messageDb');
    this.version(1).stores({
      previewMessages: 'conversationKey, myProfileId, sent', // Primary key and indexed props
      lensProfiles: '[myProfileId+conversationKey], myProfileId'
    });
  }

  async persistPreviewMessage(message: PreviewMessage) {
    const { conversationKey, myProfileId, sent } = message;
    await this.previewMessages.put(message, [
      conversationKey,
      myProfileId,
      sent
    ]);
  }

  async persistProfile(profile: LensProfile) {
    const { myProfileId, conversationKey } = profile;
    await this.lensProfiles.put(profile, [myProfileId, conversationKey]);
  }
}

export const db = new MessageDB();
