export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** Blockchain data scalar type */
  BlockchainData: any
  /** Broadcast scalar id type */
  BroadcastId: any
  /** ChainId custom scalar type */
  ChainId: any
  /** collect module data scalar type */
  CollectModuleData: any
  /** Contract address custom scalar type */
  ContractAddress: any
  /** Cursor custom scalar type */
  Cursor: any
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string
  /** Ethereum address custom scalar type */
  EthereumAddress: any
  /** follow module data scalar type */
  FollowModuleData: any
  /** handle custom scalar type */
  Handle: any
  /** handle claim id custom scalar type */
  HandleClaimIdScalar: any
  /** Internal publication id custom scalar type */
  InternalPublicationId: any
  /** jwt custom scalar type */
  Jwt: any
  /** limit custom scalar type */
  LimitScalar: any
  /** Markdown scalar type */
  Markdown: any
  /** mimetype custom scalar type */
  MimeType: any
  /** Nft ownership id type */
  NftOwnershipId: any
  /** Nonce custom scalar type */
  Nonce: any
  /** ProfileId custom scalar type */
  ProfileId: any
  /** Publication id custom scalar type */
  PublicationId: any
  /** Publication url scalar type */
  PublicationUrl: any
  /** reference module data scalar type */
  ReferenceModuleData: any
  /** Query search */
  Search: any
  /** Relayer signature */
  Signature: any
  /** Sources custom scalar type */
  Sources: any
  /** timestamp date custom scalar type */
  TimestampScalar: any
  /** The tx has */
  TxHash: any
  /** UnixTimestamp custom scalar type */
  UnixTimestamp: any
  /** Url scalar type */
  Url: any
  /** Represents NULL values */
  Void: any
}

export type ApprovedAllowanceAmount = {
  __typename?: 'ApprovedAllowanceAmount'
  allowance: Scalars['String']
  contractAddress: Scalars['ContractAddress']
  currency: Scalars['ContractAddress']
  module: Scalars['String']
}

export type ApprovedModuleAllowanceAmountRequest = {
  collectModules: Array<CollectModules>
  /** The contract addresses for the module approved currencies you want to find information on about the user */
  currencies: Array<Scalars['ContractAddress']>
  followModules: Array<FollowModules>
  referenceModules: Array<ReferenceModules>
}

export type AttachRequest = {
  /** mimetype of the file to push */
  mimeType: Scalars['MimeType']
}

/** The response to upload the attached file */
export type AttachResults = {
  __typename?: 'AttachResults'
  /** Name of the file once is uploaded */
  key: Scalars['String']
  /** Signed url to push the file */
  signedUrl: Scalars['String']
}

/** The auth challenge result */
export type AuthChallengeResult = {
  __typename?: 'AuthChallengeResult'
  /** The text to sign */
  text: Scalars['String']
}

/** The authentication result */
export type AuthenticationResult = {
  __typename?: 'AuthenticationResult'
  /** The access token */
  accessToken: Scalars['Jwt']
  /** The refresh token */
  refreshToken: Scalars['Jwt']
}

/** The challenge request */
export type ChallengeRequest = {
  /** The ethereum address you want to login with */
  address: Scalars['EthereumAddress']
}

export type ClaimHandleRequest = {
  id: Scalars['HandleClaimIdScalar']
}

export type ClaimableHandle = {
  __typename?: 'ClaimableHandle'
  expiry: Scalars['DateTime']
  handle: Scalars['Handle']
  id: Scalars['HandleClaimIdScalar']
  source: Scalars['String']
}

export type ClaimedHandle = {
  __typename?: 'ClaimedHandle'
  claimedAt: Scalars['DateTime']
  handle: Scalars['Handle']
  id: Scalars['HandleClaimIdScalar']
  source: Scalars['String']
}

export type CollectModule =
  | EmptyCollectModuleSettings
  | FeeCollectModuleSettings
  | LimitedFeeCollectModuleSettings
  | LimitedTimedFeeCollectModuleSettings
  | RevertCollectModuleSettings
  | TimedFeeCollectModuleSettings

export type CollectModuleParams = {
  /** The collect empty collect module */
  emptyCollectModule?: InputMaybe<Scalars['Boolean']>
  /** The collect fee collect module */
  feeCollectModule?: InputMaybe<FeeCollectModuleParams>
  /** The collect limited fee collect module */
  limitedFeeCollectModule?: InputMaybe<LimitedFeeCollectModuleParams>
  /** The collect limited timed fee collect module */
  limitedTimedFeeCollectModule?: InputMaybe<LimitedTimedFeeCollectModuleParams>
  /** The collect revert collect module */
  revertCollectModule?: InputMaybe<Scalars['Boolean']>
  /** The collect timed fee collect module */
  timedFeeCollectModule?: InputMaybe<TimedFeeCollectModuleParams>
}

/** The collect module types */
export enum CollectModules {
  EmptyCollectModule = 'EmptyCollectModule',
  FeeCollectModule = 'FeeCollectModule',
  LimitedFeeCollectModule = 'LimitedFeeCollectModule',
  LimitedTimedFeeCollectModule = 'LimitedTimedFeeCollectModule',
  RevertCollectModule = 'RevertCollectModule',
  TimedFeeCollectModule = 'TimedFeeCollectModule'
}

/** The social comment */
export type Comment = {
  __typename?: 'Comment'
  /** ID of the source */
  appId?: Maybe<Scalars['Sources']>
  /** The collect module */
  collectModule: CollectModule
  /** Who collected it, this is used for timeline results and like this for better caching for the client */
  collectedBy?: Maybe<Wallet>
  /** Which comment this points to if its null the pointer too deep so do another query to find it out */
  commentOn?: Maybe<Publication>
  /** The date the post was created on */
  createdAt: Scalars['DateTime']
  /** This will bring back the first comment of a comment and only be defined if using `publication` query and `commentOf` */
  firstComment?: Maybe<Comment>
  /** The internal publication id */
  id: Scalars['InternalPublicationId']
  /** The top level post/mirror this comment lives on */
  mainPost: MainPostReference
  /** The metadata for the post */
  metadata: MetadataOutput
  /** The on chain content uri could be `ipfs://` or `https` */
  onChainContentURI: Scalars['String']
  /** The profile ref */
  profile: Profile
  /** The reference module */
  referenceModule?: Maybe<ReferenceModule>
  /** The publication stats */
  stats: PublicationStats
}

/** The create burn eip 712 typed data */
export type CreateBurnEip712TypedData = {
  __typename?: 'CreateBurnEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateBurnEip712TypedDataTypes
  /** The values */
  value: CreateBurnEip712TypedDataValue
}

/** The create burn eip 712 typed data types */
export type CreateBurnEip712TypedDataTypes = {
  __typename?: 'CreateBurnEIP712TypedDataTypes'
  BurnWithSig: Array<Eip712TypedDataField>
}

/** The create burn eip 712 typed data value */
export type CreateBurnEip712TypedDataValue = {
  __typename?: 'CreateBurnEIP712TypedDataValue'
  deadline: Scalars['UnixTimestamp']
  nonce: Scalars['Nonce']
  tokenId: Scalars['String']
}

/** The broadcast item */
export type CreateCollectBroadcastItemResult = {
  __typename?: 'CreateCollectBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateCollectEip712TypedData
}

/** The collect eip 712 typed data */
export type CreateCollectEip712TypedData = {
  __typename?: 'CreateCollectEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateCollectEip712TypedDataTypes
  /** The values */
  value: CreateCollectEip712TypedDataValue
}

