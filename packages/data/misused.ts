export enum MisuseType {
  Scam = 'Scam',
  Impersonated = 'Impersonated',
  Hacked = 'Hacked',
  Trademark = 'Trademark'
}

export const misused: {
  id: string;
  type: MisuseType;
  identifiedOn: string | null;
  description: string | null;
}[] = [
  {
    // xmtp_
    id: '0xc358',
    type: MisuseType.Scam,
    identifiedOn: null,
    description: null
  },
  {
    // safewallet
    id: '0x011c4c',
    type: MisuseType.Impersonated,
    identifiedOn: 'Jul 17, 2023',
    description: null
  }
];
