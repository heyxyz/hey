export enum MisuseType {
  Impersonated = "Impersonated",
  TrademarkViolation = "Trademark violation"
}

export const misused: {
  description: null | string;
  id: string;
  identifiedOn: null | string;
  type: MisuseType;
}[] = [
  {
    description:
      "Original account owner has established a new profile: @web3academy_",
    // web3academy
    id: "0x661b",
    identifiedOn: "June 20, 2023",
    type: MisuseType.Impersonated
  },
  {
    description: "Original account is @xmtplabs",
    // xmtp_
    id: "0xc358",
    identifiedOn: null,
    type: MisuseType.TrademarkViolation
  },
  {
    description: null,
    // safewallet
    id: "0x011c4c",
    identifiedOn: "Jul 17, 2023",
    type: MisuseType.TrademarkViolation
  }
];