/** The collect eip 712 typed data types */
export type CreateCollectEip712TypedDataTypes = {
  __typename?: 'CreateCollectEIP712TypedDataTypes'
  CollectWithSig: Array<Eip712TypedDataField>
}

/** The collect eip 712 typed data value */
export type CreateCollectEip712TypedDataValue = {
  __typename?: 'CreateCollectEIP712TypedDataValue'
  data: Scalars['BlockchainData']
  deadline: Scalars['UnixTimestamp']
  nonce: Scalars['Nonce']
  profileId: Scalars['ProfileId']
  pubId: Scalars['PublicationId']
}

export type CreateCollectRequest = {
  publicationId: Scalars['InternalPublicationId']
}

/** The broadcast item */
export type CreateCommentBroadcastItemResult = {
  __typename?: 'CreateCommentBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateCommentEip712TypedData
}

/** The create comment eip 712 typed data */
export type CreateCommentEip712TypedData = {
  __typename?: 'CreateCommentEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateCommentEip712TypedDataTypes
  /** The values */
  value: CreateCommentEip712TypedDataValue
}

/** The create comment eip 712 typed data types */
export type CreateCommentEip712TypedDataTypes = {
  __typename?: 'CreateCommentEIP712TypedDataTypes'
  CommentWithSig: Array<Eip712TypedDataField>
}

/** The create comment eip 712 typed data value */
export type CreateCommentEip712TypedDataValue = {
  __typename?: 'CreateCommentEIP712TypedDataValue'
  collectModule: Scalars['ContractAddress']
  collectModuleData: Scalars['CollectModuleData']
  contentURI: Scalars['PublicationUrl']
  deadline: Scalars['UnixTimestamp']
  nonce: Scalars['Nonce']
  profileId: Scalars['ProfileId']
  profileIdPointed: Scalars['ProfileId']
  pubIdPointed: Scalars['PublicationId']
  referenceModule: Scalars['ContractAddress']
  referenceModuleData: Scalars['ReferenceModuleData']
}

/** The broadcast item */
export type CreateFollowBroadcastItemResult = {
  __typename?: 'CreateFollowBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateFollowEip712TypedData
}

/** The create follow eip 712 typed data */
export type CreateFollowEip712TypedData = {
  __typename?: 'CreateFollowEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateFollowEip712TypedDataTypes
  /** The values */
  value: CreateFollowEip712TypedDataValue
}

/** The create follow eip 712 typed data types */
export type CreateFollowEip712TypedDataTypes = {
  __typename?: 'CreateFollowEIP712TypedDataTypes'
  FollowWithSig: Array<Eip712TypedDataField>
}

/** The create follow eip 712 typed data value */
export type CreateFollowEip712TypedDataValue = {
  __typename?: 'CreateFollowEIP712TypedDataValue'
  datas: Array<Scalars['BlockchainData']>
  deadline: Scalars['UnixTimestamp']
  nonce: Scalars['Nonce']
  profileIds: Array<Scalars['ProfileId']>
}

/** The broadcast item */
export type CreateMirrorBroadcastItemResult = {
  __typename?: 'CreateMirrorBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateMirrorEip712TypedData
}

/** The mirror eip 712 typed data */
export type CreateMirrorEip712TypedData = {
  __typename?: 'CreateMirrorEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateMirrorEip712TypedDataTypes
  /** The values */
  value: CreateMirrorEip712TypedDataValue
}

/** The mirror eip 712 typed data types */
export type CreateMirrorEip712TypedDataTypes = {
  __typename?: 'CreateMirrorEIP712TypedDataTypes'
  MirrorWithSig: Array<Eip712TypedDataField>
}

/** The mirror eip 712 typed data value */
export type CreateMirrorEip712TypedDataValue = {
  __typename?: 'CreateMirrorEIP712TypedDataValue'
  deadline: Scalars['UnixTimestamp']
  nonce: Scalars['Nonce']
  profileId: Scalars['ProfileId']
  profileIdPointed: Scalars['ProfileId']
  pubIdPointed: Scalars['PublicationId']
  referenceModule: Scalars['ContractAddress']
  referenceModuleData: Scalars['ReferenceModuleData']
}

export type CreateMirrorRequest = {
  /** Profile id */
  profileId: Scalars['ProfileId']
  /** Publication id of what you want to mirror on remember if this is a comment it will be that as the id */
  publicationId: Scalars['InternalPublicationId']
  /** The reference module info */
  referenceModule?: InputMaybe<ReferenceModuleParams>
}

/** The broadcast item */
export type CreatePostBroadcastItemResult = {
  __typename?: 'CreatePostBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreatePostEip712TypedData
}

/** The create post eip 712 typed data */
export type CreatePostEip712TypedData = {
  __typename?: 'CreatePostEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreatePostEip712TypedDataTypes
  /** The values */
  value: CreatePostEip712TypedDataValue
}

/** The create post eip 712 typed data types */
export type CreatePostEip712TypedDataTypes = {
  __typename?: 'CreatePostEIP712TypedDataTypes'
  PostWithSig: Array<Eip712TypedDataField>
}

/** The create post eip 712 typed data value */
export type CreatePostEip712TypedDataValue = {
  __typename?: 'CreatePostEIP712TypedDataValue'
  collectModule: Scalars['ContractAddress']
  collectModuleData: Scalars['CollectModuleData']
  contentURI: Scalars['PublicationUrl']
  deadline: Scalars['UnixTimestamp']
  nonce: Scalars['Nonce']
  profileId: Scalars['ProfileId']
  referenceModule: Scalars['ContractAddress']
  referenceModuleData: Scalars['ReferenceModuleData']
}

export type CreateProfileRequest = {
  /** The follow module */
  followModule?: InputMaybe<FollowModuleParams>
  /** The follow NFT URI is the NFT metadata your followers will mint when they follow you. This can be updated at all times. If you do not pass in anything it will create a super cool changing NFT which will show the last publication of your profile as the NFT which looks awesome! This means people do not have to worry about writing this logic but still have the ability to customise it for their followers */
  followNFTURI?: InputMaybe<Scalars['Url']>
  handle: Scalars['Handle']
  /** The profile picture uri */
  profilePictureUri?: InputMaybe<Scalars['Url']>
}

export type CreatePublicCommentRequest = {
  /** The collect module */
  collectModule: CollectModuleParams
  /** The metadata uploaded somewhere passing in the url to reach it */
  contentURI: Scalars['Url']
  /** Profile id */
  profileId: Scalars['ProfileId']
  /** Publication id of what your comments on remember if this is a comment you commented on it will be that as the id */
  publicationId: Scalars['InternalPublicationId']
  /** The reference module */
  referenceModule?: InputMaybe<ReferenceModuleParams>
}

export type CreatePublicPostRequest = {
  /** The collect module */
  collectModule: CollectModuleParams
  /** The metadata uploaded somewhere passing in the url to reach it */
  contentURI: Scalars['Url']
  /** Profile id */
  profileId: Scalars['ProfileId']
  /** The reference module */
  referenceModule?: InputMaybe<ReferenceModuleParams>
}

/** The broadcast item */
export type CreateSetDispatcherBroadcastItemResult = {
  __typename?: 'CreateSetDispatcherBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateSetDispatcherEip712TypedData
}

/** The set dispatcher eip 712 typed data */
export type CreateSetDispatcherEip712TypedData = {
  __typename?: 'CreateSetDispatcherEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateSetDispatcherEip712TypedDataTypes
  /** The values */
  value: CreateSetDispatcherEip712TypedDataValue
}

