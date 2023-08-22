export enum IRoleEnum {
  host = 'host',
  coHost = 'coHost',
  speaker = 'speaker',
  listener = 'listener'
}

export type Peer = {
  peerId: string;
  displayName: string;
  mic?: MediaStreamTrack | null;
  role: IRoleEnum;
  avatarUrl: string;
};
