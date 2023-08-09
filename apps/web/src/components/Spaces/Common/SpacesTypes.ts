export enum IRoleEnum {
  host = 'host',
  coHost = 'coHost',
  moderator = 'moderator',
  speaker = 'speaker',
  listener = 'listener',
  peer = 'peer'
}

export type Peer = {
  peerId: string;
  displayName: string;
  mic?: MediaStreamTrack | null;
  role: IRoleEnum;
  avatarUrl: string;
};