/** The set dispatcher eip 712 typed data types */
export type CreateSetDispatcherEip712TypedDataTypes = {
  __typename?: 'CreateSetDispatcherEIP712TypedDataTypes'
  SetDispatcherWithSig: Array<Eip712TypedDataField>
}

/** The set dispatcher eip 712 typed data value */
export type CreateSetDispatcherEip712TypedDataValue = {
  __typename?: 'CreateSetDispatcherEIP712TypedDataValue'
  deadline: Scalars['UnixTimestamp']
  dispatcher: Scalars['EthereumAddress']
  nonce: Scalars['Nonce']
  profileId: Scalars['ProfileId']
}

/** The broadcast item */
export type CreateSetFollowModuleBroadcastItemResult = {
  __typename?: 'CreateSetFollowModuleBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateSetFollowModuleEip712TypedData
}

/** The set follow module eip 712 typed data */
export type CreateSetFollowModuleEip712TypedData = {
  __typename?: 'CreateSetFollowModuleEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateSetFollowModuleEip712TypedDataTypes
  /** The values */
  value: CreateSetFollowModuleEip712TypedDataValue
}

/** The set follow module eip 712 typed data types */
export type CreateSetFollowModuleEip712TypedDataTypes = {
  __typename?: 'CreateSetFollowModuleEIP712TypedDataTypes'
  SetFollowModuleWithSig: Array<Eip712TypedDataField>
}

/** The set follow module eip 712 typed data value */
export type CreateSetFollowModuleEip712TypedDataValue = {
  __typename?: 'CreateSetFollowModuleEIP712TypedDataValue'
  deadline: Scalars['UnixTimestamp']
  followModule: Scalars['ContractAddress']
  followModuleData: Scalars['FollowModuleData']
  nonce: Scalars['Nonce']
  profileId: Scalars['ProfileId']
}

export type CreateSetFollowModuleRequest = {
  /** The follow module info */
  followModule: FollowModuleParams
  profileId: Scalars['ProfileId']
}

/** The broadcast item */
export type CreateSetFollowNftUriBroadcastItemResult = {
  __typename?: 'CreateSetFollowNFTUriBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateSetFollowNftUriEip712TypedData
}

/** The set follow nft uri eip 712 typed data */
export type CreateSetFollowNftUriEip712TypedData = {
  __typename?: 'CreateSetFollowNFTUriEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateSetFollowNftUriEip712TypedDataTypes
  /** The values */
  value: CreateSetFollowNftUriEip712TypedDataValue
}

/** The set follow nft uri eip 712 typed data types */
export type CreateSetFollowNftUriEip712TypedDataTypes = {
  __typename?: 'CreateSetFollowNFTUriEIP712TypedDataTypes'
  SetFollowNFTURIWithSig: Array<Eip712TypedDataField>
}

/** The set follow nft uri eip 712 typed data value */
export type CreateSetFollowNftUriEip712TypedDataValue = {
  __typename?: 'CreateSetFollowNFTUriEIP712TypedDataValue'
  deadline: Scalars['UnixTimestamp']
  followNFTURI: Scalars['Url']
  nonce: Scalars['Nonce']
  profileId: Scalars['ProfileId']
}

export type CreateSetFollowNftUriRequest = {
  /** The follow NFT URI is the NFT metadata your followers will mint when they follow you. This can be updated at all times. If you do not pass in anything it will create a super cool changing NFT which will show the last publication of your profile as the NFT which looks awesome! This means people do not have to worry about writing this logic but still have the ability to customise it for their followers */
  followNFTURI?: InputMaybe<Scalars['Url']>
  profileId: Scalars['ProfileId']
}

/** The broadcast item */
export type CreateSetProfileImageUriBroadcastItemResult = {
  __typename?: 'CreateSetProfileImageUriBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateSetProfileImageUriEip712TypedData
}

/** The set profile uri eip 712 typed data */
export type CreateSetProfileImageUriEip712TypedData = {
  __typename?: 'CreateSetProfileImageUriEIP712TypedData'
  /** The typed data domain */
  domain: Eip712TypedDataDomain
  /** The types */
  types: CreateSetProfileImageUriEip712TypedDataTypes
  /** The values */
  value: CreateSetProfileImageUriEip712TypedDataValue
}

/** The set profile image uri eip 712 typed data types */
export type CreateSetProfileImageUriEip712TypedDataTypes = {
  __typename?: 'CreateSetProfileImageUriEIP712TypedDataTypes'
  SetProfileImageURIWithSig: Array<Eip712TypedDataField>
}

/** The set profile uri eip 712 typed data value */
export type CreateSetProfileImageUriEip712TypedDataValue = {
  __typename?: 'CreateSetProfileImageUriEIP712TypedDataValue'
  deadline: Scalars['UnixTimestamp']
  imageURI: Scalars['Url']
  nonce: Scalars['Nonce']
  profileId: Scalars['ProfileId']
}

/** The broadcast item */
export type CreateUnfollowBroadcastItemResult = {
  __typename?: 'CreateUnfollowBroadcastItemResult'
  /** The date the broadcast item expiries */
  expiresAt: Scalars['DateTime']
  /** This broadcast item ID */
  id: Scalars['BroadcastId']
  /** The typed data */
  typedData: CreateBurnEip712TypedData
}

/** The dispatcher */
export type Dispatcher = {
  __typename?: 'Dispatcher'
  /** The dispatcher address */
  address: Scalars['EthereumAddress']
  /** If the dispatcher can use the relay */
  canUseRelay: Scalars['Boolean']
}

export type DoesFollow = {
  /** The follower address remember wallets follow profiles */
  followerAddress: Scalars['EthereumAddress']
  /** The profile id */
  profileId: Scalars['ProfileId']
}

export type DoesFollowRequest = {
  /** The follower infos */
  followInfos: Array<DoesFollow>
}

/** The does follow response */
export type DoesFollowResponse = {
  __typename?: 'DoesFollowResponse'
  /** The follower address remember wallets follow profiles */
  followerAddress: Scalars['EthereumAddress']
  /** If the user does follow */
  follows: Scalars['Boolean']
  /** The profile id */
  profileId: Scalars['ProfileId']
}

/** The eip 712 typed data domain */
export type Eip712TypedDataDomain = {
  __typename?: 'EIP712TypedDataDomain'
  /** The chainId */
  chainId: Scalars['ChainId']
  /** The name of the typed data domain */
  name: Scalars['String']
  /** The verifying contract */
  verifyingContract: Scalars['ContractAddress']
  /** The version */
  version: Scalars['String']
}

/** The eip 712 typed data field */
export type Eip712TypedDataField = {
  __typename?: 'EIP712TypedDataField'
  /** The name of the typed data field */
  name: Scalars['String']
  /** The type of the typed data field */
  type: Scalars['String']
}

export type EmptyCollectModuleSettings = {
  __typename?: 'EmptyCollectModuleSettings'
  contractAddress: Scalars['ContractAddress']
  /** The collect modules enum */
  type: CollectModules
}

export type EnabledModule = {
  __typename?: 'EnabledModule'
  contractAddress: Scalars['ContractAddress']
  inputParams: Array<ModuleInfo>
  moduleName: Scalars['String']
  redeemParams: Array<ModuleInfo>
  returnDataParms: Array<ModuleInfo>
}

/** The enabled modules */
export type EnabledModules = {
  __typename?: 'EnabledModules'
  collectModules: Array<EnabledModule>
  followModules: Array<EnabledModule>
  referenceModules: Array<EnabledModule>
}

