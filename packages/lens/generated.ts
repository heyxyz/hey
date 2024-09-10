import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  ABIJson: { input: any; output: any };
  AppId: { input: any; output: any };
  BlockchainData: { input: any; output: any };
  BroadcastId: { input: any; output: any };
  ChainId: { input: any; output: any };
  ChallengeId: { input: any; output: any };
  ContentEncryptionKey: { input: any; output: any };
  CreateHandle: { input: any; output: any };
  Cursor: { input: any; output: any };
  DateTime: { input: any; output: any };
  EncryptableDateTime: { input: any; output: any };
  EncryptableMarkdown: { input: any; output: any };
  EncryptableString: { input: any; output: any };
  EncryptableTxHash: { input: any; output: any };
  EncryptableURI: { input: any; output: any };
  EncryptedPath: { input: any; output: any };
  Ens: { input: any; output: any };
  EvmAddress: { input: any; output: any };
  Handle: { input: any; output: any };
  ImageSizeTransform: { input: any; output: any };
  Jwt: { input: any; output: any };
  Locale: { input: any; output: any };
  Markdown: { input: any; output: any };
  MimeType: { input: any; output: any };
  MomokaId: { input: any; output: any };
  MomokaProof: { input: any; output: any };
  NftGalleryId: { input: any; output: any };
  NftGalleryName: { input: any; output: any };
  Nonce: { input: any; output: any };
  OnchainPublicationId: { input: any; output: any };
  PoapEventId: { input: any; output: any };
  ProfileId: { input: any; output: any };
  PublicationId: { input: any; output: any };
  Signature: { input: any; output: any };
  TokenId: { input: any; output: any };
  TxHash: { input: any; output: any };
  TxId: { input: any; output: any };
  URI: { input: any; output: any };
  URL: { input: any; output: any };
  UUID: { input: any; output: any };
  UnixTimestamp: { input: any; output: any };
  Void: { input: any; output: any };
};

export type ActOnOpenActionInput = {
  multirecipientCollectOpenAction?: InputMaybe<Scalars['Boolean']['input']>;
  simpleCollectOpenAction?: InputMaybe<Scalars['Boolean']['input']>;
  unknownOpenAction?: InputMaybe<UnknownOpenActionActRedeemInput>;
};

/** The lens manager will only support FREE open action modules, if you want your unknown module allowed to be signless please contact us */
export type ActOnOpenActionLensManagerInput = {
  simpleCollectOpenAction?: InputMaybe<Scalars['Boolean']['input']>;
  unknownOpenAction?: InputMaybe<UnknownOpenActionActRedeemInput>;
};

export type ActOnOpenActionLensManagerRequest = {
  actOn: ActOnOpenActionLensManagerInput;
  for: Scalars['PublicationId']['input'];
  referrers?: InputMaybe<Array<OnchainReferrer>>;
};

export type ActOnOpenActionRequest = {
  actOn: ActOnOpenActionInput;
  for: Scalars['PublicationId']['input'];
  referrers?: InputMaybe<Array<OnchainReferrer>>;
};

export type ActedNotification = {
  __typename?: 'ActedNotification';
  actions: Array<OpenActionProfileActed>;
  id: Scalars['UUID']['output'];
  publication: AnyPublication;
};

/** Condition that checks if the given on-chain contract function returns true. It only supports view functions */
export type AdvancedContractCondition = {
  __typename?: 'AdvancedContractCondition';
  /** The contract ABI. Has to be in human readable single string format containing the signature of the function you want to call. See https://docs.ethers.org/v5/api/utils/abi/fragments/#human-readable-abi for more info */
  abi: Scalars['String']['output'];
  /** The check to perform on the result of the function. In case of boolean outputs, "EQUALS" and "NOT_EQUALS" are supported. For BigNumber outputs, you can use every comparison option */
  comparison: ComparisonOperatorConditionType;
  /** The address and chain ID of the contract to call */
  contract: NetworkAddress;
  /** The name of the function to call. Must be included in the provided abi */
  functionName: Scalars['String']['output'];
  /** ABI encoded function parameters. In order to represent the address of the person trying to decrypt, you *have* to use the string ":userAddress" as this param represents the decrypting user address. If a param is an array or tuple, it will be in stringified format. */
  params: Array<Scalars['String']['output']>;
  /** The value to compare the result of the function against. Can be "true", "false" or a number in string format */
  value: Scalars['String']['output'];
};

export type AlreadyInvitedCheckRequest = {
  for: Scalars['EvmAddress']['input'];
};

export type Amount = {
  __typename?: 'Amount';
  /** This is the total value of the amount in the fiat currency */
  asFiat?: Maybe<FiatAmount>;
  /** The asset */
  asset: Asset;
  /** This is the most recent snapshotted 1:1 conversion rate between the asset and the requested fiat currency */
  rate?: Maybe<FiatAmount>;
  /** Floating point number as string (e.g. 42.009837). It could have the entire precision of the Asset or be truncated to the last significant decimal. */
  value: Scalars['String']['output'];
};

export type AmountAsFiatArgs = {
  request: RateRequest;
};

export type AmountRateArgs = {
  request: RateRequest;
};

export type AmountInput = {
  /** The currency */
  currency: Scalars['EvmAddress']['input'];
  /** Floating point number as string (e.g. 42.009837). It could have the entire precision of the Asset or be truncated to the last significant decimal. */
  value: Scalars['String']['input'];
};

export type AndCondition = {
  __typename?: 'AndCondition';
  criteria: Array<ThirdTierCondition>;
};

export type AnyPublication = Comment | Mirror | Post | Quote;

export type App = {
  __typename?: 'App';
  id: Scalars['AppId']['output'];
};

export type ApprovedAllowanceAmountResult = {
  __typename?: 'ApprovedAllowanceAmountResult';
  allowance: Amount;
  moduleContract: NetworkAddress;
  moduleName: Scalars['String']['output'];
};

export type ApprovedAuthentication = {
  __typename?: 'ApprovedAuthentication';
  authorizationId: Scalars['UUID']['output'];
  browser?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  device?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['DateTime']['output'];
  origin?: Maybe<Scalars['URI']['output']>;
  os?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ApprovedAuthenticationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
};

export type ApprovedModuleAllowanceAmountRequest = {
  currencies: Array<Scalars['EvmAddress']['input']>;
  followModules?: InputMaybe<Array<FollowModuleType>>;
  openActionModules?: InputMaybe<Array<OpenActionModuleType>>;
  referenceModules?: InputMaybe<Array<ReferenceModuleType>>;
  unknownFollowModules?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  unknownOpenActionModules?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  unknownReferenceModules?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
};

export type ArticleMetadataV3 = {
  __typename?: 'ArticleMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The title of the article. Empty if not set. */
  title: Scalars['String']['output'];
};

export type Asset = Erc20;

export type Audio = {
  __typename?: 'Audio';
  mimeType?: Maybe<Scalars['MimeType']['output']>;
  uri: Scalars['URI']['output'];
};

export type AudioMetadataV3 = {
  __typename?: 'AudioMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  asset: PublicationMetadataMediaAudio;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The title of the audio. Empty if not set. */
  title: Scalars['String']['output'];
};

export type AuthChallengeResult = {
  __typename?: 'AuthChallengeResult';
  id: Scalars['ChallengeId']['output'];
  /** The text that needs to be signed */
  text: Scalars['String']['output'];
};

/** The authentication result */
export type AuthenticationResult = {
  __typename?: 'AuthenticationResult';
  /** The access token */
  accessToken: Scalars['Jwt']['output'];
  /** The identity token */
  identityToken: Scalars['Jwt']['output'];
  /** The refresh token */
  refreshToken: Scalars['Jwt']['output'];
};

export type BlockRequest = {
  profiles: Array<Scalars['ProfileId']['input']>;
};

export type BroadcastMomokaResult = CreateMomokaPublicationResult | RelayError;

export type BroadcastRequest = {
  id: Scalars['BroadcastId']['input'];
  signature: Scalars['Signature']['input'];
};

export type CanClaimRequest = {
  addresses: Array<Scalars['EvmAddress']['input']>;
};

export type CanClaimResult = {
  __typename?: 'CanClaimResult';
  address: Scalars['EvmAddress']['output'];
  canClaim: Scalars['Boolean']['output'];
};

export type CanDecryptResponse = {
  __typename?: 'CanDecryptResponse';
  extraDetails?: Maybe<Scalars['String']['output']>;
  reasons?: Maybe<Array<DecryptFailReasonType>>;
  result: Scalars['Boolean']['output'];
};

export type ChallengeRequest = {
  /** The profile ID to initiate a challenge - note if you do not pass this in you be logging in as a wallet and wont be able to use all the features */
  for?: InputMaybe<Scalars['ProfileId']['input']>;
  /** The Ethereum address that will sign the challenge */
  signedBy: Scalars['EvmAddress']['input'];
};

export type ChangeProfileManager = {
  action: ChangeProfileManagerActionType;
  address: Scalars['EvmAddress']['input'];
};

export enum ChangeProfileManagerActionType {
  Add = 'ADD',
  Remove = 'REMOVE'
}

export type ChangeProfileManagersRequest = {
  /** if you define this true will enable it and false will disable it within the same tx as any other managers you are changing state for. Leave it blank if you do not want to change its current state */
  approveSignless?: InputMaybe<Scalars['Boolean']['input']>;
  changeManagers?: InputMaybe<Array<ChangeProfileManager>>;
};

export type CheckingInMetadataV3 = {
  __typename?: 'CheckingInMetadataV3';
  address?: Maybe<PhysicalAddress>;
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  geographic?: Maybe<GeoLocation>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  location: Scalars['EncryptableString']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export enum ClaimProfileStatusType {
  AlreadyClaimed = 'ALREADY_CLAIMED',
  ClaimFailed = 'CLAIM_FAILED',
  NotClaimed = 'NOT_CLAIMED'
}

/** Claim profile with handle error reason type */
export enum ClaimProfileWithHandleErrorReasonType {
  CanNotFreeText = 'CAN_NOT_FREE_TEXT',
  ClaimNotFound = 'CLAIM_NOT_FOUND',
  ClaimNotLinkedToWallet = 'CLAIM_NOT_LINKED_TO_WALLET',
  ClaimTimeExpired = 'CLAIM_TIME_EXPIRED',
  ContractExecuted = 'CONTRACT_EXECUTED',
  HandleAlreadyClaimed = 'HANDLE_ALREADY_CLAIMED',
  HandleAlreadyExists = 'HANDLE_ALREADY_EXISTS',
  HandleReserved = 'HANDLE_RESERVED'
}

export type ClaimProfileWithHandleErrorResult = {
  __typename?: 'ClaimProfileWithHandleErrorResult';
  reason: ClaimProfileWithHandleErrorReasonType;
};

export type ClaimProfileWithHandleRequest = {
  followModule?: InputMaybe<FollowModuleInput>;
  freeTextHandle?: InputMaybe<Scalars['CreateHandle']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type ClaimProfileWithHandleResult =
  | ClaimProfileWithHandleErrorResult
  | RelaySuccess;

export type ClaimTokensRequest = {
  for: ClaimableTokenType;
};

export type ClaimableProfilesResult = {
  __typename?: 'ClaimableProfilesResult';
  canMintProfileWithFreeTextHandle: Scalars['Boolean']['output'];
  reserved: Array<ReservedClaimable>;
};

export enum ClaimableTokenType {
  Bonsai = 'BONSAI'
}

export type ClaimableTokensResult = {
  __typename?: 'ClaimableTokensResult';
  bonsai: Amount;
};

export type CollectActionModuleInput = {
  multirecipientCollectOpenAction?: InputMaybe<MultirecipientFeeCollectModuleInput>;
  simpleCollectOpenAction?: InputMaybe<SimpleCollectOpenActionModuleInput>;
};

export type CollectCondition = {
  __typename?: 'CollectCondition';
  publicationId: Scalars['PublicationId']['output'];
  thisPublication: Scalars['Boolean']['output'];
};

export enum CollectOpenActionModuleType {
  LegacyAaveFeeCollectModule = 'LegacyAaveFeeCollectModule',
  LegacyErc4626FeeCollectModule = 'LegacyERC4626FeeCollectModule',
  LegacyFeeCollectModule = 'LegacyFeeCollectModule',
  LegacyFreeCollectModule = 'LegacyFreeCollectModule',
  LegacyLimitedFeeCollectModule = 'LegacyLimitedFeeCollectModule',
  LegacyLimitedTimedFeeCollectModule = 'LegacyLimitedTimedFeeCollectModule',
  LegacyMultirecipientFeeCollectModule = 'LegacyMultirecipientFeeCollectModule',
  LegacyRevertCollectModule = 'LegacyRevertCollectModule',
  LegacySimpleCollectModule = 'LegacySimpleCollectModule',
  LegacyTimedFeeCollectModule = 'LegacyTimedFeeCollectModule',
  MultirecipientFeeCollectOpenActionModule = 'MultirecipientFeeCollectOpenActionModule',
  SimpleCollectOpenActionModule = 'SimpleCollectOpenActionModule',
  UnknownOpenActionModule = 'UnknownOpenActionModule'
}

export type Comment = {
  __typename?: 'Comment';
  by: Profile;
  commentOn: PrimaryPublication;
  createdAt: Scalars['DateTime']['output'];
  firstComment?: Maybe<Comment>;
  hashtagsMentioned: Array<Scalars['String']['output']>;
  /** Signifies whether this comment has been hidden by the author of its parent publication */
  hiddenByAuthor: Scalars['Boolean']['output'];
  id: Scalars['PublicationId']['output'];
  isEncrypted: Scalars['Boolean']['output'];
  isHidden: Scalars['Boolean']['output'];
  metadata: PublicationMetadata;
  momoka?: Maybe<MomokaInfo>;
  openActionModules: Array<OpenActionModule>;
  operations: PublicationOperations;
  profilesMentioned: Array<ProfileMentioned>;
  publishedOn?: Maybe<App>;
  referenceModule?: Maybe<ReferenceModule>;
  root: CommentablePublication;
  stats: PublicationStats;
  txHash?: Maybe<Scalars['TxHash']['output']>;
};

export type CommentStatsArgs = {
  request?: InputMaybe<PublicationStatsInput>;
};

export type CommentNotification = {
  __typename?: 'CommentNotification';
  comment: Comment;
  id: Scalars['UUID']['output'];
};

export enum CommentRankingFilterType {
  All = 'ALL',
  NoneRelevant = 'NONE_RELEVANT',
  Relevant = 'RELEVANT'
}

export type CommentablePublication = Post | Quote;

export enum ComparisonOperatorConditionType {
  Equal = 'EQUAL',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  NotEqual = 'NOT_EQUAL'
}

export type CreateActOnOpenActionBroadcastItemResult = {
  __typename?: 'CreateActOnOpenActionBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateActOnOpenActionEip712TypedData;
};

export type CreateActOnOpenActionEip712TypedData = {
  __typename?: 'CreateActOnOpenActionEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateActOnOpenActionEip712TypedDataTypes;
  /** The values */
  value: CreateActOnOpenActionEip712TypedDataValue;
};

export type CreateActOnOpenActionEip712TypedDataTypes = {
  __typename?: 'CreateActOnOpenActionEIP712TypedDataTypes';
  Act: Array<Eip712TypedDataField>;
};

export type CreateActOnOpenActionEip712TypedDataValue = {
  __typename?: 'CreateActOnOpenActionEIP712TypedDataValue';
  actionModuleAddress: Scalars['EvmAddress']['output'];
  actionModuleData: Scalars['BlockchainData']['output'];
  actorProfileId: Scalars['ProfileId']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  nonce: Scalars['Nonce']['output'];
  publicationActedId: Scalars['OnchainPublicationId']['output'];
  publicationActedProfileId: Scalars['ProfileId']['output'];
  referrerProfileIds: Array<Scalars['ProfileId']['output']>;
  referrerPubIds: Array<Scalars['OnchainPublicationId']['output']>;
};

export type CreateBlockProfilesBroadcastItemResult = {
  __typename?: 'CreateBlockProfilesBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateBlockProfilesEip712TypedData;
};

export type CreateBlockProfilesEip712TypedData = {
  __typename?: 'CreateBlockProfilesEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateBlockProfilesEip712TypedDataTypes;
  /** The values */
  value: CreateBlockProfilesEip712TypedDataValue;
};

export type CreateBlockProfilesEip712TypedDataTypes = {
  __typename?: 'CreateBlockProfilesEIP712TypedDataTypes';
  SetBlockStatus: Array<Eip712TypedDataField>;
};

export type CreateBlockProfilesEip712TypedDataValue = {
  __typename?: 'CreateBlockProfilesEIP712TypedDataValue';
  blockStatus: Array<Scalars['Boolean']['output']>;
  byProfileId: Scalars['ProfileId']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  idsOfProfilesToSetBlockStatus: Array<Scalars['ProfileId']['output']>;
  nonce: Scalars['Nonce']['output'];
};

export type CreateChangeProfileManagersBroadcastItemResult = {
  __typename?: 'CreateChangeProfileManagersBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateChangeProfileManagersEip712TypedData;
};

export type CreateChangeProfileManagersEip712TypedData = {
  __typename?: 'CreateChangeProfileManagersEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateChangeProfileManagersEip712TypedDataTypes;
  /** The values */
  value: CreateChangeProfileManagersEip712TypedDataValue;
};

export type CreateChangeProfileManagersEip712TypedDataTypes = {
  __typename?: 'CreateChangeProfileManagersEIP712TypedDataTypes';
  ChangeDelegatedExecutorsConfig: Array<Eip712TypedDataField>;
};

export type CreateChangeProfileManagersEip712TypedDataValue = {
  __typename?: 'CreateChangeProfileManagersEIP712TypedDataValue';
  approvals: Array<Scalars['Boolean']['output']>;
  configNumber: Scalars['Int']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  delegatedExecutors: Array<Scalars['EvmAddress']['output']>;
  delegatorProfileId: Scalars['ProfileId']['output'];
  nonce: Scalars['Nonce']['output'];
  switchToGivenConfig: Scalars['Boolean']['output'];
};

export type CreateFollowBroadcastItemResult = {
  __typename?: 'CreateFollowBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateFollowEip712TypedData;
};

/** The create follow eip 712 typed data */
export type CreateFollowEip712TypedData = {
  __typename?: 'CreateFollowEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateFollowEip712TypedDataTypes;
  /** The values */
  value: CreateFollowEip712TypedDataValue;
};

/** The create follow eip 712 typed data types */
export type CreateFollowEip712TypedDataTypes = {
  __typename?: 'CreateFollowEIP712TypedDataTypes';
  Follow: Array<Eip712TypedDataField>;
};

/** The create follow eip 712 typed data value */
export type CreateFollowEip712TypedDataValue = {
  __typename?: 'CreateFollowEIP712TypedDataValue';
  datas: Array<Scalars['BlockchainData']['output']>;
  deadline: Scalars['UnixTimestamp']['output'];
  followTokenIds: Array<Scalars['TokenId']['output']>;
  followerProfileId: Scalars['ProfileId']['output'];
  idsOfProfilesToFollow: Array<Scalars['ProfileId']['output']>;
  nonce: Scalars['Nonce']['output'];
};

export type CreateFrameEip712TypedData = {
  __typename?: 'CreateFrameEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateFrameEip712TypedDataTypes;
  /** The values */
  value: CreateFrameEip712TypedDataValue;
};

export type CreateFrameEip712TypedDataInput = {
  /** The typed data domain */
  domain: Eip712TypedDataDomainInput;
  /** The types */
  types: CreateFrameEip712TypedDataTypesInput;
  /** The values */
  value: CreateFrameEip712TypedDataValueInput;
};

export type CreateFrameEip712TypedDataTypes = {
  __typename?: 'CreateFrameEIP712TypedDataTypes';
  FrameData: Array<Eip712TypedDataField>;
};

export type CreateFrameEip712TypedDataTypesInput = {
  FrameData: Array<Eip712TypedDataFieldInput>;
};

export type CreateFrameEip712TypedDataValue = {
  __typename?: 'CreateFrameEIP712TypedDataValue';
  actionResponse: Scalars['String']['output'];
  buttonIndex: Scalars['Int']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  inputText: Scalars['String']['output'];
  profileId: Scalars['ProfileId']['output'];
  pubId: Scalars['PublicationId']['output'];
  /** The EIP-721 spec version, must be 1.0.0 */
  specVersion: Scalars['String']['output'];
  state: Scalars['String']['output'];
  url: Scalars['URI']['output'];
};

export type CreateFrameEip712TypedDataValueInput = {
  actionResponse: Scalars['String']['input'];
  buttonIndex: Scalars['Int']['input'];
  deadline: Scalars['UnixTimestamp']['input'];
  inputText: Scalars['String']['input'];
  profileId: Scalars['ProfileId']['input'];
  pubId: Scalars['PublicationId']['input'];
  /** The EIP-721 spec version, must be 1.0.0 */
  specVersion: Scalars['String']['input'];
  state: Scalars['String']['input'];
  url: Scalars['URI']['input'];
};

export type CreateLegacyCollectBroadcastItemResult = {
  __typename?: 'CreateLegacyCollectBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateLegacyCollectEip712TypedData;
};

export type CreateLegacyCollectEip712TypedData = {
  __typename?: 'CreateLegacyCollectEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateLegacyCollectEip712TypedDataTypes;
  /** The values */
  value: CreateLegacyCollectEip712TypedDataValue;
};

export type CreateLegacyCollectEip712TypedDataTypes = {
  __typename?: 'CreateLegacyCollectEIP712TypedDataTypes';
  CollectLegacy: Array<Eip712TypedDataField>;
};

export type CreateLegacyCollectEip712TypedDataValue = {
  __typename?: 'CreateLegacyCollectEIP712TypedDataValue';
  collectModuleData: Scalars['BlockchainData']['output'];
  collectorProfileId: Scalars['ProfileId']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  nonce: Scalars['Nonce']['output'];
  publicationCollectedId: Scalars['OnchainPublicationId']['output'];
  publicationCollectedProfileId: Scalars['ProfileId']['output'];
  referrerProfileId: Scalars['ProfileId']['output'];
  referrerPubId: Scalars['OnchainPublicationId']['output'];
};

export type CreateLinkHandleToProfileBroadcastItemResult = {
  __typename?: 'CreateLinkHandleToProfileBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateLinkHandleToProfileEip712TypedData;
};

export type CreateLinkHandleToProfileEip712TypedData = {
  __typename?: 'CreateLinkHandleToProfileEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateLinkHandleToProfileEip712TypedDataTypes;
  /** The values */
  value: CreateLinkHandleToProfileEip712TypedDataValue;
};

export type CreateLinkHandleToProfileEip712TypedDataTypes = {
  __typename?: 'CreateLinkHandleToProfileEIP712TypedDataTypes';
  Link: Array<Eip712TypedDataField>;
};

export type CreateLinkHandleToProfileEip712TypedDataValue = {
  __typename?: 'CreateLinkHandleToProfileEIP712TypedDataValue';
  deadline: Scalars['UnixTimestamp']['output'];
  handleId: Scalars['TokenId']['output'];
  nonce: Scalars['Nonce']['output'];
  profileId: Scalars['ProfileId']['output'];
};

export type CreateMomokaCommentBroadcastItemResult = {
  __typename?: 'CreateMomokaCommentBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateMomokaCommentEip712TypedData;
};

export type CreateMomokaCommentEip712TypedData = {
  __typename?: 'CreateMomokaCommentEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateMomokaCommentEip712TypedDataTypes;
  /** The values */
  value: CreateMomokaCommentEip712TypedDataValue;
};

export type CreateMomokaCommentEip712TypedDataTypes = {
  __typename?: 'CreateMomokaCommentEIP712TypedDataTypes';
  Comment: Array<Eip712TypedDataField>;
};

export type CreateMomokaCommentEip712TypedDataValue = {
  __typename?: 'CreateMomokaCommentEIP712TypedDataValue';
  actionModules: Array<Scalars['EvmAddress']['output']>;
  actionModulesInitDatas: Array<Scalars['BlockchainData']['output']>;
  contentURI: Scalars['URI']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  nonce: Scalars['Nonce']['output'];
  pointedProfileId: Scalars['ProfileId']['output'];
  pointedPubId: Scalars['OnchainPublicationId']['output'];
  profileId: Scalars['ProfileId']['output'];
  referenceModule: Scalars['EvmAddress']['output'];
  referenceModuleData: Scalars['BlockchainData']['output'];
  referenceModuleInitData: Scalars['BlockchainData']['output'];
  referrerProfileIds: Array<Scalars['ProfileId']['output']>;
  referrerPubIds: Array<Scalars['OnchainPublicationId']['output']>;
};

export type CreateMomokaMirrorBroadcastItemResult = {
  __typename?: 'CreateMomokaMirrorBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateMomokaMirrorEip712TypedData;
};

export type CreateMomokaMirrorEip712TypedData = {
  __typename?: 'CreateMomokaMirrorEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateMomokaMirrorEip712TypedDataTypes;
  /** The values */
  value: CreateMomokaMirrorEip712TypedDataValue;
};

export type CreateMomokaMirrorEip712TypedDataTypes = {
  __typename?: 'CreateMomokaMirrorEIP712TypedDataTypes';
  Mirror: Array<Eip712TypedDataField>;
};

export type CreateMomokaMirrorEip712TypedDataValue = {
  __typename?: 'CreateMomokaMirrorEIP712TypedDataValue';
  deadline: Scalars['UnixTimestamp']['output'];
  metadataURI: Scalars['String']['output'];
  nonce: Scalars['Nonce']['output'];
  pointedProfileId: Scalars['ProfileId']['output'];
  pointedPubId: Scalars['OnchainPublicationId']['output'];
  profileId: Scalars['ProfileId']['output'];
  referenceModuleData: Scalars['BlockchainData']['output'];
  referrerProfileIds: Array<Scalars['ProfileId']['output']>;
  referrerPubIds: Array<Scalars['OnchainPublicationId']['output']>;
};

export type CreateMomokaPostBroadcastItemResult = {
  __typename?: 'CreateMomokaPostBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateMomokaPostEip712TypedData;
};

export type CreateMomokaPostEip712TypedData = {
  __typename?: 'CreateMomokaPostEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateMomokaPostEip712TypedDataTypes;
  /** The values */
  value: CreateMomokaPostEip712TypedDataValue;
};

export type CreateMomokaPostEip712TypedDataTypes = {
  __typename?: 'CreateMomokaPostEIP712TypedDataTypes';
  Post: Array<Eip712TypedDataField>;
};

export type CreateMomokaPostEip712TypedDataValue = {
  __typename?: 'CreateMomokaPostEIP712TypedDataValue';
  actionModules: Array<Scalars['EvmAddress']['output']>;
  actionModulesInitDatas: Array<Scalars['BlockchainData']['output']>;
  contentURI: Scalars['URI']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  nonce: Scalars['Nonce']['output'];
  profileId: Scalars['ProfileId']['output'];
  referenceModule: Scalars['EvmAddress']['output'];
  referenceModuleInitData: Scalars['BlockchainData']['output'];
};

export type CreateMomokaPublicationResult = {
  __typename?: 'CreateMomokaPublicationResult';
  id: Scalars['PublicationId']['output'];
  momokaId: Scalars['MomokaId']['output'];
  proof: Scalars['MomokaProof']['output'];
};

export type CreateMomokaQuoteBroadcastItemResult = {
  __typename?: 'CreateMomokaQuoteBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateMomokaQuoteEip712TypedData;
};

export type CreateMomokaQuoteEip712TypedData = {
  __typename?: 'CreateMomokaQuoteEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateMomokaQuoteEip712TypedDataTypes;
  /** The values */
  value: CreateMomokaQuoteEip712TypedDataValue;
};

export type CreateMomokaQuoteEip712TypedDataTypes = {
  __typename?: 'CreateMomokaQuoteEIP712TypedDataTypes';
  Quote: Array<Eip712TypedDataField>;
};

export type CreateMomokaQuoteEip712TypedDataValue = {
  __typename?: 'CreateMomokaQuoteEIP712TypedDataValue';
  actionModules: Array<Scalars['EvmAddress']['output']>;
  actionModulesInitDatas: Array<Scalars['BlockchainData']['output']>;
  contentURI: Scalars['URI']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  nonce: Scalars['Nonce']['output'];
  pointedProfileId: Scalars['ProfileId']['output'];
  pointedPubId: Scalars['OnchainPublicationId']['output'];
  profileId: Scalars['ProfileId']['output'];
  referenceModule: Scalars['EvmAddress']['output'];
  referenceModuleData: Scalars['BlockchainData']['output'];
  referenceModuleInitData: Scalars['BlockchainData']['output'];
  referrerProfileIds: Array<Scalars['ProfileId']['output']>;
  referrerPubIds: Array<Scalars['OnchainPublicationId']['output']>;
};

export type CreateOnchainCommentBroadcastItemResult = {
  __typename?: 'CreateOnchainCommentBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateOnchainCommentEip712TypedData;
};

export type CreateOnchainCommentEip712TypedData = {
  __typename?: 'CreateOnchainCommentEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateOnchainCommentEip712TypedDataTypes;
  /** The values */
  value: CreateOnchainCommentEip712TypedDataValue;
};

export type CreateOnchainCommentEip712TypedDataTypes = {
  __typename?: 'CreateOnchainCommentEIP712TypedDataTypes';
  Comment: Array<Eip712TypedDataField>;
};

export type CreateOnchainCommentEip712TypedDataValue = {
  __typename?: 'CreateOnchainCommentEIP712TypedDataValue';
  actionModules: Array<Scalars['EvmAddress']['output']>;
  actionModulesInitDatas: Array<Scalars['BlockchainData']['output']>;
  contentURI: Scalars['URI']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  nonce: Scalars['Nonce']['output'];
  pointedProfileId: Scalars['ProfileId']['output'];
  pointedPubId: Scalars['OnchainPublicationId']['output'];
  profileId: Scalars['ProfileId']['output'];
  referenceModule: Scalars['EvmAddress']['output'];
  referenceModuleData: Scalars['BlockchainData']['output'];
  referenceModuleInitData: Scalars['BlockchainData']['output'];
  referrerProfileIds: Array<Scalars['ProfileId']['output']>;
  referrerPubIds: Array<Scalars['OnchainPublicationId']['output']>;
};

export type CreateOnchainMirrorBroadcastItemResult = {
  __typename?: 'CreateOnchainMirrorBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateOnchainMirrorEip712TypedData;
};

export type CreateOnchainMirrorEip712TypedData = {
  __typename?: 'CreateOnchainMirrorEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateOnchainMirrorEip712TypedDataTypes;
  /** The values */
  value: CreateOnchainMirrorEip712TypedDataValue;
};

export type CreateOnchainMirrorEip712TypedDataTypes = {
  __typename?: 'CreateOnchainMirrorEIP712TypedDataTypes';
  Mirror: Array<Eip712TypedDataField>;
};

export type CreateOnchainMirrorEip712TypedDataValue = {
  __typename?: 'CreateOnchainMirrorEIP712TypedDataValue';
  deadline: Scalars['UnixTimestamp']['output'];
  metadataURI: Scalars['String']['output'];
  nonce: Scalars['Nonce']['output'];
  pointedProfileId: Scalars['ProfileId']['output'];
  pointedPubId: Scalars['OnchainPublicationId']['output'];
  profileId: Scalars['ProfileId']['output'];
  referenceModuleData: Scalars['BlockchainData']['output'];
  referrerProfileIds: Array<Scalars['ProfileId']['output']>;
  referrerPubIds: Array<Scalars['OnchainPublicationId']['output']>;
};

export type CreateOnchainPostBroadcastItemResult = {
  __typename?: 'CreateOnchainPostBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateOnchainPostEip712TypedData;
};

export type CreateOnchainPostEip712TypedData = {
  __typename?: 'CreateOnchainPostEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateOnchainPostEip712TypedDataTypes;
  /** The values */
  value: CreateOnchainPostEip712TypedDataValue;
};

export type CreateOnchainPostEip712TypedDataTypes = {
  __typename?: 'CreateOnchainPostEIP712TypedDataTypes';
  Post: Array<Eip712TypedDataField>;
};

export type CreateOnchainPostEip712TypedDataValue = {
  __typename?: 'CreateOnchainPostEIP712TypedDataValue';
  actionModules: Array<Scalars['EvmAddress']['output']>;
  actionModulesInitDatas: Array<Scalars['BlockchainData']['output']>;
  contentURI: Scalars['URI']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  nonce: Scalars['Nonce']['output'];
  profileId: Scalars['ProfileId']['output'];
  referenceModule: Scalars['EvmAddress']['output'];
  referenceModuleInitData: Scalars['BlockchainData']['output'];
};

export type CreateOnchainQuoteBroadcastItemResult = {
  __typename?: 'CreateOnchainQuoteBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateOnchainQuoteEip712TypedData;
};

export type CreateOnchainQuoteEip712TypedData = {
  __typename?: 'CreateOnchainQuoteEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateOnchainQuoteEip712TypedDataTypes;
  /** The values */
  value: CreateOnchainQuoteEip712TypedDataValue;
};

export type CreateOnchainQuoteEip712TypedDataTypes = {
  __typename?: 'CreateOnchainQuoteEIP712TypedDataTypes';
  Quote: Array<Eip712TypedDataField>;
};

export type CreateOnchainQuoteEip712TypedDataValue = {
  __typename?: 'CreateOnchainQuoteEIP712TypedDataValue';
  actionModules: Array<Scalars['EvmAddress']['output']>;
  actionModulesInitDatas: Array<Scalars['BlockchainData']['output']>;
  contentURI: Scalars['URI']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  nonce: Scalars['Nonce']['output'];
  pointedProfileId: Scalars['ProfileId']['output'];
  pointedPubId: Scalars['OnchainPublicationId']['output'];
  profileId: Scalars['ProfileId']['output'];
  referenceModule: Scalars['EvmAddress']['output'];
  referenceModuleData: Scalars['BlockchainData']['output'];
  referenceModuleInitData: Scalars['BlockchainData']['output'];
  referrerProfileIds: Array<Scalars['ProfileId']['output']>;
  referrerPubIds: Array<Scalars['OnchainPublicationId']['output']>;
};

export type CreateOnchainSetProfileMetadataBroadcastItemResult = {
  __typename?: 'CreateOnchainSetProfileMetadataBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateOnchainSetProfileMetadataEip712TypedData;
};

export type CreateOnchainSetProfileMetadataEip712TypedData = {
  __typename?: 'CreateOnchainSetProfileMetadataEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateOnchainSetProfileMetadataEip712TypedDataTypes;
  /** The values */
  value: CreateOnchainSetProfileMetadataEip712TypedDataValue;
};

export type CreateOnchainSetProfileMetadataEip712TypedDataTypes = {
  __typename?: 'CreateOnchainSetProfileMetadataEIP712TypedDataTypes';
  SetProfileMetadataURI: Array<Eip712TypedDataField>;
};

export type CreateOnchainSetProfileMetadataEip712TypedDataValue = {
  __typename?: 'CreateOnchainSetProfileMetadataEIP712TypedDataValue';
  deadline: Scalars['UnixTimestamp']['output'];
  metadataURI: Scalars['URI']['output'];
  nonce: Scalars['Nonce']['output'];
  profileId: Scalars['ProfileId']['output'];
};

export type CreateProfileRequest = {
  followModule?: InputMaybe<FollowModuleInput>;
  to: Scalars['EvmAddress']['input'];
};

export enum CreateProfileWithHandleErrorReasonType {
  Failed = 'FAILED',
  HandleTaken = 'HANDLE_TAKEN'
}

export type CreateProfileWithHandleErrorResult = {
  __typename?: 'CreateProfileWithHandleErrorResult';
  reason: CreateProfileWithHandleErrorReasonType;
};

export type CreateProfileWithHandleRequest = {
  followModule?: InputMaybe<FollowModuleInput>;
  handle: Scalars['CreateHandle']['input'];
  to: Scalars['EvmAddress']['input'];
};

export type CreateProfileWithHandleResult =
  | CreateProfileWithHandleErrorResult
  | RelaySuccess;

export type CreateSetFollowModuleBroadcastItemResult = {
  __typename?: 'CreateSetFollowModuleBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateSetFollowModuleEip712TypedData;
};

export type CreateSetFollowModuleEip712TypedData = {
  __typename?: 'CreateSetFollowModuleEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateSetFollowModuleEip712TypedDataTypes;
  /** The values */
  value: CreateSetFollowModuleEip712TypedDataValue;
};

export type CreateSetFollowModuleEip712TypedDataTypes = {
  __typename?: 'CreateSetFollowModuleEIP712TypedDataTypes';
  SetFollowModule: Array<Eip712TypedDataField>;
};

export type CreateSetFollowModuleEip712TypedDataValue = {
  __typename?: 'CreateSetFollowModuleEIP712TypedDataValue';
  deadline: Scalars['UnixTimestamp']['output'];
  followModule: Scalars['EvmAddress']['output'];
  followModuleInitData: Scalars['BlockchainData']['output'];
  nonce: Scalars['Nonce']['output'];
  profileId: Scalars['ProfileId']['output'];
};

export type CreateUnblockProfilesBroadcastItemResult = {
  __typename?: 'CreateUnblockProfilesBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateUnblockProfilesEip712TypedData;
};

export type CreateUnblockProfilesEip712TypedData = {
  __typename?: 'CreateUnblockProfilesEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateUnblockProfilesEip712TypedDataTypes;
  /** The values */
  value: CreateUnblockProfilesEip712TypedDataValue;
};

export type CreateUnblockProfilesEip712TypedDataTypes = {
  __typename?: 'CreateUnblockProfilesEIP712TypedDataTypes';
  SetBlockStatus: Array<Eip712TypedDataField>;
};

export type CreateUnblockProfilesEip712TypedDataValue = {
  __typename?: 'CreateUnblockProfilesEIP712TypedDataValue';
  blockStatus: Array<Scalars['Boolean']['output']>;
  byProfileId: Scalars['ProfileId']['output'];
  deadline: Scalars['UnixTimestamp']['output'];
  idsOfProfilesToSetBlockStatus: Array<Scalars['ProfileId']['output']>;
  nonce: Scalars['Nonce']['output'];
};

export type CreateUnfollowBroadcastItemResult = {
  __typename?: 'CreateUnfollowBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateUnfollowEip712TypedData;
};

export type CreateUnfollowEip712TypedData = {
  __typename?: 'CreateUnfollowEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateUnfollowEip712TypedDataTypes;
  /** The values */
  value: CreateUnfollowEip712TypedDataValue;
};

export type CreateUnfollowEip712TypedDataTypes = {
  __typename?: 'CreateUnfollowEIP712TypedDataTypes';
  Unfollow: Array<Eip712TypedDataField>;
};

export type CreateUnfollowEip712TypedDataValue = {
  __typename?: 'CreateUnfollowEIP712TypedDataValue';
  deadline: Scalars['UnixTimestamp']['output'];
  idsOfProfilesToUnfollow: Array<Scalars['ProfileId']['output']>;
  nonce: Scalars['Nonce']['output'];
  unfollowerProfileId: Scalars['ProfileId']['output'];
};

export type CreateUnlinkHandleFromProfileBroadcastItemResult = {
  __typename?: 'CreateUnlinkHandleFromProfileBroadcastItemResult';
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']['output'];
  /** This broadcast item ID */
  id: Scalars['BroadcastId']['output'];
  /** The typed data */
  typedData: CreateUnlinkHandleFromProfileEip712TypedData;
};

export type CreateUnlinkHandleFromProfileEip712TypedData = {
  __typename?: 'CreateUnlinkHandleFromProfileEIP712TypedData';
  /** The typed data domain */
  domain: Eip712TypedDataDomain;
  /** The types */
  types: CreateUnlinkHandleFromProfileEip712TypedDataTypes;
  /** The values */
  value: CreateUnlinkHandleFromProfileEip712TypedDataValue;
};

export type CreateUnlinkHandleFromProfileEip712TypedDataTypes = {
  __typename?: 'CreateUnlinkHandleFromProfileEIP712TypedDataTypes';
  Unlink: Array<Eip712TypedDataField>;
};

export type CreateUnlinkHandleFromProfileEip712TypedDataValue = {
  __typename?: 'CreateUnlinkHandleFromProfileEIP712TypedDataValue';
  deadline: Scalars['UnixTimestamp']['output'];
  handleId: Scalars['TokenId']['output'];
  nonce: Scalars['Nonce']['output'];
  profileId: Scalars['ProfileId']['output'];
};

export enum CustomFiltersType {
  Gardeners = 'GARDENERS'
}

export enum DecryptFailReasonType {
  CanNotDecrypt = 'CAN_NOT_DECRYPT',
  CollectNotFinalisedOnChain = 'COLLECT_NOT_FINALISED_ON_CHAIN',
  DoesNotFollowProfile = 'DOES_NOT_FOLLOW_PROFILE',
  DoesNotOwnNft = 'DOES_NOT_OWN_NFT',
  DoesNotOwnProfile = 'DOES_NOT_OWN_PROFILE',
  FollowNotFinalisedOnChain = 'FOLLOW_NOT_FINALISED_ON_CHAIN',
  HasNotCollectedPublication = 'HAS_NOT_COLLECTED_PUBLICATION',
  MissingEncryptionParams = 'MISSING_ENCRYPTION_PARAMS',
  NotLoggedIn = 'NOT_LOGGED_IN',
  ProfileDoesNotExist = 'PROFILE_DOES_NOT_EXIST',
  PublicationIsNotGated = 'PUBLICATION_IS_NOT_GATED',
  UnauthorizedAddress = 'UNAUTHORIZED_ADDRESS',
  UnauthorizedBalance = 'UNAUTHORIZED_BALANCE',
  Unsupported = 'UNSUPPORTED'
}

export type DefaultProfileRequest = {
  for: Scalars['EvmAddress']['input'];
};

export type DegreesOfSeparationReferenceModuleInput = {
  commentsRestricted: Scalars['Boolean']['input'];
  degreesOfSeparation: Scalars['Int']['input'];
  mirrorsRestricted: Scalars['Boolean']['input'];
  quotesRestricted: Scalars['Boolean']['input'];
  /** You can set the degree to follow someone elses graph, if you leave blank it use your profile */
  sourceProfileId?: InputMaybe<Scalars['ProfileId']['input']>;
};

export type DegreesOfSeparationReferenceModuleSettings = {
  __typename?: 'DegreesOfSeparationReferenceModuleSettings';
  /** Applied to comments */
  commentsRestricted: Scalars['Boolean']['output'];
  contract: NetworkAddress;
  /** Degrees of separation */
  degreesOfSeparation: Scalars['Int']['output'];
  /** Applied to mirrors */
  mirrorsRestricted: Scalars['Boolean']['output'];
  /** Applied to quotes */
  quotesRestricted: Scalars['Boolean']['output'];
  /** Who the degree of separation is applied to */
  sourceProfileId: Scalars['ProfileId']['output'];
  type: ReferenceModuleType;
};

export type DidReactOnPublicationPublicationIdAndProfileId = {
  profileId: Scalars['ProfileId']['input'];
  publicationId: Scalars['PublicationId']['input'];
};

export type DidReactOnPublicationRequest = {
  for: Array<DidReactOnPublicationPublicationIdAndProfileId>;
  where?: InputMaybe<WhoReactedPublicationWhere>;
};

export type DidReactOnPublicationResult = {
  __typename?: 'DidReactOnPublicationResult';
  profileId: Scalars['ProfileId']['output'];
  publicationId: Scalars['PublicationId']['output'];
  result: Scalars['Boolean']['output'];
};

export type DismissRecommendedProfilesRequest = {
  dismiss: Array<Scalars['ProfileId']['input']>;
};

export type DisputedReport = {
  __typename?: 'DisputedReport';
  createdAt: Scalars['DateTime']['output'];
  disputeReason: Scalars['String']['output'];
  disputer: Profile;
  reportAdditionalInfo: Scalars['String']['output'];
  reportReason: Scalars['String']['output'];
  reportSubreason: Scalars['String']['output'];
  reportedProfile: Profile;
  reportedPublication?: Maybe<PrimaryPublication>;
  reporter: Profile;
};

/** The eip 712 typed data domain */
export type Eip712TypedDataDomain = {
  __typename?: 'EIP712TypedDataDomain';
  /** The chainId */
  chainId: Scalars['ChainId']['output'];
  /** The name of the typed data domain */
  name: Scalars['String']['output'];
  /** The verifying contract */
  verifyingContract: Scalars['EvmAddress']['output'];
  /** The version */
  version: Scalars['String']['output'];
};

export type Eip712TypedDataDomainInput = {
  /** The chainId */
  chainId: Scalars['ChainId']['input'];
  /** The name of the typed data domain */
  name: Scalars['String']['input'];
  /** The verifying contract */
  verifyingContract: Scalars['EvmAddress']['input'];
  /** The version */
  version: Scalars['String']['input'];
};

/** The eip 712 typed data field */
export type Eip712TypedDataField = {
  __typename?: 'EIP712TypedDataField';
  /** The name of the typed data field */
  name: Scalars['String']['output'];
  /** The type of the typed data field */
  type: Scalars['String']['output'];
};

export type Eip712TypedDataFieldInput = {
  /** The name of the typed data field */
  name: Scalars['String']['input'];
  /** The type of the typed data field */
  type: Scalars['String']['input'];
};

export type EmbedMetadataV3 = {
  __typename?: 'EmbedMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  embed: Scalars['EncryptableURI']['output'];
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type EncryptableAudio = {
  __typename?: 'EncryptableAudio';
  mimeType?: Maybe<Scalars['MimeType']['output']>;
  uri: Scalars['EncryptableURI']['output'];
};

export type EncryptableAudioSet = {
  __typename?: 'EncryptableAudioSet';
  optimized?: Maybe<Audio>;
  raw: EncryptableAudio;
};

export type EncryptableImage = {
  __typename?: 'EncryptableImage';
  /** Height of the image */
  height?: Maybe<Scalars['Int']['output']>;
  /** MIME type of the image */
  mimeType?: Maybe<Scalars['MimeType']['output']>;
  uri: Scalars['EncryptableURI']['output'];
  /** Width of the image */
  width?: Maybe<Scalars['Int']['output']>;
};

export type EncryptableImageSet = {
  __typename?: 'EncryptableImageSet';
  optimized?: Maybe<Image>;
  raw: EncryptableImage;
  transformed?: Maybe<Image>;
};

export type EncryptableImageSetTransformedArgs = {
  request: ImageTransform;
};

export type EncryptableVideo = {
  __typename?: 'EncryptableVideo';
  mimeType?: Maybe<Scalars['MimeType']['output']>;
  uri: Scalars['EncryptableURI']['output'];
};

export type EncryptableVideoSet = {
  __typename?: 'EncryptableVideoSet';
  optimized?: Maybe<Video>;
  raw: EncryptableVideo;
};

export type EnsOnchainIdentity = {
  __typename?: 'EnsOnchainIdentity';
  /** The default ens mapped to this address */
  name?: Maybe<Scalars['Ens']['output']>;
};

export type EoaOwnershipCondition = {
  __typename?: 'EoaOwnershipCondition';
  address: Scalars['EvmAddress']['output'];
};

/** The erc20 type */
export type Erc20 = {
  __typename?: 'Erc20';
  /** The erc20 address */
  contract: NetworkAddress;
  /** Decimal places for the token */
  decimals: Scalars['Int']['output'];
  /** Name of the symbol */
  name: Scalars['String']['output'];
  /** Symbol for the token */
  symbol: Scalars['String']['output'];
};

export type Erc20OwnershipCondition = {
  __typename?: 'Erc20OwnershipCondition';
  amount: Amount;
  condition: ComparisonOperatorConditionType;
};

export type EventMetadataV3 = {
  __typename?: 'EventMetadataV3';
  address?: Maybe<PhysicalAddress>;
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  endsAt: Scalars['EncryptableDateTime']['output'];
  geographic?: Maybe<GeoLocation>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  links?: Maybe<Array<Scalars['EncryptableURI']['output']>>;
  locale: Scalars['Locale']['output'];
  location: Scalars['EncryptableString']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  startsAt: Scalars['EncryptableDateTime']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The optional title of the event. Empty if not set. */
  title: Scalars['String']['output'];
};

/** Possible sort criteria for exploring profiles */
export enum ExploreProfilesOrderByType {
  CreatedOn = 'CREATED_ON',
  LatestCreated = 'LATEST_CREATED',
  MostCollects = 'MOST_COLLECTS',
  MostComments = 'MOST_COMMENTS',
  MostFollowers = 'MOST_FOLLOWERS',
  MostMirrors = 'MOST_MIRRORS',
  MostPosts = 'MOST_POSTS',
  MostPublication = 'MOST_PUBLICATION'
}

export type ExploreProfilesRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  /** Order criteria for exploring profiles */
  orderBy: ExploreProfilesOrderByType;
  /** Filtering criteria for exploring profiles */
  where?: InputMaybe<ExploreProfilesWhere>;
};

export type ExploreProfilesWhere = {
  /** Array of custom filters for exploring profiles */
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  /** Filter profiles created since the specified timestamp */
  since?: InputMaybe<Scalars['UnixTimestamp']['input']>;
};

export type ExplorePublication = Post | Quote;

export type ExplorePublicationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  orderBy: ExplorePublicationsOrderByType;
  where?: InputMaybe<ExplorePublicationsWhere>;
};

export enum ExplorePublicationType {
  Post = 'POST',
  Quote = 'QUOTE'
}

export enum ExplorePublicationsOrderByType {
  Latest = 'LATEST',
  LensCurated = 'LENS_CURATED',
  TopCollectedOpenAction = 'TOP_COLLECTED_OPEN_ACTION',
  TopCommented = 'TOP_COMMENTED',
  TopMirrored = 'TOP_MIRRORED',
  TopQuoted = 'TOP_QUOTED',
  TopReacted = 'TOP_REACTED'
}

export type ExplorePublicationsWhere = {
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  metadata?: InputMaybe<PublicationMetadataFilters>;
  publicationTypes?: InputMaybe<Array<ExplorePublicationType>>;
  since?: InputMaybe<Scalars['UnixTimestamp']['input']>;
};

export type FeeFollowModuleInput = {
  amount: AmountInput;
  recipient: Scalars['EvmAddress']['input'];
};

export type FeeFollowModuleRedeemInput = {
  amount: AmountInput;
};

export type FeeFollowModuleSettings = {
  __typename?: 'FeeFollowModuleSettings';
  /** The amount info */
  amount: Amount;
  contract: NetworkAddress;
  /** The module recipient address */
  recipient: Scalars['EvmAddress']['output'];
  type: FollowModuleType;
};

export enum FeedEventItemType {
  Acted = 'ACTED',
  Collect = 'COLLECT',
  Comment = 'COMMENT',
  Mirror = 'MIRROR',
  Post = 'POST',
  Quote = 'QUOTE',
  Reaction = 'REACTION'
}

export type FeedHighlight = Post | Quote;

export type FeedHighlightsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  where?: InputMaybe<FeedHighlightsWhere>;
};

export type FeedHighlightsWhere = {
  for?: InputMaybe<Scalars['ProfileId']['input']>;
  metadata?: InputMaybe<PublicationMetadataFilters>;
};

export type FeedItem = {
  __typename?: 'FeedItem';
  acted: Array<OpenActionProfileActed>;
  comments: Array<Comment>;
  id: Scalars['String']['output'];
  mirrors: Array<Mirror>;
  reactions: Array<ReactionEvent>;
  root: PrimaryPublication;
};

export type FeedRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  where?: InputMaybe<FeedWhere>;
};

export type FeedWhere = {
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  feedEventItemTypes?: InputMaybe<Array<FeedEventItemType>>;
  for?: InputMaybe<Scalars['ProfileId']['input']>;
  metadata?: InputMaybe<PublicationMetadataFilters>;
};

export type Fiat = {
  __typename?: 'Fiat';
  decimals: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type FiatAmount = {
  __typename?: 'FiatAmount';
  asset: Fiat;
  value: Scalars['String']['output'];
};

export type Follow = {
  followModule?: InputMaybe<FollowModuleRedeemInput>;
  profileId: Scalars['ProfileId']['input'];
};

export type FollowCondition = {
  __typename?: 'FollowCondition';
  follow: Scalars['ProfileId']['output'];
};

export type FollowLensManager = {
  followModule?: InputMaybe<FollowLensManagerModuleRedeemInput>;
  profileId: Scalars['ProfileId']['input'];
};

/** The lens manager will only support follow modules which are verified here - https://github.com/lens-protocol/verified-modules/blob/master/follow-modules.json */
export type FollowLensManagerModuleRedeemInput = {
  unknownFollowModule?: InputMaybe<UnknownFollowModuleRedeemInput>;
};

export type FollowLensManagerRequest = {
  follow: Array<FollowLensManager>;
};

export type FollowModule =
  | FeeFollowModuleSettings
  | RevertFollowModuleSettings
  | UnknownFollowModuleSettings;

export type FollowModuleInput = {
  feeFollowModule?: InputMaybe<FeeFollowModuleInput>;
  freeFollowModule?: InputMaybe<Scalars['Boolean']['input']>;
  revertFollowModule?: InputMaybe<Scalars['Boolean']['input']>;
  unknownFollowModule?: InputMaybe<UnknownFollowModuleInput>;
};

export type FollowModuleRedeemInput = {
  feeFollowModule?: InputMaybe<FeeFollowModuleRedeemInput>;
  unknownFollowModule?: InputMaybe<UnknownFollowModuleRedeemInput>;
};

export enum FollowModuleType {
  FeeFollowModule = 'FeeFollowModule',
  RevertFollowModule = 'RevertFollowModule',
  UnknownFollowModule = 'UnknownFollowModule'
}

export type FollowNotification = {
  __typename?: 'FollowNotification';
  followers: Array<Profile>;
  id: Scalars['UUID']['output'];
};

export type FollowOnlyReferenceModuleSettings = {
  __typename?: 'FollowOnlyReferenceModuleSettings';
  contract: NetworkAddress;
  type: ReferenceModuleType;
};

export type FollowPaidAction = {
  __typename?: 'FollowPaidAction';
  followed: Profile;
  latestActed: Array<LatestActed>;
};

export type FollowRequest = {
  follow: Array<Follow>;
};

export type FollowRevenueRequest = {
  for: Scalars['ProfileId']['input'];
};

export type FollowRevenueResult = {
  __typename?: 'FollowRevenueResult';
  revenues: Array<RevenueAggregate>;
};

export type FollowStatusBulk = {
  follower: Scalars['ProfileId']['input'];
  profileId: Scalars['ProfileId']['input'];
};

export type FollowStatusBulkRequest = {
  followInfos: Array<FollowStatusBulk>;
};

export type FollowStatusBulkResult = {
  __typename?: 'FollowStatusBulkResult';
  follower: Scalars['ProfileId']['output'];
  profileId: Scalars['ProfileId']['output'];
  status: OptimisticStatusResult;
};

export type FollowersRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  of: Scalars['ProfileId']['input'];
  /** The order by which to sort the profiles - note if your looking at your own followers it always be DESC */
  orderBy?: InputMaybe<ProfilesOrderBy>;
};

export type FollowingRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  for: Scalars['ProfileId']['input'];
  limit?: InputMaybe<LimitType>;
  /** The order by which to sort the profiles - note if your looking at your own following it always be DESC */
  orderBy?: InputMaybe<ProfilesOrderBy>;
};

export type ForYouResult = {
  __typename?: 'ForYouResult';
  publication: PublicationForYou;
  source: ForYouSource;
};

export enum ForYouSource {
  Curated = 'curated',
  ExtendedNetwork = 'extended_network',
  Following = 'following',
  Popular = 'popular'
}

export type FrameEip712Request = {
  actionResponse: Scalars['String']['input'];
  buttonIndex: Scalars['Int']['input'];
  deadline: Scalars['UnixTimestamp']['input'];
  inputText: Scalars['String']['input'];
  profileId: Scalars['ProfileId']['input'];
  pubId: Scalars['PublicationId']['input'];
  /** The EIP-721 spec version, must be 1.0.0 */
  specVersion: Scalars['String']['input'];
  state: Scalars['String']['input'];
  url: Scalars['URI']['input'];
};

export type FrameLensManagerEip712Request = {
  actionResponse: Scalars['String']['input'];
  buttonIndex: Scalars['Int']['input'];
  inputText: Scalars['String']['input'];
  profileId: Scalars['ProfileId']['input'];
  pubId: Scalars['PublicationId']['input'];
  /** The EIP-721 spec version, must be 1.0.0 */
  specVersion: Scalars['String']['input'];
  state: Scalars['String']['input'];
  url: Scalars['URI']['input'];
};

export type FrameLensManagerSignatureResult = {
  __typename?: 'FrameLensManagerSignatureResult';
  /** The signature */
  signature: Scalars['Signature']['output'];
  /** The typed data signed */
  signedTypedData: CreateFrameEip712TypedData;
};

export type FrameVerifySignature = {
  /** The identity token */
  identityToken: Scalars['Jwt']['input'];
  /** The signature */
  signature: Scalars['Signature']['input'];
  /** The typed data signed */
  signedTypedData: CreateFrameEip712TypedDataInput;
};

export enum FrameVerifySignatureResult {
  DeadlineExpired = 'DEADLINE_EXPIRED',
  IdentityCannotUseProfile = 'IDENTITY_CANNOT_USE_PROFILE',
  IdentityUnauthorized = 'IDENTITY_UNAUTHORIZED',
  SignerAddressCannotUseProfile = 'SIGNER_ADDRESS_CANNOT_USE_PROFILE',
  Verified = 'VERIFIED'
}

export type FraudReasonInput = {
  reason: PublicationReportingReason;
  subreason: PublicationReportingFraudSubreason;
};

export type GenerateModuleCurrencyApprovalDataRequest = {
  allowance: AmountInput;
  module: ModuleCurrencyApproval;
};

export type GenerateModuleCurrencyApprovalResult = {
  __typename?: 'GenerateModuleCurrencyApprovalResult';
  data: Scalars['BlockchainData']['output'];
  from: Scalars['EvmAddress']['output'];
  to: Scalars['EvmAddress']['output'];
};

export type GeoLocation = {
  __typename?: 'GeoLocation';
  /** `null` when `rawURI` is encrypted */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** `null` when `rawURI` is encrypted */
  longitude?: Maybe<Scalars['Float']['output']>;
  /** The raw Geo URI of the location. If encrypted `latitude` and `longitude` will be `null` */
  rawURI: Scalars['EncryptableURI']['output'];
};

export type GetModuleMetadataResult = {
  __typename?: 'GetModuleMetadataResult';
  metadata: ModuleMetadata;
  moduleType: ModuleType;
  /** True if the module can be signedless and use lens manager without a signature */
  signlessApproved: Scalars['Boolean']['output'];
  /** True if the module can be sponsored through gasless so the user does not need to pay for gas */
  sponsoredApproved: Scalars['Boolean']['output'];
  /** True if the module is deemed as safe */
  verified: Scalars['Boolean']['output'];
};

export type GetProfileMetadataArgs = {
  /** The app id to query the profile's metadata */
  appId?: InputMaybe<Scalars['AppId']['input']>;
  /** If true, will fallback to global profile metadata, if there is no metadata set for that specific app id */
  useFallback?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HandleGuardianResult = {
  __typename?: 'HandleGuardianResult';
  cooldownEndsOn?: Maybe<Scalars['DateTime']['output']>;
  protected: Scalars['Boolean']['output'];
};

export type HandleInfo = {
  __typename?: 'HandleInfo';
  /** The full handle - namespace/localname */
  fullHandle: Scalars['Handle']['output'];
  guardian: HandleGuardianResult;
  /** The handle nft token id */
  id: Scalars['TokenId']['output'];
  /** If null its not linked to anything */
  linkedTo?: Maybe<HandleLinkedTo>;
  /** The localname */
  localName: Scalars['String']['output'];
  /** The namespace */
  namespace: Scalars['String']['output'];
  ownedBy: Scalars['EvmAddress']['output'];
  /** The suggested format to use on UI for ease but you can innovate and slice and dice as you want */
  suggestedFormatted: SuggestedFormattedHandle;
};

export type HandleLinkedTo = {
  __typename?: 'HandleLinkedTo';
  /** The contract address it is linked to */
  contract: NetworkAddress;
  /** The nft token id it is linked to (this can be the profile Id) */
  nftTokenId: Scalars['TokenId']['output'];
};

export type HandleToAddressRequest = {
  /** The full handle - namespace/localname */
  handle: Scalars['Handle']['input'];
};

export enum HiddenCommentsType {
  HiddenOnly = 'HIDDEN_ONLY',
  Hide = 'HIDE',
  Show = 'SHOW'
}

export type HideCommentRequest = {
  /** The comment to hide. It has to be under a publication made by the user making the request. If already hidden, nothing will happen. */
  for: Scalars['PublicationId']['input'];
};

export type HideManagedProfileRequest = {
  /** The profile to hide */
  profileId: Scalars['ProfileId']['input'];
};

export type HidePublicationRequest = {
  for: Scalars['PublicationId']['input'];
};

export type IphResult = {
  __typename?: 'IPHResult';
  h?: Maybe<Scalars['Handle']['output']>;
  hda: Scalars['Boolean']['output'];
  hs: Scalars['Boolean']['output'];
};

export type IdKitPhoneVerifyWebhookRequest = {
  sharedSecret: Scalars['String']['input'];
  worldcoin?: InputMaybe<WorldcoinPhoneVerifyWebhookRequest>;
};

export enum IdKitPhoneVerifyWebhookResultStatusType {
  AlreadyVerified = 'ALREADY_VERIFIED',
  Success = 'SUCCESS'
}

export type IllegalReasonInput = {
  reason: PublicationReportingReason;
  subreason: PublicationReportingIllegalSubreason;
};

export type Image = {
  __typename?: 'Image';
  /** Height of the image */
  height?: Maybe<Scalars['Int']['output']>;
  /** MIME type of the image */
  mimeType?: Maybe<Scalars['MimeType']['output']>;
  uri: Scalars['URI']['output'];
  /** Width of the image */
  width?: Maybe<Scalars['Int']['output']>;
};

export type ImageMetadataV3 = {
  __typename?: 'ImageMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  asset: PublicationMetadataMediaImage;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The title of the image. Empty if not set. */
  title: Scalars['String']['output'];
};

export type ImageSet = {
  __typename?: 'ImageSet';
  optimized?: Maybe<Image>;
  raw: Image;
  transformed?: Maybe<Image>;
};

export type ImageSetTransformedArgs = {
  request: ImageTransform;
};

export type ImageTransform = {
  /** Set the transformed image's height */
  height?: InputMaybe<Scalars['ImageSizeTransform']['input']>;
  /** Set if you want to keep the image's original aspect ratio. True by default. If explicitly set to false, the image will stretch based on the width and height values. */
  keepAspectRatio?: InputMaybe<Scalars['Boolean']['input']>;
  /** Set the transformed image's width */
  width?: InputMaybe<Scalars['ImageSizeTransform']['input']>;
};

export type InternalAddCuratedTagRequest = {
  hhh: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  ttt: Scalars['String']['input'];
};

export type InternalAddInvitesRequest = {
  n: Scalars['Int']['input'];
  p: Scalars['ProfileId']['input'];
  secret: Scalars['String']['input'];
};

export type InternalAllowDomainRequest = {
  domain: Scalars['URI']['input'];
  secret: Scalars['String']['input'];
};

export type InternalAllowedDomainsRequest = {
  secret: Scalars['String']['input'];
};

export type InternalBoostProfileRequest = {
  h?: InputMaybe<Scalars['Handle']['input']>;
  p?: InputMaybe<Scalars['ProfileId']['input']>;
  s: Scalars['Int']['input'];
  secret: Scalars['String']['input'];
};

export type InternalBoostScoreRequest = {
  h?: InputMaybe<Scalars['Handle']['input']>;
  p?: InputMaybe<Scalars['ProfileId']['input']>;
  secret: Scalars['String']['input'];
};

export type InternalClaimRequest = {
  address: Scalars['EvmAddress']['input'];
  freeTextHandle?: InputMaybe<Scalars['Boolean']['input']>;
  handle?: InputMaybe<Scalars['CreateHandle']['input']>;
  overrideAlreadyClaimed: Scalars['Boolean']['input'];
  overrideTradeMark: Scalars['Boolean']['input'];
  secret: Scalars['String']['input'];
};

export type InternalClaimStatusRequest = {
  address: Scalars['EvmAddress']['input'];
  secret: Scalars['String']['input'];
};

export type InternalCuratedHandlesRequest = {
  secret: Scalars['String']['input'];
};

export type InternalCuratedTagsRequest = {
  hhh: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type InternalCuratedUpdateRequest = {
  /** The full handle - namespace/localname */
  handle: Scalars['Handle']['input'];
  remove: Scalars['Boolean']['input'];
  secret: Scalars['String']['input'];
};

export type InternalForYouFeedRequest = {
  d: Scalars['DateTime']['input'];
  n: Scalars['Int']['input'];
  p?: InputMaybe<Scalars['ProfileId']['input']>;
  secret: Scalars['String']['input'];
};

export type InternalInvitesRequest = {
  p: Scalars['ProfileId']['input'];
  secret: Scalars['String']['input'];
};

export type InternalMintHandleAndProfileRequest = {
  a: Scalars['EvmAddress']['input'];
  h: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type InternalNftIndexRequest = {
  n: Array<Nfi>;
  secret: Scalars['String']['input'];
};

export type InternalNftVerifyRequest = {
  n: Array<Nfi>;
  secret: Scalars['String']['input'];
};

export type InternalPaymentHandleInfoRequest = {
  p: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type InternalProfileStatusRequest = {
  hhh: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type InternalRemoveCuratedTagRequest = {
  hhh: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  ttt: Scalars['String']['input'];
};

export type InternalUpdateModuleOptionsRequest = {
  i: Scalars['EvmAddress']['input'];
  lma?: InputMaybe<Scalars['Boolean']['input']>;
  secret: Scalars['String']['input'];
  t: ModuleType;
  v?: InputMaybe<Scalars['Boolean']['input']>;
};

export type InternalUpdateProfileStatusRequest = {
  dd: Scalars['Boolean']['input'];
  hhh: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  ss: Scalars['Boolean']['input'];
};

export type InviteRequest = {
  invites: Array<Scalars['EvmAddress']['input']>;
};

export type InvitedResult = {
  __typename?: 'InvitedResult';
  addressInvited: Scalars['EvmAddress']['output'];
  /** @deprecated Profiles hand out invites on Lens V2 so this is unnecessary information. Will always be the dead address. */
  by: Scalars['EvmAddress']['output'];
  profileMinted?: Maybe<Profile>;
  when: Scalars['DateTime']['output'];
};

export type KnownCollectOpenActionResult = {
  __typename?: 'KnownCollectOpenActionResult';
  type: CollectOpenActionModuleType;
};

export type KnownSupportedModule = {
  __typename?: 'KnownSupportedModule';
  contract: NetworkAddress;
  moduleInput: Array<ModuleInfo>;
  moduleName: Scalars['String']['output'];
  redeemInput: Array<ModuleInfo>;
  returnDataInput: Array<ModuleInfo>;
};

export type LastLoggedInProfileRequest = {
  for: Scalars['EvmAddress']['input'];
};

export type LatestActed = {
  __typename?: 'LatestActed';
  actedAt: Scalars['DateTime']['output'];
  profile: Profile;
  txHash: Scalars['TxHash']['output'];
};

export type LatestPaidActionsFilter = {
  openActionFilters?: InputMaybe<Array<OpenActionFilter>>;
  openActionPublicationMetadataFilters?: InputMaybe<PublicationMetadataFilters>;
};

export type LatestPaidActionsResult = {
  __typename?: 'LatestPaidActionsResult';
  items: Array<PaidAction>;
  pageInfo: PaginatedResultInfo;
};

export type LatestPaidActionsWhere = {
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
};

export type LegacyAaveFeeCollectModuleSettings = {
  __typename?: 'LegacyAaveFeeCollectModuleSettings';
  /** The collect module amount info */
  amount: Amount;
  /** The maximum number of collects for this publication. */
  collectLimit?: Maybe<Scalars['String']['output']>;
  contract: NetworkAddress;
  /** The end timestamp after which collecting is impossible. */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  /** True if only followers of publisher may collect the post. */
  followerOnly: Scalars['Boolean']['output'];
  /** Recipient of collect fees. */
  recipient: Scalars['EvmAddress']['output'];
  /** The referral fee associated with this publication. */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type LegacyCollectRequest = {
  on: Scalars['PublicationId']['input'];
  referrer?: InputMaybe<Scalars['PublicationId']['input']>;
};

export type LegacyDegreesOfSeparationReferenceModuleSettings = {
  __typename?: 'LegacyDegreesOfSeparationReferenceModuleSettings';
  /** Applied to comments */
  commentsRestricted: Scalars['Boolean']['output'];
  contract: NetworkAddress;
  /** Degrees of separation */
  degreesOfSeparation: Scalars['Int']['output'];
  /** Applied to mirrors */
  mirrorsRestricted: Scalars['Boolean']['output'];
  type: ReferenceModuleType;
};

export type LegacyErc4626FeeCollectModuleSettings = {
  __typename?: 'LegacyERC4626FeeCollectModuleSettings';
  /** The collect module amount info */
  amount: Amount;
  /** The maximum number of collects for this publication. */
  collectLimit?: Maybe<Scalars['String']['output']>;
  contract: NetworkAddress;
  /** The end timestamp after which collecting is impossible. */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  /** True if only followers of publisher may collect the post. */
  followerOnly: Scalars['Boolean']['output'];
  /** The recipient of the ERC4626 vault shares */
  recipient: Scalars['EvmAddress']['output'];
  /** The referral fee associated with this publication. */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
  /** The ERC4626 vault address */
  vault: NetworkAddress;
};

export type LegacyFeeCollectModuleSettings = {
  __typename?: 'LegacyFeeCollectModuleSettings';
  /** The collect module amount info */
  amount: Amount;
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** Follower only */
  followerOnly: Scalars['Boolean']['output'];
  /** The collect module recipient address */
  recipient: Scalars['EvmAddress']['output'];
  /** The collect module referral fee */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type LegacyFollowOnlyReferenceModuleSettings = {
  __typename?: 'LegacyFollowOnlyReferenceModuleSettings';
  contract: NetworkAddress;
  type: ReferenceModuleType;
};

export type LegacyFreeCollectModuleSettings = {
  __typename?: 'LegacyFreeCollectModuleSettings';
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** Follower only */
  followerOnly: Scalars['Boolean']['output'];
  type: OpenActionModuleType;
};

export type LegacyLimitedFeeCollectModuleSettings = {
  __typename?: 'LegacyLimitedFeeCollectModuleSettings';
  /** The collect module amount info */
  amount: Amount;
  /** The collect module limit. */
  collectLimit?: Maybe<Scalars['String']['output']>;
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** Follower only */
  followerOnly: Scalars['Boolean']['output'];
  /** The collect module recipient address */
  recipient: Scalars['EvmAddress']['output'];
  /** The collect module referral fee */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type LegacyLimitedTimedFeeCollectModuleSettings = {
  __typename?: 'LegacyLimitedTimedFeeCollectModuleSettings';
  /** The collect module amount info */
  amount: Amount;
  /** The collect module limit */
  collectLimit?: Maybe<Scalars['String']['output']>;
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** The collect module end timestamp */
  endTimestamp: Scalars['DateTime']['output'];
  /** Follower only */
  followerOnly: Scalars['Boolean']['output'];
  /** The collect module recipient address */
  recipient: Scalars['EvmAddress']['output'];
  /** The collect module referral fee */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type LegacyMultirecipientFeeCollectModuleSettings = {
  __typename?: 'LegacyMultirecipientFeeCollectModuleSettings';
  /** The collect module amount info */
  amount: Amount;
  /** The maximum number of collects for this publication. */
  collectLimit?: Maybe<Scalars['String']['output']>;
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** The end timestamp after which collecting is impossible. */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  /** True if only followers of publisher may collect the post. */
  followerOnly: Scalars['Boolean']['output'];
  /** Recipient of collect fees. */
  recipients: Array<RecipientDataOutput>;
  /** The referral fee associated with this publication. */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type LegacyRevertCollectModuleSettings = {
  __typename?: 'LegacyRevertCollectModuleSettings';
  contract: NetworkAddress;
  type: OpenActionModuleType;
};

export type LegacySimpleCollectModuleSettings = {
  __typename?: 'LegacySimpleCollectModuleSettings';
  /** The collect module amount info. `Amount.value = 0` in case of free collects. */
  amount: Amount;
  /** The maximum number of collects for this publication. */
  collectLimit?: Maybe<Scalars['String']['output']>;
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** The end timestamp after which collecting is impossible. */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  /** True if only followers of publisher may collect the post. */
  followerOnly: Scalars['Boolean']['output'];
  /** The collect module recipient address */
  recipient: Scalars['EvmAddress']['output'];
  /** The collect module referral fee */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type LegacyTimedFeeCollectModuleSettings = {
  __typename?: 'LegacyTimedFeeCollectModuleSettings';
  /** The collect module amount info */
  amount: Amount;
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** The collect module end timestamp */
  endTimestamp: Scalars['DateTime']['output'];
  /** Follower only */
  followerOnly: Scalars['Boolean']['output'];
  /** The collect module recipient address */
  recipient: Scalars['EvmAddress']['output'];
  /** The collect module referral fee */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type LensProfileManagerRelayError = {
  __typename?: 'LensProfileManagerRelayError';
  reason: LensProfileManagerRelayErrorReasonType;
};

export enum LensProfileManagerRelayErrorReasonType {
  AppNotAllowed = 'APP_NOT_ALLOWED',
  Failed = 'FAILED',
  NotSponsored = 'NOT_SPONSORED',
  NoLensManagerEnabled = 'NO_LENS_MANAGER_ENABLED',
  RateLimited = 'RATE_LIMITED',
  RequiresSignature = 'REQUIRES_SIGNATURE'
}

export type LensProfileManagerRelayResult =
  | LensProfileManagerRelayError
  | RelaySuccess;

export enum LensTransactionFailureType {
  MetadataError = 'METADATA_ERROR',
  Reverted = 'REVERTED'
}

export type LensTransactionResult = {
  __typename?: 'LensTransactionResult';
  extraInfo?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<LensTransactionFailureType>;
  status: LensTransactionStatusType;
  txHash: Scalars['TxHash']['output'];
};

export type LensTransactionStatusRequest = {
  /** Transaction hash for retrieving transaction status */
  forTxHash?: InputMaybe<Scalars['TxHash']['input']>;
  /** Transaction ID for retrieving transaction status when using the broadcaster */
  forTxId?: InputMaybe<Scalars['TxId']['input']>;
};

export enum LensTransactionStatusType {
  Complete = 'COMPLETE',
  Failed = 'FAILED',
  OptimisticallyUpdated = 'OPTIMISTICALLY_UPDATED',
  Processing = 'PROCESSING'
}

export enum LimitType {
  Fifty = 'Fifty',
  Ten = 'Ten',
  TwentyFive = 'TwentyFive'
}

export type LinkHandleToProfileRequest = {
  /** The full handle - namespace/localname */
  handle: Scalars['Handle']['input'];
};

export type LinkMetadataV3 = {
  __typename?: 'LinkMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  sharingLink: Scalars['EncryptableURI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type LiveStreamMetadataV3 = {
  __typename?: 'LiveStreamMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  checkLiveAPI?: Maybe<Scalars['EncryptableURI']['output']>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  /** Optional end time. Empty if not set. */
  endsAt: Scalars['EncryptableDateTime']['output'];
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  liveURL: Scalars['EncryptableURI']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  playbackURL: Scalars['EncryptableURI']['output'];
  rawURI: Scalars['URI']['output'];
  startsAt: Scalars['EncryptableDateTime']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The title of the live-stream. Empty if not set. */
  title: Scalars['String']['output'];
};

/** Managed profile visibility type */
export enum ManagedProfileVisibility {
  All = 'ALL',
  HiddenOnly = 'HIDDEN_ONLY',
  NoneHidden = 'NONE_HIDDEN'
}

export type MarketplaceMetadata = {
  __typename?: 'MarketplaceMetadata';
  animationUrl?: Maybe<Scalars['URI']['output']>;
  attributes?: Maybe<Array<PublicationMarketplaceMetadataAttribute>>;
  description?: Maybe<Scalars['Markdown']['output']>;
  externalURL?: Maybe<Scalars['URL']['output']>;
  image?: Maybe<ImageSet>;
  name?: Maybe<Scalars['String']['output']>;
};

export enum MarketplaceMetadataAttributeDisplayType {
  Date = 'DATE',
  Number = 'NUMBER',
  String = 'STRING'
}

export type MentionNotification = {
  __typename?: 'MentionNotification';
  id: Scalars['UUID']['output'];
  publication: PrimaryPublication;
};

export type MetadataAttribute = {
  __typename?: 'MetadataAttribute';
  key: Scalars['String']['output'];
  /**
   * The type of the attribute. When:
   * - BOOLEAN: the `value` is `true`|`false`
   * - DATE: the `value` is a valid ISO 8601 date string
   * - NUMBER: the `value` is a valid JS number as string
   * - STRING: the `value` is a string.
   * - JSON: the `value` is a valid JSON serialized as string
   *
   */
  type: MetadataAttributeType;
  /** The value serialized as string. It's consumer responsibility to parse it according to `type`. */
  value: Scalars['String']['output'];
};

export enum MetadataAttributeType {
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  Json = 'JSON',
  Number = 'NUMBER',
  String = 'STRING'
}

export type MintMetadataV3 = {
  __typename?: 'MintMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  mintLink: Scalars['EncryptableURI']['output'];
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type Mirror = {
  __typename?: 'Mirror';
  by: Profile;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['PublicationId']['output'];
  isHidden: Scalars['Boolean']['output'];
  mirrorOn: MirrorablePublication;
  momoka?: Maybe<MomokaInfo>;
  publishedOn?: Maybe<App>;
  txHash?: Maybe<Scalars['TxHash']['output']>;
};

export type MirrorNotification = {
  __typename?: 'MirrorNotification';
  id: Scalars['UUID']['output'];
  mirrors: Array<ProfileMirrorResult>;
  publication: PrimaryPublication;
};

export type MirrorablePublication = Comment | Post | Quote;

export type ModDisputeReportRequest = {
  reason: Scalars['String']['input'];
  reportedProfileId?: InputMaybe<Scalars['ProfileId']['input']>;
  reportedPublicationId?: InputMaybe<Scalars['PublicationId']['input']>;
  reporter: Scalars['ProfileId']['input'];
};

export type ModExplorePublicationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  orderBy: ExplorePublicationsOrderByType;
  where?: InputMaybe<ModExplorePublicationsWhere>;
};

export enum ModExplorePublicationType {
  Comment = 'COMMENT',
  Post = 'POST',
  Quote = 'QUOTE'
}

export type ModExplorePublicationsWhere = {
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  metadata?: InputMaybe<PublicationMetadataFilters>;
  publicationTypes?: InputMaybe<Array<ModExplorePublicationType>>;
  since?: InputMaybe<Scalars['UnixTimestamp']['input']>;
};

export type ModFollowerResult = {
  __typename?: 'ModFollowerResult';
  createdAt: Scalars['DateTime']['output'];
  follower: Profile;
  following: Profile;
};

export type ModReport = {
  __typename?: 'ModReport';
  additionalInfo?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  reason: Scalars['String']['output'];
  reportedProfile: Profile;
  reportedPublication?: Maybe<PrimaryPublication>;
  reporter: Profile;
  subreason: Scalars['String']['output'];
};

export type ModReportsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  forProfile?: InputMaybe<Scalars['ProfileId']['input']>;
  forPublication?: InputMaybe<Scalars['PublicationId']['input']>;
  limit?: InputMaybe<LimitType>;
};

export type ModuleCurrencyApproval = {
  followModule?: InputMaybe<FollowModuleType>;
  openActionModule?: InputMaybe<OpenActionModuleType>;
  referenceModule?: InputMaybe<ReferenceModuleType>;
  unknownFollowModule?: InputMaybe<Scalars['EvmAddress']['input']>;
  unknownOpenActionModule?: InputMaybe<Scalars['EvmAddress']['input']>;
  unknownReferenceModule?: InputMaybe<Scalars['EvmAddress']['input']>;
};

export type ModuleInfo = {
  __typename?: 'ModuleInfo';
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ModuleMetadata = {
  __typename?: 'ModuleMetadata';
  attributes: Array<MetadataAttribute>;
  authors: Array<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  initializeCalldataABI: Scalars['ABIJson']['output'];
  initializeResultDataABI?: Maybe<Scalars['ABIJson']['output']>;
  name: Scalars['String']['output'];
  processCalldataABI: Scalars['ABIJson']['output'];
  title: Scalars['String']['output'];
};

export type ModuleMetadataRequest = {
  implementation: Scalars['EvmAddress']['input'];
};

export enum ModuleType {
  Follow = 'FOLLOW',
  OpenAction = 'OPEN_ACTION',
  Reference = 'REFERENCE'
}

export type MomokaCommentRequest = {
  commentOn: Scalars['PublicationId']['input'];
  contentURI: Scalars['URI']['input'];
};

export type MomokaCommentTransaction = {
  __typename?: 'MomokaCommentTransaction';
  app?: Maybe<App>;
  commentOn: PrimaryPublication;
  createdAt: Scalars['DateTime']['output'];
  publication: Comment;
  submitter: Scalars['EvmAddress']['output'];
  transactionId: Scalars['String']['output'];
  verificationStatus: MomokaVerificationStatus;
};

export type MomokaInfo = {
  __typename?: 'MomokaInfo';
  proof: Scalars['MomokaProof']['output'];
};

export type MomokaMirrorRequest = {
  /** You can add information like app on a mirror or tracking stuff */
  metadataURI?: InputMaybe<Scalars['URI']['input']>;
  mirrorOn: Scalars['PublicationId']['input'];
};

export type MomokaMirrorTransaction = {
  __typename?: 'MomokaMirrorTransaction';
  app?: Maybe<App>;
  createdAt: Scalars['DateTime']['output'];
  mirrorOn: PrimaryPublication;
  publication: Mirror;
  submitter: Scalars['EvmAddress']['output'];
  transactionId: Scalars['String']['output'];
  verificationStatus: MomokaVerificationStatus;
};

export type MomokaPostRequest = {
  contentURI: Scalars['URI']['input'];
};

export type MomokaPostTransaction = {
  __typename?: 'MomokaPostTransaction';
  app?: Maybe<App>;
  createdAt: Scalars['DateTime']['output'];
  publication: Post;
  submitter: Scalars['EvmAddress']['output'];
  transactionId: Scalars['String']['output'];
  verificationStatus: MomokaVerificationStatus;
};

export type MomokaQuoteRequest = {
  contentURI: Scalars['URI']['input'];
  quoteOn: Scalars['PublicationId']['input'];
};

export type MomokaQuoteTransaction = {
  __typename?: 'MomokaQuoteTransaction';
  app?: Maybe<App>;
  createdAt: Scalars['DateTime']['output'];
  publication: Quote;
  quoteOn: PrimaryPublication;
  submitter: Scalars['EvmAddress']['output'];
  transactionId: Scalars['String']['output'];
  verificationStatus: MomokaVerificationStatus;
};

export type MomokaSubmitterResult = {
  __typename?: 'MomokaSubmitterResult';
  address: Scalars['EvmAddress']['output'];
  name: Scalars['String']['output'];
  totalTransactions: Scalars['Int']['output'];
};

export type MomokaSubmittersResult = {
  __typename?: 'MomokaSubmittersResult';
  items: Array<MomokaSubmitterResult>;
  pageInfo: PaginatedResultInfo;
};

export type MomokaSummaryResult = {
  __typename?: 'MomokaSummaryResult';
  totalTransactions: Scalars['Int']['output'];
};

export type MomokaTransaction =
  | MomokaCommentTransaction
  | MomokaMirrorTransaction
  | MomokaPostTransaction
  | MomokaQuoteTransaction;

export type MomokaTransactionRequest = {
  /** The momoka transaction id or internal publication id */
  for: Scalars['String']['input'];
};

export type MomokaTransactionsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  for?: InputMaybe<Scalars['ProfileId']['input']>;
  limit?: InputMaybe<LimitType>;
};

export type MomokaTransactionsResult = {
  __typename?: 'MomokaTransactionsResult';
  items: Array<MomokaTransaction>;
  pageInfo: PaginatedResultInfo;
};

export enum MomokaValidatorError {
  BlockCantBeReadFromNode = 'BLOCK_CANT_BE_READ_FROM_NODE',
  BlockTooFar = 'BLOCK_TOO_FAR',
  CanNotConnectToBundlr = 'CAN_NOT_CONNECT_TO_BUNDLR',
  ChainSignatureAlreadyUsed = 'CHAIN_SIGNATURE_ALREADY_USED',
  DataCantBeReadFromNode = 'DATA_CANT_BE_READ_FROM_NODE',
  EventMismatch = 'EVENT_MISMATCH',
  GeneratedPublicationIdMismatch = 'GENERATED_PUBLICATION_ID_MISMATCH',
  InvalidEventTimestamp = 'INVALID_EVENT_TIMESTAMP',
  InvalidFormattedTypedData = 'INVALID_FORMATTED_TYPED_DATA',
  InvalidPointerSetNotNeeded = 'INVALID_POINTER_SET_NOT_NEEDED',
  InvalidSignatureSubmitter = 'INVALID_SIGNATURE_SUBMITTER',
  InvalidTxId = 'INVALID_TX_ID',
  InvalidTypedDataDeadlineTimestamp = 'INVALID_TYPED_DATA_DEADLINE_TIMESTAMP',
  NotClosestBlock = 'NOT_CLOSEST_BLOCK',
  NoSignatureSubmitter = 'NO_SIGNATURE_SUBMITTER',
  PointerFailedVerification = 'POINTER_FAILED_VERIFICATION',
  PotentialReorg = 'POTENTIAL_REORG',
  PublicationNonceInvalid = 'PUBLICATION_NONCE_INVALID',
  PublicationNoneDa = 'PUBLICATION_NONE_DA',
  PublicationNotRecognized = 'PUBLICATION_NOT_RECOGNIZED',
  PublicationNoPointer = 'PUBLICATION_NO_POINTER',
  PublicationSignerNotAllowed = 'PUBLICATION_SIGNER_NOT_ALLOWED',
  SimulationFailed = 'SIMULATION_FAILED',
  SimulationNodeCouldNotRun = 'SIMULATION_NODE_COULD_NOT_RUN',
  TimestampProofInvalidDaId = 'TIMESTAMP_PROOF_INVALID_DA_ID',
  TimestampProofInvalidSignature = 'TIMESTAMP_PROOF_INVALID_SIGNATURE',
  TimestampProofInvalidType = 'TIMESTAMP_PROOF_INVALID_TYPE',
  TimestampProofNotSubmitter = 'TIMESTAMP_PROOF_NOT_SUBMITTER',
  Unknown = 'UNKNOWN'
}

export type MomokaVerificationStatus =
  | MomokaVerificationStatusFailure
  | MomokaVerificationStatusSuccess;

export type MomokaVerificationStatusFailure = {
  __typename?: 'MomokaVerificationStatusFailure';
  status: MomokaValidatorError;
};

export type MomokaVerificationStatusSuccess = {
  __typename?: 'MomokaVerificationStatusSuccess';
  verified: Scalars['Boolean']['output'];
};

export type MultirecipientFeeCollectModuleInput = {
  amount: AmountInput;
  collectLimit?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  followerOnly: Scalars['Boolean']['input'];
  recipients: Array<RecipientDataInput>;
  referralFee?: InputMaybe<Scalars['Float']['input']>;
};

export type MultirecipientFeeCollectOpenActionSettings = {
  __typename?: 'MultirecipientFeeCollectOpenActionSettings';
  /** The collect module amount info */
  amount: Amount;
  /** The maximum number of collects for this publication. */
  collectLimit?: Maybe<Scalars['String']['output']>;
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** The end timestamp after which collecting is impossible. */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  /** True if only followers of publisher may collect the post. */
  followerOnly: Scalars['Boolean']['output'];
  /** Recipient of collect fees. */
  recipients: Array<RecipientDataOutput>;
  /** The referral fee associated with this publication. */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type Mutation = {
  __typename?: 'Mutation';
  actOnOpenAction: LensProfileManagerRelayResult;
  addProfileInterests?: Maybe<Scalars['Void']['output']>;
  addPublicationBookmark?: Maybe<Scalars['Void']['output']>;
  addPublicationNotInterested?: Maybe<Scalars['Void']['output']>;
  addReaction?: Maybe<Scalars['Void']['output']>;
  authenticate: AuthenticationResult;
  block: LensProfileManagerRelayResult;
  broadcastOnMomoka: BroadcastMomokaResult;
  broadcastOnchain: RelayResult;
  claimProfileWithHandle: ClaimProfileWithHandleResult;
  commentOnMomoka: RelayMomokaResult;
  commentOnchain: LensProfileManagerRelayResult;
  createActOnOpenActionTypedData: CreateActOnOpenActionBroadcastItemResult;
  createBlockProfilesTypedData: CreateBlockProfilesBroadcastItemResult;
  createChangeProfileManagersTypedData: CreateChangeProfileManagersBroadcastItemResult;
  createFollowTypedData: CreateFollowBroadcastItemResult;
  createLegacyCollectTypedData: CreateLegacyCollectBroadcastItemResult;
  createLinkHandleToProfileTypedData: CreateLinkHandleToProfileBroadcastItemResult;
  createMomokaCommentTypedData: CreateMomokaCommentBroadcastItemResult;
  createMomokaMirrorTypedData: CreateMomokaMirrorBroadcastItemResult;
  createMomokaPostTypedData: CreateMomokaPostBroadcastItemResult;
  createMomokaQuoteTypedData: CreateMomokaQuoteBroadcastItemResult;
  createNftGallery: Scalars['NftGalleryId']['output'];
  createOnchainCommentTypedData: CreateOnchainCommentBroadcastItemResult;
  createOnchainMirrorTypedData: CreateOnchainMirrorBroadcastItemResult;
  createOnchainPostTypedData: CreateOnchainPostBroadcastItemResult;
  createOnchainQuoteTypedData: CreateOnchainQuoteBroadcastItemResult;
  createOnchainSetProfileMetadataTypedData: CreateOnchainSetProfileMetadataBroadcastItemResult;
  createProfile: RelaySuccess;
  createProfileWithHandle: CreateProfileWithHandleResult;
  createSetFollowModuleTypedData: CreateSetFollowModuleBroadcastItemResult;
  createUnblockProfilesTypedData: CreateUnblockProfilesBroadcastItemResult;
  createUnfollowTypedData: CreateUnfollowBroadcastItemResult;
  createUnlinkHandleFromProfileTypedData: CreateUnlinkHandleFromProfileBroadcastItemResult;
  deleteNftGallery?: Maybe<Scalars['Void']['output']>;
  dismissRecommendedProfiles?: Maybe<Scalars['Void']['output']>;
  follow: LensProfileManagerRelayResult;
  /** Hides a comment that exists under a publication made by the author. If already hidden, does nothing. */
  hideComment?: Maybe<Scalars['Void']['output']>;
  /** Hide a managed profile from your managed profiles list. */
  hideManagedProfile?: Maybe<Scalars['Void']['output']>;
  hidePublication?: Maybe<Scalars['Void']['output']>;
  idKitPhoneVerifyWebhook: IdKitPhoneVerifyWebhookResultStatusType;
  internalAddCuratedTag?: Maybe<Scalars['Void']['output']>;
  internalAddInvites?: Maybe<Scalars['Void']['output']>;
  internalAllowDomain?: Maybe<Scalars['Void']['output']>;
  internalBoostProfile: Scalars['Int']['output'];
  internalClaim?: Maybe<Scalars['Void']['output']>;
  internalCuratedUpdate?: Maybe<Scalars['Void']['output']>;
  internalForYouFeed?: Maybe<Scalars['Void']['output']>;
  internalMintHandleAndProfile: Scalars['TxHash']['output'];
  internalNftIndex?: Maybe<Scalars['Void']['output']>;
  internalNftVerify?: Maybe<Scalars['Void']['output']>;
  internalRemoveCuratedTag?: Maybe<Scalars['Void']['output']>;
  internalUpdateModuleOptions?: Maybe<Scalars['Void']['output']>;
  internalUpdateProfileStatus?: Maybe<Scalars['Void']['output']>;
  invite?: Maybe<Scalars['Void']['output']>;
  legacyCollect: LensProfileManagerRelayResult;
  linkHandleToProfile: LensProfileManagerRelayResult;
  mirrorOnMomoka: RelayMomokaResult;
  mirrorOnchain: LensProfileManagerRelayResult;
  modDisputeReport?: Maybe<Scalars['Void']['output']>;
  nftOwnershipChallenge: NftOwnershipChallengeResult;
  peerToPeerRecommend?: Maybe<Scalars['Void']['output']>;
  peerToPeerUnrecommend?: Maybe<Scalars['Void']['output']>;
  postOnMomoka: RelayMomokaResult;
  postOnchain: LensProfileManagerRelayResult;
  quoteOnMomoka: RelayMomokaResult;
  quoteOnchain: LensProfileManagerRelayResult;
  refresh: AuthenticationResult;
  refreshPublicationMetadata: RefreshPublicationMetadataResult;
  removeProfileInterests?: Maybe<Scalars['Void']['output']>;
  removePublicationBookmark?: Maybe<Scalars['Void']['output']>;
  removeReaction?: Maybe<Scalars['Void']['output']>;
  reportProfile?: Maybe<Scalars['Void']['output']>;
  reportPublication?: Maybe<Scalars['Void']['output']>;
  revokeAuthentication?: Maybe<Scalars['Void']['output']>;
  setDefaultProfile?: Maybe<Scalars['Void']['output']>;
  setFollowModule: LensProfileManagerRelayResult;
  setProfileMetadata: LensProfileManagerRelayResult;
  signFrameAction: FrameLensManagerSignatureResult;
  unblock: LensProfileManagerRelayResult;
  undoPublicationNotInterested?: Maybe<Scalars['Void']['output']>;
  unfollow: LensProfileManagerRelayResult;
  /** Unhides a hidden comment under a publication made by the author. If not hidden, does nothing. */
  unhideComment?: Maybe<Scalars['Void']['output']>;
  /** Unhide an already hidden managed profile from your managed profiles list. */
  unhideManagedProfile?: Maybe<Scalars['Void']['output']>;
  unlinkHandleFromProfile: LensProfileManagerRelayResult;
  updateNftGalleryInfo?: Maybe<Scalars['Void']['output']>;
  updateNftGalleryItems?: Maybe<Scalars['Void']['output']>;
  updateNftGalleryOrder?: Maybe<Scalars['Void']['output']>;
  walletAuthenticationToProfileAuthentication: AuthenticationResult;
};

export type MutationActOnOpenActionArgs = {
  request: ActOnOpenActionLensManagerRequest;
};

export type MutationAddProfileInterestsArgs = {
  request: ProfileInterestsRequest;
};

export type MutationAddPublicationBookmarkArgs = {
  request: PublicationBookmarkRequest;
};

export type MutationAddPublicationNotInterestedArgs = {
  request: PublicationNotInterestedRequest;
};

export type MutationAddReactionArgs = {
  request: ReactionRequest;
};

export type MutationAuthenticateArgs = {
  request: SignedAuthChallenge;
};

export type MutationBlockArgs = {
  request: BlockRequest;
};

export type MutationBroadcastOnMomokaArgs = {
  request: BroadcastRequest;
};

export type MutationBroadcastOnchainArgs = {
  request: BroadcastRequest;
};

export type MutationClaimProfileWithHandleArgs = {
  request: ClaimProfileWithHandleRequest;
};

export type MutationCommentOnMomokaArgs = {
  request: MomokaCommentRequest;
};

export type MutationCommentOnchainArgs = {
  request: OnchainCommentRequest;
};

export type MutationCreateActOnOpenActionTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: ActOnOpenActionRequest;
};

export type MutationCreateBlockProfilesTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: BlockRequest;
};

export type MutationCreateChangeProfileManagersTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: ChangeProfileManagersRequest;
};

export type MutationCreateFollowTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: FollowRequest;
};

export type MutationCreateLegacyCollectTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: LegacyCollectRequest;
};

export type MutationCreateLinkHandleToProfileTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: LinkHandleToProfileRequest;
};

export type MutationCreateMomokaCommentTypedDataArgs = {
  request: MomokaCommentRequest;
};

export type MutationCreateMomokaMirrorTypedDataArgs = {
  request: MomokaMirrorRequest;
};

export type MutationCreateMomokaPostTypedDataArgs = {
  request: MomokaPostRequest;
};

export type MutationCreateMomokaQuoteTypedDataArgs = {
  request: MomokaQuoteRequest;
};

export type MutationCreateNftGalleryArgs = {
  request: NftGalleryCreateRequest;
};

export type MutationCreateOnchainCommentTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainCommentRequest;
};

export type MutationCreateOnchainMirrorTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainMirrorRequest;
};

export type MutationCreateOnchainPostTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainPostRequest;
};

export type MutationCreateOnchainQuoteTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainQuoteRequest;
};

export type MutationCreateOnchainSetProfileMetadataTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainSetProfileMetadataRequest;
};

export type MutationCreateProfileArgs = {
  request: CreateProfileRequest;
};

export type MutationCreateProfileWithHandleArgs = {
  request: CreateProfileWithHandleRequest;
};

export type MutationCreateSetFollowModuleTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: SetFollowModuleRequest;
};

export type MutationCreateUnblockProfilesTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: UnblockRequest;
};

export type MutationCreateUnfollowTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: UnfollowRequest;
};

export type MutationCreateUnlinkHandleFromProfileTypedDataArgs = {
  options?: InputMaybe<TypedDataOptions>;
  request: UnlinkHandleFromProfileRequest;
};

export type MutationDeleteNftGalleryArgs = {
  request: NftGalleryDeleteRequest;
};

export type MutationDismissRecommendedProfilesArgs = {
  request: DismissRecommendedProfilesRequest;
};

export type MutationFollowArgs = {
  request: FollowLensManagerRequest;
};

export type MutationHideCommentArgs = {
  request: HideCommentRequest;
};

export type MutationHideManagedProfileArgs = {
  request: HideManagedProfileRequest;
};

export type MutationHidePublicationArgs = {
  request: HidePublicationRequest;
};

export type MutationIdKitPhoneVerifyWebhookArgs = {
  request: IdKitPhoneVerifyWebhookRequest;
};

export type MutationInternalAddCuratedTagArgs = {
  request: InternalAddCuratedTagRequest;
};

export type MutationInternalAddInvitesArgs = {
  request: InternalAddInvitesRequest;
};

export type MutationInternalAllowDomainArgs = {
  request: InternalAllowDomainRequest;
};

export type MutationInternalBoostProfileArgs = {
  request: InternalBoostProfileRequest;
};

export type MutationInternalClaimArgs = {
  request: InternalClaimRequest;
};

export type MutationInternalCuratedUpdateArgs = {
  request: InternalCuratedUpdateRequest;
};

export type MutationInternalForYouFeedArgs = {
  request: InternalForYouFeedRequest;
};

export type MutationInternalMintHandleAndProfileArgs = {
  request: InternalMintHandleAndProfileRequest;
};

export type MutationInternalNftIndexArgs = {
  request: InternalNftIndexRequest;
};

export type MutationInternalNftVerifyArgs = {
  request: InternalNftVerifyRequest;
};

export type MutationInternalRemoveCuratedTagArgs = {
  request: InternalRemoveCuratedTagRequest;
};

export type MutationInternalUpdateModuleOptionsArgs = {
  request: InternalUpdateModuleOptionsRequest;
};

export type MutationInternalUpdateProfileStatusArgs = {
  request: InternalUpdateProfileStatusRequest;
};

export type MutationInviteArgs = {
  request: InviteRequest;
};

export type MutationLegacyCollectArgs = {
  request: LegacyCollectRequest;
};

export type MutationLinkHandleToProfileArgs = {
  request: LinkHandleToProfileRequest;
};

export type MutationMirrorOnMomokaArgs = {
  request: MomokaMirrorRequest;
};

export type MutationMirrorOnchainArgs = {
  request: OnchainMirrorRequest;
};

export type MutationModDisputeReportArgs = {
  request: ModDisputeReportRequest;
};

export type MutationNftOwnershipChallengeArgs = {
  request: NftOwnershipChallengeRequest;
};

export type MutationPeerToPeerRecommendArgs = {
  request: PeerToPeerRecommendRequest;
};

export type MutationPeerToPeerUnrecommendArgs = {
  request: PeerToPeerRecommendRequest;
};

export type MutationPostOnMomokaArgs = {
  request: MomokaPostRequest;
};

export type MutationPostOnchainArgs = {
  request: OnchainPostRequest;
};

export type MutationQuoteOnMomokaArgs = {
  request: MomokaQuoteRequest;
};

export type MutationQuoteOnchainArgs = {
  request: OnchainQuoteRequest;
};

export type MutationRefreshArgs = {
  request: RefreshRequest;
};

export type MutationRefreshPublicationMetadataArgs = {
  request: RefreshPublicationMetadataRequest;
};

export type MutationRemoveProfileInterestsArgs = {
  request: ProfileInterestsRequest;
};

export type MutationRemovePublicationBookmarkArgs = {
  request: PublicationBookmarkRequest;
};

export type MutationRemoveReactionArgs = {
  request: ReactionRequest;
};

export type MutationReportProfileArgs = {
  request: ReportProfileRequest;
};

export type MutationReportPublicationArgs = {
  request: ReportPublicationRequest;
};

export type MutationRevokeAuthenticationArgs = {
  request: RevokeAuthenticationRequest;
};

export type MutationSetDefaultProfileArgs = {
  request: SetDefaultProfileRequest;
};

export type MutationSetFollowModuleArgs = {
  request: SetFollowModuleRequest;
};

export type MutationSetProfileMetadataArgs = {
  request: OnchainSetProfileMetadataRequest;
};

export type MutationSignFrameActionArgs = {
  request: FrameLensManagerEip712Request;
};

export type MutationUnblockArgs = {
  request: UnblockRequest;
};

export type MutationUndoPublicationNotInterestedArgs = {
  request: PublicationNotInterestedRequest;
};

export type MutationUnfollowArgs = {
  request: UnfollowRequest;
};

export type MutationUnhideCommentArgs = {
  request: UnhideCommentRequest;
};

export type MutationUnhideManagedProfileArgs = {
  request: UnhideManagedProfileRequest;
};

export type MutationUnlinkHandleFromProfileArgs = {
  request: UnlinkHandleFromProfileRequest;
};

export type MutationUpdateNftGalleryInfoArgs = {
  request: NftGalleryUpdateInfoRequest;
};

export type MutationUpdateNftGalleryItemsArgs = {
  request: NftGalleryUpdateItemsRequest;
};

export type MutationUpdateNftGalleryOrderArgs = {
  request: NftGalleryUpdateItemOrderRequest;
};

export type MutationWalletAuthenticationToProfileAuthenticationArgs = {
  request: WalletAuthenticationToProfileAuthenticationRequest;
};

export type MutualFollowersRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  observer: Scalars['ProfileId']['input'];
  /** The order by which to sort the profiles */
  orderBy?: InputMaybe<ProfilesOrderBy>;
  viewing: Scalars['ProfileId']['input'];
};

/** Mutual NFT collections request */
export type MutualNftCollectionsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  /** Profile id of the first user */
  observer: Scalars['ProfileId']['input'];
  /** Profile id of the second user */
  viewing: Scalars['ProfileId']['input'];
};

export type MutualPoapsQueryRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  observer: Scalars['ProfileId']['input'];
  viewing: Scalars['ProfileId']['input'];
};

export type NetworkAddress = {
  __typename?: 'NetworkAddress';
  address: Scalars['EvmAddress']['output'];
  chainId: Scalars['ChainId']['output'];
};

export type NetworkAddressInput = {
  address: Scalars['EvmAddress']['input'];
  chainId: Scalars['ChainId']['input'];
};

export type Nfi = {
  c: Scalars['EvmAddress']['input'];
  i: Scalars['ChainId']['input'];
};

export type Nft = {
  __typename?: 'Nft';
  collection: NftCollection;
  contentURI?: Maybe<Scalars['URI']['output']>;
  contract: NetworkAddress;
  contractType: NftContractType;
  metadata?: Maybe<NftMetadata>;
  owner: Owner;
  tokenId: Scalars['TokenId']['output'];
  totalSupply: Scalars['String']['output'];
};

/** Nft Collection type */
export type NftCollection = {
  __typename?: 'NftCollection';
  /** Collection base URI for token metadata */
  baseUri?: Maybe<Scalars['URI']['output']>;
  /** The contract info, address and chain id */
  contract: NetworkAddress;
  /** Collection ERC type */
  contractType: NftContractType;
  /** Collection name */
  name: Scalars['String']['output'];
  /** Collection symbol */
  symbol: Scalars['String']['output'];
  /** Collection verified status */
  verified: Scalars['Boolean']['output'];
};

export enum NftCollectionOwnersOrder {
  FollowersFirst = 'FollowersFirst',
  None = 'None'
}

/** NFT collection owners request */
export type NftCollectionOwnersRequest = {
  /** The profile id to use when ordering by followers */
  by?: InputMaybe<Scalars['ProfileId']['input']>;
  /** The chain id */
  chainId: Scalars['ChainId']['input'];
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The contract address */
  for: Scalars['EvmAddress']['input'];
  limit?: InputMaybe<LimitType>;
  /** The ordering of Nft collection owners */
  order?: InputMaybe<NftCollectionOwnersOrder>;
};

/** A wrapper object containing an Nft collection, the total number of Lens profiles that own it, and optional field resolvers */
export type NftCollectionWithOwners = {
  __typename?: 'NftCollectionWithOwners';
  /** The Nft collection */
  collection: NftCollection;
  /** The total number of Lens profile owners that have at least 1 NFT from this collection */
  totalOwners: Scalars['Float']['output'];
};

/** NFT collections request */
export type NftCollectionsRequest = {
  /** The chain ids to look for NFTs on. Ethereum and Polygon are supported. If omitted, it will look on both chains by default. */
  chainIds?: InputMaybe<Array<Scalars['ChainId']['input']>>;
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** Exclude Lens Follower NFTs */
  excludeFollowers?: InputMaybe<Scalars['Boolean']['input']>;
  for?: InputMaybe<Scalars['ProfileId']['input']>;
  /** Filter by owner address */
  forAddress?: InputMaybe<Scalars['EvmAddress']['input']>;
  limit?: InputMaybe<LimitType>;
};

export enum NftContractType {
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155'
}

export type NftGalleriesRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  for: Scalars['ProfileId']['input'];
  limit?: InputMaybe<LimitType>;
};

export type NftGallery = {
  __typename?: 'NftGallery';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['NftGalleryId']['output'];
  items: Array<Nft>;
  name: Scalars['NftGalleryName']['output'];
  owner: Scalars['ProfileId']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type NftGalleryCreateRequest = {
  items: Array<NftInput>;
  name: Scalars['NftGalleryName']['input'];
};

export type NftGalleryDeleteRequest = {
  galleryId: Scalars['NftGalleryId']['input'];
};

export type NftGalleryUpdateInfoRequest = {
  galleryId: Scalars['NftGalleryId']['input'];
  name: Scalars['NftGalleryName']['input'];
};

export type NftGalleryUpdateItemOrderRequest = {
  galleryId: Scalars['NftGalleryId']['input'];
  updates?: InputMaybe<Array<NftUpdateItemOrder>>;
};

export type NftGalleryUpdateItemsRequest = {
  galleryId: Scalars['NftGalleryId']['input'];
  toAdd?: InputMaybe<Array<NftInput>>;
  toRemove?: InputMaybe<Array<NftInput>>;
};

export type NftImage = {
  __typename?: 'NftImage';
  /** The contract address of the NFT collection */
  collection: NetworkAddress;
  /** The image set for the NFT */
  image: ImageSet;
  /** The token ID of the NFT */
  tokenId: Scalars['TokenId']['output'];
  /** Indicates whether the NFT is from a verified collection or not */
  verified: Scalars['Boolean']['output'];
};

export type NftInput = {
  contract: NetworkAddressInput;
  tokenId: Scalars['TokenId']['input'];
};

export type NftMetadata = {
  __typename?: 'NftMetadata';
  animationUrl?: Maybe<Scalars['URI']['output']>;
  attributes?: Maybe<Array<PublicationMarketplaceMetadataAttribute>>;
  description?: Maybe<Scalars['Markdown']['output']>;
  externalURL?: Maybe<Scalars['URL']['output']>;
  image?: Maybe<ImageSet>;
  name?: Maybe<Scalars['String']['output']>;
};

export type NftOwnershipChallengeRequest = {
  for: Scalars['EvmAddress']['input'];
  nfts: Array<NftInput>;
};

export type NftOwnershipChallengeResult = {
  __typename?: 'NftOwnershipChallengeResult';
  info?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type NftOwnershipCondition = {
  __typename?: 'NftOwnershipCondition';
  contract: NetworkAddress;
  contractType: NftContractType;
  tokenIds?: Maybe<Array<Scalars['TokenId']['output']>>;
};

export type NftUpdateItemOrder = {
  contract: NetworkAddressInput;
  newOrder: Scalars['Int']['input'];
  tokenId: Scalars['TokenId']['input'];
};

export type NftsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  where?: InputMaybe<NftsRequestWhere>;
};

export type NftsRequestWhere = {
  /** Chain IDs to search. Supports Ethereum and Polygon. If omitted, it will search in both chains */
  chainIds?: InputMaybe<Array<Scalars['ChainId']['input']>>;
  excludeCollections?: InputMaybe<Array<NetworkAddressInput>>;
  /** Exclude follower NFTs from the search */
  excludeFollowers?: InputMaybe<Scalars['Boolean']['input']>;
  /** Ethereum address of the owner. If unknown you can also search by profile ID */
  forAddress?: InputMaybe<Scalars['EvmAddress']['input']>;
  /** Profile ID of the owner */
  forProfileId?: InputMaybe<Scalars['ProfileId']['input']>;
  includeCollections?: InputMaybe<Array<NetworkAddressInput>>;
  /** Search query. Has to be part of a collection name */
  query?: InputMaybe<Scalars['String']['input']>;
};

export type Notification =
  | ActedNotification
  | CommentNotification
  | FollowNotification
  | MentionNotification
  | MirrorNotification
  | QuoteNotification
  | ReactionNotification;

export type NotificationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The order by which to sort the profiles on follows, reactions, actions and mirrors */
  orderBy?: InputMaybe<ProfilesOrderBy>;
  where?: InputMaybe<NotificationWhere>;
};

export enum NotificationType {
  Acted = 'ACTED',
  Commented = 'COMMENTED',
  Followed = 'FOLLOWED',
  Mentioned = 'MENTIONED',
  Mirrored = 'MIRRORED',
  Quoted = 'QUOTED',
  Reacted = 'REACTED'
}

export type NotificationWhere = {
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  highSignalFilter?: InputMaybe<Scalars['Boolean']['input']>;
  notificationTypes?: InputMaybe<Array<NotificationType>>;
  publishedOn?: InputMaybe<Array<Scalars['AppId']['input']>>;
  timeBasedAggregation?: InputMaybe<Scalars['Boolean']['input']>;
};

export type OnchainCommentRequest = {
  commentOn: Scalars['PublicationId']['input'];
  /** If your using an unknown reference modules you need to pass this in. `followerOnlyReferenceModule` and `degreesOfSeparationReferenceModule` is handled automatically for you and if you supply this on publications with those settings it will be ignored */
  commentOnReferenceModuleData?: InputMaybe<Scalars['BlockchainData']['input']>;
  contentURI: Scalars['URI']['input'];
  openActionModules?: InputMaybe<Array<OpenActionModuleInput>>;
  referenceModule?: InputMaybe<ReferenceModuleInput>;
  referrers?: InputMaybe<Array<OnchainReferrer>>;
};

export type OnchainMirrorRequest = {
  /** You can add information like app on a mirror or tracking stuff */
  metadataURI?: InputMaybe<Scalars['URI']['input']>;
  mirrorOn: Scalars['PublicationId']['input'];
  /** If your using an unknown reference modules you need to pass this in. `followerOnlyReferenceModule` and `degreesOfSeparationReferenceModule` is handled automatically for you and if you supply this on publications with those settings it will be ignored */
  mirrorReferenceModuleData?: InputMaybe<Scalars['BlockchainData']['input']>;
  referrers?: InputMaybe<Array<OnchainReferrer>>;
};

export type OnchainPostRequest = {
  contentURI: Scalars['URI']['input'];
  openActionModules?: InputMaybe<Array<OpenActionModuleInput>>;
  referenceModule?: InputMaybe<ReferenceModuleInput>;
};

export type OnchainQuoteRequest = {
  contentURI: Scalars['URI']['input'];
  openActionModules?: InputMaybe<Array<OpenActionModuleInput>>;
  quoteOn: Scalars['PublicationId']['input'];
  /** If your using an unknown reference modules you need to pass this in. `followerOnlyReferenceModule` and `degreesOfSeparationReferenceModule` is handled automatically for you and if you supply this on publications with those settings it will be ignored */
  quoteOnReferenceModuleData?: InputMaybe<Scalars['BlockchainData']['input']>;
  referenceModule?: InputMaybe<ReferenceModuleInput>;
  referrers?: InputMaybe<Array<OnchainReferrer>>;
};

export type OnchainReferrer = {
  profileId?: InputMaybe<Scalars['ProfileId']['input']>;
  publicationId?: InputMaybe<Scalars['PublicationId']['input']>;
};

export type OnchainSetProfileMetadataRequest = {
  metadataURI: Scalars['URI']['input'];
};

export enum OpenActionCategoryType {
  Collect = 'COLLECT'
}

export type OpenActionFilter = {
  address?: InputMaybe<Scalars['EvmAddress']['input']>;
  category?: InputMaybe<OpenActionCategoryType>;
  type?: InputMaybe<OpenActionModuleType>;
};

export type OpenActionModule =
  | LegacyAaveFeeCollectModuleSettings
  | LegacyErc4626FeeCollectModuleSettings
  | LegacyFeeCollectModuleSettings
  | LegacyFreeCollectModuleSettings
  | LegacyLimitedFeeCollectModuleSettings
  | LegacyLimitedTimedFeeCollectModuleSettings
  | LegacyMultirecipientFeeCollectModuleSettings
  | LegacyRevertCollectModuleSettings
  | LegacySimpleCollectModuleSettings
  | LegacyTimedFeeCollectModuleSettings
  | MultirecipientFeeCollectOpenActionSettings
  | SimpleCollectOpenActionSettings
  | UnknownOpenActionModuleSettings;

export type OpenActionModuleInput = {
  collectOpenAction?: InputMaybe<CollectActionModuleInput>;
  unknownOpenAction?: InputMaybe<UnknownOpenActionModuleInput>;
};

export enum OpenActionModuleType {
  LegacyAaveFeeCollectModule = 'LegacyAaveFeeCollectModule',
  LegacyErc4626FeeCollectModule = 'LegacyERC4626FeeCollectModule',
  LegacyFeeCollectModule = 'LegacyFeeCollectModule',
  LegacyFreeCollectModule = 'LegacyFreeCollectModule',
  LegacyLimitedFeeCollectModule = 'LegacyLimitedFeeCollectModule',
  LegacyLimitedTimedFeeCollectModule = 'LegacyLimitedTimedFeeCollectModule',
  LegacyMultirecipientFeeCollectModule = 'LegacyMultirecipientFeeCollectModule',
  LegacyRevertCollectModule = 'LegacyRevertCollectModule',
  LegacySimpleCollectModule = 'LegacySimpleCollectModule',
  LegacyTimedFeeCollectModule = 'LegacyTimedFeeCollectModule',
  MultirecipientFeeCollectOpenActionModule = 'MultirecipientFeeCollectOpenActionModule',
  SimpleCollectOpenActionModule = 'SimpleCollectOpenActionModule',
  UnknownOpenActionModule = 'UnknownOpenActionModule'
}

export type OpenActionPaidAction = {
  __typename?: 'OpenActionPaidAction';
  actedOn: PrimaryPublication;
  latestActed: Array<LatestActed>;
};

export type OpenActionProfileActed = {
  __typename?: 'OpenActionProfileActed';
  actedAt: Scalars['DateTime']['output'];
  action: OpenActionResult;
  by: Profile;
};

export type OpenActionResult =
  | KnownCollectOpenActionResult
  | UnknownOpenActionResult;

export type OptimisticStatusResult = {
  __typename?: 'OptimisticStatusResult';
  isFinalisedOnchain: Scalars['Boolean']['output'];
  value: Scalars['Boolean']['output'];
};

export type OrCondition = {
  __typename?: 'OrCondition';
  criteria: Array<ThirdTierCondition>;
};

export type OwnedHandlesRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The Ethereum address for which to retrieve owned handles */
  for: Scalars['EvmAddress']['input'];
  limit?: InputMaybe<LimitType>;
};

export type Owner = {
  __typename?: 'Owner';
  address: Scalars['EvmAddress']['output'];
  amount: Scalars['String']['output'];
};

export type PaginatedApprovedAuthenticationResult = {
  __typename?: 'PaginatedApprovedAuthenticationResult';
  items: Array<ApprovedAuthentication>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedCurrenciesResult = {
  __typename?: 'PaginatedCurrenciesResult';
  items: Array<Erc20>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedDisputedReports = {
  __typename?: 'PaginatedDisputedReports';
  items: Array<DisputedReport>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedExplorePublicationResult = {
  __typename?: 'PaginatedExplorePublicationResult';
  items: Array<ExplorePublication>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedFeedHighlightsResult = {
  __typename?: 'PaginatedFeedHighlightsResult';
  items: Array<FeedHighlight>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedFeedResult = {
  __typename?: 'PaginatedFeedResult';
  items: Array<FeedItem>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedForYouResult = {
  __typename?: 'PaginatedForYouResult';
  items: Array<ForYouResult>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedHandlesResult = {
  __typename?: 'PaginatedHandlesResult';
  items: Array<HandleInfo>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedModExplorePublicationResult = {
  __typename?: 'PaginatedModExplorePublicationResult';
  items: Array<PrimaryPublication>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedModFollowersResult = {
  __typename?: 'PaginatedModFollowersResult';
  items: Array<ModFollowerResult>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedModReports = {
  __typename?: 'PaginatedModReports';
  items: Array<ModReport>;
  pageInfo: PaginatedResultInfo;
};

/** Nft collections paginated result */
export type PaginatedNftCollectionsResult = {
  __typename?: 'PaginatedNftCollectionsResult';
  items: Array<NftCollection>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedNftGalleriesResult = {
  __typename?: 'PaginatedNftGalleriesResult';
  items: Array<NftGallery>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedNftsResult = {
  __typename?: 'PaginatedNftsResult';
  items: Array<Nft>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedNotificationResult = {
  __typename?: 'PaginatedNotificationResult';
  items: Array<Notification>;
  pageInfo: PaginatedResultInfo;
};

/** Pagination with Offset fields  */
export type PaginatedOffsetRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
};

/** The paginated Poap Events result */
export type PaginatedPoapEventResult = {
  __typename?: 'PaginatedPoapEventResult';
  items: Array<PoapEvent>;
  pageInfo: PaginatedResultInfo;
};

/** The paginated Poap Token Results */
export type PaginatedPoapTokenResult = {
  __typename?: 'PaginatedPoapTokenResult';
  items: Array<PoapToken>;
  pageInfo: PaginatedResultInfo;
};

/** Popular Nft collections paginated result */
export type PaginatedPopularNftCollectionsResult = {
  __typename?: 'PaginatedPopularNftCollectionsResult';
  items: Array<NftCollectionWithOwners>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedProfileActionHistoryResult = {
  __typename?: 'PaginatedProfileActionHistoryResult';
  items: Array<ProfileActionHistory>;
  pageInfo: PaginatedResultInfo;
};

/** The paginated profile managers result */
export type PaginatedProfileManagersResult = {
  __typename?: 'PaginatedProfileManagersResult';
  items: Array<ProfilesManagedResult>;
  pageInfo: PaginatedResultInfo;
};

/** The paginated profile result */
export type PaginatedProfileResult = {
  __typename?: 'PaginatedProfileResult';
  items: Array<Profile>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPublicationPrimaryResult = {
  __typename?: 'PaginatedPublicationPrimaryResult';
  items: Array<PrimaryPublication>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPublicationsResult = {
  __typename?: 'PaginatedPublicationsResult';
  items: Array<AnyPublication>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedPublicationsTagsResult = {
  __typename?: 'PaginatedPublicationsTagsResult';
  items: Array<TagResult>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
};

/** The paginated result info */
export type PaginatedResultInfo = {
  __typename?: 'PaginatedResultInfo';
  /** Cursor to query next results */
  next?: Maybe<Scalars['Cursor']['output']>;
  /** Cursor to query the actual results */
  prev?: Maybe<Scalars['Cursor']['output']>;
};

export type PaginatedRevenueFromPublicationsResult = {
  __typename?: 'PaginatedRevenueFromPublicationsResult';
  items: Array<PublicationRevenue>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedSupportedModules = {
  __typename?: 'PaginatedSupportedModules';
  items: Array<SupportedModule>;
  pageInfo: PaginatedResultInfo;
};

export type PaginatedWhoReactedResult = {
  __typename?: 'PaginatedWhoReactedResult';
  items: Array<ProfileWhoReactedResult>;
  pageInfo: PaginatedResultInfo;
};

export type PaidAction = FollowPaidAction | OpenActionPaidAction;

export type PeerToPeerRecommendRequest = {
  /** The profile to recommend */
  profileId: Scalars['ProfileId']['input'];
};

export type PhysicalAddress = {
  __typename?: 'PhysicalAddress';
  /** The country name component. */
  country: Scalars['EncryptableString']['output'];
  /** The full mailing address formatted for display. */
  formatted?: Maybe<Scalars['EncryptableString']['output']>;
  /** The city or locality. */
  locality: Scalars['EncryptableString']['output'];
  /** The zip or postal code. */
  postalCode?: Maybe<Scalars['EncryptableString']['output']>;
  /** The state or region. */
  region?: Maybe<Scalars['EncryptableString']['output']>;
  /** The street address including house number, street name, P.O. Box, apartment or unit number and extended multi-line address information. */
  streetAddress?: Maybe<Scalars['EncryptableString']['output']>;
};

/** The POAP Event result */
export type PoapEvent = {
  __typename?: 'PoapEvent';
  animationUrl?: Maybe<Scalars['URL']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  eventTemplateId?: Maybe<Scalars['Int']['output']>;
  eventUrl?: Maybe<Scalars['URL']['output']>;
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  fancyId?: Maybe<Scalars['String']['output']>;
  fromAdmin?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['PoapEventId']['output'];
  imageUrl?: Maybe<Scalars['URL']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  privateEvent?: Maybe<Scalars['Boolean']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  virtualEvent?: Maybe<Scalars['Boolean']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type PoapEventQueryRequest = {
  eventId: Scalars['PoapEventId']['input'];
};

export type PoapHoldersQueryRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  eventId: Scalars['PoapEventId']['input'];
  limit?: InputMaybe<LimitType>;
};

/** The Poap Token Event */
export type PoapToken = {
  __typename?: 'PoapToken';
  created: Scalars['DateTime']['output'];
  event: PoapEvent;
  /** Poap Event Id */
  eventId: Scalars['PoapEventId']['output'];
  /** Which network the token is: L1 (eth) or L2 (Gnosis) */
  layer: PoapTokenLayerType;
  /** migrated to L1 at */
  migrated?: Maybe<Scalars['DateTime']['output']>;
  owner: NetworkAddress;
  tokenId: Scalars['TokenId']['output'];
};

export enum PoapTokenLayerType {
  Layer1 = 'Layer1',
  Layer2 = 'Layer2'
}

export enum PopularNftCollectionsOrder {
  TotalLensProfileOwners = 'TotalLensProfileOwners',
  TotalOwners = 'TotalOwners'
}

/** Popular NFT collections request */
export type PopularNftCollectionsRequest = {
  /** The chain ids to look for NFTs on. Ethereum and Polygon are supported. If omitted, it will look on both chains by default. */
  chainIds?: InputMaybe<Array<Scalars['ChainId']['input']>>;
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** Exclude Lens Follower NFTs */
  excludeFollowers?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<LimitType>;
  /** Include only verified collections */
  onlyVerified?: InputMaybe<Scalars['Boolean']['input']>;
  /** The ordering of Nft collection owners. Defaults to Total Lens Profile owners */
  orderBy?: PopularNftCollectionsOrder;
};

export type Post = {
  __typename?: 'Post';
  by: Profile;
  createdAt: Scalars['DateTime']['output'];
  hashtagsMentioned: Array<Scalars['String']['output']>;
  id: Scalars['PublicationId']['output'];
  isEncrypted: Scalars['Boolean']['output'];
  isHidden: Scalars['Boolean']['output'];
  metadata: PublicationMetadata;
  momoka?: Maybe<MomokaInfo>;
  openActionModules: Array<OpenActionModule>;
  operations: PublicationOperations;
  profilesMentioned: Array<ProfileMentioned>;
  publishedOn?: Maybe<App>;
  referenceModule?: Maybe<ReferenceModule>;
  stats: PublicationStats;
  txHash?: Maybe<Scalars['TxHash']['output']>;
};

export type PostStatsArgs = {
  request?: InputMaybe<PublicationStatsInput>;
};

export type PrfResult = {
  __typename?: 'PrfResult';
  dd: Scalars['Boolean']['output'];
  ss: Scalars['Boolean']['output'];
};

export type PrimaryPublication = Comment | Post | Quote;

/** The Profile */
export type Profile = {
  __typename?: 'Profile';
  /** When the profile was created */
  createdAt: Scalars['DateTime']['output'];
  /** The follow module */
  followModule?: Maybe<FollowModule>;
  /** The profile follow nft address */
  followNftAddress?: Maybe<NetworkAddress>;
  guardian?: Maybe<ProfileGuardianResult>;
  /** The profile handle - a profile may not have one */
  handle?: Maybe<HandleInfo>;
  /** The profile id */
  id: Scalars['ProfileId']['output'];
  interests: Array<Scalars['String']['output']>;
  invitedBy?: Maybe<Profile>;
  /** The number of invites left */
  invitesLeft: Scalars['Int']['output'];
  /** The profile metadata. You can optionally query profile metadata by app id.  */
  metadata?: Maybe<ProfileMetadata>;
  /** The on chain identity */
  onchainIdentity: ProfileOnchainIdentity;
  operations: ProfileOperations;
  /** Who owns the profile */
  ownedBy: NetworkAddress;
  /** If the profile has been recommended by the authenticated user */
  peerToPeerRecommendedByMe: Scalars['Boolean']['output'];
  /** If the profile has got signless enabled */
  signless: Scalars['Boolean']['output'];
  /** If lens API will sponsor this persons for gasless experience, note they can have signless on but sponsor false which means it be rejected */
  sponsor: Scalars['Boolean']['output'];
  stats: ProfileStats;
  txHash: Scalars['TxHash']['output'];
};

/** The Profile */
export type ProfileMetadataArgs = {
  request?: InputMaybe<GetProfileMetadataArgs>;
};

/** The Profile */
export type ProfileStatsArgs = {
  request?: InputMaybe<ProfileStatsArg>;
};

/** The Profile */
export type ProfileActionHistory = {
  __typename?: 'ProfileActionHistory';
  actionType: ProfileActionHistoryType;
  actionedOn: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  txHash?: Maybe<Scalars['TxHash']['output']>;
  who: Scalars['EvmAddress']['output'];
};

export type ProfileActionHistoryRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
};

/** Profile action history type */
export enum ProfileActionHistoryType {
  Acted = 'ACTED',
  Blocked = 'BLOCKED',
  Collected = 'COLLECTED',
  Comment = 'COMMENT',
  Follow = 'FOLLOW',
  LinkHandle = 'LINK_HANDLE',
  LoggedIn = 'LOGGED_IN',
  Mirror = 'MIRROR',
  Post = 'POST',
  Quote = 'QUOTE',
  RefreshAuthToken = 'REFRESH_AUTH_TOKEN',
  SetProfileMetadata = 'SET_PROFILE_METADATA',
  SetProfileModule = 'SET_PROFILE_MODULE',
  Unblocked = 'UNBLOCKED',
  Unfollow = 'UNFOLLOW',
  UnlinkHandle = 'UNLINK_HANDLE'
}

export type ProfileFraudReasonInput = {
  reason: ProfileReportingReason;
  subreason: ProfileReportingFraudSubreason;
};

export type ProfileGuardianResult = {
  __typename?: 'ProfileGuardianResult';
  cooldownEndsOn?: Maybe<Scalars['DateTime']['output']>;
  protected: Scalars['Boolean']['output'];
};

/** Profile interests types */
export enum ProfileInterestTypes {
  ArtEntertainment = 'ART_ENTERTAINMENT',
  ArtEntertainmentAnime = 'ART_ENTERTAINMENT__ANIME',
  ArtEntertainmentArt = 'ART_ENTERTAINMENT__ART',
  ArtEntertainmentBooks = 'ART_ENTERTAINMENT__BOOKS',
  ArtEntertainmentDesign = 'ART_ENTERTAINMENT__DESIGN',
  ArtEntertainmentFashion = 'ART_ENTERTAINMENT__FASHION',
  ArtEntertainmentFilmTv = 'ART_ENTERTAINMENT__FILM_TV',
  ArtEntertainmentMemes = 'ART_ENTERTAINMENT__MEMES',
  ArtEntertainmentMusic = 'ART_ENTERTAINMENT__MUSIC',
  ArtEntertainmentPhotography = 'ART_ENTERTAINMENT__PHOTOGRAPHY',
  Business = 'BUSINESS',
  BusinessCreatorEconomy = 'BUSINESS__CREATOR_ECONOMY',
  BusinessFinance = 'BUSINESS__FINANCE',
  BusinessMarketing = 'BUSINESS__MARKETING',
  Career = 'CAREER',
  Crypto = 'CRYPTO',
  CryptoBitcoin = 'CRYPTO__BITCOIN',
  CryptoDaos = 'CRYPTO__DAOS',
  CryptoDefi = 'CRYPTO__DEFI',
  CryptoEthereum = 'CRYPTO__ETHEREUM',
  CryptoGm = 'CRYPTO__GM',
  CryptoGovernance = 'CRYPTO__GOVERNANCE',
  CryptoL1 = 'CRYPTO__L1',
  CryptoL2 = 'CRYPTO__L2',
  CryptoMetaverse = 'CRYPTO__METAVERSE',
  CryptoNft = 'CRYPTO__NFT',
  CryptoRekt = 'CRYPTO__REKT',
  CryptoScaling = 'CRYPTO__SCALING',
  CryptoWeb3 = 'CRYPTO__WEB3',
  CryptoWeb3Social = 'CRYPTO__WEB3_SOCIAL',
  Education = 'EDUCATION',
  FamilyParenting = 'FAMILY_PARENTING',
  FoodDrink = 'FOOD_DRINK',
  FoodDrinkBeer = 'FOOD_DRINK__BEER',
  FoodDrinkCocktails = 'FOOD_DRINK__COCKTAILS',
  FoodDrinkCooking = 'FOOD_DRINK__COOKING',
  FoodDrinkRestaurants = 'FOOD_DRINK__RESTAURANTS',
  FoodDrinkWine = 'FOOD_DRINK__WINE',
  HealthFitness = 'HEALTH_FITNESS',
  HealthFitnessBiohacking = 'HEALTH_FITNESS__BIOHACKING',
  HealthFitnessExercise = 'HEALTH_FITNESS__EXERCISE',
  HobbiesInterests = 'HOBBIES_INTERESTS',
  HobbiesInterestsArtsCrafts = 'HOBBIES_INTERESTS__ARTS_CRAFTS',
  HobbiesInterestsCars = 'HOBBIES_INTERESTS__CARS',
  HobbiesInterestsCollecting = 'HOBBIES_INTERESTS__COLLECTING',
  HobbiesInterestsGaming = 'HOBBIES_INTERESTS__GAMING',
  HobbiesInterestsSports = 'HOBBIES_INTERESTS__SPORTS',
  HobbiesInterestsTravel = 'HOBBIES_INTERESTS__TRAVEL',
  HomeGarden = 'HOME_GARDEN',
  HomeGardenAnimals = 'HOME_GARDEN__ANIMALS',
  HomeGardenGardening = 'HOME_GARDEN__GARDENING',
  HomeGardenHomeImprovement = 'HOME_GARDEN__HOME_IMPROVEMENT',
  HomeGardenNature = 'HOME_GARDEN__NATURE',
  LawGovernmentPolitics = 'LAW_GOVERNMENT_POLITICS',
  LawGovernmentPoliticsRegulation = 'LAW_GOVERNMENT_POLITICS__REGULATION',
  Lens = 'LENS',
  News = 'NEWS',
  Nsfw = 'NSFW',
  Technology = 'TECHNOLOGY',
  TechnologyAiMl = 'TECHNOLOGY__AI_ML',
  TechnologyBiotech = 'TECHNOLOGY__BIOTECH',
  TechnologyProgramming = 'TECHNOLOGY__PROGRAMMING',
  TechnologyScience = 'TECHNOLOGY__SCIENCE',
  TechnologyTools = 'TECHNOLOGY__TOOLS'
}

export type ProfileInterestsRequest = {
  interests: Array<ProfileInterestTypes>;
};

export type ProfileManagersRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The profile ID for which to retrieve managers */
  for: Scalars['ProfileId']['input'];
  limit?: InputMaybe<LimitType>;
};

export type ProfileMentioned = {
  __typename?: 'ProfileMentioned';
  profile: Profile;
  snapshotHandleMentioned: HandleInfo;
  stillOwnsHandle: Scalars['Boolean']['output'];
};

export type ProfileMetadata = {
  __typename?: 'ProfileMetadata';
  /** The app that this metadata is displayed on */
  appId?: Maybe<Scalars['AppId']['output']>;
  /** Profile Custom attributes */
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** The bio for the profile */
  bio?: Maybe<Scalars['Markdown']['output']>;
  /** The cover picture for the profile */
  coverPicture?: Maybe<ImageSet>;
  /** The display name for the profile */
  displayName?: Maybe<Scalars['String']['output']>;
  /** The picture for the profile */
  picture?: Maybe<ProfilePicture>;
  /** The raw uri for the which the profile metadata was set as */
  rawURI: Scalars['URI']['output'];
};

export type ProfileMirrorResult = {
  __typename?: 'ProfileMirrorResult';
  mirrorId: Scalars['PublicationId']['output'];
  mirroredAt: Scalars['DateTime']['output'];
  profile: Profile;
};

export type ProfileOnchainIdentity = {
  __typename?: 'ProfileOnchainIdentity';
  /** The ens information */
  ens?: Maybe<EnsOnchainIdentity>;
  /** The POH status */
  proofOfHumanity: Scalars['Boolean']['output'];
  /** The sybil dot org information */
  sybilDotOrg: SybilDotOrgIdentity;
  /** The worldcoin identity */
  worldcoin: WorldcoinIdentity;
};

export type ProfileOperations = {
  __typename?: 'ProfileOperations';
  canBlock: Scalars['Boolean']['output'];
  canFollow: TriStateValue;
  canUnblock: Scalars['Boolean']['output'];
  canUnfollow: Scalars['Boolean']['output'];
  hasBlockedMe: OptimisticStatusResult;
  id: Scalars['ProfileId']['output'];
  isBlockedByMe: OptimisticStatusResult;
  isFollowedByMe: OptimisticStatusResult;
  isFollowingMe: OptimisticStatusResult;
};

export type ProfileOwnershipCondition = {
  __typename?: 'ProfileOwnershipCondition';
  profileId: Scalars['ProfileId']['output'];
};

export type ProfilePicture = ImageSet | NftImage;

export type ProfileReactedResult = {
  __typename?: 'ProfileReactedResult';
  profile: Profile;
  reactions: Array<ReactedResult>;
};

/** The reaction details for a publication */
export type ProfileReactionResult = {
  __typename?: 'ProfileReactionResult';
  /** The reaction */
  reaction: PublicationReactionType;
  /** The reaction date */
  reactionAt: Scalars['DateTime']['output'];
};

export type ProfileRecommendationsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** Disable machine learning recommendations (default: false) */
  disableML?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter based on a specific profile ID */
  for: Scalars['ProfileId']['input'];
  limit?: InputMaybe<LimitType>;
  /** Shuffle the recommendations (default: false) */
  shuffle?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum ProfileReportingFraudSubreason {
  Impersonation = 'IMPERSONATION',
  SomethingElse = 'SOMETHING_ELSE'
}

export enum ProfileReportingReason {
  Fraud = 'FRAUD',
  Spam = 'SPAM'
}

export type ProfileReportingReasonInput = {
  fraudReason?: InputMaybe<ProfileFraudReasonInput>;
  spamReason?: InputMaybe<ProfileSpamReasonInput>;
};

export enum ProfileReportingSpamSubreason {
  Repetitive = 'REPETITIVE',
  SomethingElse = 'SOMETHING_ELSE'
}

export type ProfileRequest = {
  /** The handle for profile you want to fetch - namespace/localname */
  forHandle?: InputMaybe<Scalars['Handle']['input']>;
  /** The profile you want to fetch */
  forProfileId?: InputMaybe<Scalars['ProfileId']['input']>;
};

export type ProfileSearchRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  /** The order by which to sort the profiles */
  orderBy?: InputMaybe<ProfilesOrderBy>;
  /** Query for the profile search */
  query: Scalars['String']['input'];
  /** Filtering criteria for profile search */
  where?: InputMaybe<ProfileSearchWhere>;
};

export type ProfileSearchWhere = {
  /** Array of custom filters for profile search */
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
};

export type ProfileSpamReasonInput = {
  reason: ProfileReportingReason;
  subreason: ProfileReportingSpamSubreason;
};

/** The Profile Stats */
export type ProfileStats = {
  __typename?: 'ProfileStats';
  comments: Scalars['Int']['output'];
  countOpenActions: Scalars['Int']['output'];
  followers: Scalars['Int']['output'];
  following: Scalars['Int']['output'];
  id: Scalars['ProfileId']['output'];
  /** The profile classifier score of this profile relative to others on Lens. It is a % out of 100. */
  lensClassifierScore?: Maybe<Scalars['Float']['output']>;
  mirrors: Scalars['Int']['output'];
  posts: Scalars['Int']['output'];
  publications: Scalars['Int']['output'];
  quotes: Scalars['Int']['output'];
  /** How many times a profile has reacted on something */
  reacted: Scalars['Int']['output'];
  /** How many times other profiles have reacted on something this profile did */
  reactions: Scalars['Int']['output'];
};

/** The Profile Stats */
export type ProfileStatsCountOpenActionsArgs = {
  request?: InputMaybe<ProfileStatsCountOpenActionArgs>;
};

/** The Profile Stats */
export type ProfileStatsReactedArgs = {
  request?: InputMaybe<ProfileStatsReactionArgs>;
};

/** The Profile Stats */
export type ProfileStatsReactionsArgs = {
  request?: InputMaybe<ProfileStatsReactionArgs>;
};

export type ProfileStatsArg = {
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  forApps?: InputMaybe<Array<Scalars['AppId']['input']>>;
  hiddenComments?: InputMaybe<HiddenCommentsType>;
};

export type ProfileStatsCountOpenActionArgs = {
  anyOf?: InputMaybe<Array<OpenActionFilter>>;
};

export type ProfileStatsReactionArgs = {
  type: PublicationReactionType;
};

export type ProfileWhoReactedResult = {
  __typename?: 'ProfileWhoReactedResult';
  profile: Profile;
  reactions: Array<ProfileReactionResult>;
};

export type ProfilesManagedRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The Ethereum address for which to retrieve managed profiles */
  for: Scalars['EvmAddress']['input'];
  hiddenFilter?: InputMaybe<ManagedProfileVisibility>;
  includeOwned?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<LimitType>;
};

export type ProfilesManagedResult = {
  __typename?: 'ProfilesManagedResult';
  address: Scalars['EvmAddress']['output'];
  isLensManager: Scalars['Boolean']['output'];
};

export enum ProfilesOrderBy {
  Default = 'DEFAULT',
  ProfileClassifier = 'PROFILE_CLASSIFIER'
}

export type ProfilesRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  /** The order by which to sort the profiles */
  orderBy?: InputMaybe<ProfilesOrderBy>;
  /** The where clause to use to filter on what you are looking for */
  where: ProfilesRequestWhere;
};

export type ProfilesRequestWhere = {
  /** Pass in an array of handles to get the profile entities */
  handles?: InputMaybe<Array<Scalars['Handle']['input']>>;
  /** Pass in an array of evm address to get the profile entities they own */
  ownedBy?: InputMaybe<Array<Scalars['EvmAddress']['input']>>;
  /** Pass in an array of profile ids to get the profile entities */
  profileIds?: InputMaybe<Array<Scalars['ProfileId']['input']>>;
  /** Pass the publication id and get a list of the profiles who commented on it */
  whoCommentedOn?: InputMaybe<Scalars['PublicationId']['input']>;
  /** Pass the publication id and get a list of the profiles who mirrored it */
  whoMirroredPublication?: InputMaybe<Scalars['PublicationId']['input']>;
  /** Pass the publication id and get a list of the profiles who quoted it */
  whoQuotedPublication?: InputMaybe<Scalars['PublicationId']['input']>;
};

export type PublicationBookmarkRequest = {
  on: Scalars['PublicationId']['input'];
};

export type PublicationBookmarksRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  where?: InputMaybe<PublicationBookmarksWhere>;
};

export type PublicationBookmarksWhere = {
  metadata?: InputMaybe<PublicationMetadataFilters>;
};

export type PublicationCommentOn = {
  /** You can use this enum to show, hide or show only hidden comments */
  hiddenComments?: InputMaybe<HiddenCommentsType>;
  id: Scalars['PublicationId']['input'];
  ranking?: InputMaybe<PublicationCommentOnRanking>;
};

export type PublicationCommentOnRanking = {
  filter?: InputMaybe<CommentRankingFilterType>;
};

export enum PublicationContentWarningType {
  Nsfw = 'NSFW',
  Sensitive = 'SENSITIVE',
  Spoiler = 'SPOILER'
}

export type PublicationForYou = Post | Quote;

export type PublicationForYouRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  for?: InputMaybe<Scalars['ProfileId']['input']>;
  limit?: InputMaybe<LimitType>;
  /** The `For You` feed results are served randomized by default. Toggling this off will end up in a more `static` feed. */
  randomized?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PublicationMarketplaceMetadataAttribute = {
  __typename?: 'PublicationMarketplaceMetadataAttribute';
  displayType?: Maybe<MarketplaceMetadataAttributeDisplayType>;
  traitType?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PublicationMetadata =
  | ArticleMetadataV3
  | AudioMetadataV3
  | CheckingInMetadataV3
  | EmbedMetadataV3
  | EventMetadataV3
  | ImageMetadataV3
  | LinkMetadataV3
  | LiveStreamMetadataV3
  | MintMetadataV3
  | SpaceMetadataV3
  | StoryMetadataV3
  | TextOnlyMetadataV3
  | ThreeDMetadataV3
  | TransactionMetadataV3
  | VideoMetadataV3;

export type PublicationMetadataContentWarningFilter = {
  oneOf: Array<PublicationContentWarningType>;
};

export type PublicationMetadataEncryptionStrategy =
  PublicationMetadataLitEncryption;

export type PublicationMetadataFilters = {
  contentWarning?: InputMaybe<PublicationMetadataContentWarningFilter>;
  locale?: InputMaybe<Scalars['Locale']['input']>;
  mainContentFocus?: InputMaybe<Array<PublicationMetadataMainFocusType>>;
  publishedOn?: InputMaybe<Array<Scalars['AppId']['input']>>;
  tags?: InputMaybe<PublicationMetadataTagsFilter>;
};

export enum PublicationMetadataLicenseType {
  Cco = 'CCO',
  CcBy = 'CC_BY',
  CcByNc = 'CC_BY_NC',
  CcByNd = 'CC_BY_ND',
  TbnlCDtsaNplLedger = 'TBNL_C_DTSA_NPL_Ledger',
  TbnlCDtsaNplLegal = 'TBNL_C_DTSA_NPL_Legal',
  TbnlCDtsaPlLedger = 'TBNL_C_DTSA_PL_Ledger',
  TbnlCDtsaPlLegal = 'TBNL_C_DTSA_PL_Legal',
  TbnlCDtNplLedger = 'TBNL_C_DT_NPL_Ledger',
  TbnlCDtNplLegal = 'TBNL_C_DT_NPL_Legal',
  TbnlCDtPlLedger = 'TBNL_C_DT_PL_Ledger',
  TbnlCDtPlLegal = 'TBNL_C_DT_PL_Legal',
  TbnlCDNplLedger = 'TBNL_C_D_NPL_Ledger',
  TbnlCDNplLegal = 'TBNL_C_D_NPL_Legal',
  TbnlCDPlLedger = 'TBNL_C_D_PL_Ledger',
  TbnlCDPlLegal = 'TBNL_C_D_PL_Legal',
  TbnlCNdNplLedger = 'TBNL_C_ND_NPL_Ledger',
  TbnlCNdNplLegal = 'TBNL_C_ND_NPL_Legal',
  TbnlCNdPlLedger = 'TBNL_C_ND_PL_Ledger',
  TbnlCNdPlLegal = 'TBNL_C_ND_PL_Legal',
  TbnlNcDtsaNplLedger = 'TBNL_NC_DTSA_NPL_Ledger',
  TbnlNcDtsaNplLegal = 'TBNL_NC_DTSA_NPL_Legal',
  TbnlNcDtsaPlLedger = 'TBNL_NC_DTSA_PL_Ledger',
  TbnlNcDtsaPlLegal = 'TBNL_NC_DTSA_PL_Legal',
  TbnlNcDtNplLedger = 'TBNL_NC_DT_NPL_Ledger',
  TbnlNcDtNplLegal = 'TBNL_NC_DT_NPL_Legal',
  TbnlNcDtPlLedger = 'TBNL_NC_DT_PL_Ledger',
  TbnlNcDtPlLegal = 'TBNL_NC_DT_PL_Legal',
  TbnlNcDNplLedger = 'TBNL_NC_D_NPL_Ledger',
  TbnlNcDNplLegal = 'TBNL_NC_D_NPL_Legal',
  TbnlNcDPlLedger = 'TBNL_NC_D_PL_Ledger',
  TbnlNcDPlLegal = 'TBNL_NC_D_PL_Legal',
  TbnlNcNdNplLedger = 'TBNL_NC_ND_NPL_Ledger',
  TbnlNcNdNplLegal = 'TBNL_NC_ND_NPL_Legal',
  TbnlNcNdPlLedger = 'TBNL_NC_ND_PL_Ledger',
  TbnlNcNdPlLegal = 'TBNL_NC_ND_PL_Legal'
}

export type PublicationMetadataLitEncryption = {
  __typename?: 'PublicationMetadataLitEncryption';
  accessCondition: RootCondition;
  accessControlContract: NetworkAddress;
  encryptedPaths: Array<Scalars['EncryptedPath']['output']>;
  encryptionKey: Scalars['ContentEncryptionKey']['output'];
};

export enum PublicationMetadataMainFocusType {
  Article = 'ARTICLE',
  Audio = 'AUDIO',
  CheckingIn = 'CHECKING_IN',
  Embed = 'EMBED',
  Event = 'EVENT',
  Image = 'IMAGE',
  Link = 'LINK',
  Livestream = 'LIVESTREAM',
  Mint = 'MINT',
  ShortVideo = 'SHORT_VIDEO',
  Space = 'SPACE',
  Story = 'STORY',
  TextOnly = 'TEXT_ONLY',
  ThreeD = 'THREE_D',
  Transaction = 'TRANSACTION',
  Video = 'VIDEO'
}

export type PublicationMetadataMedia =
  | PublicationMetadataMediaAudio
  | PublicationMetadataMediaImage
  | PublicationMetadataMediaVideo;

export type PublicationMetadataMediaAudio = {
  __typename?: 'PublicationMetadataMediaAudio';
  artist?: Maybe<Scalars['EncryptableString']['output']>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  audio: EncryptableAudioSet;
  cover?: Maybe<EncryptableImageSet>;
  credits?: Maybe<Scalars['EncryptableString']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  genre?: Maybe<Scalars['EncryptableString']['output']>;
  license?: Maybe<PublicationMetadataLicenseType>;
  lyrics?: Maybe<Scalars['EncryptableString']['output']>;
  recordLabel?: Maybe<Scalars['EncryptableString']['output']>;
};

export type PublicationMetadataMediaImage = {
  __typename?: 'PublicationMetadataMediaImage';
  /** Alternative text for the image */
  altTag?: Maybe<Scalars['EncryptableString']['output']>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  image: EncryptableImageSet;
  license?: Maybe<PublicationMetadataLicenseType>;
};

export type PublicationMetadataMediaVideo = {
  __typename?: 'PublicationMetadataMediaVideo';
  /** Alternative text for the video */
  altTag?: Maybe<Scalars['EncryptableString']['output']>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  cover?: Maybe<EncryptableImageSet>;
  duration?: Maybe<Scalars['Int']['output']>;
  license?: Maybe<PublicationMetadataLicenseType>;
  video: EncryptableVideoSet;
};

export type PublicationMetadataTagsFilter = {
  all?: InputMaybe<Array<Scalars['String']['input']>>;
  oneOf?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum PublicationMetadataTransactionType {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Other = 'OTHER'
}

export type PublicationNotInterestedRequest = {
  on: Scalars['PublicationId']['input'];
};

export type PublicationOperations = {
  __typename?: 'PublicationOperations';
  actedOn: Array<OpenActionResult>;
  canAct: TriStateValue;
  canComment: TriStateValue;
  canDecrypt: CanDecryptResponse;
  canMirror: TriStateValue;
  canQuote: TriStateValue;
  hasActed: OptimisticStatusResult;
  hasBookmarked: Scalars['Boolean']['output'];
  hasMirrored: Scalars['Boolean']['output'];
  hasQuoted: Scalars['Boolean']['output'];
  hasReacted: Scalars['Boolean']['output'];
  hasReported: Scalars['Boolean']['output'];
  id: Scalars['PublicationId']['output'];
  isNotInterested: Scalars['Boolean']['output'];
};

export type PublicationOperationsActedOnArgs = {
  request?: InputMaybe<PublicationOperationsActedArgs>;
};

export type PublicationOperationsCanActArgs = {
  request?: InputMaybe<PublicationOperationsActedArgs>;
};

export type PublicationOperationsHasActedArgs = {
  request?: InputMaybe<PublicationOperationsActedArgs>;
};

export type PublicationOperationsHasReactedArgs = {
  request?: InputMaybe<PublicationOperationsReactionArgs>;
};

export type PublicationOperationsActedArgs = {
  filter?: InputMaybe<OpenActionFilter>;
};

export type PublicationOperationsReactionArgs = {
  type?: InputMaybe<PublicationReactionType>;
};

export enum PublicationReactionType {
  Downvote = 'DOWNVOTE',
  Upvote = 'UPVOTE'
}

export enum PublicationReportingFraudSubreason {
  Impersonation = 'IMPERSONATION',
  Scam = 'SCAM'
}

export enum PublicationReportingIllegalSubreason {
  AnimalAbuse = 'ANIMAL_ABUSE',
  DirectThreat = 'DIRECT_THREAT',
  HumanAbuse = 'HUMAN_ABUSE',
  IntEllEctualProperty = 'INTEllECTUAL_PROPERTY',
  ThreatIndividual = 'THREAT_INDIVIDUAL',
  Violence = 'VIOLENCE'
}

export enum PublicationReportingReason {
  Fraud = 'FRAUD',
  Illegal = 'ILLEGAL',
  Sensitive = 'SENSITIVE',
  Spam = 'SPAM'
}

export enum PublicationReportingSensitiveSubreason {
  Nsfw = 'NSFW',
  Offensive = 'OFFENSIVE'
}

export enum PublicationReportingSpamSubreason {
  FakeEngagement = 'FAKE_ENGAGEMENT',
  LowSignal = 'LOW_SIGNAL',
  ManipulationAlgo = 'MANIPULATION_ALGO',
  Misleading = 'MISLEADING',
  MisuseHashtags = 'MISUSE_HASHTAGS',
  Repetitive = 'REPETITIVE',
  SomethingElse = 'SOMETHING_ELSE',
  Unrelated = 'UNRELATED'
}

export type PublicationRequest = {
  forId?: InputMaybe<Scalars['PublicationId']['input']>;
  forTxHash?: InputMaybe<Scalars['TxHash']['input']>;
};

export type PublicationRevenue = {
  __typename?: 'PublicationRevenue';
  publication: AnyPublication;
  revenue: Array<RevenueAggregate>;
};

export type PublicationSearchRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  query: Scalars['String']['input'];
  where?: InputMaybe<PublicationSearchWhere>;
};

export type PublicationSearchWhere = {
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  metadata?: InputMaybe<PublicationMetadataFilters>;
  publicationTypes?: InputMaybe<Array<SearchPublicationType>>;
  withOpenActions?: InputMaybe<Array<OpenActionFilter>>;
};

export type PublicationStats = {
  __typename?: 'PublicationStats';
  bookmarks: Scalars['Int']['output'];
  comments: Scalars['Int']['output'];
  countOpenActions: Scalars['Int']['output'];
  id: Scalars['PublicationId']['output'];
  mirrors: Scalars['Int']['output'];
  quotes: Scalars['Int']['output'];
  reactions: Scalars['Int']['output'];
};

export type PublicationStatsCountOpenActionsArgs = {
  request?: InputMaybe<PublicationStatsCountOpenActionArgs>;
};

export type PublicationStatsReactionsArgs = {
  request?: InputMaybe<PublicationStatsReactionArgs>;
};

export type PublicationStatsCountOpenActionArgs = {
  anyOf?: InputMaybe<Array<OpenActionFilter>>;
};

export type PublicationStatsInput = {
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  hiddenComments?: InputMaybe<HiddenCommentsType>;
  /** Filter the returned stats on apps and 1 of the following filters: tags, contentWarning, mainContentFocus, locale */
  metadata?: InputMaybe<PublicationMetadataFilters>;
};

export type PublicationStatsReactionArgs = {
  type: PublicationReactionType;
};

export enum PublicationType {
  Comment = 'COMMENT',
  Mirror = 'MIRROR',
  Post = 'POST',
  Quote = 'QUOTE'
}

export type PublicationValidateMetadataResult = {
  __typename?: 'PublicationValidateMetadataResult';
  reason?: Maybe<Scalars['String']['output']>;
  valid: Scalars['Boolean']['output'];
};

export type PublicationsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  where: PublicationsWhere;
};

export type PublicationsTagsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  orderBy?: InputMaybe<TagSortCriteriaType>;
  where?: InputMaybe<PublicationsTagsWhere>;
};

export type PublicationsTagsWhere = {
  publishedOn?: InputMaybe<Array<Scalars['AppId']['input']>>;
};

export type PublicationsWhere = {
  actedBy?: InputMaybe<Scalars['ProfileId']['input']>;
  commentOn?: InputMaybe<PublicationCommentOn>;
  customFilters?: InputMaybe<Array<CustomFiltersType>>;
  from?: InputMaybe<Array<Scalars['ProfileId']['input']>>;
  metadata?: InputMaybe<PublicationMetadataFilters>;
  mirrorOn?: InputMaybe<Scalars['PublicationId']['input']>;
  publicationIds?: InputMaybe<Array<Scalars['PublicationId']['input']>>;
  publicationTypes?: InputMaybe<Array<PublicationType>>;
  quoteOn?: InputMaybe<Scalars['PublicationId']['input']>;
  withOpenActions?: InputMaybe<Array<OpenActionFilter>>;
};

export type Query = {
  __typename?: 'Query';
  approvedAuthentications: PaginatedApprovedAuthenticationResult;
  /** note here if your using a wallet JWT token it will get the allowance of the public proxy contract if its supported if not throw as profiles act not wallets */
  approvedModuleAllowanceAmount: Array<ApprovedAllowanceAmountResult>;
  canClaim: Array<CanClaimResult>;
  challenge: AuthChallengeResult;
  claimTokens: LensProfileManagerRelayResult;
  claimableProfiles: ClaimableProfilesResult;
  claimableStatus: ClaimProfileStatusType;
  claimableTokens: ClaimableTokensResult;
  createFrameTypedData: CreateFrameEip712TypedData;
  /** Get all enabled currencies */
  currencies: PaginatedCurrenciesResult;
  currentSession: ApprovedAuthentication;
  /** Get the default profile for a given EvmAddress. If no default is explicitly set, you will get the oldest profile owned by the address. */
  defaultProfile?: Maybe<Profile>;
  didReactOnPublication: Array<DidReactOnPublicationResult>;
  exploreProfiles: PaginatedProfileResult;
  explorePublications: PaginatedExplorePublicationResult;
  feed: PaginatedFeedResult;
  feedHighlights: PaginatedFeedHighlightsResult;
  followRevenues: FollowRevenueResult;
  followStatusBulk: Array<FollowStatusBulkResult>;
  followers: PaginatedProfileResult;
  following: PaginatedProfileResult;
  forYou: PaginatedForYouResult;
  generateLensAPIRelayAddress: Scalars['EvmAddress']['output'];
  /** note here if your using a wallet JWT token it will approve to the public proxy contract if its supported if not throw as profiles act not wallets */
  generateModuleCurrencyApprovalData: GenerateModuleCurrencyApprovalResult;
  handleToAddress?: Maybe<Scalars['EvmAddress']['output']>;
  internalAllowedDomains: Array<Scalars['URI']['output']>;
  internalBoostScore?: Maybe<Scalars['Int']['output']>;
  internalClaimStatus?: Maybe<Scalars['Void']['output']>;
  internalCuratedHandles: Array<Scalars['String']['output']>;
  internalCuratedTags: Array<Scalars['String']['output']>;
  internalInvites: Scalars['Int']['output'];
  internalPaymentHandleInfo?: Maybe<IphResult>;
  internalProfileStatus: PrfResult;
  invitedProfiles: Array<InvitedResult>;
  lastLoggedInProfile?: Maybe<Profile>;
  latestPaidActions: LatestPaidActionsResult;
  lensAPIOwnedEOAs: Array<Scalars['EvmAddress']['output']>;
  lensProtocolVersion: Scalars['String']['output'];
  lensTransactionStatus?: Maybe<LensTransactionResult>;
  modDisputedReports: PaginatedDisputedReports;
  modExplorePublications: PaginatedModExplorePublicationResult;
  modFollowers: PaginatedModFollowersResult;
  modLatestReports: PaginatedModReports;
  moduleMetadata?: Maybe<GetModuleMetadataResult>;
  momokaSubmitters: MomokaSubmittersResult;
  momokaSummary: MomokaSummaryResult;
  momokaTransaction?: Maybe<MomokaTransaction>;
  momokaTransactions: MomokaTransactionsResult;
  /** Returns a paged list of profiles that are followed by both the observer and the viewing profile */
  mutualFollowers: PaginatedProfileResult;
  /** Get the NFT collections that the given two profiles own at least one NFT of. */
  mutualNftCollections: PaginatedNftCollectionsResult;
  mutualPoaps: PaginatedPoapEventResult;
  /** Get the Lens Profiles that own NFTs from a given collection. */
  nftCollectionOwners: PaginatedProfileResult;
  /** Get the NFT collections that the given wallet or profileId owns at least one NFT of. Only supports Ethereum and Polygon NFTs. Note excludeFollowers is set to true by default, so the result will not include Lens Follower NFTsunless explicitly requested. */
  nftCollections: PaginatedNftCollectionsResult;
  nftGalleries: PaginatedNftGalleriesResult;
  nfts: PaginatedNftsResult;
  notifications: PaginatedNotificationResult;
  ownedHandles: PaginatedHandlesResult;
  ping: Scalars['String']['output'];
  poapEvent?: Maybe<PoapEvent>;
  poapHolders: PaginatedProfileResult;
  poaps: PaginatedPoapTokenResult;
  /** Get the most popular NFT collections. Popularity is based on how many Lens Profiles own NFTs from a given collection. */
  popularNftCollections: PaginatedPopularNftCollectionsResult;
  profile?: Maybe<Profile>;
  profileActionHistory: PaginatedProfileActionHistoryResult;
  profileAlreadyInvited: Scalars['Boolean']['output'];
  profileInterestsOptions: Array<Scalars['String']['output']>;
  profileManagers: PaginatedProfileManagersResult;
  profileRecommendations: PaginatedProfileResult;
  profiles: PaginatedProfileResult;
  profilesManaged: PaginatedProfileResult;
  publication?: Maybe<AnyPublication>;
  publicationBookmarks: PaginatedPublicationsResult;
  publications: PaginatedPublicationsResult;
  publicationsTags: PaginatedPublicationsTagsResult;
  relayQueues: Array<RelayQueueResult>;
  revenueFromPublication?: Maybe<PublicationRevenue>;
  revenueFromPublications: PaginatedRevenueFromPublicationsResult;
  searchProfiles: PaginatedProfileResult;
  searchPublications: PaginatedPublicationPrimaryResult;
  supportedFollowModules: PaginatedSupportedModules;
  supportedOpenActionCollectModules: PaginatedSupportedModules;
  supportedOpenActionModules: PaginatedSupportedModules;
  supportedReferenceModules: PaginatedSupportedModules;
  txIdToTxHash?: Maybe<Scalars['TxHash']['output']>;
  userRateLimit: UserCurrentRateLimitResult;
  userSigNonces: UserSigNonces;
  validatePublicationMetadata: PublicationValidateMetadataResult;
  verify: Scalars['Boolean']['output'];
  verifyFrameSignature: FrameVerifySignatureResult;
  whoActedOnPublication: PaginatedProfileResult;
  /** The list of profiles that the logged in profile has blocked */
  whoHaveBlocked: PaginatedProfileResult;
  whoReactedPublication: PaginatedWhoReactedResult;
};

export type QueryApprovedAuthenticationsArgs = {
  request: ApprovedAuthenticationRequest;
};

export type QueryApprovedModuleAllowanceAmountArgs = {
  request: ApprovedModuleAllowanceAmountRequest;
};

export type QueryCanClaimArgs = {
  request: CanClaimRequest;
};

export type QueryChallengeArgs = {
  request: ChallengeRequest;
};

export type QueryClaimTokensArgs = {
  request: ClaimTokensRequest;
};

export type QueryCreateFrameTypedDataArgs = {
  request: FrameEip712Request;
};

export type QueryCurrenciesArgs = {
  request: PaginatedOffsetRequest;
};

export type QueryDefaultProfileArgs = {
  request: DefaultProfileRequest;
};

export type QueryDidReactOnPublicationArgs = {
  request: DidReactOnPublicationRequest;
};

export type QueryExploreProfilesArgs = {
  request: ExploreProfilesRequest;
};

export type QueryExplorePublicationsArgs = {
  request: ExplorePublicationRequest;
};

export type QueryFeedArgs = {
  request: FeedRequest;
};

export type QueryFeedHighlightsArgs = {
  request: FeedHighlightsRequest;
};

export type QueryFollowRevenuesArgs = {
  request: FollowRevenueRequest;
};

export type QueryFollowStatusBulkArgs = {
  request: FollowStatusBulkRequest;
};

export type QueryFollowersArgs = {
  request: FollowersRequest;
};

export type QueryFollowingArgs = {
  request: FollowingRequest;
};

export type QueryForYouArgs = {
  request: PublicationForYouRequest;
};

export type QueryGenerateModuleCurrencyApprovalDataArgs = {
  request: GenerateModuleCurrencyApprovalDataRequest;
};

export type QueryHandleToAddressArgs = {
  request: HandleToAddressRequest;
};

export type QueryInternalAllowedDomainsArgs = {
  request: InternalAllowedDomainsRequest;
};

export type QueryInternalBoostScoreArgs = {
  request: InternalBoostScoreRequest;
};

export type QueryInternalClaimStatusArgs = {
  request: InternalClaimStatusRequest;
};

export type QueryInternalCuratedHandlesArgs = {
  request: InternalCuratedHandlesRequest;
};

export type QueryInternalCuratedTagsArgs = {
  request: InternalCuratedTagsRequest;
};

export type QueryInternalInvitesArgs = {
  request: InternalInvitesRequest;
};

export type QueryInternalPaymentHandleInfoArgs = {
  request: InternalPaymentHandleInfoRequest;
};

export type QueryInternalProfileStatusArgs = {
  request: InternalProfileStatusRequest;
};

export type QueryLastLoggedInProfileArgs = {
  request: LastLoggedInProfileRequest;
};

export type QueryLatestPaidActionsArgs = {
  filter?: InputMaybe<LatestPaidActionsFilter>;
  request?: InputMaybe<PaginatedRequest>;
  where?: InputMaybe<LatestPaidActionsWhere>;
};

export type QueryLensTransactionStatusArgs = {
  request: LensTransactionStatusRequest;
};

export type QueryModDisputedReportsArgs = {
  request: PaginatedRequest;
};

export type QueryModExplorePublicationsArgs = {
  request: ModExplorePublicationRequest;
};

export type QueryModFollowersArgs = {
  request: PaginatedRequest;
};

export type QueryModLatestReportsArgs = {
  request: ModReportsRequest;
};

export type QueryModuleMetadataArgs = {
  request: ModuleMetadataRequest;
};

export type QueryMomokaTransactionArgs = {
  request: MomokaTransactionRequest;
};

export type QueryMomokaTransactionsArgs = {
  request: MomokaTransactionsRequest;
};

export type QueryMutualFollowersArgs = {
  request: MutualFollowersRequest;
};

export type QueryMutualNftCollectionsArgs = {
  request: MutualNftCollectionsRequest;
};

export type QueryMutualPoapsArgs = {
  request: MutualPoapsQueryRequest;
};

export type QueryNftCollectionOwnersArgs = {
  request: NftCollectionOwnersRequest;
};

export type QueryNftCollectionsArgs = {
  request: NftCollectionsRequest;
};

export type QueryNftGalleriesArgs = {
  request: NftGalleriesRequest;
};

export type QueryNftsArgs = {
  request: NftsRequest;
};

export type QueryNotificationsArgs = {
  request?: InputMaybe<NotificationRequest>;
};

export type QueryOwnedHandlesArgs = {
  request: OwnedHandlesRequest;
};

export type QueryPoapEventArgs = {
  request: PoapEventQueryRequest;
};

export type QueryPoapHoldersArgs = {
  request: PoapHoldersQueryRequest;
};

export type QueryPoapsArgs = {
  request: UserPoapsQueryRequest;
};

export type QueryPopularNftCollectionsArgs = {
  request: PopularNftCollectionsRequest;
};

export type QueryProfileArgs = {
  request: ProfileRequest;
};

export type QueryProfileActionHistoryArgs = {
  request: ProfileActionHistoryRequest;
};

export type QueryProfileAlreadyInvitedArgs = {
  request: AlreadyInvitedCheckRequest;
};

export type QueryProfileManagersArgs = {
  request: ProfileManagersRequest;
};

export type QueryProfileRecommendationsArgs = {
  request: ProfileRecommendationsRequest;
};

export type QueryProfilesArgs = {
  request: ProfilesRequest;
};

export type QueryProfilesManagedArgs = {
  request: ProfilesManagedRequest;
};

export type QueryPublicationArgs = {
  request: PublicationRequest;
};

export type QueryPublicationBookmarksArgs = {
  request?: InputMaybe<PublicationBookmarksRequest>;
};

export type QueryPublicationsArgs = {
  request: PublicationsRequest;
};

export type QueryPublicationsTagsArgs = {
  request?: InputMaybe<PublicationsTagsRequest>;
};

export type QueryRevenueFromPublicationArgs = {
  request: RevenueFromPublicationRequest;
};

export type QueryRevenueFromPublicationsArgs = {
  request: RevenueFromPublicationsRequest;
};

export type QuerySearchProfilesArgs = {
  request: ProfileSearchRequest;
};

export type QuerySearchPublicationsArgs = {
  request: PublicationSearchRequest;
};

export type QuerySupportedFollowModulesArgs = {
  request: SupportedModulesRequest;
};

export type QuerySupportedOpenActionCollectModulesArgs = {
  request: SupportedModulesRequest;
};

export type QuerySupportedOpenActionModulesArgs = {
  request: SupportedModulesRequest;
};

export type QuerySupportedReferenceModulesArgs = {
  request: SupportedModulesRequest;
};

export type QueryTxIdToTxHashArgs = {
  for: Scalars['TxId']['input'];
};

export type QueryUserRateLimitArgs = {
  request: UserCurrentRateLimitRequest;
};

export type QueryValidatePublicationMetadataArgs = {
  request: ValidatePublicationMetadataRequest;
};

export type QueryVerifyArgs = {
  request: VerifyRequest;
};

export type QueryVerifyFrameSignatureArgs = {
  request: FrameVerifySignature;
};

export type QueryWhoActedOnPublicationArgs = {
  request: WhoActedOnPublicationRequest;
};

export type QueryWhoHaveBlockedArgs = {
  request: WhoHaveBlockedRequest;
};

export type QueryWhoReactedPublicationArgs = {
  request: WhoReactedPublicationRequest;
};

export type Quote = {
  __typename?: 'Quote';
  by: Profile;
  createdAt: Scalars['DateTime']['output'];
  hashtagsMentioned: Array<Scalars['String']['output']>;
  id: Scalars['PublicationId']['output'];
  isEncrypted: Scalars['Boolean']['output'];
  isHidden: Scalars['Boolean']['output'];
  metadata: PublicationMetadata;
  momoka?: Maybe<MomokaInfo>;
  openActionModules: Array<OpenActionModule>;
  operations: PublicationOperations;
  profilesMentioned: Array<ProfileMentioned>;
  publishedOn?: Maybe<App>;
  quoteOn: PrimaryPublication;
  referenceModule?: Maybe<ReferenceModule>;
  stats: PublicationStats;
  txHash?: Maybe<Scalars['TxHash']['output']>;
};

export type QuoteStatsArgs = {
  request?: InputMaybe<PublicationStatsInput>;
};

export type QuoteNotification = {
  __typename?: 'QuoteNotification';
  id: Scalars['UUID']['output'];
  quote: Quote;
};

export type RateRequest = {
  for: SupportedFiatType;
};

export type ReactedResult = {
  __typename?: 'ReactedResult';
  reactedAt: Scalars['DateTime']['output'];
  reaction: PublicationReactionType;
};

export type ReactionEvent = {
  __typename?: 'ReactionEvent';
  by: Profile;
  createdAt: Scalars['DateTime']['output'];
  reaction: PublicationReactionType;
};

export type ReactionNotification = {
  __typename?: 'ReactionNotification';
  id: Scalars['UUID']['output'];
  publication: PrimaryPublication;
  reactions: Array<ProfileReactedResult>;
};

export type ReactionRequest = {
  /** The ID of the app that the reaction was made from. */
  app?: InputMaybe<Scalars['AppId']['input']>;
  for: Scalars['PublicationId']['input'];
  reaction: PublicationReactionType;
};

export type RecipientDataInput = {
  /** Recipient of collect fees. */
  recipient: Scalars['EvmAddress']['input'];
  /** Split %, should be between 0.01 and 100. Up to 2 decimal points supported. All % should add up to 100 */
  split: Scalars['Float']['input'];
};

export type RecipientDataOutput = {
  __typename?: 'RecipientDataOutput';
  /** Recipient of collect fees. */
  recipient: Scalars['EvmAddress']['output'];
  /** Split %, should be between 0.01 and 100. Up to 2 decimal points supported. All % should add up to 100 */
  split: Scalars['Float']['output'];
};

export type ReferenceModule =
  | DegreesOfSeparationReferenceModuleSettings
  | FollowOnlyReferenceModuleSettings
  | LegacyDegreesOfSeparationReferenceModuleSettings
  | LegacyFollowOnlyReferenceModuleSettings
  | UnknownReferenceModuleSettings;

export type ReferenceModuleInput = {
  degreesOfSeparationReferenceModule?: InputMaybe<DegreesOfSeparationReferenceModuleInput>;
  followerOnlyReferenceModule?: InputMaybe<Scalars['Boolean']['input']>;
  unknownReferenceModule?: InputMaybe<UnknownReferenceModuleInput>;
};

export enum ReferenceModuleType {
  DegreesOfSeparationReferenceModule = 'DegreesOfSeparationReferenceModule',
  FollowerOnlyReferenceModule = 'FollowerOnlyReferenceModule',
  LegacyDegreesOfSeparationReferenceModule = 'LegacyDegreesOfSeparationReferenceModule',
  LegacyFollowerOnlyReferenceModule = 'LegacyFollowerOnlyReferenceModule',
  UnknownReferenceModule = 'UnknownReferenceModule'
}

export type RefreshPublicationMetadataRequest = {
  for: Scalars['PublicationId']['input'];
};

export type RefreshPublicationMetadataResult = {
  __typename?: 'RefreshPublicationMetadataResult';
  result: RefreshPublicationMetadataResultType;
};

export enum RefreshPublicationMetadataResultType {
  AlreadyPending = 'ALREADY_PENDING',
  Queued = 'QUEUED',
  ValidPublicationNotFound = 'VALID_PUBLICATION_NOT_FOUND'
}

/** The refresh request */
export type RefreshRequest = {
  /** The refresh token */
  refreshToken: Scalars['Jwt']['input'];
};

export type RelayError = {
  __typename?: 'RelayError';
  reason: RelayErrorReasonType;
};

export enum RelayErrorReasonType {
  AppNotAllowed = 'APP_NOT_ALLOWED',
  Expired = 'EXPIRED',
  Failed = 'FAILED',
  NotSponsored = 'NOT_SPONSORED',
  RateLimited = 'RATE_LIMITED',
  WrongWalletSigned = 'WRONG_WALLET_SIGNED'
}

export type RelayMomokaResult =
  | CreateMomokaPublicationResult
  | LensProfileManagerRelayError;

export type RelayQueueResult = {
  __typename?: 'RelayQueueResult';
  key: RelayRoleKey;
  queue: Scalars['Int']['output'];
  relay: NetworkAddress;
};

export type RelayResult = RelayError | RelaySuccess;

export enum RelayRoleKey {
  CreateProfile = 'CREATE_PROFILE',
  CreateProfileWithHandleUsingCredits_1 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_1',
  CreateProfileWithHandleUsingCredits_2 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_2',
  CreateProfileWithHandleUsingCredits_3 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_3',
  CreateProfileWithHandleUsingCredits_4 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_4',
  CreateProfileWithHandleUsingCredits_5 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_5',
  CreateProfileWithHandleUsingCredits_6 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_6',
  CreateProfileWithHandleUsingCredits_7 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_7',
  CreateProfileWithHandleUsingCredits_8 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_8',
  CreateProfileWithHandleUsingCredits_9 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_9',
  CreateProfileWithHandleUsingCredits_10 = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_10',
  CreateProfileWithHandleUsingCreditsUnderCharLimit = 'CREATE_PROFILE_WITH_HANDLE_USING_CREDITS_UNDER_CHAR_LIMIT',
  LensManager_1 = 'LENS_MANAGER_1',
  LensManager_2 = 'LENS_MANAGER_2',
  LensManager_3 = 'LENS_MANAGER_3',
  LensManager_4 = 'LENS_MANAGER_4',
  LensManager_5 = 'LENS_MANAGER_5',
  LensManager_6 = 'LENS_MANAGER_6',
  LensManager_7 = 'LENS_MANAGER_7',
  LensManager_8 = 'LENS_MANAGER_8',
  LensManager_9 = 'LENS_MANAGER_9',
  LensManager_10 = 'LENS_MANAGER_10',
  LensManager_11 = 'LENS_MANAGER_11',
  LensManager_12 = 'LENS_MANAGER_12',
  LensManager_13 = 'LENS_MANAGER_13',
  LensManager_14 = 'LENS_MANAGER_14',
  LensManager_15 = 'LENS_MANAGER_15',
  LensManager_16 = 'LENS_MANAGER_16',
  LensManager_17 = 'LENS_MANAGER_17',
  LensManager_18 = 'LENS_MANAGER_18',
  LensManager_19 = 'LENS_MANAGER_19',
  LensManager_20 = 'LENS_MANAGER_20',
  LensManager_21 = 'LENS_MANAGER_21',
  LensManager_22 = 'LENS_MANAGER_22',
  LensManager_23 = 'LENS_MANAGER_23',
  LensManager_24 = 'LENS_MANAGER_24',
  LensManager_25 = 'LENS_MANAGER_25',
  LensManager_26 = 'LENS_MANAGER_26',
  LensManager_27 = 'LENS_MANAGER_27',
  LensManager_28 = 'LENS_MANAGER_28',
  LensManager_29 = 'LENS_MANAGER_29',
  LensManager_30 = 'LENS_MANAGER_30',
  WithSig_1 = 'WITH_SIG_1',
  WithSig_2 = 'WITH_SIG_2',
  WithSig_3 = 'WITH_SIG_3',
  WithSig_4 = 'WITH_SIG_4',
  WithSig_5 = 'WITH_SIG_5',
  WithSig_6 = 'WITH_SIG_6',
  WithSig_7 = 'WITH_SIG_7',
  WithSig_8 = 'WITH_SIG_8',
  WithSig_9 = 'WITH_SIG_9',
  WithSig_10 = 'WITH_SIG_10',
  WithSig_11 = 'WITH_SIG_11',
  WithSig_12 = 'WITH_SIG_12',
  WithSig_13 = 'WITH_SIG_13',
  WithSig_14 = 'WITH_SIG_14',
  WithSig_15 = 'WITH_SIG_15',
  WithSig_16 = 'WITH_SIG_16',
  WithSig_17 = 'WITH_SIG_17',
  WithSig_18 = 'WITH_SIG_18',
  WithSig_19 = 'WITH_SIG_19',
  WithSig_20 = 'WITH_SIG_20'
}

export type RelaySuccess = {
  __typename?: 'RelaySuccess';
  txHash?: Maybe<Scalars['TxHash']['output']>;
  txId: Scalars['TxId']['output'];
};

export type ReportProfileRequest = {
  additionalComments?: InputMaybe<Scalars['String']['input']>;
  for: Scalars['ProfileId']['input'];
  reason: ProfileReportingReasonInput;
};

export type ReportPublicationRequest = {
  additionalComments?: InputMaybe<Scalars['String']['input']>;
  for: Scalars['PublicationId']['input'];
  reason: ReportingReasonInput;
};

export type ReportingReasonInput = {
  fraudReason?: InputMaybe<FraudReasonInput>;
  illegalReason?: InputMaybe<IllegalReasonInput>;
  sensitiveReason?: InputMaybe<SensitiveReasonInput>;
  spamReason?: InputMaybe<SpamReasonInput>;
};

export type ReservedClaimable = {
  __typename?: 'ReservedClaimable';
  expiry: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  source: Scalars['AppId']['output'];
  /** The full handle - namespace/localname */
  withHandle: Scalars['Handle']['output'];
};

export type RevenueAggregate = {
  __typename?: 'RevenueAggregate';
  total: Amount;
};

export type RevenueFromPublicationRequest = {
  for: Scalars['PublicationId']['input'];
  /** Will return revenue for publications made on any of the provided app ids. Will include all apps if omitted */
  publishedOn?: InputMaybe<Array<Scalars['AppId']['input']>>;
};

export type RevenueFromPublicationsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  /** The profile to get revenue for */
  for: Scalars['ProfileId']['input'];
  limit?: InputMaybe<LimitType>;
  /** Will return revenue for publications made on any of the provided app ids. Will include all apps if omitted */
  publishedOn?: InputMaybe<Array<Scalars['AppId']['input']>>;
};

export type RevertFollowModuleSettings = {
  __typename?: 'RevertFollowModuleSettings';
  contract: NetworkAddress;
  type: FollowModuleType;
};

export type RevokeAuthenticationRequest = {
  /** The token authorization id wish to revoke */
  authorizationId: Scalars['UUID']['input'];
};

export type RootCondition = {
  __typename?: 'RootCondition';
  criteria: Array<SecondTierCondition>;
};

export enum SearchPublicationType {
  Comment = 'COMMENT',
  Post = 'POST',
  Quote = 'QUOTE'
}

export type SecondTierCondition =
  | AdvancedContractCondition
  | AndCondition
  | CollectCondition
  | EoaOwnershipCondition
  | Erc20OwnershipCondition
  | FollowCondition
  | NftOwnershipCondition
  | OrCondition
  | ProfileOwnershipCondition;

export type SensitiveReasonInput = {
  reason: PublicationReportingReason;
  subreason: PublicationReportingSensitiveSubreason;
};

export type SetDefaultProfileRequest = {
  profileId: Scalars['ProfileId']['input'];
};

export type SetFollowModuleRequest = {
  followModule: FollowModuleInput;
};

/** The signed auth challenge */
export type SignedAuthChallenge = {
  id: Scalars['ChallengeId']['input'];
  /** The signature */
  signature: Scalars['Signature']['input'];
};

export type SimpleCollectOpenActionModuleInput = {
  amount?: InputMaybe<AmountInput>;
  collectLimit?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  followerOnly: Scalars['Boolean']['input'];
  recipient?: InputMaybe<Scalars['EvmAddress']['input']>;
  referralFee?: InputMaybe<Scalars['Float']['input']>;
};

export type SimpleCollectOpenActionSettings = {
  __typename?: 'SimpleCollectOpenActionSettings';
  /** The collect module amount info. `Amount.value = 0` in case of free collects. */
  amount: Amount;
  /** The maximum number of collects for this publication. */
  collectLimit?: Maybe<Scalars['String']['output']>;
  /** The collect nft address - only deployed on first collect */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** The end timestamp after which collecting is impossible. */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  /** True if only followers of publisher may collect the post. */
  followerOnly: Scalars['Boolean']['output'];
  /** The collect module recipient address */
  recipient: Scalars['EvmAddress']['output'];
  /** The collect module referral fee */
  referralFee: Scalars['Float']['output'];
  type: OpenActionModuleType;
};

export type SpaceMetadataV3 = {
  __typename?: 'SpaceMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  link: Scalars['EncryptableURI']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  startsAt: Scalars['EncryptableDateTime']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title: Scalars['String']['output'];
};

export type SpamReasonInput = {
  reason: PublicationReportingReason;
  subreason: PublicationReportingSpamSubreason;
};

export type StoryMetadataV3 = {
  __typename?: 'StoryMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  asset: PublicationMetadataMedia;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  authorizationRecordRevoked?: Maybe<Scalars['Void']['output']>;
  newMomokaTransaction: MomokaTransaction;
  newNotification?: Maybe<Notification>;
  newPublicationStats: PublicationStats;
  userSigNonces: UserSigNonces;
};

export type SubscriptionAuthorizationRecordRevokedArgs = {
  authorizationId: Scalars['UUID']['input'];
};

export type SubscriptionNewNotificationArgs = {
  for: Scalars['ProfileId']['input'];
};

export type SubscriptionNewPublicationStatsArgs = {
  for: Scalars['PublicationId']['input'];
};

export type SubscriptionUserSigNoncesArgs = {
  address: Scalars['EvmAddress']['input'];
};

export type SuggestedFormattedHandle = {
  __typename?: 'SuggestedFormattedHandle';
  /** The full formatted handle - namespace/@localname */
  full: Scalars['String']['output'];
  /** The formatted handle - @localname */
  localName: Scalars['String']['output'];
};

export enum SupportedFiatType {
  Eur = 'EUR',
  Gbp = 'GBP',
  Usd = 'USD'
}

export type SupportedModule = KnownSupportedModule | UnknownSupportedModule;

export type SupportedModulesRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  includeUnknown?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<LimitType>;
  onlyVerified?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SybilDotOrgIdentity = {
  __typename?: 'SybilDotOrgIdentity';
  source?: Maybe<SybilDotOrgIdentitySource>;
  /** The sybil dot org status */
  verified: Scalars['Boolean']['output'];
};

export type SybilDotOrgIdentitySource = {
  __typename?: 'SybilDotOrgIdentitySource';
  twitter: SybilDotOrgTwitterIdentity;
};

export type SybilDotOrgTwitterIdentity = {
  __typename?: 'SybilDotOrgTwitterIdentity';
  handle?: Maybe<Scalars['String']['output']>;
};

export type TagResult = {
  __typename?: 'TagResult';
  tag: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export enum TagSortCriteriaType {
  Alphabetical = 'ALPHABETICAL',
  MostPopular = 'MOST_POPULAR'
}

export type TextOnlyMetadataV3 = {
  __typename?: 'TextOnlyMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type ThirdTierCondition =
  | AdvancedContractCondition
  | CollectCondition
  | EoaOwnershipCondition
  | Erc20OwnershipCondition
  | FollowCondition
  | NftOwnershipCondition
  | ProfileOwnershipCondition;

export type ThreeDMetadataV3 = {
  __typename?: 'ThreeDMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  assets: Array<ThreeDMetadataV3Asset>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
};

export type ThreeDMetadataV3Asset = {
  __typename?: 'ThreeDMetadataV3Asset';
  format: Scalars['String']['output'];
  license?: Maybe<PublicationMetadataLicenseType>;
  playerURL: Scalars['EncryptableURI']['output'];
  uri: Scalars['EncryptableURI']['output'];
  zipPath?: Maybe<Scalars['String']['output']>;
};

export type TransactionMetadataV3 = {
  __typename?: 'TransactionMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  chainId: Scalars['Int']['output'];
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  txHash: Scalars['EncryptableTxHash']['output'];
  type: PublicationMetadataTransactionType;
};

export enum TriStateValue {
  No = 'NO',
  Unknown = 'UNKNOWN',
  Yes = 'YES'
}

export type TypedDataOptions = {
  /** If you wish to override the nonce for the sig if you want to do some clever stuff in the client */
  overrideSigNonce: Scalars['Nonce']['input'];
};

export type UnblockRequest = {
  profiles: Array<Scalars['ProfileId']['input']>;
};

export type UnfollowRequest = {
  unfollow: Array<Scalars['ProfileId']['input']>;
};

export type UnhideCommentRequest = {
  /** The comment to unhide. It has to be under a publication made by the user making the request. If already visible, nothing will happen. */
  for: Scalars['PublicationId']['input'];
};

export type UnhideManagedProfileRequest = {
  /** The profile to unhide */
  profileId: Scalars['ProfileId']['input'];
};

export type UnknownFollowModuleInput = {
  address: Scalars['EvmAddress']['input'];
  data: Scalars['BlockchainData']['input'];
};

export type UnknownFollowModuleRedeemInput = {
  address: Scalars['EvmAddress']['input'];
  data: Scalars['BlockchainData']['input'];
};

export type UnknownFollowModuleSettings = {
  __typename?: 'UnknownFollowModuleSettings';
  contract: NetworkAddress;
  /**
   * The data used to setup the module which you can decode with your known ABI
   * @deprecated Use initializeResultData instead
   */
  followModuleReturnData?: Maybe<Scalars['BlockchainData']['output']>;
  /** The data used to setup the module */
  initializeCalldata?: Maybe<Scalars['BlockchainData']['output']>;
  /** The data returned from the init module */
  initializeResultData?: Maybe<Scalars['BlockchainData']['output']>;
  /** True if the module can be signedless and use lens manager without a signature */
  signlessApproved: Scalars['Boolean']['output'];
  /** True if the module can be sponsored through gasless so the user does not need to pay for gas */
  sponsoredApproved: Scalars['Boolean']['output'];
  type: FollowModuleType;
  /** True if the module is deemed as safe */
  verified: Scalars['Boolean']['output'];
};

export type UnknownOpenActionActRedeemInput = {
  address: Scalars['EvmAddress']['input'];
  data: Scalars['BlockchainData']['input'];
};

export type UnknownOpenActionModuleInput = {
  address: Scalars['EvmAddress']['input'];
  data: Scalars['BlockchainData']['input'];
};

export type UnknownOpenActionModuleSettings = {
  __typename?: 'UnknownOpenActionModuleSettings';
  /** The collect nft address - only deployed on first collect and if its a collectable open action */
  collectNft?: Maybe<Scalars['EvmAddress']['output']>;
  contract: NetworkAddress;
  /** The data used to setup the module */
  initializeCalldata?: Maybe<Scalars['BlockchainData']['output']>;
  /** The data returned from the init module */
  initializeResultData?: Maybe<Scalars['BlockchainData']['output']>;
  /**
   * The data returned from the init module
   * @deprecated Use initializeResultData instead
   */
  openActionModuleReturnData?: Maybe<Scalars['BlockchainData']['output']>;
  /** True if the module can be signedless and use lens manager without a signature */
  signlessApproved: Scalars['Boolean']['output'];
  /** True if the module can be sponsored through gasless so the user does not need to pay for gas */
  sponsoredApproved: Scalars['Boolean']['output'];
  type: OpenActionModuleType;
  /** True if the module is deemed as safe */
  verified: Scalars['Boolean']['output'];
};

export type UnknownOpenActionResult = {
  __typename?: 'UnknownOpenActionResult';
  address: Scalars['EvmAddress']['output'];
  category?: Maybe<OpenActionCategoryType>;
  initReturnData?: Maybe<Scalars['BlockchainData']['output']>;
};

export type UnknownReferenceModuleInput = {
  address: Scalars['EvmAddress']['input'];
  data: Scalars['BlockchainData']['input'];
};

export type UnknownReferenceModuleSettings = {
  __typename?: 'UnknownReferenceModuleSettings';
  contract: NetworkAddress;
  /** The data used to setup the module */
  initializeCalldata?: Maybe<Scalars['BlockchainData']['output']>;
  /** The data returned from the init module */
  initializeResultData?: Maybe<Scalars['BlockchainData']['output']>;
  /**
   * The data used to setup the module which you can decode with your known ABI
   * @deprecated Use initializeResultData instead
   */
  referenceModuleReturnData?: Maybe<Scalars['BlockchainData']['output']>;
  /** True if the module can be signedless and use lens manager without a signature */
  signlessApproved: Scalars['Boolean']['output'];
  /** True if the module can be sponsored through gasless so the user does not need to pay for gas */
  sponsoredApproved: Scalars['Boolean']['output'];
  type: ReferenceModuleType;
  /** True if the module is deemed as safe */
  verified: Scalars['Boolean']['output'];
};

export type UnknownSupportedModule = {
  __typename?: 'UnknownSupportedModule';
  contract: NetworkAddress;
  moduleName: Scalars['String']['output'];
};

export type UnlinkHandleFromProfileRequest = {
  /** The full handle - namespace/localname */
  handle: Scalars['Handle']['input'];
};

export type UserCurrentRateLimit = {
  __typename?: 'UserCurrentRateLimit';
  dayAllowance: Scalars['Int']['output'];
  dayAllowanceLeft: Scalars['Int']['output'];
  dayAllowanceUsed: Scalars['Int']['output'];
  hourAllowance: Scalars['Int']['output'];
  hourAllowanceLeft: Scalars['Int']['output'];
  hourAllowanceUsed: Scalars['Int']['output'];
};

export type UserCurrentRateLimitRequest = {
  profileId?: InputMaybe<Scalars['ProfileId']['input']>;
  userAddress: Scalars['EvmAddress']['input'];
};

export type UserCurrentRateLimitResult = {
  __typename?: 'UserCurrentRateLimitResult';
  momoka: UserCurrentRateLimit;
  onchain: UserCurrentRateLimit;
};

export type UserPoapsQueryRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  for: Scalars['ProfileId']['input'];
  limit?: InputMaybe<LimitType>;
};

export type UserSigNonces = {
  __typename?: 'UserSigNonces';
  lensHubOnchainSigNonce: Scalars['Nonce']['output'];
  lensPublicActProxyOnchainSigNonce: Scalars['Nonce']['output'];
  lensTokenHandleRegistryOnchainSigNonce: Scalars['Nonce']['output'];
};

export type ValidatePublicationMetadataRequest = {
  json?: InputMaybe<Scalars['String']['input']>;
  rawURI?: InputMaybe<Scalars['URI']['input']>;
};

export type VerifyRequest = {
  /** The access token to verify */
  accessToken?: InputMaybe<Scalars['Jwt']['input']>;
  /** The identity token to verify */
  identityToken?: InputMaybe<Scalars['Jwt']['input']>;
};

export type Video = {
  __typename?: 'Video';
  mimeType?: Maybe<Scalars['MimeType']['output']>;
  uri: Scalars['URI']['output'];
};

export type VideoMetadataV3 = {
  __typename?: 'VideoMetadataV3';
  appId?: Maybe<Scalars['AppId']['output']>;
  asset: PublicationMetadataMediaVideo;
  attachments?: Maybe<Array<PublicationMetadataMedia>>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  /** Optional content. Empty if not set. */
  content: Scalars['EncryptableMarkdown']['output'];
  contentWarning?: Maybe<PublicationContentWarningType>;
  encryptedWith?: Maybe<PublicationMetadataEncryptionStrategy>;
  hideFromFeed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  isShortVideo: Scalars['Boolean']['output'];
  locale: Scalars['Locale']['output'];
  marketplace?: Maybe<MarketplaceMetadata>;
  rawURI: Scalars['URI']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** The title of the video. Empty if not set. */
  title: Scalars['String']['output'];
};

export type WalletAuthenticationToProfileAuthenticationRequest = {
  /** This can convert a wallet token to a profile token if you now onboarded */
  profileId: Scalars['ProfileId']['input'];
};

export type WhoActedOnPublicationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
  on: Scalars['PublicationId']['input'];
  /** The order by which to sort the profiles */
  orderBy?: InputMaybe<ProfilesOrderBy>;
  where?: InputMaybe<WhoActedOnPublicationWhere>;
};

export type WhoActedOnPublicationWhere = {
  anyOf: Array<OpenActionFilter>;
};

export type WhoHaveBlockedRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<LimitType>;
};

export type WhoReactedPublicationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  for: Scalars['PublicationId']['input'];
  limit?: InputMaybe<LimitType>;
  /** The order by which to sort the profiles */
  orderBy?: InputMaybe<ProfilesOrderBy>;
  where?: InputMaybe<WhoReactedPublicationWhere>;
};

export type WhoReactedPublicationWhere = {
  anyOf?: InputMaybe<Array<PublicationReactionType>>;
};

export type WorldcoinIdentity = {
  __typename?: 'WorldcoinIdentity';
  /** If the profile has verified as a user */
  isHuman: Scalars['Boolean']['output'];
};

export enum WorldcoinPhoneVerifyType {
  Orb = 'ORB',
  Phone = 'PHONE'
}

export type WorldcoinPhoneVerifyWebhookRequest = {
  nullifierHash: Scalars['String']['input'];
  signal: Scalars['EvmAddress']['input'];
  signalType: WorldcoinPhoneVerifyType;
};

export type AmountFieldsFragment = {
  __typename?: 'Amount';
  value: string;
  asFiat?: { __typename?: 'FiatAmount'; value: string } | null;
  asset: { __typename?: 'Erc20' } & Erc20FieldsFragment;
};

type AnyPublicationMetadataFields_ArticleMetadataV3_Fragment = {
  __typename?: 'ArticleMetadataV3';
} & ArticleMetadataV3FieldsFragment;

type AnyPublicationMetadataFields_AudioMetadataV3_Fragment = {
  __typename?: 'AudioMetadataV3';
} & AudioMetadataV3FieldsFragment;

type AnyPublicationMetadataFields_CheckingInMetadataV3_Fragment = {
  __typename?: 'CheckingInMetadataV3';
};

type AnyPublicationMetadataFields_EmbedMetadataV3_Fragment = {
  __typename?: 'EmbedMetadataV3';
};

type AnyPublicationMetadataFields_EventMetadataV3_Fragment = {
  __typename?: 'EventMetadataV3';
};

type AnyPublicationMetadataFields_ImageMetadataV3_Fragment = {
  __typename?: 'ImageMetadataV3';
} & ImageMetadataV3FieldsFragment;

type AnyPublicationMetadataFields_LinkMetadataV3_Fragment = {
  __typename?: 'LinkMetadataV3';
} & LinkMetadataV3FieldsFragment;

type AnyPublicationMetadataFields_LiveStreamMetadataV3_Fragment = {
  __typename?: 'LiveStreamMetadataV3';
} & LiveStreamMetadataV3FieldsFragment;

type AnyPublicationMetadataFields_MintMetadataV3_Fragment = {
  __typename?: 'MintMetadataV3';
} & MintMetadataV3FieldsFragment;

type AnyPublicationMetadataFields_SpaceMetadataV3_Fragment = {
  __typename?: 'SpaceMetadataV3';
};

type AnyPublicationMetadataFields_StoryMetadataV3_Fragment = {
  __typename?: 'StoryMetadataV3';
};

type AnyPublicationMetadataFields_TextOnlyMetadataV3_Fragment = {
  __typename?: 'TextOnlyMetadataV3';
} & TextOnlyMetadataV3FieldsFragment;

type AnyPublicationMetadataFields_ThreeDMetadataV3_Fragment = {
  __typename?: 'ThreeDMetadataV3';
};

type AnyPublicationMetadataFields_TransactionMetadataV3_Fragment = {
  __typename?: 'TransactionMetadataV3';
};

type AnyPublicationMetadataFields_VideoMetadataV3_Fragment = {
  __typename?: 'VideoMetadataV3';
} & VideoMetadataV3FieldsFragment;

export type AnyPublicationMetadataFieldsFragment =
  | AnyPublicationMetadataFields_ArticleMetadataV3_Fragment
  | AnyPublicationMetadataFields_AudioMetadataV3_Fragment
  | AnyPublicationMetadataFields_CheckingInMetadataV3_Fragment
  | AnyPublicationMetadataFields_EmbedMetadataV3_Fragment
  | AnyPublicationMetadataFields_EventMetadataV3_Fragment
  | AnyPublicationMetadataFields_ImageMetadataV3_Fragment
  | AnyPublicationMetadataFields_LinkMetadataV3_Fragment
  | AnyPublicationMetadataFields_LiveStreamMetadataV3_Fragment
  | AnyPublicationMetadataFields_MintMetadataV3_Fragment
  | AnyPublicationMetadataFields_SpaceMetadataV3_Fragment
  | AnyPublicationMetadataFields_StoryMetadataV3_Fragment
  | AnyPublicationMetadataFields_TextOnlyMetadataV3_Fragment
  | AnyPublicationMetadataFields_ThreeDMetadataV3_Fragment
  | AnyPublicationMetadataFields_TransactionMetadataV3_Fragment
  | AnyPublicationMetadataFields_VideoMetadataV3_Fragment;

export type CommentBaseFieldsFragment = {
  __typename?: 'Comment';
  id: any;
  isHidden: boolean;
  isEncrypted: boolean;
  createdAt: any;
  publishedOn?: { __typename?: 'App'; id: any } | null;
  momoka?: { __typename?: 'MomokaInfo'; proof: any } | null;
  by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
  stats: { __typename?: 'PublicationStats' } & PublicationStatsFieldsFragment;
  operations: {
    __typename?: 'PublicationOperations';
  } & PublicationOperationFieldsFragment;
  metadata:
    | ({
        __typename?: 'ArticleMetadataV3';
      } & AnyPublicationMetadataFields_ArticleMetadataV3_Fragment)
    | ({
        __typename?: 'AudioMetadataV3';
      } & AnyPublicationMetadataFields_AudioMetadataV3_Fragment)
    | ({
        __typename?: 'CheckingInMetadataV3';
      } & AnyPublicationMetadataFields_CheckingInMetadataV3_Fragment)
    | ({
        __typename?: 'EmbedMetadataV3';
      } & AnyPublicationMetadataFields_EmbedMetadataV3_Fragment)
    | ({
        __typename?: 'EventMetadataV3';
      } & AnyPublicationMetadataFields_EventMetadataV3_Fragment)
    | ({
        __typename?: 'ImageMetadataV3';
      } & AnyPublicationMetadataFields_ImageMetadataV3_Fragment)
    | ({
        __typename?: 'LinkMetadataV3';
      } & AnyPublicationMetadataFields_LinkMetadataV3_Fragment)
    | ({
        __typename?: 'LiveStreamMetadataV3';
      } & AnyPublicationMetadataFields_LiveStreamMetadataV3_Fragment)
    | ({
        __typename?: 'MintMetadataV3';
      } & AnyPublicationMetadataFields_MintMetadataV3_Fragment)
    | ({
        __typename?: 'SpaceMetadataV3';
      } & AnyPublicationMetadataFields_SpaceMetadataV3_Fragment)
    | ({
        __typename?: 'StoryMetadataV3';
      } & AnyPublicationMetadataFields_StoryMetadataV3_Fragment)
    | ({
        __typename?: 'TextOnlyMetadataV3';
      } & AnyPublicationMetadataFields_TextOnlyMetadataV3_Fragment)
    | ({
        __typename?: 'ThreeDMetadataV3';
      } & AnyPublicationMetadataFields_ThreeDMetadataV3_Fragment)
    | ({
        __typename?: 'TransactionMetadataV3';
      } & AnyPublicationMetadataFields_TransactionMetadataV3_Fragment)
    | ({
        __typename?: 'VideoMetadataV3';
      } & AnyPublicationMetadataFields_VideoMetadataV3_Fragment);
  openActionModules: Array<
    | ({
        __typename?: 'LegacyAaveFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyAaveFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyERC4626FeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyErc4626FeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyFreeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyFreeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyLimitedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyLimitedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyLimitedTimedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyLimitedTimedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyMultirecipientFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyMultirecipientFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyRevertCollectModuleSettings';
      } & OpenActionModulesFields_LegacyRevertCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacySimpleCollectModuleSettings';
      } & OpenActionModulesFields_LegacySimpleCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyTimedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyTimedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'MultirecipientFeeCollectOpenActionSettings';
      } & OpenActionModulesFields_MultirecipientFeeCollectOpenActionSettings_Fragment)
    | ({
        __typename?: 'SimpleCollectOpenActionSettings';
      } & OpenActionModulesFields_SimpleCollectOpenActionSettings_Fragment)
    | ({
        __typename?: 'UnknownOpenActionModuleSettings';
      } & OpenActionModulesFields_UnknownOpenActionModuleSettings_Fragment)
  >;
  root:
    | ({ __typename?: 'Post' } & PostFieldsFragment)
    | ({ __typename?: 'Quote' } & QuoteBaseFieldsFragment);
  profilesMentioned: Array<{
    __typename?: 'ProfileMentioned';
    snapshotHandleMentioned: {
      __typename?: 'HandleInfo';
    } & HandleInfoFieldsFragment;
  }>;
};

export type CommentFieldsFragment = {
  __typename?: 'Comment';
  commentOn:
    | ({ __typename?: 'Comment' } & CommentBaseFieldsFragment)
    | ({ __typename?: 'Post' } & PostFieldsFragment)
    | ({ __typename?: 'Quote' } & QuoteBaseFieldsFragment);
} & CommentBaseFieldsFragment;

export type EncryptableImageSetFieldsFragment = {
  __typename?: 'EncryptableImageSet';
  optimized?: { __typename?: 'Image'; uri: any } | null;
};

export type Erc20FieldsFragment = {
  __typename?: 'Erc20';
  name: string;
  symbol: string;
  decimals: number;
  contract: { __typename?: 'NetworkAddress' } & NetworkAddressFieldsFragment;
};

type FollowModuleFields_FeeFollowModuleSettings_Fragment = {
  __typename?: 'FeeFollowModuleSettings';
  type: FollowModuleType;
  recipient: any;
  amount: { __typename?: 'Amount' } & AmountFieldsFragment;
};

type FollowModuleFields_RevertFollowModuleSettings_Fragment = {
  __typename?: 'RevertFollowModuleSettings';
  type: FollowModuleType;
};

type FollowModuleFields_UnknownFollowModuleSettings_Fragment = {
  __typename?: 'UnknownFollowModuleSettings';
  type: FollowModuleType;
};

export type FollowModuleFieldsFragment =
  | FollowModuleFields_FeeFollowModuleSettings_Fragment
  | FollowModuleFields_RevertFollowModuleSettings_Fragment
  | FollowModuleFields_UnknownFollowModuleSettings_Fragment;

export type HandleInfoFieldsFragment = {
  __typename?: 'HandleInfo';
  fullHandle: any;
  localName: string;
  linkedTo?: { __typename?: 'HandleLinkedTo'; nftTokenId: any } | null;
};

export type ImageSetFieldsFragment = {
  __typename?: 'ImageSet';
  optimized?: { __typename?: 'Image'; uri: any } | null;
  raw: { __typename?: 'Image'; uri: any };
};

export type ListProfileFieldsFragment = {
  __typename?: 'Profile';
  id: any;
  peerToPeerRecommendedByMe: boolean;
  handle?: ({ __typename?: 'HandleInfo' } & HandleInfoFieldsFragment) | null;
  ownedBy: { __typename?: 'NetworkAddress' } & NetworkAddressFieldsFragment;
  operations: {
    __typename?: 'ProfileOperations';
  } & ProfileOperationsFieldsFragment;
  metadata?:
    | ({ __typename?: 'ProfileMetadata' } & ProfileMetadataFieldsFragment)
    | null;
  followModule?:
    | ({
        __typename?: 'FeeFollowModuleSettings';
      } & FollowModuleFields_FeeFollowModuleSettings_Fragment)
    | ({
        __typename?: 'RevertFollowModuleSettings';
      } & FollowModuleFields_RevertFollowModuleSettings_Fragment)
    | ({
        __typename?: 'UnknownFollowModuleSettings';
      } & FollowModuleFields_UnknownFollowModuleSettings_Fragment)
    | null;
};

export type MetadataAttributeFieldsFragment = {
  __typename?: 'MetadataAttribute';
  type: MetadataAttributeType;
  key: string;
  value: string;
};

export type MirrorFieldsFragment = {
  __typename?: 'Mirror';
  id: any;
  isHidden: boolean;
  createdAt: any;
  publishedOn?: { __typename?: 'App'; id: any } | null;
  momoka?: { __typename?: 'MomokaInfo'; proof: any } | null;
  by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
  mirrorOn:
    | ({ __typename?: 'Comment' } & CommentFieldsFragment)
    | ({ __typename?: 'Post' } & PostFieldsFragment)
    | ({ __typename?: 'Quote' } & QuoteFieldsFragment);
};

export type NetworkAddressFieldsFragment = {
  __typename?: 'NetworkAddress';
  address: any;
  chainId: any;
};

type OpenActionModulesFields_LegacyAaveFeeCollectModuleSettings_Fragment = {
  __typename?: 'LegacyAaveFeeCollectModuleSettings';
};

type OpenActionModulesFields_LegacyErc4626FeeCollectModuleSettings_Fragment = {
  __typename?: 'LegacyERC4626FeeCollectModuleSettings';
};

type OpenActionModulesFields_LegacyFeeCollectModuleSettings_Fragment = {
  __typename?: 'LegacyFeeCollectModuleSettings';
};

type OpenActionModulesFields_LegacyFreeCollectModuleSettings_Fragment = {
  __typename?: 'LegacyFreeCollectModuleSettings';
};

type OpenActionModulesFields_LegacyLimitedFeeCollectModuleSettings_Fragment = {
  __typename?: 'LegacyLimitedFeeCollectModuleSettings';
};

type OpenActionModulesFields_LegacyLimitedTimedFeeCollectModuleSettings_Fragment =
  { __typename?: 'LegacyLimitedTimedFeeCollectModuleSettings' };

type OpenActionModulesFields_LegacyMultirecipientFeeCollectModuleSettings_Fragment =
  { __typename?: 'LegacyMultirecipientFeeCollectModuleSettings' };

type OpenActionModulesFields_LegacyRevertCollectModuleSettings_Fragment = {
  __typename?: 'LegacyRevertCollectModuleSettings';
};

type OpenActionModulesFields_LegacySimpleCollectModuleSettings_Fragment = {
  __typename?: 'LegacySimpleCollectModuleSettings';
};

type OpenActionModulesFields_LegacyTimedFeeCollectModuleSettings_Fragment = {
  __typename?: 'LegacyTimedFeeCollectModuleSettings';
};

type OpenActionModulesFields_MultirecipientFeeCollectOpenActionSettings_Fragment =
  {
    __typename?: 'MultirecipientFeeCollectOpenActionSettings';
    type: OpenActionModuleType;
    collectNft?: any | null;
    collectLimit?: string | null;
    referralFee: number;
    followerOnly: boolean;
    endsAt?: any | null;
    contract: { __typename?: 'NetworkAddress' } & NetworkAddressFieldsFragment;
    amount: { __typename?: 'Amount' } & AmountFieldsFragment;
    recipients: Array<{
      __typename?: 'RecipientDataOutput';
      recipient: any;
      split: number;
    }>;
  };

type OpenActionModulesFields_SimpleCollectOpenActionSettings_Fragment = {
  __typename?: 'SimpleCollectOpenActionSettings';
  type: OpenActionModuleType;
  collectNft?: any | null;
  collectLimit?: string | null;
  followerOnly: boolean;
  recipient: any;
  referralFee: number;
  endsAt?: any | null;
  contract: { __typename?: 'NetworkAddress' } & NetworkAddressFieldsFragment;
  amount: { __typename?: 'Amount' } & AmountFieldsFragment;
};

type OpenActionModulesFields_UnknownOpenActionModuleSettings_Fragment = {
  __typename?: 'UnknownOpenActionModuleSettings';
  type: OpenActionModuleType;
  initializeResultData?: any | null;
  initializeCalldata?: any | null;
  openActionModuleReturnData?: any | null;
  contract: { __typename?: 'NetworkAddress' } & NetworkAddressFieldsFragment;
};

export type OpenActionModulesFieldsFragment =
  | OpenActionModulesFields_LegacyAaveFeeCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacyErc4626FeeCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacyFeeCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacyFreeCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacyLimitedFeeCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacyLimitedTimedFeeCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacyMultirecipientFeeCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacyRevertCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacySimpleCollectModuleSettings_Fragment
  | OpenActionModulesFields_LegacyTimedFeeCollectModuleSettings_Fragment
  | OpenActionModulesFields_MultirecipientFeeCollectOpenActionSettings_Fragment
  | OpenActionModulesFields_SimpleCollectOpenActionSettings_Fragment
  | OpenActionModulesFields_UnknownOpenActionModuleSettings_Fragment;

export type PostFieldsFragment = {
  __typename?: 'Post';
  id: any;
  isHidden: boolean;
  isEncrypted: boolean;
  createdAt: any;
  publishedOn?: { __typename?: 'App'; id: any } | null;
  momoka?: { __typename?: 'MomokaInfo'; proof: any } | null;
  by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
  stats: { __typename?: 'PublicationStats' } & PublicationStatsFieldsFragment;
  operations: {
    __typename?: 'PublicationOperations';
  } & PublicationOperationFieldsFragment;
  metadata:
    | ({
        __typename?: 'ArticleMetadataV3';
      } & AnyPublicationMetadataFields_ArticleMetadataV3_Fragment)
    | ({
        __typename?: 'AudioMetadataV3';
      } & AnyPublicationMetadataFields_AudioMetadataV3_Fragment)
    | ({
        __typename?: 'CheckingInMetadataV3';
      } & AnyPublicationMetadataFields_CheckingInMetadataV3_Fragment)
    | ({
        __typename?: 'EmbedMetadataV3';
      } & AnyPublicationMetadataFields_EmbedMetadataV3_Fragment)
    | ({
        __typename?: 'EventMetadataV3';
      } & AnyPublicationMetadataFields_EventMetadataV3_Fragment)
    | ({
        __typename?: 'ImageMetadataV3';
      } & AnyPublicationMetadataFields_ImageMetadataV3_Fragment)
    | ({
        __typename?: 'LinkMetadataV3';
      } & AnyPublicationMetadataFields_LinkMetadataV3_Fragment)
    | ({
        __typename?: 'LiveStreamMetadataV3';
      } & AnyPublicationMetadataFields_LiveStreamMetadataV3_Fragment)
    | ({
        __typename?: 'MintMetadataV3';
      } & AnyPublicationMetadataFields_MintMetadataV3_Fragment)
    | ({
        __typename?: 'SpaceMetadataV3';
      } & AnyPublicationMetadataFields_SpaceMetadataV3_Fragment)
    | ({
        __typename?: 'StoryMetadataV3';
      } & AnyPublicationMetadataFields_StoryMetadataV3_Fragment)
    | ({
        __typename?: 'TextOnlyMetadataV3';
      } & AnyPublicationMetadataFields_TextOnlyMetadataV3_Fragment)
    | ({
        __typename?: 'ThreeDMetadataV3';
      } & AnyPublicationMetadataFields_ThreeDMetadataV3_Fragment)
    | ({
        __typename?: 'TransactionMetadataV3';
      } & AnyPublicationMetadataFields_TransactionMetadataV3_Fragment)
    | ({
        __typename?: 'VideoMetadataV3';
      } & AnyPublicationMetadataFields_VideoMetadataV3_Fragment);
  openActionModules: Array<
    | ({
        __typename?: 'LegacyAaveFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyAaveFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyERC4626FeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyErc4626FeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyFreeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyFreeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyLimitedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyLimitedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyLimitedTimedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyLimitedTimedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyMultirecipientFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyMultirecipientFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyRevertCollectModuleSettings';
      } & OpenActionModulesFields_LegacyRevertCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacySimpleCollectModuleSettings';
      } & OpenActionModulesFields_LegacySimpleCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyTimedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyTimedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'MultirecipientFeeCollectOpenActionSettings';
      } & OpenActionModulesFields_MultirecipientFeeCollectOpenActionSettings_Fragment)
    | ({
        __typename?: 'SimpleCollectOpenActionSettings';
      } & OpenActionModulesFields_SimpleCollectOpenActionSettings_Fragment)
    | ({
        __typename?: 'UnknownOpenActionModuleSettings';
      } & OpenActionModulesFields_UnknownOpenActionModuleSettings_Fragment)
  >;
  profilesMentioned: Array<{
    __typename?: 'ProfileMentioned';
    snapshotHandleMentioned: {
      __typename?: 'HandleInfo';
    } & HandleInfoFieldsFragment;
  }>;
};

export type ProfileFieldsFragment = {
  __typename?: 'Profile';
  id: any;
  signless: boolean;
  sponsor: boolean;
  createdAt: any;
  interests: Array<string>;
  peerToPeerRecommendedByMe: boolean;
  handle?: ({ __typename?: 'HandleInfo' } & HandleInfoFieldsFragment) | null;
  ownedBy: { __typename?: 'NetworkAddress' } & NetworkAddressFieldsFragment;
  stats: { __typename?: 'ProfileStats' } & ProfileStatsFieldsFragment;
  operations: {
    __typename?: 'ProfileOperations';
  } & ProfileOperationsFieldsFragment;
  followNftAddress?:
    | ({ __typename?: 'NetworkAddress' } & NetworkAddressFieldsFragment)
    | null;
  followModule?:
    | ({
        __typename?: 'FeeFollowModuleSettings';
      } & FollowModuleFields_FeeFollowModuleSettings_Fragment)
    | ({
        __typename?: 'RevertFollowModuleSettings';
      } & FollowModuleFields_RevertFollowModuleSettings_Fragment)
    | ({
        __typename?: 'UnknownFollowModuleSettings';
      } & FollowModuleFields_UnknownFollowModuleSettings_Fragment)
    | null;
  metadata?:
    | ({ __typename?: 'ProfileMetadata' } & ProfileMetadataFieldsFragment)
    | null;
};

export type ProfileMetadataFieldsFragment = {
  __typename?: 'ProfileMetadata';
  displayName?: string | null;
  bio?: any | null;
  picture?:
    | ({ __typename?: 'ImageSet' } & ImageSetFieldsFragment)
    | { __typename?: 'NftImage' }
    | null;
  coverPicture?: ({ __typename?: 'ImageSet' } & ImageSetFieldsFragment) | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
};

export type ProfileOperationsFieldsFragment = {
  __typename?: 'ProfileOperations';
  id: any;
  isBlockedByMe: { __typename?: 'OptimisticStatusResult'; value: boolean };
  isFollowedByMe: { __typename?: 'OptimisticStatusResult'; value: boolean };
  isFollowingMe: { __typename?: 'OptimisticStatusResult'; value: boolean };
};

export type ProfileStatsFieldsFragment = {
  __typename?: 'ProfileStats';
  id: any;
  followers: number;
  following: number;
  publications: number;
  comments: number;
  posts: number;
  mirrors: number;
  quotes: number;
  lensClassifierScore?: number | null;
};

export type PublicationOperationFieldsFragment = {
  __typename?: 'PublicationOperations';
  isNotInterested: boolean;
  hasBookmarked: boolean;
  hasReacted: boolean;
  canMirror: TriStateValue;
  hasMirrored: boolean;
  hasQuoted: boolean;
  hasActed: { __typename?: 'OptimisticStatusResult'; value: boolean };
};

export type PublicationProfileFieldsFragment = {
  __typename?: 'Profile';
  id: any;
  peerToPeerRecommendedByMe: boolean;
  handle?: ({ __typename?: 'HandleInfo' } & HandleInfoFieldsFragment) | null;
  operations: {
    __typename?: 'ProfileOperations';
  } & ProfileOperationsFieldsFragment;
  ownedBy: { __typename?: 'NetworkAddress' } & NetworkAddressFieldsFragment;
  metadata?:
    | ({ __typename?: 'ProfileMetadata' } & ProfileMetadataFieldsFragment)
    | null;
};

export type PublicationStatsFieldsFragment = {
  __typename?: 'PublicationStats';
  id: any;
  comments: number;
  mirrors: number;
  quotes: number;
  reactions: number;
  countOpenActions: number;
  bookmarks: number;
};

export type QuoteBaseFieldsFragment = {
  __typename?: 'Quote';
  id: any;
  isHidden: boolean;
  isEncrypted: boolean;
  createdAt: any;
  publishedOn?: { __typename?: 'App'; id: any } | null;
  momoka?: { __typename?: 'MomokaInfo'; proof: any } | null;
  by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
  stats: { __typename?: 'PublicationStats' } & PublicationStatsFieldsFragment;
  operations: {
    __typename?: 'PublicationOperations';
  } & PublicationOperationFieldsFragment;
  metadata:
    | ({
        __typename?: 'ArticleMetadataV3';
      } & AnyPublicationMetadataFields_ArticleMetadataV3_Fragment)
    | ({
        __typename?: 'AudioMetadataV3';
      } & AnyPublicationMetadataFields_AudioMetadataV3_Fragment)
    | ({
        __typename?: 'CheckingInMetadataV3';
      } & AnyPublicationMetadataFields_CheckingInMetadataV3_Fragment)
    | ({
        __typename?: 'EmbedMetadataV3';
      } & AnyPublicationMetadataFields_EmbedMetadataV3_Fragment)
    | ({
        __typename?: 'EventMetadataV3';
      } & AnyPublicationMetadataFields_EventMetadataV3_Fragment)
    | ({
        __typename?: 'ImageMetadataV3';
      } & AnyPublicationMetadataFields_ImageMetadataV3_Fragment)
    | ({
        __typename?: 'LinkMetadataV3';
      } & AnyPublicationMetadataFields_LinkMetadataV3_Fragment)
    | ({
        __typename?: 'LiveStreamMetadataV3';
      } & AnyPublicationMetadataFields_LiveStreamMetadataV3_Fragment)
    | ({
        __typename?: 'MintMetadataV3';
      } & AnyPublicationMetadataFields_MintMetadataV3_Fragment)
    | ({
        __typename?: 'SpaceMetadataV3';
      } & AnyPublicationMetadataFields_SpaceMetadataV3_Fragment)
    | ({
        __typename?: 'StoryMetadataV3';
      } & AnyPublicationMetadataFields_StoryMetadataV3_Fragment)
    | ({
        __typename?: 'TextOnlyMetadataV3';
      } & AnyPublicationMetadataFields_TextOnlyMetadataV3_Fragment)
    | ({
        __typename?: 'ThreeDMetadataV3';
      } & AnyPublicationMetadataFields_ThreeDMetadataV3_Fragment)
    | ({
        __typename?: 'TransactionMetadataV3';
      } & AnyPublicationMetadataFields_TransactionMetadataV3_Fragment)
    | ({
        __typename?: 'VideoMetadataV3';
      } & AnyPublicationMetadataFields_VideoMetadataV3_Fragment);
  openActionModules: Array<
    | ({
        __typename?: 'LegacyAaveFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyAaveFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyERC4626FeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyErc4626FeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyFreeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyFreeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyLimitedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyLimitedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyLimitedTimedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyLimitedTimedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyMultirecipientFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyMultirecipientFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyRevertCollectModuleSettings';
      } & OpenActionModulesFields_LegacyRevertCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacySimpleCollectModuleSettings';
      } & OpenActionModulesFields_LegacySimpleCollectModuleSettings_Fragment)
    | ({
        __typename?: 'LegacyTimedFeeCollectModuleSettings';
      } & OpenActionModulesFields_LegacyTimedFeeCollectModuleSettings_Fragment)
    | ({
        __typename?: 'MultirecipientFeeCollectOpenActionSettings';
      } & OpenActionModulesFields_MultirecipientFeeCollectOpenActionSettings_Fragment)
    | ({
        __typename?: 'SimpleCollectOpenActionSettings';
      } & OpenActionModulesFields_SimpleCollectOpenActionSettings_Fragment)
    | ({
        __typename?: 'UnknownOpenActionModuleSettings';
      } & OpenActionModulesFields_UnknownOpenActionModuleSettings_Fragment)
  >;
  profilesMentioned: Array<{
    __typename?: 'ProfileMentioned';
    snapshotHandleMentioned: {
      __typename?: 'HandleInfo';
    } & HandleInfoFieldsFragment;
  }>;
};

export type QuoteFieldsFragment = {
  __typename?: 'Quote';
  quoteOn:
    | ({ __typename?: 'Comment' } & CommentBaseFieldsFragment)
    | ({ __typename?: 'Post' } & PostFieldsFragment)
    | ({ __typename?: 'Quote' } & QuoteBaseFieldsFragment);
} & QuoteBaseFieldsFragment;

export type ActedNotificationFieldsFragment = {
  __typename?: 'ActedNotification';
  id: any;
  actions: Array<{
    __typename?: 'OpenActionProfileActed';
    actedAt: any;
    by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
  }>;
  publication:
    | ({ __typename?: 'Comment' } & NotificationCommentFieldsFragment)
    | {
        __typename?: 'Mirror';
        mirrorOn:
          | ({ __typename?: 'Comment' } & NotificationCommentFieldsFragment)
          | ({ __typename?: 'Post' } & NotificationPostFieldsFragment)
          | ({ __typename?: 'Quote' } & NotificationQuoteFieldsFragment);
      }
    | ({ __typename?: 'Post' } & NotificationPostFieldsFragment)
    | ({ __typename?: 'Quote' } & NotificationQuoteFieldsFragment);
};

export type CommentNotificationFieldsFragment = {
  __typename?: 'CommentNotification';
  id: any;
  comment: {
    __typename?: 'Comment';
    by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
    commentOn:
      | { __typename: 'Comment' }
      | { __typename: 'Post' }
      | { __typename: 'Quote' };
  } & NotificationCommentFieldsFragment;
};

export type FollowNotificationFieldsFragment = {
  __typename?: 'FollowNotification';
  id: any;
  followers: Array<
    { __typename?: 'Profile' } & PublicationProfileFieldsFragment
  >;
};

export type MentionNotificationFieldsFragment = {
  __typename?: 'MentionNotification';
  id: any;
  publication:
    | ({
        __typename?: 'Comment';
        by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
      } & NotificationCommentFieldsFragment)
    | ({
        __typename?: 'Post';
        by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
      } & NotificationPostFieldsFragment)
    | ({
        __typename?: 'Quote';
        by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
      } & NotificationQuoteFieldsFragment);
};

export type MirrorNotificationFieldsFragment = {
  __typename?: 'MirrorNotification';
  id: any;
  mirrors: Array<{
    __typename?: 'ProfileMirrorResult';
    profile: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
  }>;
  publication:
    | ({ __typename?: 'Comment' } & NotificationCommentFieldsFragment)
    | ({ __typename?: 'Post' } & NotificationPostFieldsFragment)
    | ({ __typename?: 'Quote' } & NotificationQuoteFieldsFragment);
};

type NotificationFields_ActedNotification_Fragment = {
  __typename?: 'ActedNotification';
} & ActedNotificationFieldsFragment;

type NotificationFields_CommentNotification_Fragment = {
  __typename?: 'CommentNotification';
} & CommentNotificationFieldsFragment;

type NotificationFields_FollowNotification_Fragment = {
  __typename?: 'FollowNotification';
} & FollowNotificationFieldsFragment;

type NotificationFields_MentionNotification_Fragment = {
  __typename?: 'MentionNotification';
} & MentionNotificationFieldsFragment;

type NotificationFields_MirrorNotification_Fragment = {
  __typename?: 'MirrorNotification';
} & MirrorNotificationFieldsFragment;

type NotificationFields_QuoteNotification_Fragment = {
  __typename?: 'QuoteNotification';
} & QuoteNotificationFieldsFragment;

type NotificationFields_ReactionNotification_Fragment = {
  __typename?: 'ReactionNotification';
} & ReactionNotificationFieldsFragment;

export type NotificationFieldsFragment =
  | NotificationFields_ActedNotification_Fragment
  | NotificationFields_CommentNotification_Fragment
  | NotificationFields_FollowNotification_Fragment
  | NotificationFields_MentionNotification_Fragment
  | NotificationFields_MirrorNotification_Fragment
  | NotificationFields_QuoteNotification_Fragment
  | NotificationFields_ReactionNotification_Fragment;

export type QuoteNotificationFieldsFragment = {
  __typename?: 'QuoteNotification';
  id: any;
  quote: {
    __typename?: 'Quote';
    by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
    quoteOn:
      | { __typename: 'Comment' }
      | { __typename: 'Post' }
      | { __typename: 'Quote' };
  } & NotificationQuoteFieldsFragment;
};

export type ReactionNotificationFieldsFragment = {
  __typename?: 'ReactionNotification';
  id: any;
  publication:
    | ({ __typename?: 'Comment' } & NotificationCommentFieldsFragment)
    | ({ __typename?: 'Post' } & NotificationPostFieldsFragment)
    | ({ __typename?: 'Quote' } & NotificationQuoteFieldsFragment);
  reactions: Array<{
    __typename?: 'ProfileReactedResult';
    profile: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
  }>;
};

export type NotificationCommentFieldsFragment = {
  __typename?: 'Comment';
  id: any;
  metadata:
    | ({
        __typename?: 'ArticleMetadataV3';
      } & AnyPublicationMetadataFields_ArticleMetadataV3_Fragment)
    | ({
        __typename?: 'AudioMetadataV3';
      } & AnyPublicationMetadataFields_AudioMetadataV3_Fragment)
    | ({
        __typename?: 'CheckingInMetadataV3';
      } & AnyPublicationMetadataFields_CheckingInMetadataV3_Fragment)
    | ({
        __typename?: 'EmbedMetadataV3';
      } & AnyPublicationMetadataFields_EmbedMetadataV3_Fragment)
    | ({
        __typename?: 'EventMetadataV3';
      } & AnyPublicationMetadataFields_EventMetadataV3_Fragment)
    | ({
        __typename?: 'ImageMetadataV3';
      } & AnyPublicationMetadataFields_ImageMetadataV3_Fragment)
    | ({
        __typename?: 'LinkMetadataV3';
      } & AnyPublicationMetadataFields_LinkMetadataV3_Fragment)
    | ({
        __typename?: 'LiveStreamMetadataV3';
      } & AnyPublicationMetadataFields_LiveStreamMetadataV3_Fragment)
    | ({
        __typename?: 'MintMetadataV3';
      } & AnyPublicationMetadataFields_MintMetadataV3_Fragment)
    | ({
        __typename?: 'SpaceMetadataV3';
      } & AnyPublicationMetadataFields_SpaceMetadataV3_Fragment)
    | ({
        __typename?: 'StoryMetadataV3';
      } & AnyPublicationMetadataFields_StoryMetadataV3_Fragment)
    | ({
        __typename?: 'TextOnlyMetadataV3';
      } & AnyPublicationMetadataFields_TextOnlyMetadataV3_Fragment)
    | ({
        __typename?: 'ThreeDMetadataV3';
      } & AnyPublicationMetadataFields_ThreeDMetadataV3_Fragment)
    | ({
        __typename?: 'TransactionMetadataV3';
      } & AnyPublicationMetadataFields_TransactionMetadataV3_Fragment)
    | ({
        __typename?: 'VideoMetadataV3';
      } & AnyPublicationMetadataFields_VideoMetadataV3_Fragment);
  profilesMentioned: Array<{
    __typename?: 'ProfileMentioned';
    snapshotHandleMentioned: {
      __typename?: 'HandleInfo';
    } & HandleInfoFieldsFragment;
  }>;
};

export type NotificationPostFieldsFragment = {
  __typename?: 'Post';
  id: any;
  metadata:
    | ({
        __typename?: 'ArticleMetadataV3';
      } & AnyPublicationMetadataFields_ArticleMetadataV3_Fragment)
    | ({
        __typename?: 'AudioMetadataV3';
      } & AnyPublicationMetadataFields_AudioMetadataV3_Fragment)
    | ({
        __typename?: 'CheckingInMetadataV3';
      } & AnyPublicationMetadataFields_CheckingInMetadataV3_Fragment)
    | ({
        __typename?: 'EmbedMetadataV3';
      } & AnyPublicationMetadataFields_EmbedMetadataV3_Fragment)
    | ({
        __typename?: 'EventMetadataV3';
      } & AnyPublicationMetadataFields_EventMetadataV3_Fragment)
    | ({
        __typename?: 'ImageMetadataV3';
      } & AnyPublicationMetadataFields_ImageMetadataV3_Fragment)
    | ({
        __typename?: 'LinkMetadataV3';
      } & AnyPublicationMetadataFields_LinkMetadataV3_Fragment)
    | ({
        __typename?: 'LiveStreamMetadataV3';
      } & AnyPublicationMetadataFields_LiveStreamMetadataV3_Fragment)
    | ({
        __typename?: 'MintMetadataV3';
      } & AnyPublicationMetadataFields_MintMetadataV3_Fragment)
    | ({
        __typename?: 'SpaceMetadataV3';
      } & AnyPublicationMetadataFields_SpaceMetadataV3_Fragment)
    | ({
        __typename?: 'StoryMetadataV3';
      } & AnyPublicationMetadataFields_StoryMetadataV3_Fragment)
    | ({
        __typename?: 'TextOnlyMetadataV3';
      } & AnyPublicationMetadataFields_TextOnlyMetadataV3_Fragment)
    | ({
        __typename?: 'ThreeDMetadataV3';
      } & AnyPublicationMetadataFields_ThreeDMetadataV3_Fragment)
    | ({
        __typename?: 'TransactionMetadataV3';
      } & AnyPublicationMetadataFields_TransactionMetadataV3_Fragment)
    | ({
        __typename?: 'VideoMetadataV3';
      } & AnyPublicationMetadataFields_VideoMetadataV3_Fragment);
  profilesMentioned: Array<{
    __typename?: 'ProfileMentioned';
    snapshotHandleMentioned: {
      __typename?: 'HandleInfo';
    } & HandleInfoFieldsFragment;
  }>;
};

export type NotificationQuoteFieldsFragment = {
  __typename?: 'Quote';
  id: any;
  metadata:
    | ({
        __typename?: 'ArticleMetadataV3';
      } & AnyPublicationMetadataFields_ArticleMetadataV3_Fragment)
    | ({
        __typename?: 'AudioMetadataV3';
      } & AnyPublicationMetadataFields_AudioMetadataV3_Fragment)
    | ({
        __typename?: 'CheckingInMetadataV3';
      } & AnyPublicationMetadataFields_CheckingInMetadataV3_Fragment)
    | ({
        __typename?: 'EmbedMetadataV3';
      } & AnyPublicationMetadataFields_EmbedMetadataV3_Fragment)
    | ({
        __typename?: 'EventMetadataV3';
      } & AnyPublicationMetadataFields_EventMetadataV3_Fragment)
    | ({
        __typename?: 'ImageMetadataV3';
      } & AnyPublicationMetadataFields_ImageMetadataV3_Fragment)
    | ({
        __typename?: 'LinkMetadataV3';
      } & AnyPublicationMetadataFields_LinkMetadataV3_Fragment)
    | ({
        __typename?: 'LiveStreamMetadataV3';
      } & AnyPublicationMetadataFields_LiveStreamMetadataV3_Fragment)
    | ({
        __typename?: 'MintMetadataV3';
      } & AnyPublicationMetadataFields_MintMetadataV3_Fragment)
    | ({
        __typename?: 'SpaceMetadataV3';
      } & AnyPublicationMetadataFields_SpaceMetadataV3_Fragment)
    | ({
        __typename?: 'StoryMetadataV3';
      } & AnyPublicationMetadataFields_StoryMetadataV3_Fragment)
    | ({
        __typename?: 'TextOnlyMetadataV3';
      } & AnyPublicationMetadataFields_TextOnlyMetadataV3_Fragment)
    | ({
        __typename?: 'ThreeDMetadataV3';
      } & AnyPublicationMetadataFields_ThreeDMetadataV3_Fragment)
    | ({
        __typename?: 'TransactionMetadataV3';
      } & AnyPublicationMetadataFields_TransactionMetadataV3_Fragment)
    | ({
        __typename?: 'VideoMetadataV3';
      } & AnyPublicationMetadataFields_VideoMetadataV3_Fragment);
  profilesMentioned: Array<{
    __typename?: 'ProfileMentioned';
    snapshotHandleMentioned: {
      __typename?: 'HandleInfo';
    } & HandleInfoFieldsFragment;
  }>;
};

export type ArticleMetadataV3FieldsFragment = {
  __typename?: 'ArticleMetadataV3';
  id: string;
  content: any;
  tags?: Array<string> | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
  attachments?: Array<
    | ({
        __typename?: 'PublicationMetadataMediaAudio';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaImage';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaVideo';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment)
  > | null;
};

export type AudioMetadataV3FieldsFragment = {
  __typename?: 'AudioMetadataV3';
  id: string;
  title: string;
  content: any;
  tags?: Array<string> | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
  asset: {
    __typename?: 'PublicationMetadataMediaAudio';
  } & PublicationMetadataMediaAudioFieldsFragment;
  attachments?: Array<
    | ({
        __typename?: 'PublicationMetadataMediaAudio';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaImage';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaVideo';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment)
  > | null;
};

export type ImageMetadataV3FieldsFragment = {
  __typename?: 'ImageMetadataV3';
  id: string;
  content: any;
  tags?: Array<string> | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
  attachments?: Array<
    | ({
        __typename?: 'PublicationMetadataMediaAudio';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaImage';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaVideo';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment)
  > | null;
  asset: {
    __typename?: 'PublicationMetadataMediaImage';
  } & PublicationMetadataMediaImageFieldsFragment;
};

export type LinkMetadataV3FieldsFragment = {
  __typename?: 'LinkMetadataV3';
  id: string;
  content: any;
  sharingLink: any;
  tags?: Array<string> | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
  attachments?: Array<
    | ({
        __typename?: 'PublicationMetadataMediaAudio';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaImage';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaVideo';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment)
  > | null;
};

export type LiveStreamMetadataV3FieldsFragment = {
  __typename?: 'LiveStreamMetadataV3';
  id: string;
  playbackURL: any;
  liveURL: any;
  content: any;
  tags?: Array<string> | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
  attachments?: Array<
    | ({
        __typename?: 'PublicationMetadataMediaAudio';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaImage';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaVideo';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment)
  > | null;
};

export type MintMetadataV3FieldsFragment = {
  __typename?: 'MintMetadataV3';
  id: string;
  content: any;
  tags?: Array<string> | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
  attachments?: Array<
    | ({
        __typename?: 'PublicationMetadataMediaAudio';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaImage';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaVideo';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment)
  > | null;
};

export type TextOnlyMetadataV3FieldsFragment = {
  __typename?: 'TextOnlyMetadataV3';
  id: string;
  content: any;
  tags?: Array<string> | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
};

export type VideoMetadataV3FieldsFragment = {
  __typename?: 'VideoMetadataV3';
  id: string;
  content: any;
  tags?: Array<string> | null;
  attributes?: Array<
    { __typename?: 'MetadataAttribute' } & MetadataAttributeFieldsFragment
  > | null;
  asset: {
    __typename?: 'PublicationMetadataMediaVideo';
  } & PublicationMetadataMediaVideoFieldsFragment;
  attachments?: Array<
    | ({
        __typename?: 'PublicationMetadataMediaAudio';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaImage';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment)
    | ({
        __typename?: 'PublicationMetadataMediaVideo';
      } & PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment)
  > | null;
};

export type PublicationMetadataMediaAudioFieldsFragment = {
  __typename?: 'PublicationMetadataMediaAudio';
  artist?: any | null;
  license?: PublicationMetadataLicenseType | null;
  audio: {
    __typename?: 'EncryptableAudioSet';
    optimized?: { __typename?: 'Audio'; uri: any } | null;
  };
  cover?:
    | ({
        __typename?: 'EncryptableImageSet';
      } & EncryptableImageSetFieldsFragment)
    | null;
};

type PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment = {
  __typename?: 'PublicationMetadataMediaAudio';
} & PublicationMetadataMediaAudioFieldsFragment;

type PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment = {
  __typename?: 'PublicationMetadataMediaImage';
} & PublicationMetadataMediaImageFieldsFragment;

type PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment = {
  __typename?: 'PublicationMetadataMediaVideo';
} & PublicationMetadataMediaVideoFieldsFragment;

export type PublicationMetadataMediaFieldsFragment =
  | PublicationMetadataMediaFields_PublicationMetadataMediaAudio_Fragment
  | PublicationMetadataMediaFields_PublicationMetadataMediaImage_Fragment
  | PublicationMetadataMediaFields_PublicationMetadataMediaVideo_Fragment;

export type PublicationMetadataMediaImageFieldsFragment = {
  __typename?: 'PublicationMetadataMediaImage';
  image: {
    __typename?: 'EncryptableImageSet';
  } & EncryptableImageSetFieldsFragment;
};

export type PublicationMetadataMediaVideoFieldsFragment = {
  __typename?: 'PublicationMetadataMediaVideo';
  license?: PublicationMetadataLicenseType | null;
  video: {
    __typename?: 'EncryptableVideoSet';
    optimized?: { __typename?: 'Video'; uri: any } | null;
  };
  cover?:
    | ({
        __typename?: 'EncryptableImageSet';
      } & EncryptableImageSetFieldsFragment)
    | null;
};

export type AuthenticateMutationVariables = Exact<{
  request: SignedAuthChallenge;
}>;

export type AuthenticateMutation = {
  __typename?: 'Mutation';
  authenticate: {
    __typename?: 'AuthenticationResult';
    accessToken: any;
    refreshToken: any;
    identityToken: any;
  };
};

export type BroadcastOnchainMutationVariables = Exact<{
  request: BroadcastRequest;
}>;

export type BroadcastOnchainMutation = {
  __typename?: 'Mutation';
  broadcastOnchain:
    | { __typename?: 'RelayError'; reason: RelayErrorReasonType }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type BroadcastOnMomokaMutationVariables = Exact<{
  request: BroadcastRequest;
}>;

export type BroadcastOnMomokaMutation = {
  __typename?: 'Mutation';
  broadcastOnMomoka:
    | { __typename?: 'CreateMomokaPublicationResult'; id: any }
    | { __typename?: 'RelayError'; reason: RelayErrorReasonType };
};

export type AddProfileInterestsMutationVariables = Exact<{
  request: ProfileInterestsRequest;
}>;

export type AddProfileInterestsMutation = {
  __typename?: 'Mutation';
  addProfileInterests?: any | null;
};

export type BlockMutationVariables = Exact<{
  request: BlockRequest;
}>;

export type BlockMutation = {
  __typename?: 'Mutation';
  block:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type CreateProfileWithHandleMutationVariables = Exact<{
  request: CreateProfileWithHandleRequest;
}>;

export type CreateProfileWithHandleMutation = {
  __typename?: 'Mutation';
  createProfileWithHandle:
    | {
        __typename?: 'CreateProfileWithHandleErrorResult';
        reason: CreateProfileWithHandleErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type DismissRecommendedProfilesMutationVariables = Exact<{
  request: DismissRecommendedProfilesRequest;
}>;

export type DismissRecommendedProfilesMutation = {
  __typename?: 'Mutation';
  dismissRecommendedProfiles?: any | null;
};

export type FollowMutationVariables = Exact<{
  request: FollowLensManagerRequest;
}>;

export type FollowMutation = {
  __typename?: 'Mutation';
  follow:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type HideManagedProfileMutationVariables = Exact<{
  request: HideManagedProfileRequest;
}>;

export type HideManagedProfileMutation = {
  __typename?: 'Mutation';
  hideManagedProfile?: any | null;
};

export type LinkHandleToProfileMutationVariables = Exact<{
  request: LinkHandleToProfileRequest;
}>;

export type LinkHandleToProfileMutation = {
  __typename?: 'Mutation';
  linkHandleToProfile:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type PeerToPeerRecommendMutationVariables = Exact<{
  request: PeerToPeerRecommendRequest;
}>;

export type PeerToPeerRecommendMutation = {
  __typename?: 'Mutation';
  peerToPeerRecommend?: any | null;
};

export type PeerToPeerUnrecommendMutationVariables = Exact<{
  request: PeerToPeerRecommendRequest;
}>;

export type PeerToPeerUnrecommendMutation = {
  __typename?: 'Mutation';
  peerToPeerUnrecommend?: any | null;
};

export type RemoveProfileInterestsMutationVariables = Exact<{
  request: ProfileInterestsRequest;
}>;

export type RemoveProfileInterestsMutation = {
  __typename?: 'Mutation';
  removeProfileInterests?: any | null;
};

export type ReportProfileMutationVariables = Exact<{
  request: ReportProfileRequest;
}>;

export type ReportProfileMutation = {
  __typename?: 'Mutation';
  reportProfile?: any | null;
};

export type RevokeAuthenticationMutationVariables = Exact<{
  request: RevokeAuthenticationRequest;
}>;

export type RevokeAuthenticationMutation = {
  __typename?: 'Mutation';
  revokeAuthentication?: any | null;
};

export type SetDefaultProfileMutationVariables = Exact<{
  request: SetDefaultProfileRequest;
}>;

export type SetDefaultProfileMutation = {
  __typename?: 'Mutation';
  setDefaultProfile?: any | null;
};

export type SetProfileMetadataMutationVariables = Exact<{
  request: OnchainSetProfileMetadataRequest;
}>;

export type SetProfileMetadataMutation = {
  __typename?: 'Mutation';
  setProfileMetadata:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type UnblockMutationVariables = Exact<{
  request: UnblockRequest;
}>;

export type UnblockMutation = {
  __typename?: 'Mutation';
  unblock:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type UnfollowMutationVariables = Exact<{
  request: UnfollowRequest;
}>;

export type UnfollowMutation = {
  __typename?: 'Mutation';
  unfollow:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type UnhideManagedProfileMutationVariables = Exact<{
  request: UnhideManagedProfileRequest;
}>;

export type UnhideManagedProfileMutation = {
  __typename?: 'Mutation';
  unhideManagedProfile?: any | null;
};

export type UnlinkHandleFromProfileMutationVariables = Exact<{
  request: UnlinkHandleFromProfileRequest;
}>;

export type UnlinkHandleFromProfileMutation = {
  __typename?: 'Mutation';
  unlinkHandleFromProfile:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type CreateBlockProfilesTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: BlockRequest;
}>;

export type CreateBlockProfilesTypedDataMutation = {
  __typename?: 'Mutation';
  createBlockProfilesTypedData: {
    __typename?: 'CreateBlockProfilesBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateBlockProfilesEIP712TypedData';
      value: {
        __typename?: 'CreateBlockProfilesEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        byProfileId: any;
        idsOfProfilesToSetBlockStatus: Array<any>;
        blockStatus: Array<boolean>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      types: {
        __typename?: 'CreateBlockProfilesEIP712TypedDataTypes';
        SetBlockStatus: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
    };
  };
};

export type CreateChangeProfileManagersTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: ChangeProfileManagersRequest;
}>;

export type CreateChangeProfileManagersTypedDataMutation = {
  __typename?: 'Mutation';
  createChangeProfileManagersTypedData: {
    __typename?: 'CreateChangeProfileManagersBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateChangeProfileManagersEIP712TypedData';
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      types: {
        __typename?: 'CreateChangeProfileManagersEIP712TypedDataTypes';
        ChangeDelegatedExecutorsConfig: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      value: {
        __typename?: 'CreateChangeProfileManagersEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        delegatorProfileId: any;
        delegatedExecutors: Array<any>;
        approvals: Array<boolean>;
        configNumber: number;
        switchToGivenConfig: boolean;
      };
    };
  };
};

export type CreateFollowTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: FollowRequest;
}>;

export type CreateFollowTypedDataMutation = {
  __typename?: 'Mutation';
  createFollowTypedData: {
    __typename?: 'CreateFollowBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateFollowEIP712TypedData';
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      types: {
        __typename?: 'CreateFollowEIP712TypedDataTypes';
        Follow: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      value: {
        __typename?: 'CreateFollowEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        followerProfileId: any;
        idsOfProfilesToFollow: Array<any>;
        followTokenIds: Array<any>;
        datas: Array<any>;
      };
    };
  };
};

export type CreateLinkHandleToProfileTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: LinkHandleToProfileRequest;
}>;

export type CreateLinkHandleToProfileTypedDataMutation = {
  __typename?: 'Mutation';
  createLinkHandleToProfileTypedData: {
    __typename?: 'CreateLinkHandleToProfileBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateLinkHandleToProfileEIP712TypedData';
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      types: {
        __typename?: 'CreateLinkHandleToProfileEIP712TypedDataTypes';
        Link: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      value: {
        __typename?: 'CreateLinkHandleToProfileEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        handleId: any;
        profileId: any;
      };
    };
  };
};

export type CreateOnchainSetProfileMetadataTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainSetProfileMetadataRequest;
}>;

export type CreateOnchainSetProfileMetadataTypedDataMutation = {
  __typename?: 'Mutation';
  createOnchainSetProfileMetadataTypedData: {
    __typename?: 'CreateOnchainSetProfileMetadataBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateOnchainSetProfileMetadataEIP712TypedData';
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      types: {
        __typename?: 'CreateOnchainSetProfileMetadataEIP712TypedDataTypes';
        SetProfileMetadataURI: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      value: {
        __typename?: 'CreateOnchainSetProfileMetadataEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        profileId: any;
        metadataURI: any;
      };
    };
  };
};

export type CreateSetFollowModuleTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: SetFollowModuleRequest;
}>;

export type CreateSetFollowModuleTypedDataMutation = {
  __typename?: 'Mutation';
  createSetFollowModuleTypedData: {
    __typename?: 'CreateSetFollowModuleBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateSetFollowModuleEIP712TypedData';
      types: {
        __typename?: 'CreateSetFollowModuleEIP712TypedDataTypes';
        SetFollowModule: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateSetFollowModuleEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        profileId: any;
        followModule: any;
        followModuleInitData: any;
      };
    };
  };
};

export type CreateUnblockProfilesTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: UnblockRequest;
}>;

export type CreateUnblockProfilesTypedDataMutation = {
  __typename?: 'Mutation';
  createUnblockProfilesTypedData: {
    __typename?: 'CreateUnblockProfilesBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateUnblockProfilesEIP712TypedData';
      types: {
        __typename?: 'CreateUnblockProfilesEIP712TypedDataTypes';
        SetBlockStatus: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateUnblockProfilesEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        byProfileId: any;
        idsOfProfilesToSetBlockStatus: Array<any>;
        blockStatus: Array<boolean>;
      };
    };
  };
};

export type CreateUnfollowTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: UnfollowRequest;
}>;

export type CreateUnfollowTypedDataMutation = {
  __typename?: 'Mutation';
  createUnfollowTypedData: {
    __typename?: 'CreateUnfollowBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateUnfollowEIP712TypedData';
      types: {
        __typename?: 'CreateUnfollowEIP712TypedDataTypes';
        Unfollow: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateUnfollowEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        unfollowerProfileId: any;
        idsOfProfilesToUnfollow: Array<any>;
      };
    };
  };
};

export type CreateUnlinkHandleFromProfileTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: UnlinkHandleFromProfileRequest;
}>;

export type CreateUnlinkHandleFromProfileTypedDataMutation = {
  __typename?: 'Mutation';
  createUnlinkHandleFromProfileTypedData: {
    __typename?: 'CreateUnlinkHandleFromProfileBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateUnlinkHandleFromProfileEIP712TypedData';
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      types: {
        __typename?: 'CreateUnlinkHandleFromProfileEIP712TypedDataTypes';
        Unlink: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      value: {
        __typename?: 'CreateUnlinkHandleFromProfileEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        handleId: any;
        profileId: any;
      };
    };
  };
};

export type ActOnOpenActionMutationVariables = Exact<{
  request: ActOnOpenActionLensManagerRequest;
}>;

export type ActOnOpenActionMutation = {
  __typename?: 'Mutation';
  actOnOpenAction:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type AddPublicationBookmarkMutationVariables = Exact<{
  request: PublicationBookmarkRequest;
}>;

export type AddPublicationBookmarkMutation = {
  __typename?: 'Mutation';
  addPublicationBookmark?: any | null;
};

export type AddPublicationNotInterestedMutationVariables = Exact<{
  request: PublicationNotInterestedRequest;
}>;

export type AddPublicationNotInterestedMutation = {
  __typename?: 'Mutation';
  addPublicationNotInterested?: any | null;
};

export type AddReactionMutationVariables = Exact<{
  request: ReactionRequest;
}>;

export type AddReactionMutation = {
  __typename?: 'Mutation';
  addReaction?: any | null;
};

export type HideCommentMutationVariables = Exact<{
  request: HideCommentRequest;
}>;

export type HideCommentMutation = {
  __typename?: 'Mutation';
  hideComment?: any | null;
};

export type HidePublicationMutationVariables = Exact<{
  request: HidePublicationRequest;
}>;

export type HidePublicationMutation = {
  __typename?: 'Mutation';
  hidePublication?: any | null;
};

export type ModDisputeReportMutationVariables = Exact<{
  request: ModDisputeReportRequest;
}>;

export type ModDisputeReportMutation = {
  __typename?: 'Mutation';
  modDisputeReport?: any | null;
};

export type RemovePublicationBookmarkMutationVariables = Exact<{
  request: PublicationBookmarkRequest;
}>;

export type RemovePublicationBookmarkMutation = {
  __typename?: 'Mutation';
  removePublicationBookmark?: any | null;
};

export type RemoveReactionMutationVariables = Exact<{
  request: ReactionRequest;
}>;

export type RemoveReactionMutation = {
  __typename?: 'Mutation';
  removeReaction?: any | null;
};

export type ReportPublicationMutationVariables = Exact<{
  request: ReportPublicationRequest;
}>;

export type ReportPublicationMutation = {
  __typename?: 'Mutation';
  reportPublication?: any | null;
};

export type UndoPublicationNotInterestedMutationVariables = Exact<{
  request: PublicationNotInterestedRequest;
}>;

export type UndoPublicationNotInterestedMutation = {
  __typename?: 'Mutation';
  undoPublicationNotInterested?: any | null;
};

export type UnhideCommentMutationVariables = Exact<{
  request: UnhideCommentRequest;
}>;

export type UnhideCommentMutation = {
  __typename?: 'Mutation';
  unhideComment?: any | null;
};

export type SignFrameActionMutationVariables = Exact<{
  request: FrameLensManagerEip712Request;
}>;

export type SignFrameActionMutation = {
  __typename?: 'Mutation';
  signFrameAction: {
    __typename?: 'FrameLensManagerSignatureResult';
    signature: any;
  };
};

export type CommentOnMomokaMutationVariables = Exact<{
  request: MomokaCommentRequest;
}>;

export type CommentOnMomokaMutation = {
  __typename?: 'Mutation';
  commentOnMomoka:
    | { __typename?: 'CreateMomokaPublicationResult'; id: any }
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      };
};

export type MirrorOnMomokaMutationVariables = Exact<{
  request: MomokaMirrorRequest;
}>;

export type MirrorOnMomokaMutation = {
  __typename?: 'Mutation';
  mirrorOnMomoka:
    | { __typename?: 'CreateMomokaPublicationResult'; id: any }
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      };
};

export type PostOnMomokaMutationVariables = Exact<{
  request: MomokaPostRequest;
}>;

export type PostOnMomokaMutation = {
  __typename?: 'Mutation';
  postOnMomoka:
    | { __typename?: 'CreateMomokaPublicationResult'; id: any }
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      };
};

export type QuoteOnMomokaMutationVariables = Exact<{
  request: MomokaQuoteRequest;
}>;

export type QuoteOnMomokaMutation = {
  __typename?: 'Mutation';
  quoteOnMomoka:
    | { __typename?: 'CreateMomokaPublicationResult'; id: any }
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      };
};

export type CommentOnchainMutationVariables = Exact<{
  request: OnchainCommentRequest;
}>;

export type CommentOnchainMutation = {
  __typename?: 'Mutation';
  commentOnchain:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type MirrorOnchainMutationVariables = Exact<{
  request: OnchainMirrorRequest;
}>;

export type MirrorOnchainMutation = {
  __typename?: 'Mutation';
  mirrorOnchain:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type PostOnchainMutationVariables = Exact<{
  request: OnchainPostRequest;
}>;

export type PostOnchainMutation = {
  __typename?: 'Mutation';
  postOnchain:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type QuoteOnchainMutationVariables = Exact<{
  request: OnchainQuoteRequest;
}>;

export type QuoteOnchainMutation = {
  __typename?: 'Mutation';
  quoteOnchain:
    | {
        __typename?: 'LensProfileManagerRelayError';
        reason: LensProfileManagerRelayErrorReasonType;
      }
    | { __typename?: 'RelaySuccess'; txId: any };
};

export type CreateMomokaCommentTypedDataMutationVariables = Exact<{
  request: MomokaCommentRequest;
}>;

export type CreateMomokaCommentTypedDataMutation = {
  __typename?: 'Mutation';
  createMomokaCommentTypedData: {
    __typename?: 'CreateMomokaCommentBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateMomokaCommentEIP712TypedData';
      types: {
        __typename?: 'CreateMomokaCommentEIP712TypedDataTypes';
        Comment: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateMomokaCommentEIP712TypedDataValue';
        actionModules: Array<any>;
        actionModulesInitDatas: Array<any>;
        contentURI: any;
        deadline: any;
        nonce: any;
        pointedProfileId: any;
        pointedPubId: any;
        profileId: any;
        referenceModule: any;
        referenceModuleData: any;
        referenceModuleInitData: any;
        referrerProfileIds: Array<any>;
        referrerPubIds: Array<any>;
      };
    };
  };
};

export type CreateMomokaMirrorTypedDataMutationVariables = Exact<{
  request: MomokaMirrorRequest;
}>;

export type CreateMomokaMirrorTypedDataMutation = {
  __typename?: 'Mutation';
  createMomokaMirrorTypedData: {
    __typename?: 'CreateMomokaMirrorBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateMomokaMirrorEIP712TypedData';
      types: {
        __typename?: 'CreateMomokaMirrorEIP712TypedDataTypes';
        Mirror: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateMomokaMirrorEIP712TypedDataValue';
        nonce: any;
        metadataURI: string;
        deadline: any;
        profileId: any;
        pointedProfileId: any;
        pointedPubId: any;
        referrerProfileIds: Array<any>;
        referrerPubIds: Array<any>;
        referenceModuleData: any;
      };
    };
  };
};

export type CreateMomokaPostTypedDataMutationVariables = Exact<{
  request: MomokaPostRequest;
}>;

export type CreateMomokaPostTypedDataMutation = {
  __typename?: 'Mutation';
  createMomokaPostTypedData: {
    __typename?: 'CreateMomokaPostBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateMomokaPostEIP712TypedData';
      types: {
        __typename?: 'CreateMomokaPostEIP712TypedDataTypes';
        Post: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateMomokaPostEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        profileId: any;
        contentURI: any;
        actionModules: Array<any>;
        actionModulesInitDatas: Array<any>;
        referenceModule: any;
        referenceModuleInitData: any;
      };
    };
  };
};

export type CreateMomokaQuoteTypedDataMutationVariables = Exact<{
  request: MomokaQuoteRequest;
}>;

export type CreateMomokaQuoteTypedDataMutation = {
  __typename?: 'Mutation';
  createMomokaQuoteTypedData: {
    __typename?: 'CreateMomokaQuoteBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateMomokaQuoteEIP712TypedData';
      types: {
        __typename?: 'CreateMomokaQuoteEIP712TypedDataTypes';
        Quote: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateMomokaQuoteEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        profileId: any;
        contentURI: any;
        pointedProfileId: any;
        pointedPubId: any;
        referrerProfileIds: Array<any>;
        referrerPubIds: Array<any>;
        actionModules: Array<any>;
        actionModulesInitDatas: Array<any>;
        referenceModule: any;
        referenceModuleData: any;
        referenceModuleInitData: any;
      };
    };
  };
};

export type CreateActOnOpenActionTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: ActOnOpenActionRequest;
}>;

export type CreateActOnOpenActionTypedDataMutation = {
  __typename?: 'Mutation';
  createActOnOpenActionTypedData: {
    __typename?: 'CreateActOnOpenActionBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateActOnOpenActionEIP712TypedData';
      types: {
        __typename?: 'CreateActOnOpenActionEIP712TypedDataTypes';
        Act: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateActOnOpenActionEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        publicationActedProfileId: any;
        publicationActedId: any;
        actorProfileId: any;
        referrerProfileIds: Array<any>;
        referrerPubIds: Array<any>;
        actionModuleAddress: any;
        actionModuleData: any;
      };
    };
  };
};

export type CreateOnchainCommentTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainCommentRequest;
}>;

export type CreateOnchainCommentTypedDataMutation = {
  __typename?: 'Mutation';
  createOnchainCommentTypedData: {
    __typename?: 'CreateOnchainCommentBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateOnchainCommentEIP712TypedData';
      types: {
        __typename?: 'CreateOnchainCommentEIP712TypedDataTypes';
        Comment: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateOnchainCommentEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        profileId: any;
        contentURI: any;
        pointedProfileId: any;
        pointedPubId: any;
        referrerProfileIds: Array<any>;
        referrerPubIds: Array<any>;
        referenceModuleData: any;
        actionModules: Array<any>;
        actionModulesInitDatas: Array<any>;
        referenceModule: any;
        referenceModuleInitData: any;
      };
    };
  };
};

export type CreateOnchainMirrorTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainMirrorRequest;
}>;

export type CreateOnchainMirrorTypedDataMutation = {
  __typename?: 'Mutation';
  createOnchainMirrorTypedData: {
    __typename?: 'CreateOnchainMirrorBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateOnchainMirrorEIP712TypedData';
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      types: {
        __typename?: 'CreateOnchainMirrorEIP712TypedDataTypes';
        Mirror: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      value: {
        __typename?: 'CreateOnchainMirrorEIP712TypedDataValue';
        nonce: any;
        metadataURI: string;
        deadline: any;
        profileId: any;
        pointedProfileId: any;
        pointedPubId: any;
        referrerProfileIds: Array<any>;
        referrerPubIds: Array<any>;
        referenceModuleData: any;
      };
    };
  };
};

export type CreateOnchainPostTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainPostRequest;
}>;

export type CreateOnchainPostTypedDataMutation = {
  __typename?: 'Mutation';
  createOnchainPostTypedData: {
    __typename?: 'CreateOnchainPostBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateOnchainPostEIP712TypedData';
      types: {
        __typename?: 'CreateOnchainPostEIP712TypedDataTypes';
        Post: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateOnchainPostEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        profileId: any;
        contentURI: any;
        actionModules: Array<any>;
        actionModulesInitDatas: Array<any>;
        referenceModule: any;
        referenceModuleInitData: any;
      };
    };
  };
};

export type CreateOnchainQuoteTypedDataMutationVariables = Exact<{
  options?: InputMaybe<TypedDataOptions>;
  request: OnchainQuoteRequest;
}>;

export type CreateOnchainQuoteTypedDataMutation = {
  __typename?: 'Mutation';
  createOnchainQuoteTypedData: {
    __typename?: 'CreateOnchainQuoteBroadcastItemResult';
    id: any;
    expiresAt: any;
    typedData: {
      __typename?: 'CreateOnchainQuoteEIP712TypedData';
      types: {
        __typename?: 'CreateOnchainQuoteEIP712TypedDataTypes';
        Quote: Array<{
          __typename?: 'EIP712TypedDataField';
          name: string;
          type: string;
        }>;
      };
      domain: {
        __typename?: 'EIP712TypedDataDomain';
        name: string;
        chainId: any;
        version: string;
        verifyingContract: any;
      };
      value: {
        __typename?: 'CreateOnchainQuoteEIP712TypedDataValue';
        nonce: any;
        deadline: any;
        profileId: any;
        contentURI: any;
        pointedProfileId: any;
        pointedPubId: any;
        referrerProfileIds: Array<any>;
        referrerPubIds: Array<any>;
        referenceModuleData: any;
        actionModules: Array<any>;
        actionModulesInitDatas: Array<any>;
        referenceModule: any;
        referenceModuleInitData: any;
      };
    };
  };
};

export type ApprovedAuthenticationsQueryVariables = Exact<{
  request: ApprovedAuthenticationRequest;
}>;

export type ApprovedAuthenticationsQuery = {
  __typename?: 'Query';
  approvedAuthentications: {
    __typename?: 'PaginatedApprovedAuthenticationResult';
    items: Array<{
      __typename?: 'ApprovedAuthentication';
      authorizationId: any;
      browser?: string | null;
      os?: string | null;
      origin?: any | null;
      expiresAt: any;
      createdAt: any;
      updatedAt: any;
    }>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type ApprovedModuleAllowanceAmountQueryVariables = Exact<{
  request: ApprovedModuleAllowanceAmountRequest;
}>;

export type ApprovedModuleAllowanceAmountQuery = {
  __typename?: 'Query';
  approvedModuleAllowanceAmount: Array<{
    __typename?: 'ApprovedAllowanceAmountResult';
    moduleName: string;
    allowance: {
      __typename?: 'Amount';
      value: string;
      asset: { __typename?: 'Erc20' } & Erc20FieldsFragment;
    };
    moduleContract: {
      __typename?: 'NetworkAddress';
    } & NetworkAddressFieldsFragment;
  }>;
};

export type ChallengeQueryVariables = Exact<{
  request: ChallengeRequest;
}>;

export type ChallengeQuery = {
  __typename?: 'Query';
  challenge: { __typename?: 'AuthChallengeResult'; id: any; text: string };
};

export type CurrentProfileQueryVariables = Exact<{
  request: ProfileRequest;
}>;

export type CurrentProfileQuery = {
  __typename?: 'Query';
  profile?:
    | ({
        __typename?: 'Profile';
        handle?:
          | ({
              __typename?: 'HandleInfo';
              guardian: {
                __typename?: 'HandleGuardianResult';
                cooldownEndsOn?: any | null;
                protected: boolean;
              };
            } & HandleInfoFieldsFragment)
          | null;
        guardian?: {
          __typename?: 'ProfileGuardianResult';
          protected: boolean;
          cooldownEndsOn?: any | null;
        } | null;
      } & ProfileFieldsFragment)
    | null;
  userSigNonces: { __typename?: 'UserSigNonces'; lensHubOnchainSigNonce: any };
};

export type DefaultProfileQueryVariables = Exact<{
  request: DefaultProfileRequest;
}>;

export type DefaultProfileQuery = {
  __typename?: 'Query';
  defaultProfile?: ({ __typename?: 'Profile' } & ProfileFieldsFragment) | null;
};

export type ExploreProfilesQueryVariables = Exact<{
  request: ExploreProfilesRequest;
}>;

export type ExploreProfilesQuery = {
  __typename?: 'Query';
  exploreProfiles: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type ExplorePublicationsQueryVariables = Exact<{
  request: ExplorePublicationRequest;
}>;

export type ExplorePublicationsQuery = {
  __typename?: 'Query';
  explorePublications: {
    __typename?: 'PaginatedExplorePublicationResult';
    items: Array<
      | ({ __typename?: 'Post' } & PostFieldsFragment)
      | ({ __typename?: 'Quote' } & QuoteFieldsFragment)
    >;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type FeedQueryVariables = Exact<{
  request: FeedRequest;
}>;

export type FeedQuery = {
  __typename?: 'Query';
  feed: {
    __typename?: 'PaginatedFeedResult';
    items: Array<{
      __typename?: 'FeedItem';
      id: string;
      root:
        | { __typename?: 'Comment'; id: any }
        | ({ __typename?: 'Post' } & PostFieldsFragment)
        | ({ __typename?: 'Quote' } & QuoteFieldsFragment);
      mirrors: Array<{
        __typename?: 'Mirror';
        by: { __typename?: 'Profile' } & PublicationProfileFieldsFragment;
      }>;
    }>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type FollowRevenuesQueryVariables = Exact<{
  request: FollowRevenueRequest;
}>;

export type FollowRevenuesQuery = {
  __typename?: 'Query';
  followRevenues: {
    __typename?: 'FollowRevenueResult';
    revenues: Array<{
      __typename?: 'RevenueAggregate';
      total: { __typename?: 'Amount' } & AmountFieldsFragment;
    }>;
  };
};

export type FollowersQueryVariables = Exact<{
  request: FollowersRequest;
}>;

export type FollowersQuery = {
  __typename?: 'Query';
  followers: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type FollowingQueryVariables = Exact<{
  request: FollowingRequest;
}>;

export type FollowingQuery = {
  __typename?: 'Query';
  following: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type ForYouQueryVariables = Exact<{
  request: PublicationForYouRequest;
}>;

export type ForYouQuery = {
  __typename?: 'Query';
  forYou: {
    __typename?: 'PaginatedForYouResult';
    items: Array<{
      __typename?: 'ForYouResult';
      source: ForYouSource;
      publication:
        | ({ __typename?: 'Post' } & PostFieldsFragment)
        | ({ __typename?: 'Quote' } & QuoteFieldsFragment);
    }>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type GenerateLensApiRelayAddressQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GenerateLensApiRelayAddressQuery = {
  __typename?: 'Query';
  generateLensAPIRelayAddress: any;
};

export type GenerateModuleCurrencyApprovalDataQueryVariables = Exact<{
  request: GenerateModuleCurrencyApprovalDataRequest;
}>;

export type GenerateModuleCurrencyApprovalDataQuery = {
  __typename?: 'Query';
  generateModuleCurrencyApprovalData: {
    __typename?: 'GenerateModuleCurrencyApprovalResult';
    to: any;
    from: any;
    data: any;
  };
};

export type HandleToAddressQueryVariables = Exact<{
  request: HandleToAddressRequest;
}>;

export type HandleToAddressQuery = {
  __typename?: 'Query';
  handleToAddress?: any | null;
};

export type LatestPaidActionsQueryVariables = Exact<{
  request: PaginatedRequest;
}>;

export type LatestPaidActionsQuery = {
  __typename?: 'Query';
  latestPaidActions: {
    __typename?: 'LatestPaidActionsResult';
    items: Array<
      | { __typename?: 'FollowPaidAction' }
      | {
          __typename?: 'OpenActionPaidAction';
          actedOn:
            | ({ __typename?: 'Comment' } & CommentBaseFieldsFragment)
            | ({ __typename?: 'Post' } & PostFieldsFragment)
            | ({ __typename?: 'Quote' } & QuoteBaseFieldsFragment);
          latestActed: Array<{
            __typename?: 'LatestActed';
            actedAt: any;
            profile: {
              __typename?: 'Profile';
            } & PublicationProfileFieldsFragment;
          }>;
        }
    >;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type LensTransactionStatusQueryVariables = Exact<{
  request: LensTransactionStatusRequest;
}>;

export type LensTransactionStatusQuery = {
  __typename?: 'Query';
  lensTransactionStatus?: {
    __typename?: 'LensTransactionResult';
    status: LensTransactionStatusType;
    txHash: any;
    reason?: LensTransactionFailureType | null;
    extraInfo?: string | null;
  } | null;
};

export type ModExplorePublicationsQueryVariables = Exact<{
  request: ModExplorePublicationRequest;
}>;

export type ModExplorePublicationsQuery = {
  __typename?: 'Query';
  modExplorePublications: {
    __typename?: 'PaginatedModExplorePublicationResult';
    items: Array<
      | ({ __typename?: 'Comment' } & CommentFieldsFragment)
      | ({ __typename?: 'Post' } & PostFieldsFragment)
      | ({ __typename?: 'Quote' } & QuoteFieldsFragment)
    >;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type ModLatestReportsQueryVariables = Exact<{
  request: ModReportsRequest;
}>;

export type ModLatestReportsQuery = {
  __typename?: 'Query';
  modLatestReports: {
    __typename?: 'PaginatedModReports';
    items: Array<{
      __typename?: 'ModReport';
      reason: string;
      subreason: string;
      additionalInfo?: string | null;
      createdAt: any;
      reporter: { __typename?: 'Profile' } & ProfileFieldsFragment;
      reportedPublication?:
        | ({ __typename?: 'Comment' } & CommentFieldsFragment)
        | ({ __typename?: 'Post' } & PostFieldsFragment)
        | ({ __typename?: 'Quote' } & QuoteFieldsFragment)
        | null;
    }>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type ModuleMetadataQueryVariables = Exact<{
  request: ModuleMetadataRequest;
}>;

export type ModuleMetadataQuery = {
  __typename?: 'Query';
  moduleMetadata?: {
    __typename?: 'GetModuleMetadataResult';
    moduleType: ModuleType;
    signlessApproved: boolean;
    sponsoredApproved: boolean;
    verified: boolean;
    metadata: {
      __typename?: 'ModuleMetadata';
      authors: Array<string>;
      description: string;
      initializeCalldataABI: any;
      initializeResultDataABI?: any | null;
      name: string;
      processCalldataABI: any;
      title: string;
      attributes: Array<{
        __typename?: 'MetadataAttribute';
        key: string;
        type: MetadataAttributeType;
        value: string;
      }>;
    };
  } | null;
};

export type MutualFollowersQueryVariables = Exact<{
  request: MutualFollowersRequest;
}>;

export type MutualFollowersQuery = {
  __typename?: 'Query';
  mutualFollowers: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type NotificationsQueryVariables = Exact<{
  request: NotificationRequest;
}>;

export type NotificationsQuery = {
  __typename?: 'Query';
  notifications: {
    __typename?: 'PaginatedNotificationResult';
    items: Array<
      | ({
          __typename?: 'ActedNotification';
        } & NotificationFields_ActedNotification_Fragment)
      | ({
          __typename?: 'CommentNotification';
        } & NotificationFields_CommentNotification_Fragment)
      | ({
          __typename?: 'FollowNotification';
        } & NotificationFields_FollowNotification_Fragment)
      | ({
          __typename?: 'MentionNotification';
        } & NotificationFields_MentionNotification_Fragment)
      | ({
          __typename?: 'MirrorNotification';
        } & NotificationFields_MirrorNotification_Fragment)
      | ({
          __typename?: 'QuoteNotification';
        } & NotificationFields_QuoteNotification_Fragment)
      | ({
          __typename?: 'ReactionNotification';
        } & NotificationFields_ReactionNotification_Fragment)
    >;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type OwnedHandlesQueryVariables = Exact<{
  request: OwnedHandlesRequest;
}>;

export type OwnedHandlesQuery = {
  __typename?: 'Query';
  ownedHandles: {
    __typename?: 'PaginatedHandlesResult';
    items: Array<{ __typename?: 'HandleInfo' } & HandleInfoFieldsFragment>;
  };
};

export type ProfileQueryVariables = Exact<{
  request: ProfileRequest;
}>;

export type ProfileQuery = {
  __typename?: 'Query';
  profile?: ({ __typename?: 'Profile' } & ProfileFieldsFragment) | null;
};

export type ProfileActionHistoryQueryVariables = Exact<{
  request: ProfileActionHistoryRequest;
}>;

export type ProfileActionHistoryQuery = {
  __typename?: 'Query';
  profileActionHistory: {
    __typename?: 'PaginatedProfileActionHistoryResult';
    items: Array<{
      __typename?: 'ProfileActionHistory';
      id: number;
      actionType: ProfileActionHistoryType;
      who: any;
      txHash?: any | null;
      actionedOn: any;
    }>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type ProfileInterestsOptionsQueryVariables = Exact<{
  request: ProfileRequest;
}>;

export type ProfileInterestsOptionsQuery = {
  __typename?: 'Query';
  profileInterestsOptions: Array<string>;
  profile?: {
    __typename?: 'Profile';
    id: any;
    interests: Array<string>;
  } | null;
};

export type ProfileManagersQueryVariables = Exact<{
  request: ProfileManagersRequest;
}>;

export type ProfileManagersQuery = {
  __typename?: 'Query';
  profileManagers: {
    __typename?: 'PaginatedProfileManagersResult';
    items: Array<{
      __typename?: 'ProfilesManagedResult';
      address: any;
      isLensManager: boolean;
    }>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type ProfileRecommendationsQueryVariables = Exact<{
  request: ProfileRecommendationsRequest;
}>;

export type ProfileRecommendationsQuery = {
  __typename?: 'Query';
  profileRecommendations: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
  };
};

export type ProfilesQueryVariables = Exact<{
  request: ProfilesRequest;
}>;

export type ProfilesQuery = {
  __typename?: 'Query';
  profiles: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type ProfilesManagedQueryVariables = Exact<{
  profilesManagedRequest: ProfilesManagedRequest;
  lastLoggedInProfileRequest: LastLoggedInProfileRequest;
}>;

export type ProfilesManagedQuery = {
  __typename?: 'Query';
  profilesManaged: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
  lastLoggedInProfile?:
    | ({ __typename?: 'Profile' } & ListProfileFieldsFragment)
    | null;
};

export type PublicationQueryVariables = Exact<{
  request: PublicationRequest;
}>;

export type PublicationQuery = {
  __typename?: 'Query';
  publication?:
    | ({ __typename?: 'Comment' } & CommentFieldsFragment)
    | ({ __typename?: 'Mirror' } & MirrorFieldsFragment)
    | ({ __typename?: 'Post' } & PostFieldsFragment)
    | ({ __typename?: 'Quote' } & QuoteFieldsFragment)
    | null;
};

export type PublicationBookmarksQueryVariables = Exact<{
  request: PublicationBookmarksRequest;
}>;

export type PublicationBookmarksQuery = {
  __typename?: 'Query';
  publicationBookmarks: {
    __typename?: 'PaginatedPublicationsResult';
    items: Array<
      | ({ __typename?: 'Comment' } & CommentFieldsFragment)
      | ({ __typename?: 'Mirror' } & MirrorFieldsFragment)
      | ({ __typename?: 'Post' } & PostFieldsFragment)
      | ({ __typename?: 'Quote' } & QuoteFieldsFragment)
    >;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type PublicationsQueryVariables = Exact<{
  request: PublicationsRequest;
}>;

export type PublicationsQuery = {
  __typename?: 'Query';
  publications: {
    __typename?: 'PaginatedPublicationsResult';
    items: Array<
      | ({ __typename?: 'Comment' } & CommentFieldsFragment)
      | ({ __typename?: 'Mirror' } & MirrorFieldsFragment)
      | ({ __typename?: 'Post' } & PostFieldsFragment)
      | ({ __typename?: 'Quote' } & QuoteFieldsFragment)
    >;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type SearchProfilesQueryVariables = Exact<{
  request: ProfileSearchRequest;
}>;

export type SearchProfilesQuery = {
  __typename?: 'Query';
  searchProfiles: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type SearchPublicationsQueryVariables = Exact<{
  request: PublicationSearchRequest;
}>;

export type SearchPublicationsQuery = {
  __typename?: 'Query';
  searchPublications: {
    __typename?: 'PaginatedPublicationPrimaryResult';
    items: Array<
      | ({ __typename?: 'Comment' } & CommentFieldsFragment)
      | ({ __typename?: 'Post' } & PostFieldsFragment)
      | ({ __typename?: 'Quote' } & QuoteFieldsFragment)
    >;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type StaffPicksQueryVariables = Exact<{
  batch1?: InputMaybe<
    Array<Scalars['ProfileId']['input']> | Scalars['ProfileId']['input']
  >;
  batch2?: InputMaybe<
    Array<Scalars['ProfileId']['input']> | Scalars['ProfileId']['input']
  >;
  batch3?: InputMaybe<
    Array<Scalars['ProfileId']['input']> | Scalars['ProfileId']['input']
  >;
}>;

export type StaffPicksQuery = {
  __typename?: 'Query';
  batch1: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
  };
  batch2: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
  };
  batch3: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
  };
};

export type UserRateLimitQueryVariables = Exact<{
  request: UserCurrentRateLimitRequest;
}>;

export type UserRateLimitQuery = {
  __typename?: 'Query';
  userRateLimit: {
    __typename?: 'UserCurrentRateLimitResult';
    momoka: {
      __typename?: 'UserCurrentRateLimit';
      hourAllowanceLeft: number;
      hourAllowanceUsed: number;
      hourAllowance: number;
      dayAllowanceLeft: number;
      dayAllowanceUsed: number;
      dayAllowance: number;
    };
    onchain: {
      __typename?: 'UserCurrentRateLimit';
      hourAllowanceLeft: number;
      hourAllowanceUsed: number;
      hourAllowance: number;
      dayAllowanceLeft: number;
      dayAllowanceUsed: number;
      dayAllowance: number;
    };
  };
};

export type WhoActedOnPublicationQueryVariables = Exact<{
  request: WhoActedOnPublicationRequest;
}>;

export type WhoActedOnPublicationQuery = {
  __typename?: 'Query';
  whoActedOnPublication: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type WhoHaveBlockedQueryVariables = Exact<{
  request: WhoHaveBlockedRequest;
}>;

export type WhoHaveBlockedQuery = {
  __typename?: 'Query';
  whoHaveBlocked: {
    __typename?: 'PaginatedProfileResult';
    items: Array<{ __typename?: 'Profile' } & ListProfileFieldsFragment>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type WhoReactedPublicationQueryVariables = Exact<{
  request: WhoReactedPublicationRequest;
}>;

export type WhoReactedPublicationQuery = {
  __typename?: 'Query';
  whoReactedPublication: {
    __typename?: 'PaginatedWhoReactedResult';
    items: Array<{
      __typename?: 'ProfileWhoReactedResult';
      profile: { __typename?: 'Profile' } & ListProfileFieldsFragment;
    }>;
    pageInfo: { __typename?: 'PaginatedResultInfo'; next?: any | null };
  };
};

export type UserSigNoncesSubscriptionSubscriptionVariables = Exact<{
  address: Scalars['EvmAddress']['input'];
}>;

export type UserSigNoncesSubscriptionSubscription = {
  __typename?: 'Subscription';
  userSigNonces: { __typename?: 'UserSigNonces'; lensHubOnchainSigNonce: any };
};

export const HandleInfoFieldsFragmentDoc = gql`
  fragment HandleInfoFields on HandleInfo {
    fullHandle
    localName
    linkedTo {
      nftTokenId
    }
  }
`;
export const NetworkAddressFieldsFragmentDoc = gql`
  fragment NetworkAddressFields on NetworkAddress {
    address
    chainId
  }
`;
export const ProfileOperationsFieldsFragmentDoc = gql`
  fragment ProfileOperationsFields on ProfileOperations {
    id
    isBlockedByMe {
      value
    }
    isFollowedByMe {
      value
    }
    isFollowingMe {
      value
    }
  }
`;
export const ImageSetFieldsFragmentDoc = gql`
  fragment ImageSetFields on ImageSet {
    optimized {
      uri
    }
    raw {
      uri
    }
  }
`;
export const MetadataAttributeFieldsFragmentDoc = gql`
  fragment MetadataAttributeFields on MetadataAttribute {
    type
    key
    value
  }
`;
export const ProfileMetadataFieldsFragmentDoc = gql`
  fragment ProfileMetadataFields on ProfileMetadata {
    displayName
    bio
    picture {
      ... on ImageSet {
        ...ImageSetFields
      }
    }
    coverPicture {
      ...ImageSetFields
    }
    attributes {
      ...MetadataAttributeFields
    }
  }
  ${ImageSetFieldsFragmentDoc}
  ${MetadataAttributeFieldsFragmentDoc}
`;
export const Erc20FieldsFragmentDoc = gql`
  fragment Erc20Fields on Asset {
    ... on Erc20 {
      name
      symbol
      decimals
      contract {
        ...NetworkAddressFields
      }
    }
  }
  ${NetworkAddressFieldsFragmentDoc}
`;
export const AmountFieldsFragmentDoc = gql`
  fragment AmountFields on Amount {
    asFiat(request: { for: USD }) {
      value
    }
    asset {
      ...Erc20Fields
    }
    value
  }
  ${Erc20FieldsFragmentDoc}
`;
export const FollowModuleFieldsFragmentDoc = gql`
  fragment FollowModuleFields on FollowModule {
    ... on FeeFollowModuleSettings {
      type
      amount {
        ...AmountFields
      }
      recipient
    }
    ... on RevertFollowModuleSettings {
      type
    }
    ... on UnknownFollowModuleSettings {
      type
    }
  }
  ${AmountFieldsFragmentDoc}
`;
export const ListProfileFieldsFragmentDoc = gql`
  fragment ListProfileFields on Profile {
    id
    handle {
      ...HandleInfoFields
    }
    ownedBy {
      ...NetworkAddressFields
    }
    operations {
      ...ProfileOperationsFields
    }
    metadata {
      ...ProfileMetadataFields
    }
    followModule {
      ...FollowModuleFields
    }
    peerToPeerRecommendedByMe
  }
  ${HandleInfoFieldsFragmentDoc}
  ${NetworkAddressFieldsFragmentDoc}
  ${ProfileOperationsFieldsFragmentDoc}
  ${ProfileMetadataFieldsFragmentDoc}
  ${FollowModuleFieldsFragmentDoc}
`;
export const PublicationProfileFieldsFragmentDoc = gql`
  fragment PublicationProfileFields on Profile {
    id
    handle {
      ...HandleInfoFields
    }
    operations {
      ...ProfileOperationsFields
    }
    ownedBy {
      ...NetworkAddressFields
    }
    metadata {
      ...ProfileMetadataFields
    }
    peerToPeerRecommendedByMe
  }
  ${HandleInfoFieldsFragmentDoc}
  ${ProfileOperationsFieldsFragmentDoc}
  ${NetworkAddressFieldsFragmentDoc}
  ${ProfileMetadataFieldsFragmentDoc}
`;
export const PublicationStatsFieldsFragmentDoc = gql`
  fragment PublicationStatsFields on PublicationStats {
    id
    comments
    mirrors
    quotes
    reactions(request: { type: UPVOTE })
    countOpenActions(request: { anyOf: [{ category: COLLECT }] })
    bookmarks
  }
`;
export const PublicationOperationFieldsFragmentDoc = gql`
  fragment PublicationOperationFields on PublicationOperations {
    isNotInterested
    hasBookmarked
    hasActed {
      value
    }
    hasReacted(request: { type: UPVOTE })
    canMirror
    hasMirrored
    hasQuoted
  }
`;
export const EncryptableImageSetFieldsFragmentDoc = gql`
  fragment EncryptableImageSetFields on EncryptableImageSet {
    optimized {
      uri
    }
  }
`;
export const PublicationMetadataMediaVideoFieldsFragmentDoc = gql`
  fragment PublicationMetadataMediaVideoFields on PublicationMetadataMediaVideo {
    video {
      optimized {
        uri
      }
    }
    cover {
      ...EncryptableImageSetFields
    }
    license
  }
  ${EncryptableImageSetFieldsFragmentDoc}
`;
export const PublicationMetadataMediaImageFieldsFragmentDoc = gql`
  fragment PublicationMetadataMediaImageFields on PublicationMetadataMediaImage {
    image {
      ...EncryptableImageSetFields
    }
  }
  ${EncryptableImageSetFieldsFragmentDoc}
`;
export const PublicationMetadataMediaAudioFieldsFragmentDoc = gql`
  fragment PublicationMetadataMediaAudioFields on PublicationMetadataMediaAudio {
    artist
    audio {
      optimized {
        uri
      }
    }
    cover {
      ...EncryptableImageSetFields
    }
    license
  }
  ${EncryptableImageSetFieldsFragmentDoc}
`;
export const PublicationMetadataMediaFieldsFragmentDoc = gql`
  fragment PublicationMetadataMediaFields on PublicationMetadataMedia {
    ... on PublicationMetadataMediaVideo {
      ...PublicationMetadataMediaVideoFields
    }
    ... on PublicationMetadataMediaImage {
      ...PublicationMetadataMediaImageFields
    }
    ... on PublicationMetadataMediaAudio {
      ...PublicationMetadataMediaAudioFields
    }
  }
  ${PublicationMetadataMediaVideoFieldsFragmentDoc}
  ${PublicationMetadataMediaImageFieldsFragmentDoc}
  ${PublicationMetadataMediaAudioFieldsFragmentDoc}
`;
export const VideoMetadataV3FieldsFragmentDoc = gql`
  fragment VideoMetadataV3Fields on VideoMetadataV3 {
    id
    content
    tags
    attributes {
      ...MetadataAttributeFields
    }
    asset {
      ...PublicationMetadataMediaVideoFields
    }
    attachments {
      ...PublicationMetadataMediaFields
    }
  }
  ${MetadataAttributeFieldsFragmentDoc}
  ${PublicationMetadataMediaVideoFieldsFragmentDoc}
  ${PublicationMetadataMediaFieldsFragmentDoc}
`;
export const ArticleMetadataV3FieldsFragmentDoc = gql`
  fragment ArticleMetadataV3Fields on ArticleMetadataV3 {
    id
    content
    tags
    attributes {
      ...MetadataAttributeFields
    }
    attachments {
      ...PublicationMetadataMediaFields
    }
  }
  ${MetadataAttributeFieldsFragmentDoc}
  ${PublicationMetadataMediaFieldsFragmentDoc}
`;
export const AudioMetadataV3FieldsFragmentDoc = gql`
  fragment AudioMetadataV3Fields on AudioMetadataV3 {
    id
    title
    content
    tags
    attributes {
      ...MetadataAttributeFields
    }
    asset {
      ...PublicationMetadataMediaAudioFields
    }
    attachments {
      ...PublicationMetadataMediaFields
    }
  }
  ${MetadataAttributeFieldsFragmentDoc}
  ${PublicationMetadataMediaAudioFieldsFragmentDoc}
  ${PublicationMetadataMediaFieldsFragmentDoc}
`;
export const ImageMetadataV3FieldsFragmentDoc = gql`
  fragment ImageMetadataV3Fields on ImageMetadataV3 {
    id
    content
    tags
    attributes {
      ...MetadataAttributeFields
    }
    attachments {
      ...PublicationMetadataMediaFields
    }
    asset {
      ...PublicationMetadataMediaImageFields
    }
  }
  ${MetadataAttributeFieldsFragmentDoc}
  ${PublicationMetadataMediaFieldsFragmentDoc}
  ${PublicationMetadataMediaImageFieldsFragmentDoc}
`;
export const LinkMetadataV3FieldsFragmentDoc = gql`
  fragment LinkMetadataV3Fields on LinkMetadataV3 {
    id
    content
    sharingLink
    tags
    attributes {
      ...MetadataAttributeFields
    }
    attachments {
      ...PublicationMetadataMediaFields
    }
  }
  ${MetadataAttributeFieldsFragmentDoc}
  ${PublicationMetadataMediaFieldsFragmentDoc}
`;
export const LiveStreamMetadataV3FieldsFragmentDoc = gql`
  fragment LiveStreamMetadataV3Fields on LiveStreamMetadataV3 {
    id
    playbackURL
    liveURL
    content
    tags
    attributes {
      ...MetadataAttributeFields
    }
    attachments {
      ...PublicationMetadataMediaFields
    }
  }
  ${MetadataAttributeFieldsFragmentDoc}
  ${PublicationMetadataMediaFieldsFragmentDoc}
`;
export const MintMetadataV3FieldsFragmentDoc = gql`
  fragment MintMetadataV3Fields on MintMetadataV3 {
    id
    content
    tags
    attributes {
      ...MetadataAttributeFields
    }
    attachments {
      ...PublicationMetadataMediaFields
    }
  }
  ${MetadataAttributeFieldsFragmentDoc}
  ${PublicationMetadataMediaFieldsFragmentDoc}
`;
export const TextOnlyMetadataV3FieldsFragmentDoc = gql`
  fragment TextOnlyMetadataV3Fields on TextOnlyMetadataV3 {
    id
    content
    tags
    attributes {
      ...MetadataAttributeFields
    }
  }
  ${MetadataAttributeFieldsFragmentDoc}
`;
export const AnyPublicationMetadataFieldsFragmentDoc = gql`
  fragment AnyPublicationMetadataFields on PublicationMetadata {
    ... on VideoMetadataV3 {
      ...VideoMetadataV3Fields
    }
    ... on ArticleMetadataV3 {
      ...ArticleMetadataV3Fields
    }
    ... on AudioMetadataV3 {
      ...AudioMetadataV3Fields
    }
    ... on ImageMetadataV3 {
      ...ImageMetadataV3Fields
    }
    ... on LinkMetadataV3 {
      ...LinkMetadataV3Fields
    }
    ... on LiveStreamMetadataV3 {
      ...LiveStreamMetadataV3Fields
    }
    ... on MintMetadataV3 {
      ...MintMetadataV3Fields
    }
    ... on TextOnlyMetadataV3 {
      ...TextOnlyMetadataV3Fields
    }
  }
  ${VideoMetadataV3FieldsFragmentDoc}
  ${ArticleMetadataV3FieldsFragmentDoc}
  ${AudioMetadataV3FieldsFragmentDoc}
  ${ImageMetadataV3FieldsFragmentDoc}
  ${LinkMetadataV3FieldsFragmentDoc}
  ${LiveStreamMetadataV3FieldsFragmentDoc}
  ${MintMetadataV3FieldsFragmentDoc}
  ${TextOnlyMetadataV3FieldsFragmentDoc}
`;
export const OpenActionModulesFieldsFragmentDoc = gql`
  fragment OpenActionModulesFields on OpenActionModule {
    ... on SimpleCollectOpenActionSettings {
      type
      contract {
        ...NetworkAddressFields
      }
      amount {
        ...AmountFields
      }
      collectNft
      collectLimit
      followerOnly
      recipient
      referralFee
      endsAt
    }
    ... on MultirecipientFeeCollectOpenActionSettings {
      type
      contract {
        ...NetworkAddressFields
      }
      amount {
        ...AmountFields
      }
      collectNft
      collectLimit
      referralFee
      followerOnly
      endsAt
      recipients {
        recipient
        split
      }
    }
    ... on UnknownOpenActionModuleSettings {
      type
      contract {
        ...NetworkAddressFields
      }
      initializeResultData
      initializeCalldata
      openActionModuleReturnData
    }
  }
  ${NetworkAddressFieldsFragmentDoc}
  ${AmountFieldsFragmentDoc}
`;
export const PostFieldsFragmentDoc = gql`
  fragment PostFields on Post {
    id
    publishedOn {
      id
    }
    isHidden
    isEncrypted
    momoka {
      proof
    }
    createdAt
    by {
      ...PublicationProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    operations {
      ...PublicationOperationFields
    }
    metadata {
      ...AnyPublicationMetadataFields
    }
    openActionModules {
      ...OpenActionModulesFields
    }
    profilesMentioned {
      snapshotHandleMentioned {
        ...HandleInfoFields
      }
    }
  }
  ${PublicationProfileFieldsFragmentDoc}
  ${PublicationStatsFieldsFragmentDoc}
  ${PublicationOperationFieldsFragmentDoc}
  ${AnyPublicationMetadataFieldsFragmentDoc}
  ${OpenActionModulesFieldsFragmentDoc}
  ${HandleInfoFieldsFragmentDoc}
`;
export const QuoteBaseFieldsFragmentDoc = gql`
  fragment QuoteBaseFields on Quote {
    id
    publishedOn {
      id
    }
    isHidden
    isEncrypted
    momoka {
      proof
    }
    createdAt
    by {
      ...PublicationProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    operations {
      ...PublicationOperationFields
    }
    metadata {
      ...AnyPublicationMetadataFields
    }
    openActionModules {
      ...OpenActionModulesFields
    }
    profilesMentioned {
      snapshotHandleMentioned {
        ...HandleInfoFields
      }
    }
  }
  ${PublicationProfileFieldsFragmentDoc}
  ${PublicationStatsFieldsFragmentDoc}
  ${PublicationOperationFieldsFragmentDoc}
  ${AnyPublicationMetadataFieldsFragmentDoc}
  ${OpenActionModulesFieldsFragmentDoc}
  ${HandleInfoFieldsFragmentDoc}
`;
export const CommentBaseFieldsFragmentDoc = gql`
  fragment CommentBaseFields on Comment {
    id
    publishedOn {
      id
    }
    isHidden
    isEncrypted
    momoka {
      proof
    }
    createdAt
    by {
      ...PublicationProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    operations {
      ...PublicationOperationFields
    }
    metadata {
      ...AnyPublicationMetadataFields
    }
    openActionModules {
      ...OpenActionModulesFields
    }
    root {
      ... on Post {
        ...PostFields
      }
      ... on Quote {
        ...QuoteBaseFields
      }
    }
    profilesMentioned {
      snapshotHandleMentioned {
        ...HandleInfoFields
      }
    }
  }
  ${PublicationProfileFieldsFragmentDoc}
  ${PublicationStatsFieldsFragmentDoc}
  ${PublicationOperationFieldsFragmentDoc}
  ${AnyPublicationMetadataFieldsFragmentDoc}
  ${OpenActionModulesFieldsFragmentDoc}
  ${PostFieldsFragmentDoc}
  ${QuoteBaseFieldsFragmentDoc}
  ${HandleInfoFieldsFragmentDoc}
`;
export const CommentFieldsFragmentDoc = gql`
  fragment CommentFields on Comment {
    ...CommentBaseFields
    commentOn {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentBaseFields
      }
      ... on Quote {
        ...QuoteBaseFields
      }
    }
  }
  ${CommentBaseFieldsFragmentDoc}
  ${PostFieldsFragmentDoc}
  ${QuoteBaseFieldsFragmentDoc}
`;
export const QuoteFieldsFragmentDoc = gql`
  fragment QuoteFields on Quote {
    ...QuoteBaseFields
    quoteOn {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentBaseFields
      }
      ... on Quote {
        ...QuoteBaseFields
      }
    }
  }
  ${QuoteBaseFieldsFragmentDoc}
  ${PostFieldsFragmentDoc}
  ${CommentBaseFieldsFragmentDoc}
`;
export const MirrorFieldsFragmentDoc = gql`
  fragment MirrorFields on Mirror {
    id
    publishedOn {
      id
    }
    isHidden
    momoka {
      proof
    }
    createdAt
    by {
      ...PublicationProfileFields
    }
    mirrorOn {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Quote {
        ...QuoteFields
      }
    }
  }
  ${PublicationProfileFieldsFragmentDoc}
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;
export const ProfileStatsFieldsFragmentDoc = gql`
  fragment ProfileStatsFields on ProfileStats {
    id
    followers
    following
    publications
    comments
    posts
    mirrors
    quotes
    lensClassifierScore
  }
`;
export const ProfileFieldsFragmentDoc = gql`
  fragment ProfileFields on Profile {
    id
    handle {
      ...HandleInfoFields
    }
    ownedBy {
      ...NetworkAddressFields
    }
    signless
    sponsor
    createdAt
    stats {
      ...ProfileStatsFields
    }
    operations {
      ...ProfileOperationsFields
    }
    interests
    followNftAddress {
      ...NetworkAddressFields
    }
    followModule {
      ...FollowModuleFields
    }
    metadata {
      ...ProfileMetadataFields
    }
    peerToPeerRecommendedByMe
  }
  ${HandleInfoFieldsFragmentDoc}
  ${NetworkAddressFieldsFragmentDoc}
  ${ProfileStatsFieldsFragmentDoc}
  ${ProfileOperationsFieldsFragmentDoc}
  ${FollowModuleFieldsFragmentDoc}
  ${ProfileMetadataFieldsFragmentDoc}
`;
export const NotificationPostFieldsFragmentDoc = gql`
  fragment NotificationPostFields on Post {
    id
    metadata {
      ...AnyPublicationMetadataFields
    }
    profilesMentioned {
      snapshotHandleMentioned {
        ...HandleInfoFields
      }
    }
  }
  ${AnyPublicationMetadataFieldsFragmentDoc}
  ${HandleInfoFieldsFragmentDoc}
`;
export const NotificationCommentFieldsFragmentDoc = gql`
  fragment NotificationCommentFields on Comment {
    id
    metadata {
      ...AnyPublicationMetadataFields
    }
    profilesMentioned {
      snapshotHandleMentioned {
        ...HandleInfoFields
      }
    }
  }
  ${AnyPublicationMetadataFieldsFragmentDoc}
  ${HandleInfoFieldsFragmentDoc}
`;
export const NotificationQuoteFieldsFragmentDoc = gql`
  fragment NotificationQuoteFields on Quote {
    id
    metadata {
      ...AnyPublicationMetadataFields
    }
    profilesMentioned {
      snapshotHandleMentioned {
        ...HandleInfoFields
      }
    }
  }
  ${AnyPublicationMetadataFieldsFragmentDoc}
  ${HandleInfoFieldsFragmentDoc}
`;
export const ReactionNotificationFieldsFragmentDoc = gql`
  fragment ReactionNotificationFields on ReactionNotification {
    id
    publication {
      ... on Post {
        ...NotificationPostFields
      }
      ... on Comment {
        ...NotificationCommentFields
      }
      ... on Quote {
        ...NotificationQuoteFields
      }
    }
    reactions {
      profile {
        ...PublicationProfileFields
      }
    }
  }
  ${NotificationPostFieldsFragmentDoc}
  ${NotificationCommentFieldsFragmentDoc}
  ${NotificationQuoteFieldsFragmentDoc}
  ${PublicationProfileFieldsFragmentDoc}
`;
export const CommentNotificationFieldsFragmentDoc = gql`
  fragment CommentNotificationFields on CommentNotification {
    id
    comment {
      ...NotificationCommentFields
      by {
        ...PublicationProfileFields
      }
      commentOn {
        __typename
      }
    }
  }
  ${NotificationCommentFieldsFragmentDoc}
  ${PublicationProfileFieldsFragmentDoc}
`;
export const MirrorNotificationFieldsFragmentDoc = gql`
  fragment MirrorNotificationFields on MirrorNotification {
    id
    mirrors {
      profile {
        ...PublicationProfileFields
      }
    }
    publication {
      ... on Post {
        ...NotificationPostFields
      }
      ... on Comment {
        ...NotificationCommentFields
      }
      ... on Quote {
        ...NotificationQuoteFields
      }
    }
  }
  ${PublicationProfileFieldsFragmentDoc}
  ${NotificationPostFieldsFragmentDoc}
  ${NotificationCommentFieldsFragmentDoc}
  ${NotificationQuoteFieldsFragmentDoc}
`;
export const QuoteNotificationFieldsFragmentDoc = gql`
  fragment QuoteNotificationFields on QuoteNotification {
    id
    quote {
      ...NotificationQuoteFields
      by {
        ...PublicationProfileFields
      }
      quoteOn {
        __typename
      }
    }
  }
  ${NotificationQuoteFieldsFragmentDoc}
  ${PublicationProfileFieldsFragmentDoc}
`;
export const ActedNotificationFieldsFragmentDoc = gql`
  fragment ActedNotificationFields on ActedNotification {
    id
    actions {
      actedAt
      by {
        ...PublicationProfileFields
      }
    }
    publication {
      ... on Post {
        ...NotificationPostFields
      }
      ... on Comment {
        ...NotificationCommentFields
      }
      ... on Mirror {
        mirrorOn {
          ... on Post {
            ...NotificationPostFields
          }
          ... on Comment {
            ...NotificationCommentFields
          }
          ... on Quote {
            ...NotificationQuoteFields
          }
        }
      }
      ... on Quote {
        ...NotificationQuoteFields
      }
    }
  }
  ${PublicationProfileFieldsFragmentDoc}
  ${NotificationPostFieldsFragmentDoc}
  ${NotificationCommentFieldsFragmentDoc}
  ${NotificationQuoteFieldsFragmentDoc}
`;
export const FollowNotificationFieldsFragmentDoc = gql`
  fragment FollowNotificationFields on FollowNotification {
    id
    followers {
      ...PublicationProfileFields
    }
  }
  ${PublicationProfileFieldsFragmentDoc}
`;
export const MentionNotificationFieldsFragmentDoc = gql`
  fragment MentionNotificationFields on MentionNotification {
    id
    publication {
      ... on Post {
        ...NotificationPostFields
        by {
          ...PublicationProfileFields
        }
      }
      ... on Comment {
        ...NotificationCommentFields
        by {
          ...PublicationProfileFields
        }
      }
      ... on Quote {
        ...NotificationQuoteFields
        by {
          ...PublicationProfileFields
        }
      }
    }
  }
  ${NotificationPostFieldsFragmentDoc}
  ${PublicationProfileFieldsFragmentDoc}
  ${NotificationCommentFieldsFragmentDoc}
  ${NotificationQuoteFieldsFragmentDoc}
`;
export const NotificationFieldsFragmentDoc = gql`
  fragment NotificationFields on Notification {
    ... on ReactionNotification {
      ...ReactionNotificationFields
    }
    ... on CommentNotification {
      ...CommentNotificationFields
    }
    ... on MirrorNotification {
      ...MirrorNotificationFields
    }
    ... on QuoteNotification {
      ...QuoteNotificationFields
    }
    ... on ActedNotification {
      ...ActedNotificationFields
    }
    ... on FollowNotification {
      ...FollowNotificationFields
    }
    ... on MentionNotification {
      ...MentionNotificationFields
    }
  }
  ${ReactionNotificationFieldsFragmentDoc}
  ${CommentNotificationFieldsFragmentDoc}
  ${MirrorNotificationFieldsFragmentDoc}
  ${QuoteNotificationFieldsFragmentDoc}
  ${ActedNotificationFieldsFragmentDoc}
  ${FollowNotificationFieldsFragmentDoc}
  ${MentionNotificationFieldsFragmentDoc}
`;
export const AuthenticateDocument = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
      identityToken
    }
  }
`;
export type AuthenticateMutationFn = Apollo.MutationFunction<
  AuthenticateMutation,
  AuthenticateMutationVariables
>;

/**
 * __useAuthenticateMutation__
 *
 * To run a mutation, you first call `useAuthenticateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthenticateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authenticateMutation, { data, loading, error }] = useAuthenticateMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAuthenticateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AuthenticateMutation,
    AuthenticateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AuthenticateMutation,
    AuthenticateMutationVariables
  >(AuthenticateDocument, options);
}
export type AuthenticateMutationHookResult = ReturnType<
  typeof useAuthenticateMutation
>;
export type AuthenticateMutationResult =
  Apollo.MutationResult<AuthenticateMutation>;
export type AuthenticateMutationOptions = Apollo.BaseMutationOptions<
  AuthenticateMutation,
  AuthenticateMutationVariables
>;
export const BroadcastOnchainDocument = gql`
  mutation BroadcastOnchain($request: BroadcastRequest!) {
    broadcastOnchain(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on RelayError {
        reason
      }
    }
  }
`;
export type BroadcastOnchainMutationFn = Apollo.MutationFunction<
  BroadcastOnchainMutation,
  BroadcastOnchainMutationVariables
>;

/**
 * __useBroadcastOnchainMutation__
 *
 * To run a mutation, you first call `useBroadcastOnchainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBroadcastOnchainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [broadcastOnchainMutation, { data, loading, error }] = useBroadcastOnchainMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useBroadcastOnchainMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BroadcastOnchainMutation,
    BroadcastOnchainMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BroadcastOnchainMutation,
    BroadcastOnchainMutationVariables
  >(BroadcastOnchainDocument, options);
}
export type BroadcastOnchainMutationHookResult = ReturnType<
  typeof useBroadcastOnchainMutation
>;
export type BroadcastOnchainMutationResult =
  Apollo.MutationResult<BroadcastOnchainMutation>;
export type BroadcastOnchainMutationOptions = Apollo.BaseMutationOptions<
  BroadcastOnchainMutation,
  BroadcastOnchainMutationVariables
>;
export const BroadcastOnMomokaDocument = gql`
  mutation BroadcastOnMomoka($request: BroadcastRequest!) {
    broadcastOnMomoka(request: $request) {
      ... on CreateMomokaPublicationResult {
        id
      }
      ... on RelayError {
        reason
      }
    }
  }
`;
export type BroadcastOnMomokaMutationFn = Apollo.MutationFunction<
  BroadcastOnMomokaMutation,
  BroadcastOnMomokaMutationVariables
>;

/**
 * __useBroadcastOnMomokaMutation__
 *
 * To run a mutation, you first call `useBroadcastOnMomokaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBroadcastOnMomokaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [broadcastOnMomokaMutation, { data, loading, error }] = useBroadcastOnMomokaMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useBroadcastOnMomokaMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BroadcastOnMomokaMutation,
    BroadcastOnMomokaMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BroadcastOnMomokaMutation,
    BroadcastOnMomokaMutationVariables
  >(BroadcastOnMomokaDocument, options);
}
export type BroadcastOnMomokaMutationHookResult = ReturnType<
  typeof useBroadcastOnMomokaMutation
>;
export type BroadcastOnMomokaMutationResult =
  Apollo.MutationResult<BroadcastOnMomokaMutation>;
export type BroadcastOnMomokaMutationOptions = Apollo.BaseMutationOptions<
  BroadcastOnMomokaMutation,
  BroadcastOnMomokaMutationVariables
>;
export const AddProfileInterestsDocument = gql`
  mutation AddProfileInterests($request: ProfileInterestsRequest!) {
    addProfileInterests(request: $request)
  }
`;
export type AddProfileInterestsMutationFn = Apollo.MutationFunction<
  AddProfileInterestsMutation,
  AddProfileInterestsMutationVariables
>;

/**
 * __useAddProfileInterestsMutation__
 *
 * To run a mutation, you first call `useAddProfileInterestsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProfileInterestsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProfileInterestsMutation, { data, loading, error }] = useAddProfileInterestsMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAddProfileInterestsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddProfileInterestsMutation,
    AddProfileInterestsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddProfileInterestsMutation,
    AddProfileInterestsMutationVariables
  >(AddProfileInterestsDocument, options);
}
export type AddProfileInterestsMutationHookResult = ReturnType<
  typeof useAddProfileInterestsMutation
>;
export type AddProfileInterestsMutationResult =
  Apollo.MutationResult<AddProfileInterestsMutation>;
export type AddProfileInterestsMutationOptions = Apollo.BaseMutationOptions<
  AddProfileInterestsMutation,
  AddProfileInterestsMutationVariables
>;
export const BlockDocument = gql`
  mutation Block($request: BlockRequest!) {
    block(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type BlockMutationFn = Apollo.MutationFunction<
  BlockMutation,
  BlockMutationVariables
>;

/**
 * __useBlockMutation__
 *
 * To run a mutation, you first call `useBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [blockMutation, { data, loading, error }] = useBlockMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useBlockMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BlockMutation,
    BlockMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<BlockMutation, BlockMutationVariables>(
    BlockDocument,
    options
  );
}
export type BlockMutationHookResult = ReturnType<typeof useBlockMutation>;
export type BlockMutationResult = Apollo.MutationResult<BlockMutation>;
export type BlockMutationOptions = Apollo.BaseMutationOptions<
  BlockMutation,
  BlockMutationVariables
>;
export const CreateProfileWithHandleDocument = gql`
  mutation CreateProfileWithHandle($request: CreateProfileWithHandleRequest!) {
    createProfileWithHandle(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on CreateProfileWithHandleErrorResult {
        reason
      }
    }
  }
`;
export type CreateProfileWithHandleMutationFn = Apollo.MutationFunction<
  CreateProfileWithHandleMutation,
  CreateProfileWithHandleMutationVariables
>;

/**
 * __useCreateProfileWithHandleMutation__
 *
 * To run a mutation, you first call `useCreateProfileWithHandleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProfileWithHandleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProfileWithHandleMutation, { data, loading, error }] = useCreateProfileWithHandleMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateProfileWithHandleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateProfileWithHandleMutation,
    CreateProfileWithHandleMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateProfileWithHandleMutation,
    CreateProfileWithHandleMutationVariables
  >(CreateProfileWithHandleDocument, options);
}
export type CreateProfileWithHandleMutationHookResult = ReturnType<
  typeof useCreateProfileWithHandleMutation
>;
export type CreateProfileWithHandleMutationResult =
  Apollo.MutationResult<CreateProfileWithHandleMutation>;
export type CreateProfileWithHandleMutationOptions = Apollo.BaseMutationOptions<
  CreateProfileWithHandleMutation,
  CreateProfileWithHandleMutationVariables
>;
export const DismissRecommendedProfilesDocument = gql`
  mutation DismissRecommendedProfiles(
    $request: DismissRecommendedProfilesRequest!
  ) {
    dismissRecommendedProfiles(request: $request)
  }
`;
export type DismissRecommendedProfilesMutationFn = Apollo.MutationFunction<
  DismissRecommendedProfilesMutation,
  DismissRecommendedProfilesMutationVariables
>;

/**
 * __useDismissRecommendedProfilesMutation__
 *
 * To run a mutation, you first call `useDismissRecommendedProfilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissRecommendedProfilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissRecommendedProfilesMutation, { data, loading, error }] = useDismissRecommendedProfilesMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useDismissRecommendedProfilesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DismissRecommendedProfilesMutation,
    DismissRecommendedProfilesMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DismissRecommendedProfilesMutation,
    DismissRecommendedProfilesMutationVariables
  >(DismissRecommendedProfilesDocument, options);
}
export type DismissRecommendedProfilesMutationHookResult = ReturnType<
  typeof useDismissRecommendedProfilesMutation
>;
export type DismissRecommendedProfilesMutationResult =
  Apollo.MutationResult<DismissRecommendedProfilesMutation>;
export type DismissRecommendedProfilesMutationOptions =
  Apollo.BaseMutationOptions<
    DismissRecommendedProfilesMutation,
    DismissRecommendedProfilesMutationVariables
  >;
export const FollowDocument = gql`
  mutation Follow($request: FollowLensManagerRequest!) {
    follow(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type FollowMutationFn = Apollo.MutationFunction<
  FollowMutation,
  FollowMutationVariables
>;

/**
 * __useFollowMutation__
 *
 * To run a mutation, you first call `useFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followMutation, { data, loading, error }] = useFollowMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useFollowMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FollowMutation,
    FollowMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<FollowMutation, FollowMutationVariables>(
    FollowDocument,
    options
  );
}
export type FollowMutationHookResult = ReturnType<typeof useFollowMutation>;
export type FollowMutationResult = Apollo.MutationResult<FollowMutation>;
export type FollowMutationOptions = Apollo.BaseMutationOptions<
  FollowMutation,
  FollowMutationVariables
>;
export const HideManagedProfileDocument = gql`
  mutation HideManagedProfile($request: HideManagedProfileRequest!) {
    hideManagedProfile(request: $request)
  }
`;
export type HideManagedProfileMutationFn = Apollo.MutationFunction<
  HideManagedProfileMutation,
  HideManagedProfileMutationVariables
>;

/**
 * __useHideManagedProfileMutation__
 *
 * To run a mutation, you first call `useHideManagedProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHideManagedProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hideManagedProfileMutation, { data, loading, error }] = useHideManagedProfileMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useHideManagedProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    HideManagedProfileMutation,
    HideManagedProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    HideManagedProfileMutation,
    HideManagedProfileMutationVariables
  >(HideManagedProfileDocument, options);
}
export type HideManagedProfileMutationHookResult = ReturnType<
  typeof useHideManagedProfileMutation
>;
export type HideManagedProfileMutationResult =
  Apollo.MutationResult<HideManagedProfileMutation>;
export type HideManagedProfileMutationOptions = Apollo.BaseMutationOptions<
  HideManagedProfileMutation,
  HideManagedProfileMutationVariables
>;
export const LinkHandleToProfileDocument = gql`
  mutation LinkHandleToProfile($request: LinkHandleToProfileRequest!) {
    linkHandleToProfile(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type LinkHandleToProfileMutationFn = Apollo.MutationFunction<
  LinkHandleToProfileMutation,
  LinkHandleToProfileMutationVariables
>;

/**
 * __useLinkHandleToProfileMutation__
 *
 * To run a mutation, you first call `useLinkHandleToProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkHandleToProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkHandleToProfileMutation, { data, loading, error }] = useLinkHandleToProfileMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useLinkHandleToProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LinkHandleToProfileMutation,
    LinkHandleToProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LinkHandleToProfileMutation,
    LinkHandleToProfileMutationVariables
  >(LinkHandleToProfileDocument, options);
}
export type LinkHandleToProfileMutationHookResult = ReturnType<
  typeof useLinkHandleToProfileMutation
>;
export type LinkHandleToProfileMutationResult =
  Apollo.MutationResult<LinkHandleToProfileMutation>;
export type LinkHandleToProfileMutationOptions = Apollo.BaseMutationOptions<
  LinkHandleToProfileMutation,
  LinkHandleToProfileMutationVariables
>;
export const PeerToPeerRecommendDocument = gql`
  mutation PeerToPeerRecommend($request: PeerToPeerRecommendRequest!) {
    peerToPeerRecommend(request: $request)
  }
`;
export type PeerToPeerRecommendMutationFn = Apollo.MutationFunction<
  PeerToPeerRecommendMutation,
  PeerToPeerRecommendMutationVariables
>;

/**
 * __usePeerToPeerRecommendMutation__
 *
 * To run a mutation, you first call `usePeerToPeerRecommendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePeerToPeerRecommendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [peerToPeerRecommendMutation, { data, loading, error }] = usePeerToPeerRecommendMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePeerToPeerRecommendMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PeerToPeerRecommendMutation,
    PeerToPeerRecommendMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PeerToPeerRecommendMutation,
    PeerToPeerRecommendMutationVariables
  >(PeerToPeerRecommendDocument, options);
}
export type PeerToPeerRecommendMutationHookResult = ReturnType<
  typeof usePeerToPeerRecommendMutation
>;
export type PeerToPeerRecommendMutationResult =
  Apollo.MutationResult<PeerToPeerRecommendMutation>;
export type PeerToPeerRecommendMutationOptions = Apollo.BaseMutationOptions<
  PeerToPeerRecommendMutation,
  PeerToPeerRecommendMutationVariables
>;
export const PeerToPeerUnrecommendDocument = gql`
  mutation PeerToPeerUnrecommend($request: PeerToPeerRecommendRequest!) {
    peerToPeerUnrecommend(request: $request)
  }
`;
export type PeerToPeerUnrecommendMutationFn = Apollo.MutationFunction<
  PeerToPeerUnrecommendMutation,
  PeerToPeerUnrecommendMutationVariables
>;

/**
 * __usePeerToPeerUnrecommendMutation__
 *
 * To run a mutation, you first call `usePeerToPeerUnrecommendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePeerToPeerUnrecommendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [peerToPeerUnrecommendMutation, { data, loading, error }] = usePeerToPeerUnrecommendMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePeerToPeerUnrecommendMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PeerToPeerUnrecommendMutation,
    PeerToPeerUnrecommendMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PeerToPeerUnrecommendMutation,
    PeerToPeerUnrecommendMutationVariables
  >(PeerToPeerUnrecommendDocument, options);
}
export type PeerToPeerUnrecommendMutationHookResult = ReturnType<
  typeof usePeerToPeerUnrecommendMutation
>;
export type PeerToPeerUnrecommendMutationResult =
  Apollo.MutationResult<PeerToPeerUnrecommendMutation>;
export type PeerToPeerUnrecommendMutationOptions = Apollo.BaseMutationOptions<
  PeerToPeerUnrecommendMutation,
  PeerToPeerUnrecommendMutationVariables
>;
export const RemoveProfileInterestsDocument = gql`
  mutation RemoveProfileInterests($request: ProfileInterestsRequest!) {
    removeProfileInterests(request: $request)
  }
`;
export type RemoveProfileInterestsMutationFn = Apollo.MutationFunction<
  RemoveProfileInterestsMutation,
  RemoveProfileInterestsMutationVariables
>;

/**
 * __useRemoveProfileInterestsMutation__
 *
 * To run a mutation, you first call `useRemoveProfileInterestsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProfileInterestsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProfileInterestsMutation, { data, loading, error }] = useRemoveProfileInterestsMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useRemoveProfileInterestsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveProfileInterestsMutation,
    RemoveProfileInterestsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveProfileInterestsMutation,
    RemoveProfileInterestsMutationVariables
  >(RemoveProfileInterestsDocument, options);
}
export type RemoveProfileInterestsMutationHookResult = ReturnType<
  typeof useRemoveProfileInterestsMutation
>;
export type RemoveProfileInterestsMutationResult =
  Apollo.MutationResult<RemoveProfileInterestsMutation>;
export type RemoveProfileInterestsMutationOptions = Apollo.BaseMutationOptions<
  RemoveProfileInterestsMutation,
  RemoveProfileInterestsMutationVariables
>;
export const ReportProfileDocument = gql`
  mutation ReportProfile($request: ReportProfileRequest!) {
    reportProfile(request: $request)
  }
`;
export type ReportProfileMutationFn = Apollo.MutationFunction<
  ReportProfileMutation,
  ReportProfileMutationVariables
>;

/**
 * __useReportProfileMutation__
 *
 * To run a mutation, you first call `useReportProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportProfileMutation, { data, loading, error }] = useReportProfileMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useReportProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReportProfileMutation,
    ReportProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ReportProfileMutation,
    ReportProfileMutationVariables
  >(ReportProfileDocument, options);
}
export type ReportProfileMutationHookResult = ReturnType<
  typeof useReportProfileMutation
>;
export type ReportProfileMutationResult =
  Apollo.MutationResult<ReportProfileMutation>;
export type ReportProfileMutationOptions = Apollo.BaseMutationOptions<
  ReportProfileMutation,
  ReportProfileMutationVariables
>;
export const RevokeAuthenticationDocument = gql`
  mutation RevokeAuthentication($request: RevokeAuthenticationRequest!) {
    revokeAuthentication(request: $request)
  }
`;
export type RevokeAuthenticationMutationFn = Apollo.MutationFunction<
  RevokeAuthenticationMutation,
  RevokeAuthenticationMutationVariables
>;

/**
 * __useRevokeAuthenticationMutation__
 *
 * To run a mutation, you first call `useRevokeAuthenticationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeAuthenticationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeAuthenticationMutation, { data, loading, error }] = useRevokeAuthenticationMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useRevokeAuthenticationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RevokeAuthenticationMutation,
    RevokeAuthenticationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RevokeAuthenticationMutation,
    RevokeAuthenticationMutationVariables
  >(RevokeAuthenticationDocument, options);
}
export type RevokeAuthenticationMutationHookResult = ReturnType<
  typeof useRevokeAuthenticationMutation
>;
export type RevokeAuthenticationMutationResult =
  Apollo.MutationResult<RevokeAuthenticationMutation>;
export type RevokeAuthenticationMutationOptions = Apollo.BaseMutationOptions<
  RevokeAuthenticationMutation,
  RevokeAuthenticationMutationVariables
>;
export const SetDefaultProfileDocument = gql`
  mutation SetDefaultProfile($request: SetDefaultProfileRequest!) {
    setDefaultProfile(request: $request)
  }
`;
export type SetDefaultProfileMutationFn = Apollo.MutationFunction<
  SetDefaultProfileMutation,
  SetDefaultProfileMutationVariables
>;

/**
 * __useSetDefaultProfileMutation__
 *
 * To run a mutation, you first call `useSetDefaultProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDefaultProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDefaultProfileMutation, { data, loading, error }] = useSetDefaultProfileMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useSetDefaultProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetDefaultProfileMutation,
    SetDefaultProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SetDefaultProfileMutation,
    SetDefaultProfileMutationVariables
  >(SetDefaultProfileDocument, options);
}
export type SetDefaultProfileMutationHookResult = ReturnType<
  typeof useSetDefaultProfileMutation
>;
export type SetDefaultProfileMutationResult =
  Apollo.MutationResult<SetDefaultProfileMutation>;
export type SetDefaultProfileMutationOptions = Apollo.BaseMutationOptions<
  SetDefaultProfileMutation,
  SetDefaultProfileMutationVariables
>;
export const SetProfileMetadataDocument = gql`
  mutation SetProfileMetadata($request: OnchainSetProfileMetadataRequest!) {
    setProfileMetadata(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type SetProfileMetadataMutationFn = Apollo.MutationFunction<
  SetProfileMetadataMutation,
  SetProfileMetadataMutationVariables
>;

/**
 * __useSetProfileMetadataMutation__
 *
 * To run a mutation, you first call `useSetProfileMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetProfileMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setProfileMetadataMutation, { data, loading, error }] = useSetProfileMetadataMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useSetProfileMetadataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetProfileMetadataMutation,
    SetProfileMetadataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SetProfileMetadataMutation,
    SetProfileMetadataMutationVariables
  >(SetProfileMetadataDocument, options);
}
export type SetProfileMetadataMutationHookResult = ReturnType<
  typeof useSetProfileMetadataMutation
>;
export type SetProfileMetadataMutationResult =
  Apollo.MutationResult<SetProfileMetadataMutation>;
export type SetProfileMetadataMutationOptions = Apollo.BaseMutationOptions<
  SetProfileMetadataMutation,
  SetProfileMetadataMutationVariables
>;
export const UnblockDocument = gql`
  mutation Unblock($request: UnblockRequest!) {
    unblock(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type UnblockMutationFn = Apollo.MutationFunction<
  UnblockMutation,
  UnblockMutationVariables
>;

/**
 * __useUnblockMutation__
 *
 * To run a mutation, you first call `useUnblockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnblockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unblockMutation, { data, loading, error }] = useUnblockMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUnblockMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnblockMutation,
    UnblockMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnblockMutation, UnblockMutationVariables>(
    UnblockDocument,
    options
  );
}
export type UnblockMutationHookResult = ReturnType<typeof useUnblockMutation>;
export type UnblockMutationResult = Apollo.MutationResult<UnblockMutation>;
export type UnblockMutationOptions = Apollo.BaseMutationOptions<
  UnblockMutation,
  UnblockMutationVariables
>;
export const UnfollowDocument = gql`
  mutation Unfollow($request: UnfollowRequest!) {
    unfollow(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type UnfollowMutationFn = Apollo.MutationFunction<
  UnfollowMutation,
  UnfollowMutationVariables
>;

/**
 * __useUnfollowMutation__
 *
 * To run a mutation, you first call `useUnfollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowMutation, { data, loading, error }] = useUnfollowMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUnfollowMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnfollowMutation,
    UnfollowMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnfollowMutation, UnfollowMutationVariables>(
    UnfollowDocument,
    options
  );
}
export type UnfollowMutationHookResult = ReturnType<typeof useUnfollowMutation>;
export type UnfollowMutationResult = Apollo.MutationResult<UnfollowMutation>;
export type UnfollowMutationOptions = Apollo.BaseMutationOptions<
  UnfollowMutation,
  UnfollowMutationVariables
>;
export const UnhideManagedProfileDocument = gql`
  mutation UnhideManagedProfile($request: UnhideManagedProfileRequest!) {
    unhideManagedProfile(request: $request)
  }
`;
export type UnhideManagedProfileMutationFn = Apollo.MutationFunction<
  UnhideManagedProfileMutation,
  UnhideManagedProfileMutationVariables
>;

/**
 * __useUnhideManagedProfileMutation__
 *
 * To run a mutation, you first call `useUnhideManagedProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnhideManagedProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unhideManagedProfileMutation, { data, loading, error }] = useUnhideManagedProfileMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUnhideManagedProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnhideManagedProfileMutation,
    UnhideManagedProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UnhideManagedProfileMutation,
    UnhideManagedProfileMutationVariables
  >(UnhideManagedProfileDocument, options);
}
export type UnhideManagedProfileMutationHookResult = ReturnType<
  typeof useUnhideManagedProfileMutation
>;
export type UnhideManagedProfileMutationResult =
  Apollo.MutationResult<UnhideManagedProfileMutation>;
export type UnhideManagedProfileMutationOptions = Apollo.BaseMutationOptions<
  UnhideManagedProfileMutation,
  UnhideManagedProfileMutationVariables
>;
export const UnlinkHandleFromProfileDocument = gql`
  mutation UnlinkHandleFromProfile($request: UnlinkHandleFromProfileRequest!) {
    unlinkHandleFromProfile(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type UnlinkHandleFromProfileMutationFn = Apollo.MutationFunction<
  UnlinkHandleFromProfileMutation,
  UnlinkHandleFromProfileMutationVariables
>;

/**
 * __useUnlinkHandleFromProfileMutation__
 *
 * To run a mutation, you first call `useUnlinkHandleFromProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkHandleFromProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkHandleFromProfileMutation, { data, loading, error }] = useUnlinkHandleFromProfileMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUnlinkHandleFromProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnlinkHandleFromProfileMutation,
    UnlinkHandleFromProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UnlinkHandleFromProfileMutation,
    UnlinkHandleFromProfileMutationVariables
  >(UnlinkHandleFromProfileDocument, options);
}
export type UnlinkHandleFromProfileMutationHookResult = ReturnType<
  typeof useUnlinkHandleFromProfileMutation
>;
export type UnlinkHandleFromProfileMutationResult =
  Apollo.MutationResult<UnlinkHandleFromProfileMutation>;
export type UnlinkHandleFromProfileMutationOptions = Apollo.BaseMutationOptions<
  UnlinkHandleFromProfileMutation,
  UnlinkHandleFromProfileMutationVariables
>;
export const CreateBlockProfilesTypedDataDocument = gql`
  mutation CreateBlockProfilesTypedData(
    $options: TypedDataOptions
    $request: BlockRequest!
  ) {
    createBlockProfilesTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        value {
          nonce
          deadline
          byProfileId
          idsOfProfilesToSetBlockStatus
          blockStatus
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetBlockStatus {
            name
            type
          }
        }
      }
    }
  }
`;
export type CreateBlockProfilesTypedDataMutationFn = Apollo.MutationFunction<
  CreateBlockProfilesTypedDataMutation,
  CreateBlockProfilesTypedDataMutationVariables
>;

/**
 * __useCreateBlockProfilesTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateBlockProfilesTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBlockProfilesTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBlockProfilesTypedDataMutation, { data, loading, error }] = useCreateBlockProfilesTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateBlockProfilesTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateBlockProfilesTypedDataMutation,
    CreateBlockProfilesTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateBlockProfilesTypedDataMutation,
    CreateBlockProfilesTypedDataMutationVariables
  >(CreateBlockProfilesTypedDataDocument, options);
}
export type CreateBlockProfilesTypedDataMutationHookResult = ReturnType<
  typeof useCreateBlockProfilesTypedDataMutation
>;
export type CreateBlockProfilesTypedDataMutationResult =
  Apollo.MutationResult<CreateBlockProfilesTypedDataMutation>;
export type CreateBlockProfilesTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateBlockProfilesTypedDataMutation,
    CreateBlockProfilesTypedDataMutationVariables
  >;
export const CreateChangeProfileManagersTypedDataDocument = gql`
  mutation CreateChangeProfileManagersTypedData(
    $options: TypedDataOptions
    $request: ChangeProfileManagersRequest!
  ) {
    createChangeProfileManagersTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          ChangeDelegatedExecutorsConfig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          delegatorProfileId
          delegatedExecutors
          approvals
          configNumber
          switchToGivenConfig
        }
      }
    }
  }
`;
export type CreateChangeProfileManagersTypedDataMutationFn =
  Apollo.MutationFunction<
    CreateChangeProfileManagersTypedDataMutation,
    CreateChangeProfileManagersTypedDataMutationVariables
  >;

/**
 * __useCreateChangeProfileManagersTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateChangeProfileManagersTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChangeProfileManagersTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChangeProfileManagersTypedDataMutation, { data, loading, error }] = useCreateChangeProfileManagersTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateChangeProfileManagersTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateChangeProfileManagersTypedDataMutation,
    CreateChangeProfileManagersTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateChangeProfileManagersTypedDataMutation,
    CreateChangeProfileManagersTypedDataMutationVariables
  >(CreateChangeProfileManagersTypedDataDocument, options);
}
export type CreateChangeProfileManagersTypedDataMutationHookResult = ReturnType<
  typeof useCreateChangeProfileManagersTypedDataMutation
>;
export type CreateChangeProfileManagersTypedDataMutationResult =
  Apollo.MutationResult<CreateChangeProfileManagersTypedDataMutation>;
export type CreateChangeProfileManagersTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateChangeProfileManagersTypedDataMutation,
    CreateChangeProfileManagersTypedDataMutationVariables
  >;
export const CreateFollowTypedDataDocument = gql`
  mutation CreateFollowTypedData(
    $options: TypedDataOptions
    $request: FollowRequest!
  ) {
    createFollowTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          Follow {
            name
            type
          }
        }
        value {
          nonce
          deadline
          followerProfileId
          idsOfProfilesToFollow
          followTokenIds
          datas
        }
      }
    }
  }
`;
export type CreateFollowTypedDataMutationFn = Apollo.MutationFunction<
  CreateFollowTypedDataMutation,
  CreateFollowTypedDataMutationVariables
>;

/**
 * __useCreateFollowTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateFollowTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFollowTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFollowTypedDataMutation, { data, loading, error }] = useCreateFollowTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateFollowTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateFollowTypedDataMutation,
    CreateFollowTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateFollowTypedDataMutation,
    CreateFollowTypedDataMutationVariables
  >(CreateFollowTypedDataDocument, options);
}
export type CreateFollowTypedDataMutationHookResult = ReturnType<
  typeof useCreateFollowTypedDataMutation
>;
export type CreateFollowTypedDataMutationResult =
  Apollo.MutationResult<CreateFollowTypedDataMutation>;
export type CreateFollowTypedDataMutationOptions = Apollo.BaseMutationOptions<
  CreateFollowTypedDataMutation,
  CreateFollowTypedDataMutationVariables
>;
export const CreateLinkHandleToProfileTypedDataDocument = gql`
  mutation CreateLinkHandleToProfileTypedData(
    $options: TypedDataOptions
    $request: LinkHandleToProfileRequest!
  ) {
    createLinkHandleToProfileTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          Link {
            name
            type
          }
        }
        value {
          nonce
          deadline
          handleId
          profileId
        }
      }
    }
  }
`;
export type CreateLinkHandleToProfileTypedDataMutationFn =
  Apollo.MutationFunction<
    CreateLinkHandleToProfileTypedDataMutation,
    CreateLinkHandleToProfileTypedDataMutationVariables
  >;

/**
 * __useCreateLinkHandleToProfileTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateLinkHandleToProfileTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLinkHandleToProfileTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLinkHandleToProfileTypedDataMutation, { data, loading, error }] = useCreateLinkHandleToProfileTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateLinkHandleToProfileTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateLinkHandleToProfileTypedDataMutation,
    CreateLinkHandleToProfileTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateLinkHandleToProfileTypedDataMutation,
    CreateLinkHandleToProfileTypedDataMutationVariables
  >(CreateLinkHandleToProfileTypedDataDocument, options);
}
export type CreateLinkHandleToProfileTypedDataMutationHookResult = ReturnType<
  typeof useCreateLinkHandleToProfileTypedDataMutation
>;
export type CreateLinkHandleToProfileTypedDataMutationResult =
  Apollo.MutationResult<CreateLinkHandleToProfileTypedDataMutation>;
export type CreateLinkHandleToProfileTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateLinkHandleToProfileTypedDataMutation,
    CreateLinkHandleToProfileTypedDataMutationVariables
  >;
export const CreateOnchainSetProfileMetadataTypedDataDocument = gql`
  mutation CreateOnchainSetProfileMetadataTypedData(
    $options: TypedDataOptions
    $request: OnchainSetProfileMetadataRequest!
  ) {
    createOnchainSetProfileMetadataTypedData(
      options: $options
      request: $request
    ) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetProfileMetadataURI {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileId
          metadataURI
        }
      }
    }
  }
`;
export type CreateOnchainSetProfileMetadataTypedDataMutationFn =
  Apollo.MutationFunction<
    CreateOnchainSetProfileMetadataTypedDataMutation,
    CreateOnchainSetProfileMetadataTypedDataMutationVariables
  >;

/**
 * __useCreateOnchainSetProfileMetadataTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateOnchainSetProfileMetadataTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOnchainSetProfileMetadataTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOnchainSetProfileMetadataTypedDataMutation, { data, loading, error }] = useCreateOnchainSetProfileMetadataTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateOnchainSetProfileMetadataTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOnchainSetProfileMetadataTypedDataMutation,
    CreateOnchainSetProfileMetadataTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateOnchainSetProfileMetadataTypedDataMutation,
    CreateOnchainSetProfileMetadataTypedDataMutationVariables
  >(CreateOnchainSetProfileMetadataTypedDataDocument, options);
}
export type CreateOnchainSetProfileMetadataTypedDataMutationHookResult =
  ReturnType<typeof useCreateOnchainSetProfileMetadataTypedDataMutation>;
export type CreateOnchainSetProfileMetadataTypedDataMutationResult =
  Apollo.MutationResult<CreateOnchainSetProfileMetadataTypedDataMutation>;
export type CreateOnchainSetProfileMetadataTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateOnchainSetProfileMetadataTypedDataMutation,
    CreateOnchainSetProfileMetadataTypedDataMutationVariables
  >;
export const CreateSetFollowModuleTypedDataDocument = gql`
  mutation CreateSetFollowModuleTypedData(
    $options: TypedDataOptions
    $request: SetFollowModuleRequest!
  ) {
    createSetFollowModuleTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetFollowModule {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          followModule
          followModuleInitData
        }
      }
    }
  }
`;
export type CreateSetFollowModuleTypedDataMutationFn = Apollo.MutationFunction<
  CreateSetFollowModuleTypedDataMutation,
  CreateSetFollowModuleTypedDataMutationVariables
>;

/**
 * __useCreateSetFollowModuleTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateSetFollowModuleTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSetFollowModuleTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSetFollowModuleTypedDataMutation, { data, loading, error }] = useCreateSetFollowModuleTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateSetFollowModuleTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSetFollowModuleTypedDataMutation,
    CreateSetFollowModuleTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateSetFollowModuleTypedDataMutation,
    CreateSetFollowModuleTypedDataMutationVariables
  >(CreateSetFollowModuleTypedDataDocument, options);
}
export type CreateSetFollowModuleTypedDataMutationHookResult = ReturnType<
  typeof useCreateSetFollowModuleTypedDataMutation
>;
export type CreateSetFollowModuleTypedDataMutationResult =
  Apollo.MutationResult<CreateSetFollowModuleTypedDataMutation>;
export type CreateSetFollowModuleTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateSetFollowModuleTypedDataMutation,
    CreateSetFollowModuleTypedDataMutationVariables
  >;
export const CreateUnblockProfilesTypedDataDocument = gql`
  mutation CreateUnblockProfilesTypedData(
    $options: TypedDataOptions
    $request: UnblockRequest!
  ) {
    createUnblockProfilesTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetBlockStatus {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          byProfileId
          idsOfProfilesToSetBlockStatus
          blockStatus
        }
      }
    }
  }
`;
export type CreateUnblockProfilesTypedDataMutationFn = Apollo.MutationFunction<
  CreateUnblockProfilesTypedDataMutation,
  CreateUnblockProfilesTypedDataMutationVariables
>;

/**
 * __useCreateUnblockProfilesTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateUnblockProfilesTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUnblockProfilesTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUnblockProfilesTypedDataMutation, { data, loading, error }] = useCreateUnblockProfilesTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateUnblockProfilesTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUnblockProfilesTypedDataMutation,
    CreateUnblockProfilesTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateUnblockProfilesTypedDataMutation,
    CreateUnblockProfilesTypedDataMutationVariables
  >(CreateUnblockProfilesTypedDataDocument, options);
}
export type CreateUnblockProfilesTypedDataMutationHookResult = ReturnType<
  typeof useCreateUnblockProfilesTypedDataMutation
>;
export type CreateUnblockProfilesTypedDataMutationResult =
  Apollo.MutationResult<CreateUnblockProfilesTypedDataMutation>;
export type CreateUnblockProfilesTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateUnblockProfilesTypedDataMutation,
    CreateUnblockProfilesTypedDataMutationVariables
  >;
export const CreateUnfollowTypedDataDocument = gql`
  mutation CreateUnfollowTypedData(
    $options: TypedDataOptions
    $request: UnfollowRequest!
  ) {
    createUnfollowTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          Unfollow {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          unfollowerProfileId
          idsOfProfilesToUnfollow
        }
      }
    }
  }
`;
export type CreateUnfollowTypedDataMutationFn = Apollo.MutationFunction<
  CreateUnfollowTypedDataMutation,
  CreateUnfollowTypedDataMutationVariables
>;

/**
 * __useCreateUnfollowTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateUnfollowTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUnfollowTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUnfollowTypedDataMutation, { data, loading, error }] = useCreateUnfollowTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateUnfollowTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUnfollowTypedDataMutation,
    CreateUnfollowTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateUnfollowTypedDataMutation,
    CreateUnfollowTypedDataMutationVariables
  >(CreateUnfollowTypedDataDocument, options);
}
export type CreateUnfollowTypedDataMutationHookResult = ReturnType<
  typeof useCreateUnfollowTypedDataMutation
>;
export type CreateUnfollowTypedDataMutationResult =
  Apollo.MutationResult<CreateUnfollowTypedDataMutation>;
export type CreateUnfollowTypedDataMutationOptions = Apollo.BaseMutationOptions<
  CreateUnfollowTypedDataMutation,
  CreateUnfollowTypedDataMutationVariables
>;
export const CreateUnlinkHandleFromProfileTypedDataDocument = gql`
  mutation CreateUnlinkHandleFromProfileTypedData(
    $options: TypedDataOptions
    $request: UnlinkHandleFromProfileRequest!
  ) {
    createUnlinkHandleFromProfileTypedData(
      options: $options
      request: $request
    ) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          Unlink {
            name
            type
          }
        }
        value {
          nonce
          deadline
          handleId
          profileId
        }
      }
    }
  }
`;
export type CreateUnlinkHandleFromProfileTypedDataMutationFn =
  Apollo.MutationFunction<
    CreateUnlinkHandleFromProfileTypedDataMutation,
    CreateUnlinkHandleFromProfileTypedDataMutationVariables
  >;

/**
 * __useCreateUnlinkHandleFromProfileTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateUnlinkHandleFromProfileTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUnlinkHandleFromProfileTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUnlinkHandleFromProfileTypedDataMutation, { data, loading, error }] = useCreateUnlinkHandleFromProfileTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateUnlinkHandleFromProfileTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUnlinkHandleFromProfileTypedDataMutation,
    CreateUnlinkHandleFromProfileTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateUnlinkHandleFromProfileTypedDataMutation,
    CreateUnlinkHandleFromProfileTypedDataMutationVariables
  >(CreateUnlinkHandleFromProfileTypedDataDocument, options);
}
export type CreateUnlinkHandleFromProfileTypedDataMutationHookResult =
  ReturnType<typeof useCreateUnlinkHandleFromProfileTypedDataMutation>;
export type CreateUnlinkHandleFromProfileTypedDataMutationResult =
  Apollo.MutationResult<CreateUnlinkHandleFromProfileTypedDataMutation>;
export type CreateUnlinkHandleFromProfileTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateUnlinkHandleFromProfileTypedDataMutation,
    CreateUnlinkHandleFromProfileTypedDataMutationVariables
  >;
export const ActOnOpenActionDocument = gql`
  mutation ActOnOpenAction($request: ActOnOpenActionLensManagerRequest!) {
    actOnOpenAction(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type ActOnOpenActionMutationFn = Apollo.MutationFunction<
  ActOnOpenActionMutation,
  ActOnOpenActionMutationVariables
>;

/**
 * __useActOnOpenActionMutation__
 *
 * To run a mutation, you first call `useActOnOpenActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActOnOpenActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [actOnOpenActionMutation, { data, loading, error }] = useActOnOpenActionMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useActOnOpenActionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ActOnOpenActionMutation,
    ActOnOpenActionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ActOnOpenActionMutation,
    ActOnOpenActionMutationVariables
  >(ActOnOpenActionDocument, options);
}
export type ActOnOpenActionMutationHookResult = ReturnType<
  typeof useActOnOpenActionMutation
>;
export type ActOnOpenActionMutationResult =
  Apollo.MutationResult<ActOnOpenActionMutation>;
export type ActOnOpenActionMutationOptions = Apollo.BaseMutationOptions<
  ActOnOpenActionMutation,
  ActOnOpenActionMutationVariables
>;
export const AddPublicationBookmarkDocument = gql`
  mutation AddPublicationBookmark($request: PublicationBookmarkRequest!) {
    addPublicationBookmark(request: $request)
  }
`;
export type AddPublicationBookmarkMutationFn = Apollo.MutationFunction<
  AddPublicationBookmarkMutation,
  AddPublicationBookmarkMutationVariables
>;

/**
 * __useAddPublicationBookmarkMutation__
 *
 * To run a mutation, you first call `useAddPublicationBookmarkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPublicationBookmarkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPublicationBookmarkMutation, { data, loading, error }] = useAddPublicationBookmarkMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAddPublicationBookmarkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddPublicationBookmarkMutation,
    AddPublicationBookmarkMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddPublicationBookmarkMutation,
    AddPublicationBookmarkMutationVariables
  >(AddPublicationBookmarkDocument, options);
}
export type AddPublicationBookmarkMutationHookResult = ReturnType<
  typeof useAddPublicationBookmarkMutation
>;
export type AddPublicationBookmarkMutationResult =
  Apollo.MutationResult<AddPublicationBookmarkMutation>;
export type AddPublicationBookmarkMutationOptions = Apollo.BaseMutationOptions<
  AddPublicationBookmarkMutation,
  AddPublicationBookmarkMutationVariables
>;
export const AddPublicationNotInterestedDocument = gql`
  mutation AddPublicationNotInterested(
    $request: PublicationNotInterestedRequest!
  ) {
    addPublicationNotInterested(request: $request)
  }
`;
export type AddPublicationNotInterestedMutationFn = Apollo.MutationFunction<
  AddPublicationNotInterestedMutation,
  AddPublicationNotInterestedMutationVariables
>;

/**
 * __useAddPublicationNotInterestedMutation__
 *
 * To run a mutation, you first call `useAddPublicationNotInterestedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPublicationNotInterestedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPublicationNotInterestedMutation, { data, loading, error }] = useAddPublicationNotInterestedMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAddPublicationNotInterestedMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddPublicationNotInterestedMutation,
    AddPublicationNotInterestedMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddPublicationNotInterestedMutation,
    AddPublicationNotInterestedMutationVariables
  >(AddPublicationNotInterestedDocument, options);
}
export type AddPublicationNotInterestedMutationHookResult = ReturnType<
  typeof useAddPublicationNotInterestedMutation
>;
export type AddPublicationNotInterestedMutationResult =
  Apollo.MutationResult<AddPublicationNotInterestedMutation>;
export type AddPublicationNotInterestedMutationOptions =
  Apollo.BaseMutationOptions<
    AddPublicationNotInterestedMutation,
    AddPublicationNotInterestedMutationVariables
  >;
export const AddReactionDocument = gql`
  mutation AddReaction($request: ReactionRequest!) {
    addReaction(request: $request)
  }
`;
export type AddReactionMutationFn = Apollo.MutationFunction<
  AddReactionMutation,
  AddReactionMutationVariables
>;

/**
 * __useAddReactionMutation__
 *
 * To run a mutation, you first call `useAddReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addReactionMutation, { data, loading, error }] = useAddReactionMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAddReactionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddReactionMutation,
    AddReactionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddReactionMutation, AddReactionMutationVariables>(
    AddReactionDocument,
    options
  );
}
export type AddReactionMutationHookResult = ReturnType<
  typeof useAddReactionMutation
>;
export type AddReactionMutationResult =
  Apollo.MutationResult<AddReactionMutation>;
export type AddReactionMutationOptions = Apollo.BaseMutationOptions<
  AddReactionMutation,
  AddReactionMutationVariables
>;
export const HideCommentDocument = gql`
  mutation HideComment($request: HideCommentRequest!) {
    hideComment(request: $request)
  }
`;
export type HideCommentMutationFn = Apollo.MutationFunction<
  HideCommentMutation,
  HideCommentMutationVariables
>;

/**
 * __useHideCommentMutation__
 *
 * To run a mutation, you first call `useHideCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHideCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hideCommentMutation, { data, loading, error }] = useHideCommentMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useHideCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    HideCommentMutation,
    HideCommentMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<HideCommentMutation, HideCommentMutationVariables>(
    HideCommentDocument,
    options
  );
}
export type HideCommentMutationHookResult = ReturnType<
  typeof useHideCommentMutation
>;
export type HideCommentMutationResult =
  Apollo.MutationResult<HideCommentMutation>;
export type HideCommentMutationOptions = Apollo.BaseMutationOptions<
  HideCommentMutation,
  HideCommentMutationVariables
>;
export const HidePublicationDocument = gql`
  mutation HidePublication($request: HidePublicationRequest!) {
    hidePublication(request: $request)
  }
`;
export type HidePublicationMutationFn = Apollo.MutationFunction<
  HidePublicationMutation,
  HidePublicationMutationVariables
>;

/**
 * __useHidePublicationMutation__
 *
 * To run a mutation, you first call `useHidePublicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHidePublicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hidePublicationMutation, { data, loading, error }] = useHidePublicationMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useHidePublicationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    HidePublicationMutation,
    HidePublicationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    HidePublicationMutation,
    HidePublicationMutationVariables
  >(HidePublicationDocument, options);
}
export type HidePublicationMutationHookResult = ReturnType<
  typeof useHidePublicationMutation
>;
export type HidePublicationMutationResult =
  Apollo.MutationResult<HidePublicationMutation>;
export type HidePublicationMutationOptions = Apollo.BaseMutationOptions<
  HidePublicationMutation,
  HidePublicationMutationVariables
>;
export const ModDisputeReportDocument = gql`
  mutation ModDisputeReport($request: ModDisputeReportRequest!) {
    modDisputeReport(request: $request)
  }
`;
export type ModDisputeReportMutationFn = Apollo.MutationFunction<
  ModDisputeReportMutation,
  ModDisputeReportMutationVariables
>;

/**
 * __useModDisputeReportMutation__
 *
 * To run a mutation, you first call `useModDisputeReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useModDisputeReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [modDisputeReportMutation, { data, loading, error }] = useModDisputeReportMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useModDisputeReportMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ModDisputeReportMutation,
    ModDisputeReportMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ModDisputeReportMutation,
    ModDisputeReportMutationVariables
  >(ModDisputeReportDocument, options);
}
export type ModDisputeReportMutationHookResult = ReturnType<
  typeof useModDisputeReportMutation
>;
export type ModDisputeReportMutationResult =
  Apollo.MutationResult<ModDisputeReportMutation>;
export type ModDisputeReportMutationOptions = Apollo.BaseMutationOptions<
  ModDisputeReportMutation,
  ModDisputeReportMutationVariables
>;
export const RemovePublicationBookmarkDocument = gql`
  mutation RemovePublicationBookmark($request: PublicationBookmarkRequest!) {
    removePublicationBookmark(request: $request)
  }
`;
export type RemovePublicationBookmarkMutationFn = Apollo.MutationFunction<
  RemovePublicationBookmarkMutation,
  RemovePublicationBookmarkMutationVariables
>;

/**
 * __useRemovePublicationBookmarkMutation__
 *
 * To run a mutation, you first call `useRemovePublicationBookmarkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePublicationBookmarkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePublicationBookmarkMutation, { data, loading, error }] = useRemovePublicationBookmarkMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useRemovePublicationBookmarkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemovePublicationBookmarkMutation,
    RemovePublicationBookmarkMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemovePublicationBookmarkMutation,
    RemovePublicationBookmarkMutationVariables
  >(RemovePublicationBookmarkDocument, options);
}
export type RemovePublicationBookmarkMutationHookResult = ReturnType<
  typeof useRemovePublicationBookmarkMutation
>;
export type RemovePublicationBookmarkMutationResult =
  Apollo.MutationResult<RemovePublicationBookmarkMutation>;
export type RemovePublicationBookmarkMutationOptions =
  Apollo.BaseMutationOptions<
    RemovePublicationBookmarkMutation,
    RemovePublicationBookmarkMutationVariables
  >;
export const RemoveReactionDocument = gql`
  mutation RemoveReaction($request: ReactionRequest!) {
    removeReaction(request: $request)
  }
`;
export type RemoveReactionMutationFn = Apollo.MutationFunction<
  RemoveReactionMutation,
  RemoveReactionMutationVariables
>;

/**
 * __useRemoveReactionMutation__
 *
 * To run a mutation, you first call `useRemoveReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeReactionMutation, { data, loading, error }] = useRemoveReactionMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useRemoveReactionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveReactionMutation,
    RemoveReactionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveReactionMutation,
    RemoveReactionMutationVariables
  >(RemoveReactionDocument, options);
}
export type RemoveReactionMutationHookResult = ReturnType<
  typeof useRemoveReactionMutation
>;
export type RemoveReactionMutationResult =
  Apollo.MutationResult<RemoveReactionMutation>;
export type RemoveReactionMutationOptions = Apollo.BaseMutationOptions<
  RemoveReactionMutation,
  RemoveReactionMutationVariables
>;
export const ReportPublicationDocument = gql`
  mutation ReportPublication($request: ReportPublicationRequest!) {
    reportPublication(request: $request)
  }
`;
export type ReportPublicationMutationFn = Apollo.MutationFunction<
  ReportPublicationMutation,
  ReportPublicationMutationVariables
>;

/**
 * __useReportPublicationMutation__
 *
 * To run a mutation, you first call `useReportPublicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportPublicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportPublicationMutation, { data, loading, error }] = useReportPublicationMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useReportPublicationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReportPublicationMutation,
    ReportPublicationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ReportPublicationMutation,
    ReportPublicationMutationVariables
  >(ReportPublicationDocument, options);
}
export type ReportPublicationMutationHookResult = ReturnType<
  typeof useReportPublicationMutation
>;
export type ReportPublicationMutationResult =
  Apollo.MutationResult<ReportPublicationMutation>;
export type ReportPublicationMutationOptions = Apollo.BaseMutationOptions<
  ReportPublicationMutation,
  ReportPublicationMutationVariables
>;
export const UndoPublicationNotInterestedDocument = gql`
  mutation UndoPublicationNotInterested(
    $request: PublicationNotInterestedRequest!
  ) {
    undoPublicationNotInterested(request: $request)
  }
`;
export type UndoPublicationNotInterestedMutationFn = Apollo.MutationFunction<
  UndoPublicationNotInterestedMutation,
  UndoPublicationNotInterestedMutationVariables
>;

/**
 * __useUndoPublicationNotInterestedMutation__
 *
 * To run a mutation, you first call `useUndoPublicationNotInterestedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUndoPublicationNotInterestedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [undoPublicationNotInterestedMutation, { data, loading, error }] = useUndoPublicationNotInterestedMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUndoPublicationNotInterestedMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UndoPublicationNotInterestedMutation,
    UndoPublicationNotInterestedMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UndoPublicationNotInterestedMutation,
    UndoPublicationNotInterestedMutationVariables
  >(UndoPublicationNotInterestedDocument, options);
}
export type UndoPublicationNotInterestedMutationHookResult = ReturnType<
  typeof useUndoPublicationNotInterestedMutation
>;
export type UndoPublicationNotInterestedMutationResult =
  Apollo.MutationResult<UndoPublicationNotInterestedMutation>;
export type UndoPublicationNotInterestedMutationOptions =
  Apollo.BaseMutationOptions<
    UndoPublicationNotInterestedMutation,
    UndoPublicationNotInterestedMutationVariables
  >;
export const UnhideCommentDocument = gql`
  mutation UnhideComment($request: UnhideCommentRequest!) {
    unhideComment(request: $request)
  }
`;
export type UnhideCommentMutationFn = Apollo.MutationFunction<
  UnhideCommentMutation,
  UnhideCommentMutationVariables
>;

/**
 * __useUnhideCommentMutation__
 *
 * To run a mutation, you first call `useUnhideCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnhideCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unhideCommentMutation, { data, loading, error }] = useUnhideCommentMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUnhideCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnhideCommentMutation,
    UnhideCommentMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UnhideCommentMutation,
    UnhideCommentMutationVariables
  >(UnhideCommentDocument, options);
}
export type UnhideCommentMutationHookResult = ReturnType<
  typeof useUnhideCommentMutation
>;
export type UnhideCommentMutationResult =
  Apollo.MutationResult<UnhideCommentMutation>;
export type UnhideCommentMutationOptions = Apollo.BaseMutationOptions<
  UnhideCommentMutation,
  UnhideCommentMutationVariables
>;
export const SignFrameActionDocument = gql`
  mutation SignFrameAction($request: FrameLensManagerEIP712Request!) {
    signFrameAction(request: $request) {
      signature
    }
  }
`;
export type SignFrameActionMutationFn = Apollo.MutationFunction<
  SignFrameActionMutation,
  SignFrameActionMutationVariables
>;

/**
 * __useSignFrameActionMutation__
 *
 * To run a mutation, you first call `useSignFrameActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignFrameActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signFrameActionMutation, { data, loading, error }] = useSignFrameActionMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useSignFrameActionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SignFrameActionMutation,
    SignFrameActionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SignFrameActionMutation,
    SignFrameActionMutationVariables
  >(SignFrameActionDocument, options);
}
export type SignFrameActionMutationHookResult = ReturnType<
  typeof useSignFrameActionMutation
>;
export type SignFrameActionMutationResult =
  Apollo.MutationResult<SignFrameActionMutation>;
export type SignFrameActionMutationOptions = Apollo.BaseMutationOptions<
  SignFrameActionMutation,
  SignFrameActionMutationVariables
>;
export const CommentOnMomokaDocument = gql`
  mutation CommentOnMomoka($request: MomokaCommentRequest!) {
    commentOnMomoka(request: $request) {
      ... on CreateMomokaPublicationResult {
        id
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type CommentOnMomokaMutationFn = Apollo.MutationFunction<
  CommentOnMomokaMutation,
  CommentOnMomokaMutationVariables
>;

/**
 * __useCommentOnMomokaMutation__
 *
 * To run a mutation, you first call `useCommentOnMomokaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCommentOnMomokaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [commentOnMomokaMutation, { data, loading, error }] = useCommentOnMomokaMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCommentOnMomokaMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CommentOnMomokaMutation,
    CommentOnMomokaMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CommentOnMomokaMutation,
    CommentOnMomokaMutationVariables
  >(CommentOnMomokaDocument, options);
}
export type CommentOnMomokaMutationHookResult = ReturnType<
  typeof useCommentOnMomokaMutation
>;
export type CommentOnMomokaMutationResult =
  Apollo.MutationResult<CommentOnMomokaMutation>;
export type CommentOnMomokaMutationOptions = Apollo.BaseMutationOptions<
  CommentOnMomokaMutation,
  CommentOnMomokaMutationVariables
>;
export const MirrorOnMomokaDocument = gql`
  mutation MirrorOnMomoka($request: MomokaMirrorRequest!) {
    mirrorOnMomoka(request: $request) {
      ... on CreateMomokaPublicationResult {
        id
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type MirrorOnMomokaMutationFn = Apollo.MutationFunction<
  MirrorOnMomokaMutation,
  MirrorOnMomokaMutationVariables
>;

/**
 * __useMirrorOnMomokaMutation__
 *
 * To run a mutation, you first call `useMirrorOnMomokaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMirrorOnMomokaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mirrorOnMomokaMutation, { data, loading, error }] = useMirrorOnMomokaMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useMirrorOnMomokaMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MirrorOnMomokaMutation,
    MirrorOnMomokaMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MirrorOnMomokaMutation,
    MirrorOnMomokaMutationVariables
  >(MirrorOnMomokaDocument, options);
}
export type MirrorOnMomokaMutationHookResult = ReturnType<
  typeof useMirrorOnMomokaMutation
>;
export type MirrorOnMomokaMutationResult =
  Apollo.MutationResult<MirrorOnMomokaMutation>;
export type MirrorOnMomokaMutationOptions = Apollo.BaseMutationOptions<
  MirrorOnMomokaMutation,
  MirrorOnMomokaMutationVariables
>;
export const PostOnMomokaDocument = gql`
  mutation PostOnMomoka($request: MomokaPostRequest!) {
    postOnMomoka(request: $request) {
      ... on CreateMomokaPublicationResult {
        id
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type PostOnMomokaMutationFn = Apollo.MutationFunction<
  PostOnMomokaMutation,
  PostOnMomokaMutationVariables
>;

/**
 * __usePostOnMomokaMutation__
 *
 * To run a mutation, you first call `usePostOnMomokaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostOnMomokaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postOnMomokaMutation, { data, loading, error }] = usePostOnMomokaMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePostOnMomokaMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PostOnMomokaMutation,
    PostOnMomokaMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PostOnMomokaMutation,
    PostOnMomokaMutationVariables
  >(PostOnMomokaDocument, options);
}
export type PostOnMomokaMutationHookResult = ReturnType<
  typeof usePostOnMomokaMutation
>;
export type PostOnMomokaMutationResult =
  Apollo.MutationResult<PostOnMomokaMutation>;
export type PostOnMomokaMutationOptions = Apollo.BaseMutationOptions<
  PostOnMomokaMutation,
  PostOnMomokaMutationVariables
>;
export const QuoteOnMomokaDocument = gql`
  mutation QuoteOnMomoka($request: MomokaQuoteRequest!) {
    quoteOnMomoka(request: $request) {
      ... on CreateMomokaPublicationResult {
        id
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type QuoteOnMomokaMutationFn = Apollo.MutationFunction<
  QuoteOnMomokaMutation,
  QuoteOnMomokaMutationVariables
>;

/**
 * __useQuoteOnMomokaMutation__
 *
 * To run a mutation, you first call `useQuoteOnMomokaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useQuoteOnMomokaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [quoteOnMomokaMutation, { data, loading, error }] = useQuoteOnMomokaMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useQuoteOnMomokaMutation(
  baseOptions?: Apollo.MutationHookOptions<
    QuoteOnMomokaMutation,
    QuoteOnMomokaMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    QuoteOnMomokaMutation,
    QuoteOnMomokaMutationVariables
  >(QuoteOnMomokaDocument, options);
}
export type QuoteOnMomokaMutationHookResult = ReturnType<
  typeof useQuoteOnMomokaMutation
>;
export type QuoteOnMomokaMutationResult =
  Apollo.MutationResult<QuoteOnMomokaMutation>;
export type QuoteOnMomokaMutationOptions = Apollo.BaseMutationOptions<
  QuoteOnMomokaMutation,
  QuoteOnMomokaMutationVariables
>;
export const CommentOnchainDocument = gql`
  mutation CommentOnchain($request: OnchainCommentRequest!) {
    commentOnchain(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type CommentOnchainMutationFn = Apollo.MutationFunction<
  CommentOnchainMutation,
  CommentOnchainMutationVariables
>;

/**
 * __useCommentOnchainMutation__
 *
 * To run a mutation, you first call `useCommentOnchainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCommentOnchainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [commentOnchainMutation, { data, loading, error }] = useCommentOnchainMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCommentOnchainMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CommentOnchainMutation,
    CommentOnchainMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CommentOnchainMutation,
    CommentOnchainMutationVariables
  >(CommentOnchainDocument, options);
}
export type CommentOnchainMutationHookResult = ReturnType<
  typeof useCommentOnchainMutation
>;
export type CommentOnchainMutationResult =
  Apollo.MutationResult<CommentOnchainMutation>;
export type CommentOnchainMutationOptions = Apollo.BaseMutationOptions<
  CommentOnchainMutation,
  CommentOnchainMutationVariables
>;
export const MirrorOnchainDocument = gql`
  mutation MirrorOnchain($request: OnchainMirrorRequest!) {
    mirrorOnchain(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type MirrorOnchainMutationFn = Apollo.MutationFunction<
  MirrorOnchainMutation,
  MirrorOnchainMutationVariables
>;

/**
 * __useMirrorOnchainMutation__
 *
 * To run a mutation, you first call `useMirrorOnchainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMirrorOnchainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mirrorOnchainMutation, { data, loading, error }] = useMirrorOnchainMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useMirrorOnchainMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MirrorOnchainMutation,
    MirrorOnchainMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MirrorOnchainMutation,
    MirrorOnchainMutationVariables
  >(MirrorOnchainDocument, options);
}
export type MirrorOnchainMutationHookResult = ReturnType<
  typeof useMirrorOnchainMutation
>;
export type MirrorOnchainMutationResult =
  Apollo.MutationResult<MirrorOnchainMutation>;
export type MirrorOnchainMutationOptions = Apollo.BaseMutationOptions<
  MirrorOnchainMutation,
  MirrorOnchainMutationVariables
>;
export const PostOnchainDocument = gql`
  mutation PostOnchain($request: OnchainPostRequest!) {
    postOnchain(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type PostOnchainMutationFn = Apollo.MutationFunction<
  PostOnchainMutation,
  PostOnchainMutationVariables
>;

/**
 * __usePostOnchainMutation__
 *
 * To run a mutation, you first call `usePostOnchainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostOnchainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postOnchainMutation, { data, loading, error }] = usePostOnchainMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePostOnchainMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PostOnchainMutation,
    PostOnchainMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PostOnchainMutation, PostOnchainMutationVariables>(
    PostOnchainDocument,
    options
  );
}
export type PostOnchainMutationHookResult = ReturnType<
  typeof usePostOnchainMutation
>;
export type PostOnchainMutationResult =
  Apollo.MutationResult<PostOnchainMutation>;
export type PostOnchainMutationOptions = Apollo.BaseMutationOptions<
  PostOnchainMutation,
  PostOnchainMutationVariables
>;
export const QuoteOnchainDocument = gql`
  mutation QuoteOnchain($request: OnchainQuoteRequest!) {
    quoteOnchain(request: $request) {
      ... on RelaySuccess {
        txId
      }
      ... on LensProfileManagerRelayError {
        reason
      }
    }
  }
`;
export type QuoteOnchainMutationFn = Apollo.MutationFunction<
  QuoteOnchainMutation,
  QuoteOnchainMutationVariables
>;

/**
 * __useQuoteOnchainMutation__
 *
 * To run a mutation, you first call `useQuoteOnchainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useQuoteOnchainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [quoteOnchainMutation, { data, loading, error }] = useQuoteOnchainMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useQuoteOnchainMutation(
  baseOptions?: Apollo.MutationHookOptions<
    QuoteOnchainMutation,
    QuoteOnchainMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    QuoteOnchainMutation,
    QuoteOnchainMutationVariables
  >(QuoteOnchainDocument, options);
}
export type QuoteOnchainMutationHookResult = ReturnType<
  typeof useQuoteOnchainMutation
>;
export type QuoteOnchainMutationResult =
  Apollo.MutationResult<QuoteOnchainMutation>;
export type QuoteOnchainMutationOptions = Apollo.BaseMutationOptions<
  QuoteOnchainMutation,
  QuoteOnchainMutationVariables
>;
export const CreateMomokaCommentTypedDataDocument = gql`
  mutation CreateMomokaCommentTypedData($request: MomokaCommentRequest!) {
    createMomokaCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          Comment {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          actionModules
          actionModulesInitDatas
          contentURI
          deadline
          nonce
          pointedProfileId
          pointedPubId
          profileId
          referenceModule
          referenceModuleData
          referenceModuleInitData
          referrerProfileIds
          referrerPubIds
        }
      }
    }
  }
`;
export type CreateMomokaCommentTypedDataMutationFn = Apollo.MutationFunction<
  CreateMomokaCommentTypedDataMutation,
  CreateMomokaCommentTypedDataMutationVariables
>;

/**
 * __useCreateMomokaCommentTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateMomokaCommentTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMomokaCommentTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMomokaCommentTypedDataMutation, { data, loading, error }] = useCreateMomokaCommentTypedDataMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateMomokaCommentTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMomokaCommentTypedDataMutation,
    CreateMomokaCommentTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateMomokaCommentTypedDataMutation,
    CreateMomokaCommentTypedDataMutationVariables
  >(CreateMomokaCommentTypedDataDocument, options);
}
export type CreateMomokaCommentTypedDataMutationHookResult = ReturnType<
  typeof useCreateMomokaCommentTypedDataMutation
>;
export type CreateMomokaCommentTypedDataMutationResult =
  Apollo.MutationResult<CreateMomokaCommentTypedDataMutation>;
export type CreateMomokaCommentTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateMomokaCommentTypedDataMutation,
    CreateMomokaCommentTypedDataMutationVariables
  >;
export const CreateMomokaMirrorTypedDataDocument = gql`
  mutation CreateMomokaMirrorTypedData($request: MomokaMirrorRequest!) {
    createMomokaMirrorTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          Mirror {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          metadataURI
          deadline
          profileId
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          referenceModuleData
        }
      }
    }
  }
`;
export type CreateMomokaMirrorTypedDataMutationFn = Apollo.MutationFunction<
  CreateMomokaMirrorTypedDataMutation,
  CreateMomokaMirrorTypedDataMutationVariables
>;

/**
 * __useCreateMomokaMirrorTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateMomokaMirrorTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMomokaMirrorTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMomokaMirrorTypedDataMutation, { data, loading, error }] = useCreateMomokaMirrorTypedDataMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateMomokaMirrorTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMomokaMirrorTypedDataMutation,
    CreateMomokaMirrorTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateMomokaMirrorTypedDataMutation,
    CreateMomokaMirrorTypedDataMutationVariables
  >(CreateMomokaMirrorTypedDataDocument, options);
}
export type CreateMomokaMirrorTypedDataMutationHookResult = ReturnType<
  typeof useCreateMomokaMirrorTypedDataMutation
>;
export type CreateMomokaMirrorTypedDataMutationResult =
  Apollo.MutationResult<CreateMomokaMirrorTypedDataMutation>;
export type CreateMomokaMirrorTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateMomokaMirrorTypedDataMutation,
    CreateMomokaMirrorTypedDataMutationVariables
  >;
export const CreateMomokaPostTypedDataDocument = gql`
  mutation CreateMomokaPostTypedData($request: MomokaPostRequest!) {
    createMomokaPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          Post {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;
export type CreateMomokaPostTypedDataMutationFn = Apollo.MutationFunction<
  CreateMomokaPostTypedDataMutation,
  CreateMomokaPostTypedDataMutationVariables
>;

/**
 * __useCreateMomokaPostTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateMomokaPostTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMomokaPostTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMomokaPostTypedDataMutation, { data, loading, error }] = useCreateMomokaPostTypedDataMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateMomokaPostTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMomokaPostTypedDataMutation,
    CreateMomokaPostTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateMomokaPostTypedDataMutation,
    CreateMomokaPostTypedDataMutationVariables
  >(CreateMomokaPostTypedDataDocument, options);
}
export type CreateMomokaPostTypedDataMutationHookResult = ReturnType<
  typeof useCreateMomokaPostTypedDataMutation
>;
export type CreateMomokaPostTypedDataMutationResult =
  Apollo.MutationResult<CreateMomokaPostTypedDataMutation>;
export type CreateMomokaPostTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateMomokaPostTypedDataMutation,
    CreateMomokaPostTypedDataMutationVariables
  >;
export const CreateMomokaQuoteTypedDataDocument = gql`
  mutation CreateMomokaQuoteTypedData($request: MomokaQuoteRequest!) {
    createMomokaQuoteTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          Quote {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`;
export type CreateMomokaQuoteTypedDataMutationFn = Apollo.MutationFunction<
  CreateMomokaQuoteTypedDataMutation,
  CreateMomokaQuoteTypedDataMutationVariables
>;

/**
 * __useCreateMomokaQuoteTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateMomokaQuoteTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMomokaQuoteTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMomokaQuoteTypedDataMutation, { data, loading, error }] = useCreateMomokaQuoteTypedDataMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateMomokaQuoteTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMomokaQuoteTypedDataMutation,
    CreateMomokaQuoteTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateMomokaQuoteTypedDataMutation,
    CreateMomokaQuoteTypedDataMutationVariables
  >(CreateMomokaQuoteTypedDataDocument, options);
}
export type CreateMomokaQuoteTypedDataMutationHookResult = ReturnType<
  typeof useCreateMomokaQuoteTypedDataMutation
>;
export type CreateMomokaQuoteTypedDataMutationResult =
  Apollo.MutationResult<CreateMomokaQuoteTypedDataMutation>;
export type CreateMomokaQuoteTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateMomokaQuoteTypedDataMutation,
    CreateMomokaQuoteTypedDataMutationVariables
  >;
export const CreateActOnOpenActionTypedDataDocument = gql`
  mutation CreateActOnOpenActionTypedData(
    $options: TypedDataOptions
    $request: ActOnOpenActionRequest!
  ) {
    createActOnOpenActionTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          Act {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          publicationActedProfileId
          publicationActedId
          actorProfileId
          referrerProfileIds
          referrerPubIds
          actionModuleAddress
          actionModuleData
        }
      }
    }
  }
`;
export type CreateActOnOpenActionTypedDataMutationFn = Apollo.MutationFunction<
  CreateActOnOpenActionTypedDataMutation,
  CreateActOnOpenActionTypedDataMutationVariables
>;

/**
 * __useCreateActOnOpenActionTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateActOnOpenActionTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateActOnOpenActionTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createActOnOpenActionTypedDataMutation, { data, loading, error }] = useCreateActOnOpenActionTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateActOnOpenActionTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateActOnOpenActionTypedDataMutation,
    CreateActOnOpenActionTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateActOnOpenActionTypedDataMutation,
    CreateActOnOpenActionTypedDataMutationVariables
  >(CreateActOnOpenActionTypedDataDocument, options);
}
export type CreateActOnOpenActionTypedDataMutationHookResult = ReturnType<
  typeof useCreateActOnOpenActionTypedDataMutation
>;
export type CreateActOnOpenActionTypedDataMutationResult =
  Apollo.MutationResult<CreateActOnOpenActionTypedDataMutation>;
export type CreateActOnOpenActionTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateActOnOpenActionTypedDataMutation,
    CreateActOnOpenActionTypedDataMutationVariables
  >;
export const CreateOnchainCommentTypedDataDocument = gql`
  mutation CreateOnchainCommentTypedData(
    $options: TypedDataOptions
    $request: OnchainCommentRequest!
  ) {
    createOnchainCommentTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          Comment {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          referenceModuleData
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;
export type CreateOnchainCommentTypedDataMutationFn = Apollo.MutationFunction<
  CreateOnchainCommentTypedDataMutation,
  CreateOnchainCommentTypedDataMutationVariables
>;

/**
 * __useCreateOnchainCommentTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateOnchainCommentTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOnchainCommentTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOnchainCommentTypedDataMutation, { data, loading, error }] = useCreateOnchainCommentTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateOnchainCommentTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOnchainCommentTypedDataMutation,
    CreateOnchainCommentTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateOnchainCommentTypedDataMutation,
    CreateOnchainCommentTypedDataMutationVariables
  >(CreateOnchainCommentTypedDataDocument, options);
}
export type CreateOnchainCommentTypedDataMutationHookResult = ReturnType<
  typeof useCreateOnchainCommentTypedDataMutation
>;
export type CreateOnchainCommentTypedDataMutationResult =
  Apollo.MutationResult<CreateOnchainCommentTypedDataMutation>;
export type CreateOnchainCommentTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateOnchainCommentTypedDataMutation,
    CreateOnchainCommentTypedDataMutationVariables
  >;
export const CreateOnchainMirrorTypedDataDocument = gql`
  mutation CreateOnchainMirrorTypedData(
    $options: TypedDataOptions
    $request: OnchainMirrorRequest!
  ) {
    createOnchainMirrorTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          Mirror {
            name
            type
          }
        }
        value {
          nonce
          metadataURI
          deadline
          profileId
          metadataURI
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          referenceModuleData
        }
      }
    }
  }
`;
export type CreateOnchainMirrorTypedDataMutationFn = Apollo.MutationFunction<
  CreateOnchainMirrorTypedDataMutation,
  CreateOnchainMirrorTypedDataMutationVariables
>;

/**
 * __useCreateOnchainMirrorTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateOnchainMirrorTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOnchainMirrorTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOnchainMirrorTypedDataMutation, { data, loading, error }] = useCreateOnchainMirrorTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateOnchainMirrorTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOnchainMirrorTypedDataMutation,
    CreateOnchainMirrorTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateOnchainMirrorTypedDataMutation,
    CreateOnchainMirrorTypedDataMutationVariables
  >(CreateOnchainMirrorTypedDataDocument, options);
}
export type CreateOnchainMirrorTypedDataMutationHookResult = ReturnType<
  typeof useCreateOnchainMirrorTypedDataMutation
>;
export type CreateOnchainMirrorTypedDataMutationResult =
  Apollo.MutationResult<CreateOnchainMirrorTypedDataMutation>;
export type CreateOnchainMirrorTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateOnchainMirrorTypedDataMutation,
    CreateOnchainMirrorTypedDataMutationVariables
  >;
export const CreateOnchainPostTypedDataDocument = gql`
  mutation CreateOnchainPostTypedData(
    $options: TypedDataOptions
    $request: OnchainPostRequest!
  ) {
    createOnchainPostTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          Post {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;
export type CreateOnchainPostTypedDataMutationFn = Apollo.MutationFunction<
  CreateOnchainPostTypedDataMutation,
  CreateOnchainPostTypedDataMutationVariables
>;

/**
 * __useCreateOnchainPostTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateOnchainPostTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOnchainPostTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOnchainPostTypedDataMutation, { data, loading, error }] = useCreateOnchainPostTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateOnchainPostTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOnchainPostTypedDataMutation,
    CreateOnchainPostTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateOnchainPostTypedDataMutation,
    CreateOnchainPostTypedDataMutationVariables
  >(CreateOnchainPostTypedDataDocument, options);
}
export type CreateOnchainPostTypedDataMutationHookResult = ReturnType<
  typeof useCreateOnchainPostTypedDataMutation
>;
export type CreateOnchainPostTypedDataMutationResult =
  Apollo.MutationResult<CreateOnchainPostTypedDataMutation>;
export type CreateOnchainPostTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateOnchainPostTypedDataMutation,
    CreateOnchainPostTypedDataMutationVariables
  >;
export const CreateOnchainQuoteTypedDataDocument = gql`
  mutation CreateOnchainQuoteTypedData(
    $options: TypedDataOptions
    $request: OnchainQuoteRequest!
  ) {
    createOnchainQuoteTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          Quote {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          pointedProfileId
          pointedPubId
          referrerProfileIds
          referrerPubIds
          referenceModuleData
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;
export type CreateOnchainQuoteTypedDataMutationFn = Apollo.MutationFunction<
  CreateOnchainQuoteTypedDataMutation,
  CreateOnchainQuoteTypedDataMutationVariables
>;

/**
 * __useCreateOnchainQuoteTypedDataMutation__
 *
 * To run a mutation, you first call `useCreateOnchainQuoteTypedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOnchainQuoteTypedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOnchainQuoteTypedDataMutation, { data, loading, error }] = useCreateOnchainQuoteTypedDataMutation({
 *   variables: {
 *      options: // value for 'options'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateOnchainQuoteTypedDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOnchainQuoteTypedDataMutation,
    CreateOnchainQuoteTypedDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateOnchainQuoteTypedDataMutation,
    CreateOnchainQuoteTypedDataMutationVariables
  >(CreateOnchainQuoteTypedDataDocument, options);
}
export type CreateOnchainQuoteTypedDataMutationHookResult = ReturnType<
  typeof useCreateOnchainQuoteTypedDataMutation
>;
export type CreateOnchainQuoteTypedDataMutationResult =
  Apollo.MutationResult<CreateOnchainQuoteTypedDataMutation>;
export type CreateOnchainQuoteTypedDataMutationOptions =
  Apollo.BaseMutationOptions<
    CreateOnchainQuoteTypedDataMutation,
    CreateOnchainQuoteTypedDataMutationVariables
  >;
export const ApprovedAuthenticationsDocument = gql`
  query ApprovedAuthentications($request: ApprovedAuthenticationRequest!) {
    approvedAuthentications(request: $request) {
      items {
        authorizationId
        browser
        os
        origin
        expiresAt
        createdAt
        updatedAt
      }
      pageInfo {
        next
      }
    }
  }
`;

/**
 * __useApprovedAuthenticationsQuery__
 *
 * To run a query within a React component, call `useApprovedAuthenticationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useApprovedAuthenticationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApprovedAuthenticationsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useApprovedAuthenticationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    ApprovedAuthenticationsQuery,
    ApprovedAuthenticationsQueryVariables
  > &
    (
      | { variables: ApprovedAuthenticationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ApprovedAuthenticationsQuery,
    ApprovedAuthenticationsQueryVariables
  >(ApprovedAuthenticationsDocument, options);
}
export function useApprovedAuthenticationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ApprovedAuthenticationsQuery,
    ApprovedAuthenticationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ApprovedAuthenticationsQuery,
    ApprovedAuthenticationsQueryVariables
  >(ApprovedAuthenticationsDocument, options);
}
export function useApprovedAuthenticationsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ApprovedAuthenticationsQuery,
    ApprovedAuthenticationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ApprovedAuthenticationsQuery,
    ApprovedAuthenticationsQueryVariables
  >(ApprovedAuthenticationsDocument, options);
}
export type ApprovedAuthenticationsQueryHookResult = ReturnType<
  typeof useApprovedAuthenticationsQuery
>;
export type ApprovedAuthenticationsLazyQueryHookResult = ReturnType<
  typeof useApprovedAuthenticationsLazyQuery
>;
export type ApprovedAuthenticationsSuspenseQueryHookResult = ReturnType<
  typeof useApprovedAuthenticationsSuspenseQuery
>;
export type ApprovedAuthenticationsQueryResult = Apollo.QueryResult<
  ApprovedAuthenticationsQuery,
  ApprovedAuthenticationsQueryVariables
>;
export const ApprovedModuleAllowanceAmountDocument = gql`
  query ApprovedModuleAllowanceAmount(
    $request: ApprovedModuleAllowanceAmountRequest!
  ) {
    approvedModuleAllowanceAmount(request: $request) {
      allowance {
        value
        asset {
          ...Erc20Fields
        }
      }
      moduleContract {
        ...NetworkAddressFields
      }
      moduleName
    }
  }
  ${Erc20FieldsFragmentDoc}
  ${NetworkAddressFieldsFragmentDoc}
`;

/**
 * __useApprovedModuleAllowanceAmountQuery__
 *
 * To run a query within a React component, call `useApprovedModuleAllowanceAmountQuery` and pass it any options that fit your needs.
 * When your component renders, `useApprovedModuleAllowanceAmountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApprovedModuleAllowanceAmountQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useApprovedModuleAllowanceAmountQuery(
  baseOptions: Apollo.QueryHookOptions<
    ApprovedModuleAllowanceAmountQuery,
    ApprovedModuleAllowanceAmountQueryVariables
  > &
    (
      | {
          variables: ApprovedModuleAllowanceAmountQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ApprovedModuleAllowanceAmountQuery,
    ApprovedModuleAllowanceAmountQueryVariables
  >(ApprovedModuleAllowanceAmountDocument, options);
}
export function useApprovedModuleAllowanceAmountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ApprovedModuleAllowanceAmountQuery,
    ApprovedModuleAllowanceAmountQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ApprovedModuleAllowanceAmountQuery,
    ApprovedModuleAllowanceAmountQueryVariables
  >(ApprovedModuleAllowanceAmountDocument, options);
}
export function useApprovedModuleAllowanceAmountSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ApprovedModuleAllowanceAmountQuery,
    ApprovedModuleAllowanceAmountQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ApprovedModuleAllowanceAmountQuery,
    ApprovedModuleAllowanceAmountQueryVariables
  >(ApprovedModuleAllowanceAmountDocument, options);
}
export type ApprovedModuleAllowanceAmountQueryHookResult = ReturnType<
  typeof useApprovedModuleAllowanceAmountQuery
>;
export type ApprovedModuleAllowanceAmountLazyQueryHookResult = ReturnType<
  typeof useApprovedModuleAllowanceAmountLazyQuery
>;
export type ApprovedModuleAllowanceAmountSuspenseQueryHookResult = ReturnType<
  typeof useApprovedModuleAllowanceAmountSuspenseQuery
>;
export type ApprovedModuleAllowanceAmountQueryResult = Apollo.QueryResult<
  ApprovedModuleAllowanceAmountQuery,
  ApprovedModuleAllowanceAmountQueryVariables
>;
export const ChallengeDocument = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      id
      text
    }
  }
`;

/**
 * __useChallengeQuery__
 *
 * To run a query within a React component, call `useChallengeQuery` and pass it any options that fit your needs.
 * When your component renders, `useChallengeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChallengeQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useChallengeQuery(
  baseOptions: Apollo.QueryHookOptions<
    ChallengeQuery,
    ChallengeQueryVariables
  > &
    ({ variables: ChallengeQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ChallengeQuery, ChallengeQueryVariables>(
    ChallengeDocument,
    options
  );
}
export function useChallengeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ChallengeQuery,
    ChallengeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ChallengeQuery, ChallengeQueryVariables>(
    ChallengeDocument,
    options
  );
}
export function useChallengeSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ChallengeQuery,
    ChallengeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ChallengeQuery, ChallengeQueryVariables>(
    ChallengeDocument,
    options
  );
}
export type ChallengeQueryHookResult = ReturnType<typeof useChallengeQuery>;
export type ChallengeLazyQueryHookResult = ReturnType<
  typeof useChallengeLazyQuery
>;
export type ChallengeSuspenseQueryHookResult = ReturnType<
  typeof useChallengeSuspenseQuery
>;
export type ChallengeQueryResult = Apollo.QueryResult<
  ChallengeQuery,
  ChallengeQueryVariables
>;
export const CurrentProfileDocument = gql`
  query CurrentProfile($request: ProfileRequest!) {
    profile(request: $request) {
      ...ProfileFields
      handle {
        ...HandleInfoFields
        guardian {
          cooldownEndsOn
          protected
        }
      }
      guardian {
        protected
        cooldownEndsOn
      }
    }
    userSigNonces {
      lensHubOnchainSigNonce
    }
  }
  ${ProfileFieldsFragmentDoc}
  ${HandleInfoFieldsFragmentDoc}
`;

/**
 * __useCurrentProfileQuery__
 *
 * To run a query within a React component, call `useCurrentProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentProfileQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCurrentProfileQuery(
  baseOptions: Apollo.QueryHookOptions<
    CurrentProfileQuery,
    CurrentProfileQueryVariables
  > &
    (
      | { variables: CurrentProfileQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentProfileQuery, CurrentProfileQueryVariables>(
    CurrentProfileDocument,
    options
  );
}
export function useCurrentProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CurrentProfileQuery,
    CurrentProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CurrentProfileQuery, CurrentProfileQueryVariables>(
    CurrentProfileDocument,
    options
  );
}
export function useCurrentProfileSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    CurrentProfileQuery,
    CurrentProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CurrentProfileQuery,
    CurrentProfileQueryVariables
  >(CurrentProfileDocument, options);
}
export type CurrentProfileQueryHookResult = ReturnType<
  typeof useCurrentProfileQuery
>;
export type CurrentProfileLazyQueryHookResult = ReturnType<
  typeof useCurrentProfileLazyQuery
>;
export type CurrentProfileSuspenseQueryHookResult = ReturnType<
  typeof useCurrentProfileSuspenseQuery
>;
export type CurrentProfileQueryResult = Apollo.QueryResult<
  CurrentProfileQuery,
  CurrentProfileQueryVariables
>;
export const DefaultProfileDocument = gql`
  query DefaultProfile($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      ...ProfileFields
    }
  }
  ${ProfileFieldsFragmentDoc}
`;

/**
 * __useDefaultProfileQuery__
 *
 * To run a query within a React component, call `useDefaultProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useDefaultProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDefaultProfileQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useDefaultProfileQuery(
  baseOptions: Apollo.QueryHookOptions<
    DefaultProfileQuery,
    DefaultProfileQueryVariables
  > &
    (
      | { variables: DefaultProfileQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DefaultProfileQuery, DefaultProfileQueryVariables>(
    DefaultProfileDocument,
    options
  );
}
export function useDefaultProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DefaultProfileQuery,
    DefaultProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DefaultProfileQuery, DefaultProfileQueryVariables>(
    DefaultProfileDocument,
    options
  );
}
export function useDefaultProfileSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    DefaultProfileQuery,
    DefaultProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DefaultProfileQuery,
    DefaultProfileQueryVariables
  >(DefaultProfileDocument, options);
}
export type DefaultProfileQueryHookResult = ReturnType<
  typeof useDefaultProfileQuery
>;
export type DefaultProfileLazyQueryHookResult = ReturnType<
  typeof useDefaultProfileLazyQuery
>;
export type DefaultProfileSuspenseQueryHookResult = ReturnType<
  typeof useDefaultProfileSuspenseQuery
>;
export type DefaultProfileQueryResult = Apollo.QueryResult<
  DefaultProfileQuery,
  DefaultProfileQueryVariables
>;
export const ExploreProfilesDocument = gql`
  query ExploreProfiles($request: ExploreProfilesRequest!) {
    exploreProfiles(request: $request) {
      items {
        ...ProfileFields
      }
      pageInfo {
        next
      }
    }
  }
  ${ProfileFieldsFragmentDoc}
`;

/**
 * __useExploreProfilesQuery__
 *
 * To run a query within a React component, call `useExploreProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useExploreProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExploreProfilesQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useExploreProfilesQuery(
  baseOptions: Apollo.QueryHookOptions<
    ExploreProfilesQuery,
    ExploreProfilesQueryVariables
  > &
    (
      | { variables: ExploreProfilesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ExploreProfilesQuery, ExploreProfilesQueryVariables>(
    ExploreProfilesDocument,
    options
  );
}
export function useExploreProfilesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ExploreProfilesQuery,
    ExploreProfilesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ExploreProfilesQuery,
    ExploreProfilesQueryVariables
  >(ExploreProfilesDocument, options);
}
export function useExploreProfilesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ExploreProfilesQuery,
    ExploreProfilesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ExploreProfilesQuery,
    ExploreProfilesQueryVariables
  >(ExploreProfilesDocument, options);
}
export type ExploreProfilesQueryHookResult = ReturnType<
  typeof useExploreProfilesQuery
>;
export type ExploreProfilesLazyQueryHookResult = ReturnType<
  typeof useExploreProfilesLazyQuery
>;
export type ExploreProfilesSuspenseQueryHookResult = ReturnType<
  typeof useExploreProfilesSuspenseQuery
>;
export type ExploreProfilesQueryResult = Apollo.QueryResult<
  ExploreProfilesQuery,
  ExploreProfilesQueryVariables
>;
export const ExplorePublicationsDocument = gql`
  query ExplorePublications($request: ExplorePublicationRequest!) {
    explorePublications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Quote {
          ...QuoteFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;

/**
 * __useExplorePublicationsQuery__
 *
 * To run a query within a React component, call `useExplorePublicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useExplorePublicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExplorePublicationsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useExplorePublicationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    ExplorePublicationsQuery,
    ExplorePublicationsQueryVariables
  > &
    (
      | { variables: ExplorePublicationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ExplorePublicationsQuery,
    ExplorePublicationsQueryVariables
  >(ExplorePublicationsDocument, options);
}
export function useExplorePublicationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ExplorePublicationsQuery,
    ExplorePublicationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ExplorePublicationsQuery,
    ExplorePublicationsQueryVariables
  >(ExplorePublicationsDocument, options);
}
export function useExplorePublicationsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ExplorePublicationsQuery,
    ExplorePublicationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ExplorePublicationsQuery,
    ExplorePublicationsQueryVariables
  >(ExplorePublicationsDocument, options);
}
export type ExplorePublicationsQueryHookResult = ReturnType<
  typeof useExplorePublicationsQuery
>;
export type ExplorePublicationsLazyQueryHookResult = ReturnType<
  typeof useExplorePublicationsLazyQuery
>;
export type ExplorePublicationsSuspenseQueryHookResult = ReturnType<
  typeof useExplorePublicationsSuspenseQuery
>;
export type ExplorePublicationsQueryResult = Apollo.QueryResult<
  ExplorePublicationsQuery,
  ExplorePublicationsQueryVariables
>;
export const FeedDocument = gql`
  query Feed($request: FeedRequest!) {
    feed(request: $request) {
      items {
        id
        root {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            id
          }
          ... on Quote {
            ...QuoteFields
          }
        }
        mirrors {
          by {
            ...PublicationProfileFields
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
  ${PublicationProfileFieldsFragmentDoc}
`;

/**
 * __useFeedQuery__
 *
 * To run a query within a React component, call `useFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useFeedQuery(
  baseOptions: Apollo.QueryHookOptions<FeedQuery, FeedQueryVariables> &
    ({ variables: FeedQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FeedQuery, FeedQueryVariables>(FeedDocument, options);
}
export function useFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FeedQuery, FeedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FeedQuery, FeedQueryVariables>(
    FeedDocument,
    options
  );
}
export function useFeedSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<FeedQuery, FeedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<FeedQuery, FeedQueryVariables>(
    FeedDocument,
    options
  );
}
export type FeedQueryHookResult = ReturnType<typeof useFeedQuery>;
export type FeedLazyQueryHookResult = ReturnType<typeof useFeedLazyQuery>;
export type FeedSuspenseQueryHookResult = ReturnType<
  typeof useFeedSuspenseQuery
>;
export type FeedQueryResult = Apollo.QueryResult<FeedQuery, FeedQueryVariables>;
export const FollowRevenuesDocument = gql`
  query FollowRevenues($request: FollowRevenueRequest!) {
    followRevenues(request: $request) {
      revenues {
        total {
          ...AmountFields
        }
      }
    }
  }
  ${AmountFieldsFragmentDoc}
`;

/**
 * __useFollowRevenuesQuery__
 *
 * To run a query within a React component, call `useFollowRevenuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowRevenuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowRevenuesQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useFollowRevenuesQuery(
  baseOptions: Apollo.QueryHookOptions<
    FollowRevenuesQuery,
    FollowRevenuesQueryVariables
  > &
    (
      | { variables: FollowRevenuesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FollowRevenuesQuery, FollowRevenuesQueryVariables>(
    FollowRevenuesDocument,
    options
  );
}
export function useFollowRevenuesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FollowRevenuesQuery,
    FollowRevenuesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FollowRevenuesQuery, FollowRevenuesQueryVariables>(
    FollowRevenuesDocument,
    options
  );
}
export function useFollowRevenuesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    FollowRevenuesQuery,
    FollowRevenuesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    FollowRevenuesQuery,
    FollowRevenuesQueryVariables
  >(FollowRevenuesDocument, options);
}
export type FollowRevenuesQueryHookResult = ReturnType<
  typeof useFollowRevenuesQuery
>;
export type FollowRevenuesLazyQueryHookResult = ReturnType<
  typeof useFollowRevenuesLazyQuery
>;
export type FollowRevenuesSuspenseQueryHookResult = ReturnType<
  typeof useFollowRevenuesSuspenseQuery
>;
export type FollowRevenuesQueryResult = Apollo.QueryResult<
  FollowRevenuesQuery,
  FollowRevenuesQueryVariables
>;
export const FollowersDocument = gql`
  query Followers($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        ...ListProfileFields
      }
      pageInfo {
        next
      }
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useFollowersQuery__
 *
 * To run a query within a React component, call `useFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowersQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useFollowersQuery(
  baseOptions: Apollo.QueryHookOptions<
    FollowersQuery,
    FollowersQueryVariables
  > &
    ({ variables: FollowersQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FollowersQuery, FollowersQueryVariables>(
    FollowersDocument,
    options
  );
}
export function useFollowersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FollowersQuery,
    FollowersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FollowersQuery, FollowersQueryVariables>(
    FollowersDocument,
    options
  );
}
export function useFollowersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    FollowersQuery,
    FollowersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<FollowersQuery, FollowersQueryVariables>(
    FollowersDocument,
    options
  );
}
export type FollowersQueryHookResult = ReturnType<typeof useFollowersQuery>;
export type FollowersLazyQueryHookResult = ReturnType<
  typeof useFollowersLazyQuery
>;
export type FollowersSuspenseQueryHookResult = ReturnType<
  typeof useFollowersSuspenseQuery
>;
export type FollowersQueryResult = Apollo.QueryResult<
  FollowersQuery,
  FollowersQueryVariables
>;
export const FollowingDocument = gql`
  query Following($request: FollowingRequest!) {
    following(request: $request) {
      items {
        ...ListProfileFields
      }
      pageInfo {
        next
      }
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useFollowingQuery__
 *
 * To run a query within a React component, call `useFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowingQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useFollowingQuery(
  baseOptions: Apollo.QueryHookOptions<
    FollowingQuery,
    FollowingQueryVariables
  > &
    ({ variables: FollowingQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FollowingQuery, FollowingQueryVariables>(
    FollowingDocument,
    options
  );
}
export function useFollowingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FollowingQuery,
    FollowingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FollowingQuery, FollowingQueryVariables>(
    FollowingDocument,
    options
  );
}
export function useFollowingSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    FollowingQuery,
    FollowingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<FollowingQuery, FollowingQueryVariables>(
    FollowingDocument,
    options
  );
}
export type FollowingQueryHookResult = ReturnType<typeof useFollowingQuery>;
export type FollowingLazyQueryHookResult = ReturnType<
  typeof useFollowingLazyQuery
>;
export type FollowingSuspenseQueryHookResult = ReturnType<
  typeof useFollowingSuspenseQuery
>;
export type FollowingQueryResult = Apollo.QueryResult<
  FollowingQuery,
  FollowingQueryVariables
>;
export const ForYouDocument = gql`
  query ForYou($request: PublicationForYouRequest!) {
    forYou(request: $request) {
      items {
        publication {
          ... on Post {
            ...PostFields
          }
          ... on Quote {
            ...QuoteFields
          }
        }
        source
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;

/**
 * __useForYouQuery__
 *
 * To run a query within a React component, call `useForYouQuery` and pass it any options that fit your needs.
 * When your component renders, `useForYouQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useForYouQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useForYouQuery(
  baseOptions: Apollo.QueryHookOptions<ForYouQuery, ForYouQueryVariables> &
    ({ variables: ForYouQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ForYouQuery, ForYouQueryVariables>(
    ForYouDocument,
    options
  );
}
export function useForYouLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ForYouQuery, ForYouQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ForYouQuery, ForYouQueryVariables>(
    ForYouDocument,
    options
  );
}
export function useForYouSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ForYouQuery,
    ForYouQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ForYouQuery, ForYouQueryVariables>(
    ForYouDocument,
    options
  );
}
export type ForYouQueryHookResult = ReturnType<typeof useForYouQuery>;
export type ForYouLazyQueryHookResult = ReturnType<typeof useForYouLazyQuery>;
export type ForYouSuspenseQueryHookResult = ReturnType<
  typeof useForYouSuspenseQuery
>;
export type ForYouQueryResult = Apollo.QueryResult<
  ForYouQuery,
  ForYouQueryVariables
>;
export const GenerateLensApiRelayAddressDocument = gql`
  query GenerateLensAPIRelayAddress {
    generateLensAPIRelayAddress
  }
`;

/**
 * __useGenerateLensApiRelayAddressQuery__
 *
 * To run a query within a React component, call `useGenerateLensApiRelayAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateLensApiRelayAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateLensApiRelayAddressQuery({
 *   variables: {
 *   },
 * });
 */
export function useGenerateLensApiRelayAddressQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GenerateLensApiRelayAddressQuery,
    GenerateLensApiRelayAddressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GenerateLensApiRelayAddressQuery,
    GenerateLensApiRelayAddressQueryVariables
  >(GenerateLensApiRelayAddressDocument, options);
}
export function useGenerateLensApiRelayAddressLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GenerateLensApiRelayAddressQuery,
    GenerateLensApiRelayAddressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GenerateLensApiRelayAddressQuery,
    GenerateLensApiRelayAddressQueryVariables
  >(GenerateLensApiRelayAddressDocument, options);
}
export function useGenerateLensApiRelayAddressSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GenerateLensApiRelayAddressQuery,
    GenerateLensApiRelayAddressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GenerateLensApiRelayAddressQuery,
    GenerateLensApiRelayAddressQueryVariables
  >(GenerateLensApiRelayAddressDocument, options);
}
export type GenerateLensApiRelayAddressQueryHookResult = ReturnType<
  typeof useGenerateLensApiRelayAddressQuery
>;
export type GenerateLensApiRelayAddressLazyQueryHookResult = ReturnType<
  typeof useGenerateLensApiRelayAddressLazyQuery
>;
export type GenerateLensApiRelayAddressSuspenseQueryHookResult = ReturnType<
  typeof useGenerateLensApiRelayAddressSuspenseQuery
>;
export type GenerateLensApiRelayAddressQueryResult = Apollo.QueryResult<
  GenerateLensApiRelayAddressQuery,
  GenerateLensApiRelayAddressQueryVariables
>;
export const GenerateModuleCurrencyApprovalDataDocument = gql`
  query GenerateModuleCurrencyApprovalData(
    $request: GenerateModuleCurrencyApprovalDataRequest!
  ) {
    generateModuleCurrencyApprovalData(request: $request) {
      to
      from
      data
    }
  }
`;

/**
 * __useGenerateModuleCurrencyApprovalDataQuery__
 *
 * To run a query within a React component, call `useGenerateModuleCurrencyApprovalDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateModuleCurrencyApprovalDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateModuleCurrencyApprovalDataQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useGenerateModuleCurrencyApprovalDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    GenerateModuleCurrencyApprovalDataQuery,
    GenerateModuleCurrencyApprovalDataQueryVariables
  > &
    (
      | {
          variables: GenerateModuleCurrencyApprovalDataQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GenerateModuleCurrencyApprovalDataQuery,
    GenerateModuleCurrencyApprovalDataQueryVariables
  >(GenerateModuleCurrencyApprovalDataDocument, options);
}
export function useGenerateModuleCurrencyApprovalDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GenerateModuleCurrencyApprovalDataQuery,
    GenerateModuleCurrencyApprovalDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GenerateModuleCurrencyApprovalDataQuery,
    GenerateModuleCurrencyApprovalDataQueryVariables
  >(GenerateModuleCurrencyApprovalDataDocument, options);
}
export function useGenerateModuleCurrencyApprovalDataSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GenerateModuleCurrencyApprovalDataQuery,
    GenerateModuleCurrencyApprovalDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GenerateModuleCurrencyApprovalDataQuery,
    GenerateModuleCurrencyApprovalDataQueryVariables
  >(GenerateModuleCurrencyApprovalDataDocument, options);
}
export type GenerateModuleCurrencyApprovalDataQueryHookResult = ReturnType<
  typeof useGenerateModuleCurrencyApprovalDataQuery
>;
export type GenerateModuleCurrencyApprovalDataLazyQueryHookResult = ReturnType<
  typeof useGenerateModuleCurrencyApprovalDataLazyQuery
>;
export type GenerateModuleCurrencyApprovalDataSuspenseQueryHookResult =
  ReturnType<typeof useGenerateModuleCurrencyApprovalDataSuspenseQuery>;
export type GenerateModuleCurrencyApprovalDataQueryResult = Apollo.QueryResult<
  GenerateModuleCurrencyApprovalDataQuery,
  GenerateModuleCurrencyApprovalDataQueryVariables
>;
export const HandleToAddressDocument = gql`
  query HandleToAddress($request: HandleToAddressRequest!) {
    handleToAddress(request: $request)
  }
`;

/**
 * __useHandleToAddressQuery__
 *
 * To run a query within a React component, call `useHandleToAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useHandleToAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHandleToAddressQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useHandleToAddressQuery(
  baseOptions: Apollo.QueryHookOptions<
    HandleToAddressQuery,
    HandleToAddressQueryVariables
  > &
    (
      | { variables: HandleToAddressQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HandleToAddressQuery, HandleToAddressQueryVariables>(
    HandleToAddressDocument,
    options
  );
}
export function useHandleToAddressLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    HandleToAddressQuery,
    HandleToAddressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    HandleToAddressQuery,
    HandleToAddressQueryVariables
  >(HandleToAddressDocument, options);
}
export function useHandleToAddressSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    HandleToAddressQuery,
    HandleToAddressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    HandleToAddressQuery,
    HandleToAddressQueryVariables
  >(HandleToAddressDocument, options);
}
export type HandleToAddressQueryHookResult = ReturnType<
  typeof useHandleToAddressQuery
>;
export type HandleToAddressLazyQueryHookResult = ReturnType<
  typeof useHandleToAddressLazyQuery
>;
export type HandleToAddressSuspenseQueryHookResult = ReturnType<
  typeof useHandleToAddressSuspenseQuery
>;
export type HandleToAddressQueryResult = Apollo.QueryResult<
  HandleToAddressQuery,
  HandleToAddressQueryVariables
>;
export const LatestPaidActionsDocument = gql`
  query LatestPaidActions($request: PaginatedRequest!) {
    latestPaidActions(request: $request) {
      items {
        ... on OpenActionPaidAction {
          actedOn {
            ... on Post {
              ...PostFields
            }
            ... on Comment {
              ...CommentBaseFields
            }
            ... on Quote {
              ...QuoteBaseFields
            }
          }
          latestActed {
            actedAt
            profile {
              ...PublicationProfileFields
            }
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${CommentBaseFieldsFragmentDoc}
  ${QuoteBaseFieldsFragmentDoc}
  ${PublicationProfileFieldsFragmentDoc}
`;

/**
 * __useLatestPaidActionsQuery__
 *
 * To run a query within a React component, call `useLatestPaidActionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestPaidActionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestPaidActionsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useLatestPaidActionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    LatestPaidActionsQuery,
    LatestPaidActionsQueryVariables
  > &
    (
      | { variables: LatestPaidActionsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    LatestPaidActionsQuery,
    LatestPaidActionsQueryVariables
  >(LatestPaidActionsDocument, options);
}
export function useLatestPaidActionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LatestPaidActionsQuery,
    LatestPaidActionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LatestPaidActionsQuery,
    LatestPaidActionsQueryVariables
  >(LatestPaidActionsDocument, options);
}
export function useLatestPaidActionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    LatestPaidActionsQuery,
    LatestPaidActionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    LatestPaidActionsQuery,
    LatestPaidActionsQueryVariables
  >(LatestPaidActionsDocument, options);
}
export type LatestPaidActionsQueryHookResult = ReturnType<
  typeof useLatestPaidActionsQuery
>;
export type LatestPaidActionsLazyQueryHookResult = ReturnType<
  typeof useLatestPaidActionsLazyQuery
>;
export type LatestPaidActionsSuspenseQueryHookResult = ReturnType<
  typeof useLatestPaidActionsSuspenseQuery
>;
export type LatestPaidActionsQueryResult = Apollo.QueryResult<
  LatestPaidActionsQuery,
  LatestPaidActionsQueryVariables
>;
export const LensTransactionStatusDocument = gql`
  query LensTransactionStatus($request: LensTransactionStatusRequest!) {
    lensTransactionStatus(request: $request) {
      status
      txHash
      reason
      extraInfo
    }
  }
`;

/**
 * __useLensTransactionStatusQuery__
 *
 * To run a query within a React component, call `useLensTransactionStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useLensTransactionStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLensTransactionStatusQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useLensTransactionStatusQuery(
  baseOptions: Apollo.QueryHookOptions<
    LensTransactionStatusQuery,
    LensTransactionStatusQueryVariables
  > &
    (
      | { variables: LensTransactionStatusQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    LensTransactionStatusQuery,
    LensTransactionStatusQueryVariables
  >(LensTransactionStatusDocument, options);
}
export function useLensTransactionStatusLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LensTransactionStatusQuery,
    LensTransactionStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LensTransactionStatusQuery,
    LensTransactionStatusQueryVariables
  >(LensTransactionStatusDocument, options);
}
export function useLensTransactionStatusSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    LensTransactionStatusQuery,
    LensTransactionStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    LensTransactionStatusQuery,
    LensTransactionStatusQueryVariables
  >(LensTransactionStatusDocument, options);
}
export type LensTransactionStatusQueryHookResult = ReturnType<
  typeof useLensTransactionStatusQuery
>;
export type LensTransactionStatusLazyQueryHookResult = ReturnType<
  typeof useLensTransactionStatusLazyQuery
>;
export type LensTransactionStatusSuspenseQueryHookResult = ReturnType<
  typeof useLensTransactionStatusSuspenseQuery
>;
export type LensTransactionStatusQueryResult = Apollo.QueryResult<
  LensTransactionStatusQuery,
  LensTransactionStatusQueryVariables
>;
export const ModExplorePublicationsDocument = gql`
  query ModExplorePublications($request: ModExplorePublicationRequest!) {
    modExplorePublications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Quote {
          ...QuoteFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;

/**
 * __useModExplorePublicationsQuery__
 *
 * To run a query within a React component, call `useModExplorePublicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useModExplorePublicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModExplorePublicationsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useModExplorePublicationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    ModExplorePublicationsQuery,
    ModExplorePublicationsQueryVariables
  > &
    (
      | { variables: ModExplorePublicationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ModExplorePublicationsQuery,
    ModExplorePublicationsQueryVariables
  >(ModExplorePublicationsDocument, options);
}
export function useModExplorePublicationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ModExplorePublicationsQuery,
    ModExplorePublicationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ModExplorePublicationsQuery,
    ModExplorePublicationsQueryVariables
  >(ModExplorePublicationsDocument, options);
}
export function useModExplorePublicationsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ModExplorePublicationsQuery,
    ModExplorePublicationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ModExplorePublicationsQuery,
    ModExplorePublicationsQueryVariables
  >(ModExplorePublicationsDocument, options);
}
export type ModExplorePublicationsQueryHookResult = ReturnType<
  typeof useModExplorePublicationsQuery
>;
export type ModExplorePublicationsLazyQueryHookResult = ReturnType<
  typeof useModExplorePublicationsLazyQuery
>;
export type ModExplorePublicationsSuspenseQueryHookResult = ReturnType<
  typeof useModExplorePublicationsSuspenseQuery
>;
export type ModExplorePublicationsQueryResult = Apollo.QueryResult<
  ModExplorePublicationsQuery,
  ModExplorePublicationsQueryVariables
>;
export const ModLatestReportsDocument = gql`
  query ModLatestReports($request: ModReportsRequest!) {
    modLatestReports(request: $request) {
      items {
        reason
        subreason
        additionalInfo
        createdAt
        reporter {
          ...ProfileFields
        }
        reportedPublication {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentFields
          }
          ... on Quote {
            ...QuoteFields
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${ProfileFieldsFragmentDoc}
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;

/**
 * __useModLatestReportsQuery__
 *
 * To run a query within a React component, call `useModLatestReportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useModLatestReportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModLatestReportsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useModLatestReportsQuery(
  baseOptions: Apollo.QueryHookOptions<
    ModLatestReportsQuery,
    ModLatestReportsQueryVariables
  > &
    (
      | { variables: ModLatestReportsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ModLatestReportsQuery, ModLatestReportsQueryVariables>(
    ModLatestReportsDocument,
    options
  );
}
export function useModLatestReportsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ModLatestReportsQuery,
    ModLatestReportsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ModLatestReportsQuery,
    ModLatestReportsQueryVariables
  >(ModLatestReportsDocument, options);
}
export function useModLatestReportsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ModLatestReportsQuery,
    ModLatestReportsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ModLatestReportsQuery,
    ModLatestReportsQueryVariables
  >(ModLatestReportsDocument, options);
}
export type ModLatestReportsQueryHookResult = ReturnType<
  typeof useModLatestReportsQuery
>;
export type ModLatestReportsLazyQueryHookResult = ReturnType<
  typeof useModLatestReportsLazyQuery
>;
export type ModLatestReportsSuspenseQueryHookResult = ReturnType<
  typeof useModLatestReportsSuspenseQuery
>;
export type ModLatestReportsQueryResult = Apollo.QueryResult<
  ModLatestReportsQuery,
  ModLatestReportsQueryVariables
>;
export const ModuleMetadataDocument = gql`
  query ModuleMetadata($request: ModuleMetadataRequest!) {
    moduleMetadata(request: $request) {
      metadata {
        attributes {
          key
          type
          value
        }
        authors
        description
        initializeCalldataABI
        initializeResultDataABI
        name
        processCalldataABI
        title
      }
      moduleType
      signlessApproved
      sponsoredApproved
      verified
    }
  }
`;

/**
 * __useModuleMetadataQuery__
 *
 * To run a query within a React component, call `useModuleMetadataQuery` and pass it any options that fit your needs.
 * When your component renders, `useModuleMetadataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModuleMetadataQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useModuleMetadataQuery(
  baseOptions: Apollo.QueryHookOptions<
    ModuleMetadataQuery,
    ModuleMetadataQueryVariables
  > &
    (
      | { variables: ModuleMetadataQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ModuleMetadataQuery, ModuleMetadataQueryVariables>(
    ModuleMetadataDocument,
    options
  );
}
export function useModuleMetadataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ModuleMetadataQuery,
    ModuleMetadataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ModuleMetadataQuery, ModuleMetadataQueryVariables>(
    ModuleMetadataDocument,
    options
  );
}
export function useModuleMetadataSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ModuleMetadataQuery,
    ModuleMetadataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ModuleMetadataQuery,
    ModuleMetadataQueryVariables
  >(ModuleMetadataDocument, options);
}
export type ModuleMetadataQueryHookResult = ReturnType<
  typeof useModuleMetadataQuery
>;
export type ModuleMetadataLazyQueryHookResult = ReturnType<
  typeof useModuleMetadataLazyQuery
>;
export type ModuleMetadataSuspenseQueryHookResult = ReturnType<
  typeof useModuleMetadataSuspenseQuery
>;
export type ModuleMetadataQueryResult = Apollo.QueryResult<
  ModuleMetadataQuery,
  ModuleMetadataQueryVariables
>;
export const MutualFollowersDocument = gql`
  query MutualFollowers($request: MutualFollowersRequest!) {
    mutualFollowers(request: $request) {
      items {
        ...ListProfileFields
      }
      pageInfo {
        next
      }
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useMutualFollowersQuery__
 *
 * To run a query within a React component, call `useMutualFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useMutualFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMutualFollowersQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useMutualFollowersQuery(
  baseOptions: Apollo.QueryHookOptions<
    MutualFollowersQuery,
    MutualFollowersQueryVariables
  > &
    (
      | { variables: MutualFollowersQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MutualFollowersQuery, MutualFollowersQueryVariables>(
    MutualFollowersDocument,
    options
  );
}
export function useMutualFollowersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MutualFollowersQuery,
    MutualFollowersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MutualFollowersQuery,
    MutualFollowersQueryVariables
  >(MutualFollowersDocument, options);
}
export function useMutualFollowersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    MutualFollowersQuery,
    MutualFollowersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MutualFollowersQuery,
    MutualFollowersQueryVariables
  >(MutualFollowersDocument, options);
}
export type MutualFollowersQueryHookResult = ReturnType<
  typeof useMutualFollowersQuery
>;
export type MutualFollowersLazyQueryHookResult = ReturnType<
  typeof useMutualFollowersLazyQuery
>;
export type MutualFollowersSuspenseQueryHookResult = ReturnType<
  typeof useMutualFollowersSuspenseQuery
>;
export type MutualFollowersQueryResult = Apollo.QueryResult<
  MutualFollowersQuery,
  MutualFollowersQueryVariables
>;
export const NotificationsDocument = gql`
  query Notifications($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ...NotificationFields
      }
      pageInfo {
        next
      }
    }
  }
  ${NotificationFieldsFragmentDoc}
`;

/**
 * __useNotificationsQuery__
 *
 * To run a query within a React component, call `useNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useNotificationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    NotificationsQuery,
    NotificationsQueryVariables
  > &
    (
      | { variables: NotificationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NotificationsQuery, NotificationsQueryVariables>(
    NotificationsDocument,
    options
  );
}
export function useNotificationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    NotificationsQuery,
    NotificationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NotificationsQuery, NotificationsQueryVariables>(
    NotificationsDocument,
    options
  );
}
export function useNotificationsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    NotificationsQuery,
    NotificationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    NotificationsQuery,
    NotificationsQueryVariables
  >(NotificationsDocument, options);
}
export type NotificationsQueryHookResult = ReturnType<
  typeof useNotificationsQuery
>;
export type NotificationsLazyQueryHookResult = ReturnType<
  typeof useNotificationsLazyQuery
>;
export type NotificationsSuspenseQueryHookResult = ReturnType<
  typeof useNotificationsSuspenseQuery
>;
export type NotificationsQueryResult = Apollo.QueryResult<
  NotificationsQuery,
  NotificationsQueryVariables
>;
export const OwnedHandlesDocument = gql`
  query OwnedHandles($request: OwnedHandlesRequest!) {
    ownedHandles(request: $request) {
      items {
        ...HandleInfoFields
      }
    }
  }
  ${HandleInfoFieldsFragmentDoc}
`;

/**
 * __useOwnedHandlesQuery__
 *
 * To run a query within a React component, call `useOwnedHandlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOwnedHandlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOwnedHandlesQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useOwnedHandlesQuery(
  baseOptions: Apollo.QueryHookOptions<
    OwnedHandlesQuery,
    OwnedHandlesQueryVariables
  > &
    (
      | { variables: OwnedHandlesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OwnedHandlesQuery, OwnedHandlesQueryVariables>(
    OwnedHandlesDocument,
    options
  );
}
export function useOwnedHandlesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OwnedHandlesQuery,
    OwnedHandlesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OwnedHandlesQuery, OwnedHandlesQueryVariables>(
    OwnedHandlesDocument,
    options
  );
}
export function useOwnedHandlesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OwnedHandlesQuery,
    OwnedHandlesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OwnedHandlesQuery, OwnedHandlesQueryVariables>(
    OwnedHandlesDocument,
    options
  );
}
export type OwnedHandlesQueryHookResult = ReturnType<
  typeof useOwnedHandlesQuery
>;
export type OwnedHandlesLazyQueryHookResult = ReturnType<
  typeof useOwnedHandlesLazyQuery
>;
export type OwnedHandlesSuspenseQueryHookResult = ReturnType<
  typeof useOwnedHandlesSuspenseQuery
>;
export type OwnedHandlesQueryResult = Apollo.QueryResult<
  OwnedHandlesQuery,
  OwnedHandlesQueryVariables
>;
export const ProfileDocument = gql`
  query Profile($request: ProfileRequest!) {
    profile(request: $request) {
      ...ProfileFields
    }
  }
  ${ProfileFieldsFragmentDoc}
`;

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useProfileQuery(
  baseOptions: Apollo.QueryHookOptions<ProfileQuery, ProfileQueryVariables> &
    ({ variables: ProfileQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProfileQuery, ProfileQueryVariables>(
    ProfileDocument,
    options
  );
}
export function useProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProfileQuery, ProfileQueryVariables>(
    ProfileDocument,
    options
  );
}
export function useProfileSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ProfileQuery,
    ProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ProfileQuery, ProfileQueryVariables>(
    ProfileDocument,
    options
  );
}
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileSuspenseQueryHookResult = ReturnType<
  typeof useProfileSuspenseQuery
>;
export type ProfileQueryResult = Apollo.QueryResult<
  ProfileQuery,
  ProfileQueryVariables
>;
export const ProfileActionHistoryDocument = gql`
  query ProfileActionHistory($request: ProfileActionHistoryRequest!) {
    profileActionHistory(request: $request) {
      items {
        id
        actionType
        who
        txHash
        actionedOn
      }
      pageInfo {
        next
      }
    }
  }
`;

/**
 * __useProfileActionHistoryQuery__
 *
 * To run a query within a React component, call `useProfileActionHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileActionHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileActionHistoryQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useProfileActionHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    ProfileActionHistoryQuery,
    ProfileActionHistoryQueryVariables
  > &
    (
      | { variables: ProfileActionHistoryQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ProfileActionHistoryQuery,
    ProfileActionHistoryQueryVariables
  >(ProfileActionHistoryDocument, options);
}
export function useProfileActionHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfileActionHistoryQuery,
    ProfileActionHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ProfileActionHistoryQuery,
    ProfileActionHistoryQueryVariables
  >(ProfileActionHistoryDocument, options);
}
export function useProfileActionHistorySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ProfileActionHistoryQuery,
    ProfileActionHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ProfileActionHistoryQuery,
    ProfileActionHistoryQueryVariables
  >(ProfileActionHistoryDocument, options);
}
export type ProfileActionHistoryQueryHookResult = ReturnType<
  typeof useProfileActionHistoryQuery
>;
export type ProfileActionHistoryLazyQueryHookResult = ReturnType<
  typeof useProfileActionHistoryLazyQuery
>;
export type ProfileActionHistorySuspenseQueryHookResult = ReturnType<
  typeof useProfileActionHistorySuspenseQuery
>;
export type ProfileActionHistoryQueryResult = Apollo.QueryResult<
  ProfileActionHistoryQuery,
  ProfileActionHistoryQueryVariables
>;
export const ProfileInterestsOptionsDocument = gql`
  query ProfileInterestsOptions($request: ProfileRequest!) {
    profileInterestsOptions
    profile(request: $request) {
      id
      interests
    }
  }
`;

/**
 * __useProfileInterestsOptionsQuery__
 *
 * To run a query within a React component, call `useProfileInterestsOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileInterestsOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileInterestsOptionsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useProfileInterestsOptionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    ProfileInterestsOptionsQuery,
    ProfileInterestsOptionsQueryVariables
  > &
    (
      | { variables: ProfileInterestsOptionsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ProfileInterestsOptionsQuery,
    ProfileInterestsOptionsQueryVariables
  >(ProfileInterestsOptionsDocument, options);
}
export function useProfileInterestsOptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfileInterestsOptionsQuery,
    ProfileInterestsOptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ProfileInterestsOptionsQuery,
    ProfileInterestsOptionsQueryVariables
  >(ProfileInterestsOptionsDocument, options);
}
export function useProfileInterestsOptionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ProfileInterestsOptionsQuery,
    ProfileInterestsOptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ProfileInterestsOptionsQuery,
    ProfileInterestsOptionsQueryVariables
  >(ProfileInterestsOptionsDocument, options);
}
export type ProfileInterestsOptionsQueryHookResult = ReturnType<
  typeof useProfileInterestsOptionsQuery
>;
export type ProfileInterestsOptionsLazyQueryHookResult = ReturnType<
  typeof useProfileInterestsOptionsLazyQuery
>;
export type ProfileInterestsOptionsSuspenseQueryHookResult = ReturnType<
  typeof useProfileInterestsOptionsSuspenseQuery
>;
export type ProfileInterestsOptionsQueryResult = Apollo.QueryResult<
  ProfileInterestsOptionsQuery,
  ProfileInterestsOptionsQueryVariables
>;
export const ProfileManagersDocument = gql`
  query ProfileManagers($request: ProfileManagersRequest!) {
    profileManagers(request: $request) {
      items {
        address
        isLensManager
      }
      pageInfo {
        next
      }
    }
  }
`;

/**
 * __useProfileManagersQuery__
 *
 * To run a query within a React component, call `useProfileManagersQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileManagersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileManagersQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useProfileManagersQuery(
  baseOptions: Apollo.QueryHookOptions<
    ProfileManagersQuery,
    ProfileManagersQueryVariables
  > &
    (
      | { variables: ProfileManagersQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProfileManagersQuery, ProfileManagersQueryVariables>(
    ProfileManagersDocument,
    options
  );
}
export function useProfileManagersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfileManagersQuery,
    ProfileManagersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ProfileManagersQuery,
    ProfileManagersQueryVariables
  >(ProfileManagersDocument, options);
}
export function useProfileManagersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ProfileManagersQuery,
    ProfileManagersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ProfileManagersQuery,
    ProfileManagersQueryVariables
  >(ProfileManagersDocument, options);
}
export type ProfileManagersQueryHookResult = ReturnType<
  typeof useProfileManagersQuery
>;
export type ProfileManagersLazyQueryHookResult = ReturnType<
  typeof useProfileManagersLazyQuery
>;
export type ProfileManagersSuspenseQueryHookResult = ReturnType<
  typeof useProfileManagersSuspenseQuery
>;
export type ProfileManagersQueryResult = Apollo.QueryResult<
  ProfileManagersQuery,
  ProfileManagersQueryVariables
>;
export const ProfileRecommendationsDocument = gql`
  query ProfileRecommendations($request: ProfileRecommendationsRequest!) {
    profileRecommendations(request: $request) {
      items {
        ...ListProfileFields
      }
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useProfileRecommendationsQuery__
 *
 * To run a query within a React component, call `useProfileRecommendationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileRecommendationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileRecommendationsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useProfileRecommendationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    ProfileRecommendationsQuery,
    ProfileRecommendationsQueryVariables
  > &
    (
      | { variables: ProfileRecommendationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ProfileRecommendationsQuery,
    ProfileRecommendationsQueryVariables
  >(ProfileRecommendationsDocument, options);
}
export function useProfileRecommendationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfileRecommendationsQuery,
    ProfileRecommendationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ProfileRecommendationsQuery,
    ProfileRecommendationsQueryVariables
  >(ProfileRecommendationsDocument, options);
}
export function useProfileRecommendationsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ProfileRecommendationsQuery,
    ProfileRecommendationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ProfileRecommendationsQuery,
    ProfileRecommendationsQueryVariables
  >(ProfileRecommendationsDocument, options);
}
export type ProfileRecommendationsQueryHookResult = ReturnType<
  typeof useProfileRecommendationsQuery
>;
export type ProfileRecommendationsLazyQueryHookResult = ReturnType<
  typeof useProfileRecommendationsLazyQuery
>;
export type ProfileRecommendationsSuspenseQueryHookResult = ReturnType<
  typeof useProfileRecommendationsSuspenseQuery
>;
export type ProfileRecommendationsQueryResult = Apollo.QueryResult<
  ProfileRecommendationsQuery,
  ProfileRecommendationsQueryVariables
>;
export const ProfilesDocument = gql`
  query Profiles($request: ProfilesRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFields
      }
      pageInfo {
        next
      }
    }
  }
  ${ProfileFieldsFragmentDoc}
`;

/**
 * __useProfilesQuery__
 *
 * To run a query within a React component, call `useProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilesQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useProfilesQuery(
  baseOptions: Apollo.QueryHookOptions<ProfilesQuery, ProfilesQueryVariables> &
    ({ variables: ProfilesQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProfilesQuery, ProfilesQueryVariables>(
    ProfilesDocument,
    options
  );
}
export function useProfilesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfilesQuery,
    ProfilesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProfilesQuery, ProfilesQueryVariables>(
    ProfilesDocument,
    options
  );
}
export function useProfilesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ProfilesQuery,
    ProfilesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ProfilesQuery, ProfilesQueryVariables>(
    ProfilesDocument,
    options
  );
}
export type ProfilesQueryHookResult = ReturnType<typeof useProfilesQuery>;
export type ProfilesLazyQueryHookResult = ReturnType<
  typeof useProfilesLazyQuery
>;
export type ProfilesSuspenseQueryHookResult = ReturnType<
  typeof useProfilesSuspenseQuery
>;
export type ProfilesQueryResult = Apollo.QueryResult<
  ProfilesQuery,
  ProfilesQueryVariables
>;
export const ProfilesManagedDocument = gql`
  query ProfilesManaged(
    $profilesManagedRequest: ProfilesManagedRequest!
    $lastLoggedInProfileRequest: LastLoggedInProfileRequest!
  ) {
    profilesManaged(request: $profilesManagedRequest) {
      items {
        ...ListProfileFields
      }
      pageInfo {
        next
      }
    }
    lastLoggedInProfile(request: $lastLoggedInProfileRequest) {
      ...ListProfileFields
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useProfilesManagedQuery__
 *
 * To run a query within a React component, call `useProfilesManagedQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilesManagedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilesManagedQuery({
 *   variables: {
 *      profilesManagedRequest: // value for 'profilesManagedRequest'
 *      lastLoggedInProfileRequest: // value for 'lastLoggedInProfileRequest'
 *   },
 * });
 */
export function useProfilesManagedQuery(
  baseOptions: Apollo.QueryHookOptions<
    ProfilesManagedQuery,
    ProfilesManagedQueryVariables
  > &
    (
      | { variables: ProfilesManagedQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProfilesManagedQuery, ProfilesManagedQueryVariables>(
    ProfilesManagedDocument,
    options
  );
}
export function useProfilesManagedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProfilesManagedQuery,
    ProfilesManagedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ProfilesManagedQuery,
    ProfilesManagedQueryVariables
  >(ProfilesManagedDocument, options);
}
export function useProfilesManagedSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ProfilesManagedQuery,
    ProfilesManagedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ProfilesManagedQuery,
    ProfilesManagedQueryVariables
  >(ProfilesManagedDocument, options);
}
export type ProfilesManagedQueryHookResult = ReturnType<
  typeof useProfilesManagedQuery
>;
export type ProfilesManagedLazyQueryHookResult = ReturnType<
  typeof useProfilesManagedLazyQuery
>;
export type ProfilesManagedSuspenseQueryHookResult = ReturnType<
  typeof useProfilesManagedSuspenseQuery
>;
export type ProfilesManagedQueryResult = Apollo.QueryResult<
  ProfilesManagedQuery,
  ProfilesManagedQueryVariables
>;
export const PublicationDocument = gql`
  query Publication($request: PublicationRequest!) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Mirror {
        ...MirrorFields
      }
      ... on Quote {
        ...QuoteFields
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${MirrorFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;

/**
 * __usePublicationQuery__
 *
 * To run a query within a React component, call `usePublicationQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicationQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePublicationQuery(
  baseOptions: Apollo.QueryHookOptions<
    PublicationQuery,
    PublicationQueryVariables
  > &
    (
      | { variables: PublicationQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PublicationQuery, PublicationQueryVariables>(
    PublicationDocument,
    options
  );
}
export function usePublicationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PublicationQuery,
    PublicationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PublicationQuery, PublicationQueryVariables>(
    PublicationDocument,
    options
  );
}
export function usePublicationSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    PublicationQuery,
    PublicationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<PublicationQuery, PublicationQueryVariables>(
    PublicationDocument,
    options
  );
}
export type PublicationQueryHookResult = ReturnType<typeof usePublicationQuery>;
export type PublicationLazyQueryHookResult = ReturnType<
  typeof usePublicationLazyQuery
>;
export type PublicationSuspenseQueryHookResult = ReturnType<
  typeof usePublicationSuspenseQuery
>;
export type PublicationQueryResult = Apollo.QueryResult<
  PublicationQuery,
  PublicationQueryVariables
>;
export const PublicationBookmarksDocument = gql`
  query PublicationBookmarks($request: PublicationBookmarksRequest!) {
    publicationBookmarks(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
        ... on Quote {
          ...QuoteFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${MirrorFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;

/**
 * __usePublicationBookmarksQuery__
 *
 * To run a query within a React component, call `usePublicationBookmarksQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicationBookmarksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicationBookmarksQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePublicationBookmarksQuery(
  baseOptions: Apollo.QueryHookOptions<
    PublicationBookmarksQuery,
    PublicationBookmarksQueryVariables
  > &
    (
      | { variables: PublicationBookmarksQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    PublicationBookmarksQuery,
    PublicationBookmarksQueryVariables
  >(PublicationBookmarksDocument, options);
}
export function usePublicationBookmarksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PublicationBookmarksQuery,
    PublicationBookmarksQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PublicationBookmarksQuery,
    PublicationBookmarksQueryVariables
  >(PublicationBookmarksDocument, options);
}
export function usePublicationBookmarksSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    PublicationBookmarksQuery,
    PublicationBookmarksQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PublicationBookmarksQuery,
    PublicationBookmarksQueryVariables
  >(PublicationBookmarksDocument, options);
}
export type PublicationBookmarksQueryHookResult = ReturnType<
  typeof usePublicationBookmarksQuery
>;
export type PublicationBookmarksLazyQueryHookResult = ReturnType<
  typeof usePublicationBookmarksLazyQuery
>;
export type PublicationBookmarksSuspenseQueryHookResult = ReturnType<
  typeof usePublicationBookmarksSuspenseQuery
>;
export type PublicationBookmarksQueryResult = Apollo.QueryResult<
  PublicationBookmarksQuery,
  PublicationBookmarksQueryVariables
>;
export const PublicationsDocument = gql`
  query Publications($request: PublicationsRequest!) {
    publications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
        ... on Quote {
          ...QuoteFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${MirrorFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;

/**
 * __usePublicationsQuery__
 *
 * To run a query within a React component, call `usePublicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicationsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePublicationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    PublicationsQuery,
    PublicationsQueryVariables
  > &
    (
      | { variables: PublicationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PublicationsQuery, PublicationsQueryVariables>(
    PublicationsDocument,
    options
  );
}
export function usePublicationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PublicationsQuery,
    PublicationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PublicationsQuery, PublicationsQueryVariables>(
    PublicationsDocument,
    options
  );
}
export function usePublicationsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    PublicationsQuery,
    PublicationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<PublicationsQuery, PublicationsQueryVariables>(
    PublicationsDocument,
    options
  );
}
export type PublicationsQueryHookResult = ReturnType<
  typeof usePublicationsQuery
>;
export type PublicationsLazyQueryHookResult = ReturnType<
  typeof usePublicationsLazyQuery
>;
export type PublicationsSuspenseQueryHookResult = ReturnType<
  typeof usePublicationsSuspenseQuery
>;
export type PublicationsQueryResult = Apollo.QueryResult<
  PublicationsQuery,
  PublicationsQueryVariables
>;
export const SearchProfilesDocument = gql`
  query SearchProfiles($request: ProfileSearchRequest!) {
    searchProfiles(request: $request) {
      items {
        ...ProfileFields
      }
      pageInfo {
        next
      }
    }
  }
  ${ProfileFieldsFragmentDoc}
`;

/**
 * __useSearchProfilesQuery__
 *
 * To run a query within a React component, call `useSearchProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProfilesQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useSearchProfilesQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchProfilesQuery,
    SearchProfilesQueryVariables
  > &
    (
      | { variables: SearchProfilesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchProfilesQuery, SearchProfilesQueryVariables>(
    SearchProfilesDocument,
    options
  );
}
export function useSearchProfilesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchProfilesQuery,
    SearchProfilesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchProfilesQuery, SearchProfilesQueryVariables>(
    SearchProfilesDocument,
    options
  );
}
export function useSearchProfilesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SearchProfilesQuery,
    SearchProfilesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SearchProfilesQuery,
    SearchProfilesQueryVariables
  >(SearchProfilesDocument, options);
}
export type SearchProfilesQueryHookResult = ReturnType<
  typeof useSearchProfilesQuery
>;
export type SearchProfilesLazyQueryHookResult = ReturnType<
  typeof useSearchProfilesLazyQuery
>;
export type SearchProfilesSuspenseQueryHookResult = ReturnType<
  typeof useSearchProfilesSuspenseQuery
>;
export type SearchProfilesQueryResult = Apollo.QueryResult<
  SearchProfilesQuery,
  SearchProfilesQueryVariables
>;
export const SearchPublicationsDocument = gql`
  query SearchPublications($request: PublicationSearchRequest!) {
    searchPublications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Quote {
          ...QuoteFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFieldsFragmentDoc}
  ${CommentFieldsFragmentDoc}
  ${QuoteFieldsFragmentDoc}
`;

/**
 * __useSearchPublicationsQuery__
 *
 * To run a query within a React component, call `useSearchPublicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPublicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPublicationsQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useSearchPublicationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchPublicationsQuery,
    SearchPublicationsQueryVariables
  > &
    (
      | { variables: SearchPublicationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchPublicationsQuery,
    SearchPublicationsQueryVariables
  >(SearchPublicationsDocument, options);
}
export function useSearchPublicationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchPublicationsQuery,
    SearchPublicationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SearchPublicationsQuery,
    SearchPublicationsQueryVariables
  >(SearchPublicationsDocument, options);
}
export function useSearchPublicationsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SearchPublicationsQuery,
    SearchPublicationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SearchPublicationsQuery,
    SearchPublicationsQueryVariables
  >(SearchPublicationsDocument, options);
}
export type SearchPublicationsQueryHookResult = ReturnType<
  typeof useSearchPublicationsQuery
>;
export type SearchPublicationsLazyQueryHookResult = ReturnType<
  typeof useSearchPublicationsLazyQuery
>;
export type SearchPublicationsSuspenseQueryHookResult = ReturnType<
  typeof useSearchPublicationsSuspenseQuery
>;
export type SearchPublicationsQueryResult = Apollo.QueryResult<
  SearchPublicationsQuery,
  SearchPublicationsQueryVariables
>;
export const StaffPicksDocument = gql`
  query StaffPicks(
    $batch1: [ProfileId!]
    $batch2: [ProfileId!]
    $batch3: [ProfileId!]
  ) {
    batch1: profiles(request: { where: { profileIds: $batch1 } }) {
      items {
        ...ListProfileFields
      }
    }
    batch2: profiles(request: { where: { profileIds: $batch2 } }) {
      items {
        ...ListProfileFields
      }
    }
    batch3: profiles(request: { where: { profileIds: $batch3 } }) {
      items {
        ...ListProfileFields
      }
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useStaffPicksQuery__
 *
 * To run a query within a React component, call `useStaffPicksQuery` and pass it any options that fit your needs.
 * When your component renders, `useStaffPicksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStaffPicksQuery({
 *   variables: {
 *      batch1: // value for 'batch1'
 *      batch2: // value for 'batch2'
 *      batch3: // value for 'batch3'
 *   },
 * });
 */
export function useStaffPicksQuery(
  baseOptions?: Apollo.QueryHookOptions<
    StaffPicksQuery,
    StaffPicksQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<StaffPicksQuery, StaffPicksQueryVariables>(
    StaffPicksDocument,
    options
  );
}
export function useStaffPicksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    StaffPicksQuery,
    StaffPicksQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<StaffPicksQuery, StaffPicksQueryVariables>(
    StaffPicksDocument,
    options
  );
}
export function useStaffPicksSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    StaffPicksQuery,
    StaffPicksQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<StaffPicksQuery, StaffPicksQueryVariables>(
    StaffPicksDocument,
    options
  );
}
export type StaffPicksQueryHookResult = ReturnType<typeof useStaffPicksQuery>;
export type StaffPicksLazyQueryHookResult = ReturnType<
  typeof useStaffPicksLazyQuery
>;
export type StaffPicksSuspenseQueryHookResult = ReturnType<
  typeof useStaffPicksSuspenseQuery
>;
export type StaffPicksQueryResult = Apollo.QueryResult<
  StaffPicksQuery,
  StaffPicksQueryVariables
>;
export const UserRateLimitDocument = gql`
  query UserRateLimit($request: UserCurrentRateLimitRequest!) {
    userRateLimit(request: $request) {
      momoka {
        hourAllowanceLeft
        hourAllowanceUsed
        hourAllowance
        dayAllowanceLeft
        dayAllowanceUsed
        dayAllowance
      }
      onchain {
        hourAllowanceLeft
        hourAllowanceUsed
        hourAllowance
        dayAllowanceLeft
        dayAllowanceUsed
        dayAllowance
      }
    }
  }
`;

/**
 * __useUserRateLimitQuery__
 *
 * To run a query within a React component, call `useUserRateLimitQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserRateLimitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserRateLimitQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUserRateLimitQuery(
  baseOptions: Apollo.QueryHookOptions<
    UserRateLimitQuery,
    UserRateLimitQueryVariables
  > &
    (
      | { variables: UserRateLimitQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserRateLimitQuery, UserRateLimitQueryVariables>(
    UserRateLimitDocument,
    options
  );
}
export function useUserRateLimitLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserRateLimitQuery,
    UserRateLimitQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserRateLimitQuery, UserRateLimitQueryVariables>(
    UserRateLimitDocument,
    options
  );
}
export function useUserRateLimitSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    UserRateLimitQuery,
    UserRateLimitQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UserRateLimitQuery,
    UserRateLimitQueryVariables
  >(UserRateLimitDocument, options);
}
export type UserRateLimitQueryHookResult = ReturnType<
  typeof useUserRateLimitQuery
>;
export type UserRateLimitLazyQueryHookResult = ReturnType<
  typeof useUserRateLimitLazyQuery
>;
export type UserRateLimitSuspenseQueryHookResult = ReturnType<
  typeof useUserRateLimitSuspenseQuery
>;
export type UserRateLimitQueryResult = Apollo.QueryResult<
  UserRateLimitQuery,
  UserRateLimitQueryVariables
>;
export const WhoActedOnPublicationDocument = gql`
  query WhoActedOnPublication($request: WhoActedOnPublicationRequest!) {
    whoActedOnPublication(request: $request) {
      items {
        ...ListProfileFields
      }
      pageInfo {
        next
      }
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useWhoActedOnPublicationQuery__
 *
 * To run a query within a React component, call `useWhoActedOnPublicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhoActedOnPublicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhoActedOnPublicationQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useWhoActedOnPublicationQuery(
  baseOptions: Apollo.QueryHookOptions<
    WhoActedOnPublicationQuery,
    WhoActedOnPublicationQueryVariables
  > &
    (
      | { variables: WhoActedOnPublicationQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    WhoActedOnPublicationQuery,
    WhoActedOnPublicationQueryVariables
  >(WhoActedOnPublicationDocument, options);
}
export function useWhoActedOnPublicationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    WhoActedOnPublicationQuery,
    WhoActedOnPublicationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WhoActedOnPublicationQuery,
    WhoActedOnPublicationQueryVariables
  >(WhoActedOnPublicationDocument, options);
}
export function useWhoActedOnPublicationSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    WhoActedOnPublicationQuery,
    WhoActedOnPublicationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WhoActedOnPublicationQuery,
    WhoActedOnPublicationQueryVariables
  >(WhoActedOnPublicationDocument, options);
}
export type WhoActedOnPublicationQueryHookResult = ReturnType<
  typeof useWhoActedOnPublicationQuery
>;
export type WhoActedOnPublicationLazyQueryHookResult = ReturnType<
  typeof useWhoActedOnPublicationLazyQuery
>;
export type WhoActedOnPublicationSuspenseQueryHookResult = ReturnType<
  typeof useWhoActedOnPublicationSuspenseQuery
>;
export type WhoActedOnPublicationQueryResult = Apollo.QueryResult<
  WhoActedOnPublicationQuery,
  WhoActedOnPublicationQueryVariables
>;
export const WhoHaveBlockedDocument = gql`
  query WhoHaveBlocked($request: WhoHaveBlockedRequest!) {
    whoHaveBlocked(request: $request) {
      items {
        ...ListProfileFields
      }
      pageInfo {
        next
      }
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useWhoHaveBlockedQuery__
 *
 * To run a query within a React component, call `useWhoHaveBlockedQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhoHaveBlockedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhoHaveBlockedQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useWhoHaveBlockedQuery(
  baseOptions: Apollo.QueryHookOptions<
    WhoHaveBlockedQuery,
    WhoHaveBlockedQueryVariables
  > &
    (
      | { variables: WhoHaveBlockedQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<WhoHaveBlockedQuery, WhoHaveBlockedQueryVariables>(
    WhoHaveBlockedDocument,
    options
  );
}
export function useWhoHaveBlockedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    WhoHaveBlockedQuery,
    WhoHaveBlockedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<WhoHaveBlockedQuery, WhoHaveBlockedQueryVariables>(
    WhoHaveBlockedDocument,
    options
  );
}
export function useWhoHaveBlockedSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    WhoHaveBlockedQuery,
    WhoHaveBlockedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WhoHaveBlockedQuery,
    WhoHaveBlockedQueryVariables
  >(WhoHaveBlockedDocument, options);
}
export type WhoHaveBlockedQueryHookResult = ReturnType<
  typeof useWhoHaveBlockedQuery
>;
export type WhoHaveBlockedLazyQueryHookResult = ReturnType<
  typeof useWhoHaveBlockedLazyQuery
>;
export type WhoHaveBlockedSuspenseQueryHookResult = ReturnType<
  typeof useWhoHaveBlockedSuspenseQuery
>;
export type WhoHaveBlockedQueryResult = Apollo.QueryResult<
  WhoHaveBlockedQuery,
  WhoHaveBlockedQueryVariables
>;
export const WhoReactedPublicationDocument = gql`
  query WhoReactedPublication($request: WhoReactedPublicationRequest!) {
    whoReactedPublication(request: $request) {
      items {
        profile {
          ...ListProfileFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${ListProfileFieldsFragmentDoc}
`;

/**
 * __useWhoReactedPublicationQuery__
 *
 * To run a query within a React component, call `useWhoReactedPublicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhoReactedPublicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhoReactedPublicationQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useWhoReactedPublicationQuery(
  baseOptions: Apollo.QueryHookOptions<
    WhoReactedPublicationQuery,
    WhoReactedPublicationQueryVariables
  > &
    (
      | { variables: WhoReactedPublicationQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    WhoReactedPublicationQuery,
    WhoReactedPublicationQueryVariables
  >(WhoReactedPublicationDocument, options);
}
export function useWhoReactedPublicationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    WhoReactedPublicationQuery,
    WhoReactedPublicationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WhoReactedPublicationQuery,
    WhoReactedPublicationQueryVariables
  >(WhoReactedPublicationDocument, options);
}
export function useWhoReactedPublicationSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    WhoReactedPublicationQuery,
    WhoReactedPublicationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WhoReactedPublicationQuery,
    WhoReactedPublicationQueryVariables
  >(WhoReactedPublicationDocument, options);
}
export type WhoReactedPublicationQueryHookResult = ReturnType<
  typeof useWhoReactedPublicationQuery
>;
export type WhoReactedPublicationLazyQueryHookResult = ReturnType<
  typeof useWhoReactedPublicationLazyQuery
>;
export type WhoReactedPublicationSuspenseQueryHookResult = ReturnType<
  typeof useWhoReactedPublicationSuspenseQuery
>;
export type WhoReactedPublicationQueryResult = Apollo.QueryResult<
  WhoReactedPublicationQuery,
  WhoReactedPublicationQueryVariables
>;
export const UserSigNoncesSubscriptionDocument = gql`
  subscription UserSigNoncesSubscription($address: EvmAddress!) {
    userSigNonces(address: $address) {
      lensHubOnchainSigNonce
    }
  }
`;

/**
 * __useUserSigNoncesSubscriptionSubscription__
 *
 * To run a query within a React component, call `useUserSigNoncesSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserSigNoncesSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSigNoncesSubscriptionSubscription({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserSigNoncesSubscriptionSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    UserSigNoncesSubscriptionSubscription,
    UserSigNoncesSubscriptionSubscriptionVariables
  > &
    (
      | {
          variables: UserSigNoncesSubscriptionSubscriptionVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    UserSigNoncesSubscriptionSubscription,
    UserSigNoncesSubscriptionSubscriptionVariables
  >(UserSigNoncesSubscriptionDocument, options);
}
export type UserSigNoncesSubscriptionSubscriptionHookResult = ReturnType<
  typeof useUserSigNoncesSubscriptionSubscription
>;
export type UserSigNoncesSubscriptionSubscriptionResult =
  Apollo.SubscriptionResult<UserSigNoncesSubscriptionSubscription>;

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    AnyPublication: ['Comment', 'Mirror', 'Post', 'Quote'],
    Asset: ['Erc20'],
    BroadcastMomokaResult: ['CreateMomokaPublicationResult', 'RelayError'],
    ClaimProfileWithHandleResult: [
      'ClaimProfileWithHandleErrorResult',
      'RelaySuccess'
    ],
    CommentablePublication: ['Post', 'Quote'],
    CreateProfileWithHandleResult: [
      'CreateProfileWithHandleErrorResult',
      'RelaySuccess'
    ],
    ExplorePublication: ['Post', 'Quote'],
    FeedHighlight: ['Post', 'Quote'],
    FollowModule: [
      'FeeFollowModuleSettings',
      'RevertFollowModuleSettings',
      'UnknownFollowModuleSettings'
    ],
    LensProfileManagerRelayResult: [
      'LensProfileManagerRelayError',
      'RelaySuccess'
    ],
    MirrorablePublication: ['Comment', 'Post', 'Quote'],
    MomokaTransaction: [
      'MomokaCommentTransaction',
      'MomokaMirrorTransaction',
      'MomokaPostTransaction',
      'MomokaQuoteTransaction'
    ],
    MomokaVerificationStatus: [
      'MomokaVerificationStatusFailure',
      'MomokaVerificationStatusSuccess'
    ],
    Notification: [
      'ActedNotification',
      'CommentNotification',
      'FollowNotification',
      'MentionNotification',
      'MirrorNotification',
      'QuoteNotification',
      'ReactionNotification'
    ],
    OpenActionModule: [
      'LegacyAaveFeeCollectModuleSettings',
      'LegacyERC4626FeeCollectModuleSettings',
      'LegacyFeeCollectModuleSettings',
      'LegacyFreeCollectModuleSettings',
      'LegacyLimitedFeeCollectModuleSettings',
      'LegacyLimitedTimedFeeCollectModuleSettings',
      'LegacyMultirecipientFeeCollectModuleSettings',
      'LegacyRevertCollectModuleSettings',
      'LegacySimpleCollectModuleSettings',
      'LegacyTimedFeeCollectModuleSettings',
      'MultirecipientFeeCollectOpenActionSettings',
      'SimpleCollectOpenActionSettings',
      'UnknownOpenActionModuleSettings'
    ],
    OpenActionResult: [
      'KnownCollectOpenActionResult',
      'UnknownOpenActionResult'
    ],
    PaidAction: ['FollowPaidAction', 'OpenActionPaidAction'],
    PrimaryPublication: ['Comment', 'Post', 'Quote'],
    ProfilePicture: ['ImageSet', 'NftImage'],
    PublicationForYou: ['Post', 'Quote'],
    PublicationMetadata: [
      'ArticleMetadataV3',
      'AudioMetadataV3',
      'CheckingInMetadataV3',
      'EmbedMetadataV3',
      'EventMetadataV3',
      'ImageMetadataV3',
      'LinkMetadataV3',
      'LiveStreamMetadataV3',
      'MintMetadataV3',
      'SpaceMetadataV3',
      'StoryMetadataV3',
      'TextOnlyMetadataV3',
      'ThreeDMetadataV3',
      'TransactionMetadataV3',
      'VideoMetadataV3'
    ],
    PublicationMetadataEncryptionStrategy: ['PublicationMetadataLitEncryption'],
    PublicationMetadataMedia: [
      'PublicationMetadataMediaAudio',
      'PublicationMetadataMediaImage',
      'PublicationMetadataMediaVideo'
    ],
    ReferenceModule: [
      'DegreesOfSeparationReferenceModuleSettings',
      'FollowOnlyReferenceModuleSettings',
      'LegacyDegreesOfSeparationReferenceModuleSettings',
      'LegacyFollowOnlyReferenceModuleSettings',
      'UnknownReferenceModuleSettings'
    ],
    RelayMomokaResult: [
      'CreateMomokaPublicationResult',
      'LensProfileManagerRelayError'
    ],
    RelayResult: ['RelayError', 'RelaySuccess'],
    SecondTierCondition: [
      'AdvancedContractCondition',
      'AndCondition',
      'CollectCondition',
      'EoaOwnershipCondition',
      'Erc20OwnershipCondition',
      'FollowCondition',
      'NftOwnershipCondition',
      'OrCondition',
      'ProfileOwnershipCondition'
    ],
    SupportedModule: ['KnownSupportedModule', 'UnknownSupportedModule'],
    ThirdTierCondition: [
      'AdvancedContractCondition',
      'CollectCondition',
      'EoaOwnershipCondition',
      'Erc20OwnershipCondition',
      'FollowCondition',
      'NftOwnershipCondition',
      'ProfileOwnershipCondition'
    ]
  }
};
export default result;
