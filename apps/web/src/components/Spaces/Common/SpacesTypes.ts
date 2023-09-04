export enum RoleEnum {
  host = 'host',
  coHost = 'coHost',
  speaker = 'speaker',
  listener = 'listener'
}

export type Peer = {
  peerId: string;
  displayName: string;
  mic?: MediaStreamTrack | null;
  role: RoleEnum;
  avatarUrl: string;
};