/** The erc20 type */
export type Erc20 = {
  __typename?: 'Erc20'
  /** The erc20 address */
  address: Scalars['ContractAddress']
  /** Decimal places for the token */
  decimals: Scalars['Int']
  /** Name of the symbol */
  name: Scalars['String']
  /** Symbol for the token */
  symbol: Scalars['String']
}

export type Erc20Amount = {
  __typename?: 'Erc20Amount'
  /** The erc20 token info */
  asset: Erc20
  /** Floating point number as string (e.g. 42.009837). It could have the entire precision of the Asset or be truncated to the last significant decimal. */
  value: Scalars['String']
}

export type ExplorePublicationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
  sortCriteria: PublicationSortCriteria
  /** The App Id */
  sources?: InputMaybe<Array<Scalars['Sources']>>
  timestamp?: InputMaybe<Scalars['TimestampScalar']>
}

/** The paginated publication result */
export type ExplorePublicationResult = {
  __typename?: 'ExplorePublicationResult'
  items: Array<Publication>
  pageInfo: PaginatedResultInfo
}

export type FeeCollectModuleParams = {
  /** The collect module amount info */
  amount: ModuleFeeAmountParams
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The collect module referral fee */
  referralFee: Scalars['Float']
}

export type FeeCollectModuleSettings = {
  __typename?: 'FeeCollectModuleSettings'
  /** The collect module amount info */
  amount: ModuleFeeAmount
  contractAddress: Scalars['ContractAddress']
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The collect module referral fee */
  referralFee: Scalars['Float']
  /** The collect modules enum */
  type: CollectModules
}

export type FeeFollowModuleParams = {
  /** The follow module amount info */
  amount: ModuleFeeAmountParams
  /** The follow module recipient address */
  recipient: Scalars['EthereumAddress']
}

export type FeeFollowModuleRedeemParams = {
  /** The expected amount to pay */
  amount: ModuleFeeAmountParams
}

export type FeeFollowModuleSettings = {
  __typename?: 'FeeFollowModuleSettings'
  /** The collect module amount info */
  amount: ModuleFeeAmount
  contractAddress: Scalars['ContractAddress']
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The follow modules enum */
  type: FollowModules
}

export type Follow = {
  followModule?: InputMaybe<FollowModuleRedeemParams>
  profile: Scalars['ProfileId']
}

export type FollowModule = FeeFollowModuleSettings

export type FollowModuleParams = {
  /** The empty follow module */
  emptyFollowModule?: InputMaybe<Scalars['Boolean']>
  /** The follower fee follower module */
  feeFollowModule?: InputMaybe<FeeFollowModuleParams>
}

export type FollowModuleRedeemParams = {
  /** The follower fee follower module */
  feeFollowModule?: InputMaybe<FeeFollowModuleRedeemParams>
}

/** The follow module types */
export enum FollowModules {
  FeeFollowModule = 'FeeFollowModule'
}

export type FollowOnlyReferenceModuleSettings = {
  __typename?: 'FollowOnlyReferenceModuleSettings'
  contractAddress: Scalars['ContractAddress']
  /** The reference modules enum */
  type: ReferenceModules
}

export type FollowRequest = {
  follow: Array<Follow>
}

export type Follower = {
  __typename?: 'Follower'
  totalAmountOfTimesFollowed: Scalars['Int']
  wallet: Wallet
}

export type FollowerNftOwnedTokenIds = {
  __typename?: 'FollowerNftOwnedTokenIds'
  followerNftAddress: Scalars['ContractAddress']
  tokensIds: Array<Scalars['String']>
}

export type FollowerNftOwnedTokenIdsRequest = {
  address: Scalars['EthereumAddress']
  profileId: Scalars['ProfileId']
}

export type FollowersRequest = {
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
  profileId: Scalars['ProfileId']
}

export type Following = {
  __typename?: 'Following'
  profile: Profile
  totalAmountOfTimesFollowing: Scalars['Int']
}

export type FollowingRequest = {
  address: Scalars['EthereumAddress']
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
}

export type FraudReasonInputParams = {
  reason: PublicationReportingReason
  subreason: PublicationReportingFraudSubreason
}

export type GenerateModuleCurrencyApproval = {
  __typename?: 'GenerateModuleCurrencyApproval'
  data: Scalars['BlockchainData']
  from: Scalars['EthereumAddress']
  to: Scalars['ContractAddress']
}

export type GenerateModuleCurrencyApprovalDataRequest = {
  collectModule?: InputMaybe<CollectModules>
  currency: Scalars['ContractAddress']
  followModule?: InputMaybe<FollowModules>
  referenceModule?: InputMaybe<ReferenceModules>
  /** Floating point number as string (e.g. 42.009837). The server will move its decimal places for you */
  value: Scalars['String']
}

export type HasCollectedItem = {
  __typename?: 'HasCollectedItem'
  collected: Scalars['Boolean']
  collectedTimes: Scalars['Int']
  publicationId: Scalars['InternalPublicationId']
}

export type HasCollectedPublicationRequest = {
  /** Internal publication ids */
  publicationIds: Array<Scalars['InternalPublicationId']>
  /** Wallet address */
  walletAddress: Scalars['EthereumAddress']
}

export type HasCollectedRequest = {
  collectRequests: Array<HasCollectedPublicationRequest>
}

export type HasCollectedResult = {
  __typename?: 'HasCollectedResult'
  results: Array<HasCollectedItem>
  /** Wallet address */
  walletAddress: Scalars['EthereumAddress']
}

export type HasMirroredItem = {
  __typename?: 'HasMirroredItem'
  mirrored: Scalars['Boolean']
  publicationId: Scalars['InternalPublicationId']
}

export type HasMirroredProfileRequest = {
  /** Profile id */
  profileId: Scalars['ProfileId']
  /** Internal publication ids */
  publicationIds: Array<Scalars['InternalPublicationId']>
}

export type HasMirroredRequest = {
  profilesRequest: Array<HasMirroredProfileRequest>
}

export type HasMirroredResult = {
  __typename?: 'HasMirroredResult'
  /** Profile id */
  profileId: Scalars['ProfileId']
  results: Array<HasMirroredItem>
}

export type HasTxHashBeenIndexedRequest = {
  txHash: Scalars['TxHash']
}

export type HidePublicationRequest = {
  /** Publication id */
  publicationId: Scalars['InternalPublicationId']
}

export type IllegalReasonInputParams = {
  reason: PublicationReportingReason
  subreason: PublicationReportingIllegalSubreason
}

export type LimitedFeeCollectModuleParams = {
  /** The collect module amount info */
  amount: ModuleFeeAmountParams
  /** The collect module limit */
  collectLimit: Scalars['String']
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The collect module referral fee */
  referralFee: Scalars['Float']
}

export type LimitedFeeCollectModuleSettings = {
  __typename?: 'LimitedFeeCollectModuleSettings'
  /** The collect module amount info */
  amount: ModuleFeeAmount
  /** The collect module limit */
  collectLimit: Scalars['String']
  contractAddress: Scalars['ContractAddress']
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The collect module referral fee */
  referralFee: Scalars['Float']
  /** The collect modules enum */
  type: CollectModules
}

export type LimitedTimedFeeCollectModuleParams = {
  /** The collect module amount info */
  amount: ModuleFeeAmountParams
  /** The collect module limit */
  collectLimit: Scalars['String']
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The collect module referral fee */
  referralFee: Scalars['Float']
}

