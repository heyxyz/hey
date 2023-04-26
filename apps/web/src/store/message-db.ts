import type { Table } from 'dexie';
import Dexie from 'dexie';
import type { Profile } from 'lens';

export interface PreviewMessage {
  conversationKey: string;
  myAddress: string;
  myProfileId: string;
  sent: Date;
  messageBytes: Uint8Array;
}

export type LensProfile = Profile & {
  myAddress: string;
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
      previewMessages: '[myAddress+conversationKey], [myAddress+myProfileId], sent', // Primary key and indexed props
      lensProfiles: '[myAddress+myProfileId+conversationKey], [myAddress+myProfileId]'
    });
  }

  async persistPreviewMessage(message: PreviewMessage) {
    const { myAddress, conversationKey } = message;
    await this.previewMessages.put(message, [myAddress, conversationKey]);
  }

  async persistProfile(profile: LensProfile) {
    const { myAddress, myProfileId, conversationKey } = profile;
    await this.lensProfiles.put(profile, [myAddress, myProfileId, conversationKey]);
  }
}

export const db = new MessageDB();
