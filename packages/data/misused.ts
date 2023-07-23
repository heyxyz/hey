export enum MisuseType {
  Scam = 'Scam',
  Impersonated = 'Impersonated',
  Hacked = 'Hacked',
  Phishing = 'Phishing',
  TrademarkViolation = 'Trademark violation'
}

export const misused: {
  id: string;
  type: MisuseType;
  identifiedOn: string | null;
  description: string | null;
}[] = [
  {
    // web3academy
    id: '0x661b',
    type: MisuseType.Impersonated,
    identifiedOn: 'June 20, 2023',
    description: 'Original account is @web3academy_'
  },
  {
    // xmtp_
    id: '0xc358',
    type: MisuseType.TrademarkViolation,
    identifiedOn: null,
    description: 'Original account is @xmtplabs'
  },
  {
    // safewallet
    id: '0x011c4c',
    type: MisuseType.TrademarkViolation,
    identifiedOn: 'Jul 17, 2023',
    description: null
  }
];