export type LimitedTimedFeeCollectModuleSettings = {
  __typename?: 'LimitedTimedFeeCollectModuleSettings'
  /** The collect module amount info */
  amount: ModuleFeeAmount
  /** The collect module limit */
  collectLimit: Scalars['String']
  contractAddress: Scalars['ContractAddress']
  /** The collect module end timestamp */
  endTimestamp: Scalars['DateTime']
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The collect module referral fee */
  referralFee: Scalars['Float']
  /** The collect modules enum */
  type: CollectModules
}

export type Log = {
  __typename?: 'Log'
  address: Scalars['ContractAddress']
  blockHash: Scalars['String']
  blockNumber: Scalars['Int']
  data: Scalars['String']
  logIndex: Scalars['Int']
  removed: Scalars['Boolean']
  topics: Array<Scalars['String']>
  transactionHash: Scalars['TxHash']
  transactionIndex: Scalars['Int']
}

export type MainPostReference = Mirror | Post

/** The Media url */
export type Media = {
  __typename?: 'Media'
  /** Height - will always be null on the public API */
  height?: Maybe<Scalars['Int']>
  /** The image/audio/video mime type for the publication */
  mimeType?: Maybe<Scalars['MimeType']>
  /** Size - will always be null on the public API */
  size?: Maybe<Scalars['Int']>
  /** The token image nft */
  url: Scalars['Url']
  /** Width - will always be null on the public API */
  width?: Maybe<Scalars['Int']>
}

/** The Media Set */
export type MediaSet = {
  __typename?: 'MediaSet'
  /** Medium media - will always be null on the public API */
  medium?: Maybe<Media>
  /** Original media */
  original: Media
  /** Small media - will always be null on the public API */
  small?: Maybe<Media>
}

/** The metadata attribute output */
export type MetadataAttributeOutput = {
  __typename?: 'MetadataAttributeOutput'
  /** The display type */
  displayType?: Maybe<MetadataDisplayType>
  /** The trait type - can be anything its the name it will render so include spaces */
  traitType: Scalars['String']
  /** The value */
  value: Scalars['String']
}

/** The metadata display types */
export enum MetadataDisplayType {
  Date = 'date',
  Number = 'number',
  String = 'string'
}

/** The metadata output */
export type MetadataOutput = {
  __typename?: 'MetadataOutput'
  /** The attributes */
  attributes: Array<MetadataAttributeOutput>
  /** This is the metadata content for the publication, should be markdown */
  content?: Maybe<Scalars['Markdown']>
  /** The image cover for video/music publications */
  cover?: Maybe<MediaSet>
  /** This is the metadata description */
  description?: Maybe<Scalars['Markdown']>
  /** The images/audios/videos for the publication */
  media: Array<MediaSet>
  /** The metadata name */
  name?: Maybe<Scalars['String']>
}

/** The social mirror */
export type Mirror = {
  __typename?: 'Mirror'
  /** ID of the source */
  appId?: Maybe<Scalars['Sources']>
  /** The collect module */
  collectModule: CollectModule
  /** The date the post was created on */
  createdAt: Scalars['DateTime']
  /** The internal publication id */
  id: Scalars['InternalPublicationId']
  /** The metadata for the post */
  metadata: MetadataOutput
  /** The mirror publication */
  mirrorOf: MirrorablePublication
  /** The on chain content uri could be `ipfs://` or `https` */
  onChainContentURI: Scalars['String']
  /** The profile ref */
  profile: Profile
  /** The reference module */
  referenceModule?: Maybe<ReferenceModule>
  /** The publication stats */
  stats: PublicationStats
}

export type MirrorablePublication = Comment | Post

export type ModuleFeeAmount = {
  __typename?: 'ModuleFeeAmount'
  /** The erc20 token info */
  asset: Erc20
  /** Floating point number as string (e.g. 42.009837). It could have the entire precision of the Asset or be truncated to the last significant decimal. */
  value: Scalars['String']
}

export type ModuleFeeAmountParams = {
  /** The currency address */
  currency: Scalars['ContractAddress']
  /** Floating point number as string (e.g. 42.009837). It could have the entire precision of the Asset or be truncated to the last significant decimal. */
  value: Scalars['String']
}

export type ModuleInfo = {
  __typename?: 'ModuleInfo'
  name: Scalars['String']
  type: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  attachFile: AttachResults
  authenticate: AuthenticationResult
  claim: RelayResult
  createCollectTypedData: CreateCollectBroadcastItemResult
  createCommentTypedData: CreateCommentBroadcastItemResult
  createFollowTypedData: CreateFollowBroadcastItemResult
  createMirrorTypedData: CreateMirrorBroadcastItemResult
  createPostTypedData: CreatePostBroadcastItemResult
  createProfile: RelayResult
  createSetDispatcherTypedData: CreateSetDispatcherBroadcastItemResult
  createSetFollowModuleTypedData: CreateSetFollowModuleBroadcastItemResult
  createSetFollowNFTUriTypedData: CreateSetFollowNftUriBroadcastItemResult
  createSetProfileImageURITypedData: CreateSetProfileImageUriBroadcastItemResult
  createUnfollowTypedData: CreateUnfollowBroadcastItemResult
  hidePublication?: Maybe<Scalars['Void']>
  refresh: AuthenticationResult
  reportPublication?: Maybe<Scalars['Void']>
  updateProfile: Profile
}

export type MutationAttachFileArgs = {
  request: AttachRequest
}

export type MutationAuthenticateArgs = {
  request: SignedAuthChallenge
}

export type MutationClaimArgs = {
  request: ClaimHandleRequest
}

export type MutationCreateCollectTypedDataArgs = {
  request: CreateCollectRequest
}

export type MutationCreateCommentTypedDataArgs = {
  request: CreatePublicCommentRequest
}

export type MutationCreateFollowTypedDataArgs = {
  request: FollowRequest
}

export type MutationCreateMirrorTypedDataArgs = {
  request: CreateMirrorRequest
}

export type MutationCreatePostTypedDataArgs = {
  request: CreatePublicPostRequest
}

export type MutationCreateProfileArgs = {
  request: CreateProfileRequest
}

export type MutationCreateSetDispatcherTypedDataArgs = {
  request: SetDispatcherRequest
}

export type MutationCreateSetFollowModuleTypedDataArgs = {
  request: CreateSetFollowModuleRequest
}

export type MutationCreateSetFollowNftUriTypedDataArgs = {
  request: CreateSetFollowNftUriRequest
}

export type MutationCreateSetProfileImageUriTypedDataArgs = {
  request: UpdateProfileImageRequest
}

export type MutationCreateUnfollowTypedDataArgs = {
  request: UnfollowRequest
}

export type MutationHidePublicationArgs = {
  request: HidePublicationRequest
}

export type MutationRefreshArgs = {
  request: RefreshRequest
}

export type MutationReportPublicationArgs = {
  request: ReportPublicationRequest
}

export type MutationUpdateProfileArgs = {
  request: UpdateProfileRequest
}

/** The nft type */
export type Nft = {
  __typename?: 'NFT'
  /** aka "1"  */
  chainId: Scalars['ChainId']
  /** aka "CryptoKitties"  */
  collectionName: Scalars['String']
  /** aka "https://api.criptokitt..."  */
  contentURI: Scalars['String']
  /** aka 0x057Ec652A4F150f7FF94f089A38008f49a0DF88e  */
  contractAddress: Scalars['ContractAddress']
  /** aka us CryptoKitties */
  contractName: Scalars['String']
  /** aka "Hey cutie! I m Beard Coffee. ....  */
  description: Scalars['String']
  /** aka "ERC721"  */
  ercType: Scalars['String']
  /** aka "Beard Coffee"  */
  name: Scalars['String']
  /** aka "{ uri:"https://ipfs....", metaType:"image/png" }"  */
  originalContent: NftContent
  /** aka { address: 0x057Ec652A4F150f7FF94f089A38008f49a0DF88e, amount:"2" }  */
  owners: Array<Owner>
  /** aka RARI */
  symbol: Scalars['String']
  /** aka "13"  */
  tokenId: Scalars['String']
}

/** The NFT content uri */
export type NftContent = {
  __typename?: 'NFTContent'
  /** The meta type content */
  metaType: Scalars['String']
  /** The token uri  nft */
  uri: Scalars['String']
}

export type NftData = {
  /** Id of the nft ownership challenge */
  id: Scalars['NftOwnershipId']
  /** The signature */
  signature: Scalars['Signature']
}

export type NfTsRequest = {
  /** Chain Ids */
  chainIds: Array<Scalars['ChainId']>
  /** Filter by contract address */
  contractAddress?: InputMaybe<Scalars['ContractAddress']>
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
  /** Filter by owner address */
  ownerAddress: Scalars['EthereumAddress']
}

/** Paginated nft results */
export type NfTsResult = {
  __typename?: 'NFTsResult'
  items: Array<Nft>
  pageInfo: PaginatedResultInfo
}

export type NewCollectNotification = {
  __typename?: 'NewCollectNotification'
  collectedPublication: Publication
  createdAt: Scalars['DateTime']
  wallet: Wallet
}

export type NewCommentNotification = {
  __typename?: 'NewCommentNotification'
  comment: Comment
  createdAt: Scalars['DateTime']
  /** The profile */
  profile: Profile
}

export type NewFollowerNotification = {
  __typename?: 'NewFollowerNotification'
  createdAt: Scalars['DateTime']
  isFollowedByMe: Scalars['Boolean']
  wallet: Wallet
}

export type NewMirrorNotification = {
  __typename?: 'NewMirrorNotification'
  createdAt: Scalars['DateTime']
  /** The profile */
  profile: Profile
  publication: MirrorablePublication
}

/** The NFT image */
export type NftImage = {
  __typename?: 'NftImage'
  /** The contract address */
  contractAddress: Scalars['ContractAddress']
  /** The token id of the nft */
  tokenId: Scalars['String']
  /** The token image nft */
  uri: Scalars['Url']
  /** If the NFT is verified */
  verified: Scalars['Boolean']
}

export type NftOwnershipChallenge = {
  /** Chain Id */
  chainId: Scalars['ChainId']
  /** ContractAddress for nft */
  contractAddress: Scalars['ContractAddress']
  /** Token id for NFT */
  tokenId: Scalars['String']
}

export type NftOwnershipChallengeRequest = {
  /** The wallet address which owns the NFT */
  ethereumAddress: Scalars['EthereumAddress']
  nfts: Array<NftOwnershipChallenge>
}

/** NFT ownership challenge result */
export type NftOwnershipChallengeResult = {
  __typename?: 'NftOwnershipChallengeResult'
  /** Id of the nft ownership challenge */
  id: Scalars['NftOwnershipId']
  text: Scalars['String']
  /** Timeout of the validation */
  timeout: Scalars['TimestampScalar']
}

export type Notification =
  | NewCollectNotification
  | NewCommentNotification
  | NewFollowerNotification
  | NewMirrorNotification

export type NotificationRequest = {
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
  /** The profile id */
  profileId?: InputMaybe<Scalars['ProfileId']>
  /** The App Id */
  sources?: InputMaybe<Array<Scalars['Sources']>>
}

/** The nft type */
export type Owner = {
  __typename?: 'Owner'
  /** aka 0x057Ec652A4F150f7FF94f089A38008f49a0DF88e  */
  address: Scalars['EthereumAddress']
  /** number of tokens owner */
  amount: Scalars['Float']
}

/** The paginated followers result */
export type PaginatedFollowersResult = {
  __typename?: 'PaginatedFollowersResult'
  items: Array<Follower>
  pageInfo: PaginatedResultInfo
}

export type PaginatedFollowingResult = {
  __typename?: 'PaginatedFollowingResult'
  items: Array<Following>
  pageInfo: PaginatedResultInfo
}

/** The paginated notification result */
export type PaginatedNotificationResult = {
  __typename?: 'PaginatedNotificationResult'
  items: Array<Notification>
  pageInfo: PaginatedResultInfo
}

/** The paginated profile result */
export type PaginatedProfileResult = {
  __typename?: 'PaginatedProfileResult'
  items: Array<Profile>
  pageInfo: PaginatedResultInfo
}

/** The paginated publication result */
export type PaginatedPublicationResult = {
  __typename?: 'PaginatedPublicationResult'
  items: Array<Publication>
  pageInfo: PaginatedResultInfo
}

/** The paginated result info */
export type PaginatedResultInfo = {
  __typename?: 'PaginatedResultInfo'
  /** Cursor to query next results */
  next?: Maybe<Scalars['Cursor']>
  /** Cursor to query the actual results */
  prev?: Maybe<Scalars['Cursor']>
  /** The total number of entities the pagination iterates over. e.g. For a query that requests all nfts with more than 10 likes, this field gives the total amount of nfts with more than 10 likes, not the total amount of nfts */
  totalCount: Scalars['Int']
}

/** The paginated timeline result */
export type PaginatedTimelineResult = {
  __typename?: 'PaginatedTimelineResult'
  items: Array<Publication>
  pageInfo: PaginatedResultInfo
}

export type PendingApprovalFollowsRequest = {
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
}

/** The paginated follow result */
export type PendingApproveFollowsResult = {
  __typename?: 'PendingApproveFollowsResult'
  items: Array<Profile>
  pageInfo: PaginatedResultInfo
}

/** The social post */
export type Post = {
  __typename?: 'Post'
  /** ID of the source */
  appId?: Maybe<Scalars['Sources']>
  /** The collect module */
  collectModule: CollectModule
  /** Who collected it, this is used for timeline results and like this for better caching for the client */
  collectedBy?: Maybe<Wallet>
  /** The date the post was created on */
  createdAt: Scalars['DateTime']
  /** The internal publication id */
  id: Scalars['InternalPublicationId']
  /** The metadata for the post */
  metadata: MetadataOutput
  /** The on chain content uri could be `ipfs://` or `https` */
  onChainContentURI: Scalars['String']
  /** The profile ref */
  profile: Profile
  /** The reference module */
  referenceModule?: Maybe<ReferenceModule>
  /** The publication stats */
  stats: PublicationStats
}

/** The Profile */
export type Profile = {
  __typename?: 'Profile'
  /** Bio of the profile */
  bio?: Maybe<Scalars['String']>
  /** The cover picture for the profile */
  coverPicture?: Maybe<ProfileMedia>
  /** The dispatcher */
  depatcher?: Maybe<Dispatcher>
  /** The follow module */
  followModule?: Maybe<FollowModule>
  /** The profile handle */
  handle: Scalars['Handle']
  /** The profile id */
  id: Scalars['ProfileId']
  /** Location set on profile */
  location?: Maybe<Scalars['String']>
  /** Name of the profile */
  name?: Maybe<Scalars['String']>
  /** Who owns the profile */
  ownedBy: Scalars['EthereumAddress']
  /** The picture for the profile */
  picture?: Maybe<ProfileMedia>
  /** Profile stats */
  stats: ProfileStats
  /** Twitter url set on profile */
  twitterUrl?: Maybe<Scalars['Url']>
  /** Website set on profile */
  website?: Maybe<Scalars['String']>
}

export type ProfileMedia = MediaSet | NftImage

export type ProfileQueryRequest = {
  cursor?: InputMaybe<Scalars['Cursor']>
  /** The handles for the profile */
  handles?: InputMaybe<Array<Scalars['Handle']>>
  limit?: InputMaybe<Scalars['LimitScalar']>
  /** The ethereum addresses */
  ownedBy?: InputMaybe<Array<Scalars['EthereumAddress']>>
  /** The profile ids */
  profileIds?: InputMaybe<Array<Scalars['ProfileId']>>
  /** The mirrored publication id */
  whoMirroredPublicationId?: InputMaybe<Scalars['InternalPublicationId']>
}

/** Profile search results */
export type ProfileSearchResult = {
  __typename?: 'ProfileSearchResult'
  items: Array<Profile>
  pageInfo: PaginatedResultInfo
  type: SearchRequestTypes
}

/** The Profile Stats */
export type ProfileStats = {
  __typename?: 'ProfileStats'
  /** Total collects count */
  totalCollects: Scalars['Int']
  /** Total comment count */
  totalComments: Scalars['Int']
  /** Total follower count */
  totalFollowers: Scalars['Int']
  /** Total following count (remember the wallet follows not profile so will be same for every profile they own) */
  totalFollowing: Scalars['Int']
  /** Total mirror count */
  totalMirrors: Scalars['Int']
  /** Total post count */
  totalPosts: Scalars['Int']
  /** Total publication count */
  totalPublications: Scalars['Int']
}

export type Publication = Comment | Mirror | Post

export type PublicationMetadataStatus = {
  __typename?: 'PublicationMetadataStatus'
  /** If metadata validation failed it will put a reason why here */
  reason?: Maybe<Scalars['String']>
  status: PublicationMetadataStatusType
}

/** publication metadata status type */
export enum PublicationMetadataStatusType {
  MetadataValidationFailed = 'METADATA_VALIDATION_FAILED',
  Pending = 'PENDING',
  Success = 'SUCCESS'
}

export type PublicationQueryRequest = {
  /** The publication id */
  publicationId?: InputMaybe<Scalars['InternalPublicationId']>
  /** The tx hash */
  txHash?: InputMaybe<Scalars['TxHash']>
}

/** Publication reporting fraud subreason */
export enum PublicationReportingFraudSubreason {
  Impersonation = 'IMPERSONATION',
  Scam = 'SCAM'
}

/** Publication reporting illegal subreason */
export enum PublicationReportingIllegalSubreason {
  AnimalAbuse = 'ANIMAL_ABUSE',
  HumanAbuse = 'HUMAN_ABUSE'
}

/** Publication reporting reason */
export enum PublicationReportingReason {
  Fraud = 'FRAUD',
  Illegal = 'ILLEGAL',
  Sensitive = 'SENSITIVE'
}

/** Publication reporting sensitive subreason */
export enum PublicationReportingSensitiveSubreason {
  Nsfw = 'NSFW',
  Offensive = 'OFFENSIVE'
}

/** Publication search results */
export type PublicationSearchResult = {
  __typename?: 'PublicationSearchResult'
  items: Array<PublicationSearchResultItem>
  pageInfo: PaginatedResultInfo
  type: SearchRequestTypes
}

export type PublicationSearchResultItem = Comment | Post

/** Publication sort criteria */
export enum PublicationSortCriteria {
  TopCollected = 'TOP_COLLECTED',
  TopCommented = 'TOP_COMMENTED'
}

/** The publication stats */
export type PublicationStats = {
  __typename?: 'PublicationStats'
  /** The total amount of collects */
  totalAmountOfCollects: Scalars['Int']
  /** The total amount of comments */
  totalAmountOfComments: Scalars['Int']
  /** The total amount of mirrors */
  totalAmountOfMirrors: Scalars['Int']
}

/** The publication types */
export enum PublicationTypes {
  Comment = 'COMMENT',
  Mirror = 'MIRROR',
  Post = 'POST'
}

export type PublicationsQueryRequest = {
  /** The ethereum address */
  collectedBy?: InputMaybe<Scalars['EthereumAddress']>
  /** The publication id */
  commentsOf?: InputMaybe<Scalars['InternalPublicationId']>
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
  /** Profile id */
  profileId?: InputMaybe<Scalars['ProfileId']>
  /** The publication types you want to query */
  publicationTypes?: InputMaybe<Array<PublicationTypes>>
  /** The App Id */
  sources?: InputMaybe<Array<Scalars['Sources']>>
}

export type Query = {
  __typename?: 'Query'
  approvedModuleAllowanceAmount: Array<ApprovedAllowanceAmount>
  challenge: AuthChallengeResult
  claimableHandles: Array<ClaimableHandle>
  claimedHandles: Array<ClaimedHandle>
  doesFollow: Array<DoesFollowResponse>
  enabledModuleCurrencies: Array<Erc20>
  enabledModules: EnabledModules
  explorePublications: ExplorePublicationResult
  followerNftOwnedTokenIds: FollowerNftOwnedTokenIds
  followers: PaginatedFollowersResult
  following: PaginatedFollowingResult
  generateModuleCurrencyApprovalData: GenerateModuleCurrencyApproval
  hasCollected: Array<HasCollectedResult>
  hasMirrored: Array<HasMirroredResult>
  hasTxHashBeenIndexed: TransactionResult
  nftOwnershipChallenge: NftOwnershipChallengeResult
  nfts: NfTsResult
  notifications: PaginatedNotificationResult
  pendingApprovalFollows: PendingApproveFollowsResult
  ping: Scalars['String']
  profiles: PaginatedProfileResult
  publication?: Maybe<Publication>
  publications: PaginatedPublicationResult
  recommendedProfiles: Array<Profile>
  revenue: RevenueResult
  search: SearchResult
  timeline: PaginatedTimelineResult
  verify: Scalars['Boolean']
}

export type QueryApprovedModuleAllowanceAmountArgs = {
  request: ApprovedModuleAllowanceAmountRequest
}

export type QueryChallengeArgs = {
  request: ChallengeRequest
}

export type QueryDoesFollowArgs = {
  request: DoesFollowRequest
}

export type QueryExplorePublicationsArgs = {
  request: ExplorePublicationRequest
}

export type QueryFollowerNftOwnedTokenIdsArgs = {
  request: FollowerNftOwnedTokenIdsRequest
}

export type QueryFollowersArgs = {
  request: FollowersRequest
}

export type QueryFollowingArgs = {
  request: FollowingRequest
}

export type QueryGenerateModuleCurrencyApprovalDataArgs = {
  request: GenerateModuleCurrencyApprovalDataRequest
}

export type QueryHasCollectedArgs = {
  request: HasCollectedRequest
}

export type QueryHasMirroredArgs = {
  request: HasMirroredRequest
}

export type QueryHasTxHashBeenIndexedArgs = {
  request: HasTxHashBeenIndexedRequest
}

export type QueryNftOwnershipChallengeArgs = {
  request: NftOwnershipChallengeRequest
}

export type QueryNftsArgs = {
  request: NfTsRequest
}

export type QueryNotificationsArgs = {
  request: NotificationRequest
}

export type QueryPendingApprovalFollowsArgs = {
  request: PendingApprovalFollowsRequest
}

export type QueryProfilesArgs = {
  request: ProfileQueryRequest
}

export type QueryPublicationArgs = {
  request: PublicationQueryRequest
}

export type QueryPublicationsArgs = {
  request: PublicationsQueryRequest
}

export type QueryRevenueArgs = {
  request: RevenueQueryRequest
}

export type QuerySearchArgs = {
  request: SearchQueryRequest
}

export type QueryTimelineArgs = {
  request: TimelineRequest
}

export type QueryVerifyArgs = {
  request: VerifyRequest
}

export type ReferenceModule = FollowOnlyReferenceModuleSettings

export type ReferenceModuleParams = {
  /** The follower only reference module */
  followerOnlyReferenceModule?: InputMaybe<Scalars['Boolean']>
}

/** The reference module types */
export enum ReferenceModules {
  FollowerOnlyReferenceModule = 'FollowerOnlyReferenceModule'
}

/** The refresh request */
export type RefreshRequest = {
  /** The refresh token */
  refreshToken: Scalars['Jwt']
}

export type RelayError = {
  __typename?: 'RelayError'
  reason: RelayErrorReasons
}

/** Relay error reason */
export enum RelayErrorReasons {
  Expired = 'EXPIRED',
  HandleTaken = 'HANDLE_TAKEN',
  Rejected = 'REJECTED',
  WrongWalletSigned = 'WRONG_WALLET_SIGNED'
}

export type RelayResult = RelayError | RelayerResult

/** The relayer result */
export type RelayerResult = {
  __typename?: 'RelayerResult'
  /** The tx hash */
  txHash: Scalars['TxHash']
}

export type ReportPublicationRequest = {
  additionalComments?: InputMaybe<Scalars['String']>
  publicationId: Scalars['InternalPublicationId']
  reason: ReportingReasonInputParams
}

export type ReportingReasonInputParams = {
  fraudReason?: InputMaybe<FraudReasonInputParams>
  illegalReason?: InputMaybe<IllegalReasonInputParams>
  sensitiveReason?: InputMaybe<SensitiveReasonInputParams>
}

/** The social comment */
export type Revenue = {
  __typename?: 'Revenue'
  earnings: Erc20Amount
  /** Protocol treasury fee % */
  protocolFee: Scalars['Float']
  publication: Publication
}

export type RevenueQueryRequest = {
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
  /** The profile id */
  profileId: Scalars['ProfileId']
  /** The App Id */
  sources?: InputMaybe<Array<Scalars['Sources']>>
}

/** The paginated revenue result */
export type RevenueResult = {
  __typename?: 'RevenueResult'
  items: Array<Revenue>
  pageInfo: PaginatedResultInfo
}

export type RevertCollectModuleSettings = {
  __typename?: 'RevertCollectModuleSettings'
  contractAddress: Scalars['ContractAddress']
  /** The collect modules enum */
  type: CollectModules
}

export type SearchQueryRequest = {
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
  /** The search term */
  query: Scalars['Search']
  /** The App Id */
  sources?: InputMaybe<Array<Scalars['Sources']>>
  type: SearchRequestTypes
}

/** Search request types */
export enum SearchRequestTypes {
  Profile = 'PROFILE',
  Publication = 'PUBLICATION'
}

export type SearchResult = ProfileSearchResult | PublicationSearchResult

export type SensitiveReasonInputParams = {
  reason: PublicationReportingReason
  subreason: PublicationReportingSensitiveSubreason
}

export type SetDispatcherRequest = {
  /** The dispatcher address - they can post, comment, mirror, set follow module, change your profile picture on your behalf. */
  dispatcher?: InputMaybe<Scalars['EthereumAddress']>
  /** If you want to enable or disable it */
  enable?: InputMaybe<Scalars['Boolean']>
  /** The profile id */
  profileId: Scalars['ProfileId']
}

/** The signed auth challenge */
export type SignedAuthChallenge = {
  /** The ethereum address you signed the signature with */
  address: Scalars['EthereumAddress']
  /** The signature */
  signature: Scalars['Signature']
}

export type TimedFeeCollectModuleParams = {
  /** The collect module amount info */
  amount: ModuleFeeAmountParams
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The collect module referral fee */
  referralFee: Scalars['Float']
}

export type TimedFeeCollectModuleSettings = {
  __typename?: 'TimedFeeCollectModuleSettings'
  /** The collect module amount info */
  amount: ModuleFeeAmount
  contractAddress: Scalars['ContractAddress']
  /** The collect module end timestamp */
  endTimestamp: Scalars['DateTime']
  /** The collect module recipient address */
  recipient: Scalars['EthereumAddress']
  /** The collect module referral fee */
  referralFee: Scalars['Float']
  /** The collect modules enum */
  type: CollectModules
}

export type TimelineRequest = {
  cursor?: InputMaybe<Scalars['Cursor']>
  limit?: InputMaybe<Scalars['LimitScalar']>
  /** The profile id */
  profileId: Scalars['ProfileId']
  /** The App Id */
  sources?: InputMaybe<Array<Scalars['Sources']>>
}

export type TransactionError = {
  __typename?: 'TransactionError'
  reason: TransactionErrorReasons
  txReceipt?: Maybe<TransactionReceipt>
}

/** Transaction error reason */
export enum TransactionErrorReasons {
  Reverted = 'REVERTED'
}

export type TransactionIndexedResult = {
  __typename?: 'TransactionIndexedResult'
  indexed: Scalars['Boolean']
  /** Publications can be indexed but the ipfs link for example not findable for x time. This allows you to work that out for publications. If its not a publication tx then it always be null. */
  metadataStatus?: Maybe<PublicationMetadataStatus>
  txReceipt?: Maybe<TransactionReceipt>
}

export type TransactionReceipt = {
  __typename?: 'TransactionReceipt'
  blockHash: Scalars['String']
  blockNumber: Scalars['Int']
  byzantium: Scalars['Boolean']
  confirmations: Scalars['Int']
  contractAddress?: Maybe<Scalars['ContractAddress']>
  cumulativeGasUsed: Scalars['String']
  effectiveGasPrice: Scalars['String']
  from: Scalars['EthereumAddress']
  gasUsed: Scalars['String']
  logs: Array<Log>
  logsBloom: Scalars['String']
  root?: Maybe<Scalars['String']>
  status: Scalars['Int']
  to?: Maybe<Scalars['EthereumAddress']>
  transactionHash: Scalars['TxHash']
  transactionIndex: Scalars['Int']
  type: Scalars['Int']
}

export type TransactionResult = TransactionError | TransactionIndexedResult

export type UnfollowRequest = {
  profile: Scalars['ProfileId']
}

export type UpdateProfileImageRequest = {
  /** The nft data */
  nftData?: InputMaybe<NftData>
  profileId: Scalars['ProfileId']
  /** The url to the image if offline */
  url?: InputMaybe<Scalars['Url']>
}

export type UpdateProfileRequest = {
  /** The profile bio */
  bio?: InputMaybe<Scalars['String']>
  /** The cover picture for the profile */
  coverPicture?: InputMaybe<Scalars['Url']>
  /** The profile location */
  location?: InputMaybe<Scalars['String']>
  /** The profile name */
  name: Scalars['String']
  profileId: Scalars['ProfileId']
  /** The profile twitter url */
  twitterUrl?: InputMaybe<Scalars['Url']>
  /** The profile website */
  website?: InputMaybe<Scalars['Url']>
}

/** The access request */
export type VerifyRequest = {
  /** The access token */
  accessToken: Scalars['Jwt']
}

export type Wallet = {
  __typename?: 'Wallet'
  address: Scalars['EthereumAddress']
  /** The default profile for the wallet for now it is just their first profile, this will be the default profile they picked soon enough */
  defaultProfile?: Maybe<Profile>
}
