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
  JSONScalar: { input: any; output: any };
  datetime: { input: any; output: any };
};

export type AccumulativeSalesQueryInput = {
  collectionAddress: Scalars['String']['input'];
  tokenId?: InputMaybe<Scalars['String']['input']>;
};

export type ActiveMarket = {
  __typename?: 'ActiveMarket';
  collectionAddress?: Maybe<Scalars['String']['output']>;
  marketAddress: Scalars['String']['output'];
  marketType: ActiveMarketType;
  networkInfo: NetworkInfo;
  price?: Maybe<PriceAtTime>;
  properties?: Maybe<ActiveMarketProperties>;
  status: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['String']['output']>;
  transactionInfo: TransactionInfo;
};

export type ActiveMarketProperties =
  | LilNounsAuction
  | NounsAuction
  | NounsBuilderAuction
  | V2Auction
  | V3ReserveAuction;

export type ActiveMarketQueryInput = {
  collectionAddress?: InputMaybe<Scalars['String']['input']>;
  marketType: ActiveMarketType;
  token?: InputMaybe<TokenInput>;
};

export enum ActiveMarketType {
  ActiveLilNounsAuction = 'ACTIVE_LIL_NOUNS_AUCTION',
  ActiveNounsAuction = 'ACTIVE_NOUNS_AUCTION',
  ActiveNounsBuilderAuction = 'ACTIVE_NOUNS_BUILDER_AUCTION',
  ActiveV2Auction = 'ACTIVE_V2_AUCTION',
  ActiveV3ReserveAuction = 'ACTIVE_V3_RESERVE_AUCTION'
}

export type AggregateAttribute = {
  __typename?: 'AggregateAttribute';
  traitType: Scalars['String']['output'];
  valueMetrics: Array<AggregateAttributeValue>;
};

export enum AggregateAttributeSortKey {
  Count = 'COUNT',
  None = 'NONE',
  Value = 'VALUE'
}

export type AggregateAttributeSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: AggregateAttributeSortKey;
};

export type AggregateAttributeValue = {
  __typename?: 'AggregateAttributeValue';
  count: Scalars['Int']['output'];
  percent: Scalars['Float']['output'];
  value: Scalars['String']['output'];
};

export type AggregateAttributesQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export type AggregateStat = {
  __typename?: 'AggregateStat';
  accumulativeSales: Array<SalesBucket>;
  floorPrice?: Maybe<Scalars['Float']['output']>;
  nftCount: Scalars['Int']['output'];
  ownerCount: Scalars['Int']['output'];
  ownersByCount: OwnerCountConnection;
  ownersByCount1155: Array<OwnerCount>;
  salesVolume: SalesVolume;
};

export type AggregateStatAccumulativeSalesArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  where: AccumulativeSalesQueryInput;
};

export type AggregateStatFloorPriceArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  where: CollectionAddressAndAttributesInput;
};

export type AggregateStatNftCountArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  where: CollectionAddressOwnerAddressAttributesInput;
};

export type AggregateStatOwnerCountArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  where: CollectionAddressAndAttributesInput;
};

export type AggregateStatOwnersByCountArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<OwnerCountSortKeySortInput>;
  where: OwnersByCountQueryInput;
};

export type AggregateStatOwnersByCount1155Args = {
  where: OwnersByCount1155QueryInput;
};

export type AggregateStatSalesVolumeArgs = {
  filter?: InputMaybe<SalesVolumeFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  where: CollectionAddressOwnerAddressAttributesInput;
};

export type ApprovalEvent = {
  __typename?: 'ApprovalEvent';
  approvalEventType: ApprovalEventType;
  approved?: Maybe<Scalars['Boolean']['output']>;
  approvedAddress: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  ownerAddress: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['String']['output']>;
};

export enum ApprovalEventType {
  Approval = 'APPROVAL',
  ApprovalForAll = 'APPROVAL_FOR_ALL'
}

export type AttributeFilter = {
  traitType: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export type AudioEncodingTypes = {
  __typename?: 'AudioEncodingTypes';
  large?: Maybe<Scalars['String']['output']>;
  original: Scalars['String']['output'];
};

export enum Chain {
  BaseGoerli = 'BASE_GOERLI',
  BaseMainnet = 'BASE_MAINNET',
  Goerli = 'GOERLI',
  Mainnet = 'MAINNET',
  OptimismGoerli = 'OPTIMISM_GOERLI',
  OptimismMainnet = 'OPTIMISM_MAINNET',
  PgnMainnet = 'PGN_MAINNET',
  Rinkeby = 'RINKEBY',
  Sepolia = 'SEPOLIA',
  ZoraGoerli = 'ZORA_GOERLI',
  ZoraMainnet = 'ZORA_MAINNET'
}

export type Collection = {
  __typename?: 'Collection';
  address: Scalars['String']['output'];
  attributes?: Maybe<Array<CollectionAttribute>>;
  description: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  networkInfo: NetworkInfo;
  symbol?: Maybe<Scalars['String']['output']>;
  tokenStandard?: Maybe<TokenStandard>;
  totalSupply?: Maybe<Scalars['Int']['output']>;
};

export type CollectionAddressAndAttributesInput = {
  attributes?: InputMaybe<Array<AttributeFilter>>;
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CollectionAddressOwnerAddressAttributesInput = {
  attributes?: InputMaybe<Array<AttributeFilter>>;
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CollectionAttribute = {
  __typename?: 'CollectionAttribute';
  traitType?: Maybe<Scalars['String']['output']>;
  valueMetrics: Array<CollectionAttributeValue>;
};

export type CollectionAttributeValue = {
  __typename?: 'CollectionAttributeValue';
  count: Scalars['Int']['output'];
  percent: Scalars['Float']['output'];
  value: Scalars['String']['output'];
};

export type CollectionConnection = {
  __typename?: 'CollectionConnection';
  nodes: Array<Collection>;
  pageInfo: PageInfo;
};

export enum CollectionSortKey {
  Created = 'CREATED',
  Name = 'NAME',
  None = 'NONE'
}

export type CollectionSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: CollectionSortKey;
};

export type CollectionsQueryInput = {
  collectionAddresses: Array<Scalars['String']['input']>;
};

export type Currency = {
  __typename?: 'Currency';
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CurrencyAmount = {
  __typename?: 'CurrencyAmount';
  currency: Currency;
  decimal: Scalars['Float']['output'];
  raw: Scalars['String']['output'];
};

export type Event = {
  __typename?: 'Event';
  collectionAddress?: Maybe<Scalars['String']['output']>;
  eventType: EventType;
  networkInfo: NetworkInfo;
  properties: EventProperties;
  tokenId?: Maybe<Scalars['String']['output']>;
  transactionInfo: TransactionInfo;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  nodes: Array<Event>;
  pageInfo: PageInfo;
};

export type EventProperties =
  | ApprovalEvent
  | LilNounsAuctionEvent
  | MintEvent
  | NounsAuctionEvent
  | Sale
  | SeaportEvent
  | TransferEvent
  | V1MarketEvent
  | V1MediaEvent
  | V2AuctionEvent
  | V3AskEvent
  | V3ModuleManagerEvent
  | V3ReserveAuctionEvent;

export enum EventSortKey {
  Created = 'CREATED'
}

export type EventSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: EventSortKey;
};

export enum EventType {
  ApprovalEvent = 'APPROVAL_EVENT',
  LilNounsAuctionEvent = 'LIL_NOUNS_AUCTION_EVENT',
  MintEvent = 'MINT_EVENT',
  NounsAuctionEvent = 'NOUNS_AUCTION_EVENT',
  SaleEvent = 'SALE_EVENT',
  SeaportEvent = 'SEAPORT_EVENT',
  TransferEvent = 'TRANSFER_EVENT',
  V1MarketEvent = 'V1_MARKET_EVENT',
  V1MediaEvent = 'V1_MEDIA_EVENT',
  V2AuctionEvent = 'V2_AUCTION_EVENT',
  V3AskEvent = 'V3_ASK_EVENT',
  V3ModuleManagerEvent = 'V3_MODULE_MANAGER_EVENT',
  V3ReserveAuctionEvent = 'V3_RESERVE_AUCTION_EVENT'
}

export type EventsQueryFilter = {
  bidderAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  eventTypes?: InputMaybe<Array<EventType>>;
  recipientAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  sellerAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  senderAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  timeFilter?: InputMaybe<TimeFilter>;
};

export type EventsQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export type ImageEncodingTypes = {
  __typename?: 'ImageEncodingTypes';
  large?: Maybe<Scalars['String']['output']>;
  original: Scalars['String']['output'];
  poster?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type ImageEncodingTypesVideoEncodingTypesAudioEncodingTypesUnsupportedEncodingTypes =

    | AudioEncodingTypes
    | ImageEncodingTypes
    | UnsupportedEncodingTypes
    | VideoEncodingTypes;

export type LilNounsAuction = {
  __typename?: 'LilNounsAuction';
  address: Scalars['String']['output'];
  amount?: Maybe<PriceAtTime>;
  auctionCurrency: Scalars['String']['output'];
  auctionId: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  duration: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  estimatedDurationTime?: Maybe<Scalars['datetime']['output']>;
  firstBidTime?: Maybe<Scalars['datetime']['output']>;
  highestBidPrice?: Maybe<PriceAtTime>;
  highestBidder?: Maybe<Scalars['String']['output']>;
  minBidIncrementPercentage?: Maybe<Scalars['Int']['output']>;
  reservePrice?: Maybe<PriceAtTime>;
  startTime: Scalars['String']['output'];
  timeBuffer?: Maybe<Scalars['Int']['output']>;
  tokenId: Scalars['String']['output'];
  winner?: Maybe<Scalars['String']['output']>;
};

export type LilNounsAuctionBidEventProperties = {
  __typename?: 'LilNounsAuctionBidEventProperties';
  extended: Scalars['Boolean']['output'];
  lilNounId: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type LilNounsAuctionCreatedEventProperties = {
  __typename?: 'LilNounsAuctionCreatedEventProperties';
  endTime: Scalars['String']['output'];
  lilNounId: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type LilNounsAuctionEvent = {
  __typename?: 'LilNounsAuctionEvent';
  address: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  lilNounsAuctionEventType: LilNounsAuctionEventType;
  properties: LilNounsAuctionEventProperties;
  tokenId: Scalars['String']['output'];
};

export type LilNounsAuctionEventProperties =
  | LilNounsAuctionBidEventProperties
  | LilNounsAuctionCreatedEventProperties
  | LilNounsAuctionExtendedEventProperties
  | LilNounsAuctionMinBidIncrementPercentageUpdatedEventProperties
  | LilNounsAuctionReservePriceUpdatedEventProperties
  | LilNounsAuctionSettledEventProperties
  | LilNounsAuctionTimeBufferUpdatedEventProperties;

export enum LilNounsAuctionEventType {
  LilNounsAuctionHouseAuctionBidEvent = 'LIL_NOUNS_AUCTION_HOUSE_AUCTION_BID_EVENT',
  LilNounsAuctionHouseAuctionCreatedEvent = 'LIL_NOUNS_AUCTION_HOUSE_AUCTION_CREATED_EVENT',
  LilNounsAuctionHouseAuctionExtendedEvent = 'LIL_NOUNS_AUCTION_HOUSE_AUCTION_EXTENDED_EVENT',
  LilNounsAuctionHouseAuctionMinBidIncrementPercentageUpdated = 'LIL_NOUNS_AUCTION_HOUSE_AUCTION_MIN_BID_INCREMENT_PERCENTAGE_UPDATED',
  LilNounsAuctionHouseAuctionReservePriceUpdatedEvent = 'LIL_NOUNS_AUCTION_HOUSE_AUCTION_RESERVE_PRICE_UPDATED_EVENT',
  LilNounsAuctionHouseAuctionSettledEvent = 'LIL_NOUNS_AUCTION_HOUSE_AUCTION_SETTLED_EVENT',
  LilNounsAuctionHouseAuctionTimeBufferUpdatedEvent = 'LIL_NOUNS_AUCTION_HOUSE_AUCTION_TIME_BUFFER_UPDATED_EVENT'
}

export type LilNounsAuctionExtendedEventProperties = {
  __typename?: 'LilNounsAuctionExtendedEventProperties';
  endTime: Scalars['String']['output'];
  lilNounId: Scalars['String']['output'];
};

export type LilNounsAuctionMinBidIncrementPercentageUpdatedEventProperties = {
  __typename?: 'LilNounsAuctionMinBidIncrementPercentageUpdatedEventProperties';
  minBidIncrementPercentage: Scalars['String']['output'];
};

export type LilNounsAuctionReservePriceUpdatedEventProperties = {
  __typename?: 'LilNounsAuctionReservePriceUpdatedEventProperties';
  reservePrice: Scalars['String']['output'];
};

export type LilNounsAuctionSettledEventProperties = {
  __typename?: 'LilNounsAuctionSettledEventProperties';
  amount: Scalars['String']['output'];
  lilNounId: Scalars['String']['output'];
  price: PriceAtTime;
  winner: Scalars['String']['output'];
};

export type LilNounsAuctionTimeBufferUpdatedEventProperties = {
  __typename?: 'LilNounsAuctionTimeBufferUpdatedEventProperties';
  timeBuffer: Scalars['String']['output'];
};

export type Market = {
  __typename?: 'Market';
  collectionAddress?: Maybe<Scalars['String']['output']>;
  marketAddress: Scalars['String']['output'];
  marketType: MarketType;
  networkInfo: NetworkInfo;
  price?: Maybe<PriceAtTime>;
  properties?: Maybe<MarketProperties>;
  status: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['String']['output']>;
  transactionInfo: TransactionInfo;
};

export enum MarketCategory {
  Ask = 'ASK',
  Auction = 'AUCTION',
  Offer = 'OFFER'
}

export type MarketProperties =
  | LilNounsAuction
  | NounsAuction
  | NounsBuilderAuction
  | V1Ask
  | V1BidShare
  | V1Offer
  | V2Auction
  | V3Ask
  | V3ReserveAuction;

export enum MarketSortKey {
  ChainTokenPrice = 'CHAIN_TOKEN_PRICE',
  Created = 'CREATED',
  NativePrice = 'NATIVE_PRICE',
  None = 'NONE',
  TimedSaleEnding = 'TIMED_SALE_ENDING'
}

export type MarketSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: MarketSortKey;
};

export enum MarketStatus {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Completed = 'COMPLETED',
  Invalid = 'INVALID'
}

export enum MarketType {
  LilNounsAuction = 'LIL_NOUNS_AUCTION',
  NounsAuction = 'NOUNS_AUCTION',
  NounsBuilderAuction = 'NOUNS_BUILDER_AUCTION',
  V1Ask = 'V1_ASK',
  V1BidShare = 'V1_BID_SHARE',
  V1Offer = 'V1_OFFER',
  V2Auction = 'V2_AUCTION',
  V3Ask = 'V3_ASK',
  V3ReserveAuction = 'V3_RESERVE_AUCTION'
}

export type MarketTypeFilter = {
  bidderAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  marketType: MarketType;
  statuses?: InputMaybe<Array<MarketStatus>>;
};

export type MarketWithToken = {
  __typename?: 'MarketWithToken';
  market: Market;
  token?: Maybe<Token>;
};

export type MarketWithTokenConnection = {
  __typename?: 'MarketWithTokenConnection';
  nodes: Array<MarketWithToken>;
  pageInfo: PageInfo;
};

export type MarketsQueryFilter = {
  marketFilters?: InputMaybe<Array<MarketTypeFilter>>;
  priceFilter?: InputMaybe<PriceFilter>;
};

export type MarketsQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export enum MediaType {
  Audio = 'AUDIO',
  Gif = 'GIF',
  Html = 'HTML',
  Image = 'IMAGE',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type Mint = {
  __typename?: 'Mint';
  collectionAddress: Scalars['String']['output'];
  networkInfo: NetworkInfo;
  originatorAddress: Scalars['String']['output'];
  price: PriceAtTime;
  toAddress: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
  transactionInfo: TransactionInfo;
};

export type MintComment = {
  __typename?: 'MintComment';
  blockNumber: Scalars['Int']['output'];
  collectionAddress: Scalars['String']['output'];
  comment: Scalars['String']['output'];
  fromAddress: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  tokenId: Scalars['String']['output'];
};

export type MintComments = {
  __typename?: 'MintComments';
  comments: Array<MintComment>;
};

export type MintCommentsQueryInput = {
  collectionAddress: Scalars['String']['input'];
  tokenId?: InputMaybe<Scalars['String']['input']>;
};

export type MintEvent = {
  __typename?: 'MintEvent';
  collectionAddress: Scalars['String']['output'];
  originatorAddress: Scalars['String']['output'];
  price?: Maybe<PriceAtTime>;
  toAddress: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type MintInfo = {
  __typename?: 'MintInfo';
  mintContext: TransactionInfo;
  originatorAddress: Scalars['String']['output'];
  price?: Maybe<PriceAtTime>;
  toAddress: Scalars['String']['output'];
};

export enum MintSortKey {
  None = 'NONE',
  Price = 'PRICE',
  Time = 'TIME',
  TokenId = 'TOKEN_ID'
}

export type MintSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: MintSortKey;
};

export type MintWithTokenAndMarkets = {
  __typename?: 'MintWithTokenAndMarkets';
  markets: Array<Market>;
  mint: Mint;
  token?: Maybe<Token>;
};

export type MintWithTokenAndMarketsMarketsArgs = {
  filter?: InputMaybe<MarketsQueryFilter>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<MarketSortKeySortInput>;
};

export type MintWithTokenAndMarketsConnection = {
  __typename?: 'MintWithTokenAndMarketsConnection';
  nodes: Array<MintWithTokenAndMarkets>;
  pageInfo: PageInfo;
};

export type MintsQueryFilter = {
  priceFilter?: InputMaybe<PriceFilter>;
  timeFilter?: InputMaybe<TimeFilter>;
};

export type MintsQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  minterAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  recipientAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export enum Network {
  Base = 'BASE',
  Ethereum = 'ETHEREUM',
  Optimism = 'OPTIMISM',
  Pgn = 'PGN',
  Zora = 'ZORA'
}

export type NetworkInfo = {
  __typename?: 'NetworkInfo';
  chain: Chain;
  network: Network;
};

export type NetworkInput = {
  chain: Chain;
  network: Network;
};

export type Nouns = {
  __typename?: 'Nouns';
  nounsActiveMarket?: Maybe<NounsBuilderAuction>;
  nounsDaos: NounsDaoConnection;
  nounsEvents: NounsEventConnection;
  nounsMarkets: NounsBuilderAuctionConnection;
  nounsProposal?: Maybe<NounsProposal>;
  nounsProposals: NounsProposalConnection;
  nounsSearch: NounsSearchResultConnection;
};

export type NounsNounsActiveMarketArgs = {
  network?: InputMaybe<NetworkInput>;
  where: NounsActiveMarketQueryInput;
};

export type NounsNounsDaosArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<NounsSortKeySortInput>;
  where?: InputMaybe<NounsQueryInput>;
};

export type NounsNounsEventsArgs = {
  filter?: InputMaybe<NounsEventsQueryFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<EventSortKeySortInput>;
  where?: InputMaybe<NounsEventsQueryInput>;
};

export type NounsNounsMarketsArgs = {
  filter?: InputMaybe<NounsMarketsQueryFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<MarketSortKeySortInput>;
  where?: InputMaybe<NounsMarketsQueryInput>;
};

export type NounsNounsProposalArgs = {
  network?: InputMaybe<NetworkInput>;
  where: NounsProposalQueryInput;
};

export type NounsNounsProposalsArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<NounsProposalSortKeySortInput>;
  where?: InputMaybe<NounsProposalsQueryInput>;
};

export type NounsNounsSearchArgs = {
  filterModel?: InputMaybe<NounsSearchFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination: SearchPaginationInput;
  query: NounsSearchQueryInput;
};

export type NounsActiveMarketQueryInput = {
  collectionAddress: Scalars['String']['input'];
};

export type NounsAuction = {
  __typename?: 'NounsAuction';
  address: Scalars['String']['output'];
  amount?: Maybe<PriceAtTime>;
  auctionCurrency: Scalars['String']['output'];
  auctionId: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  duration: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  estimatedDurationTime?: Maybe<Scalars['datetime']['output']>;
  firstBidTime?: Maybe<Scalars['datetime']['output']>;
  highestBidPrice?: Maybe<PriceAtTime>;
  highestBidder?: Maybe<Scalars['String']['output']>;
  minBidIncrementPercentage?: Maybe<Scalars['Int']['output']>;
  reservePrice?: Maybe<PriceAtTime>;
  startTime: Scalars['String']['output'];
  timeBuffer?: Maybe<Scalars['Int']['output']>;
  tokenId: Scalars['String']['output'];
  winner?: Maybe<Scalars['String']['output']>;
};

export type NounsAuctionBidEventProperties = {
  __typename?: 'NounsAuctionBidEventProperties';
  extended: Scalars['Boolean']['output'];
  nounId: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type NounsAuctionCreatedEventProperties = {
  __typename?: 'NounsAuctionCreatedEventProperties';
  endTime: Scalars['String']['output'];
  nounId: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type NounsAuctionEvent = {
  __typename?: 'NounsAuctionEvent';
  address: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  nounsAuctionEventType: NounsAuctionEventType;
  properties: NounsAuctionEventProperties;
  tokenId: Scalars['String']['output'];
};

export type NounsAuctionEventProperties =
  | NounsAuctionBidEventProperties
  | NounsAuctionCreatedEventProperties
  | NounsAuctionExtendedEventProperties
  | NounsAuctionMinBidIncrementPercentageUpdatedEventProperties
  | NounsAuctionReservePriceUpdatedEventProperties
  | NounsAuctionSettledEventProperties
  | NounsAuctionTimeBufferUpdatedEventProperties;

export enum NounsAuctionEventType {
  NounsAuctionHouseAuctionBidEvent = 'NOUNS_AUCTION_HOUSE_AUCTION_BID_EVENT',
  NounsAuctionHouseAuctionCreatedEvent = 'NOUNS_AUCTION_HOUSE_AUCTION_CREATED_EVENT',
  NounsAuctionHouseAuctionExtendedEvent = 'NOUNS_AUCTION_HOUSE_AUCTION_EXTENDED_EVENT',
  NounsAuctionHouseAuctionMinBidIncrementPercentageUpdated = 'NOUNS_AUCTION_HOUSE_AUCTION_MIN_BID_INCREMENT_PERCENTAGE_UPDATED',
  NounsAuctionHouseAuctionReservePriceUpdatedEvent = 'NOUNS_AUCTION_HOUSE_AUCTION_RESERVE_PRICE_UPDATED_EVENT',
  NounsAuctionHouseAuctionSettledEvent = 'NOUNS_AUCTION_HOUSE_AUCTION_SETTLED_EVENT',
  NounsAuctionHouseAuctionTimeBufferUpdatedEvent = 'NOUNS_AUCTION_HOUSE_AUCTION_TIME_BUFFER_UPDATED_EVENT'
}

export type NounsAuctionExtendedEventProperties = {
  __typename?: 'NounsAuctionExtendedEventProperties';
  endTime: Scalars['String']['output'];
  nounId: Scalars['String']['output'];
};

export type NounsAuctionMinBidIncrementPercentageUpdatedEventProperties = {
  __typename?: 'NounsAuctionMinBidIncrementPercentageUpdatedEventProperties';
  minBidIncrementPercentage: Scalars['String']['output'];
};

export type NounsAuctionReservePriceUpdatedEventProperties = {
  __typename?: 'NounsAuctionReservePriceUpdatedEventProperties';
  reservePrice: Scalars['String']['output'];
};

export type NounsAuctionSettledEventProperties = {
  __typename?: 'NounsAuctionSettledEventProperties';
  amount: Scalars['String']['output'];
  nounId: Scalars['String']['output'];
  price: PriceAtTime;
  winner: Scalars['String']['output'];
};

export type NounsAuctionTimeBufferUpdatedEventProperties = {
  __typename?: 'NounsAuctionTimeBufferUpdatedEventProperties';
  timeBuffer: Scalars['String']['output'];
};

export type NounsBuilderAuction = {
  __typename?: 'NounsBuilderAuction';
  address: Scalars['String']['output'];
  amount?: Maybe<PriceAtTime>;
  auction?: Maybe<Scalars['String']['output']>;
  collectionAddress: Scalars['String']['output'];
  duration: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  estimatedDurationTime?: Maybe<Scalars['datetime']['output']>;
  extended?: Maybe<Scalars['Boolean']['output']>;
  firstBidTime?: Maybe<Scalars['datetime']['output']>;
  governor?: Maybe<Scalars['String']['output']>;
  highestBidPrice?: Maybe<PriceAtTime>;
  highestBidder?: Maybe<Scalars['String']['output']>;
  manager?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  minBidIncrementPercentage?: Maybe<Scalars['Int']['output']>;
  networkInfo: NetworkInfo;
  reservePrice?: Maybe<PriceAtTime>;
  startTime: Scalars['String']['output'];
  status: MarketStatus;
  timeBuffer?: Maybe<Scalars['String']['output']>;
  tokenId: Scalars['String']['output'];
  transactionInfo: TransactionInfo;
  treasury?: Maybe<Scalars['String']['output']>;
  winner?: Maybe<Scalars['String']['output']>;
};

export type NounsBuilderAuctionAuctionBidEventProperties = {
  __typename?: 'NounsBuilderAuctionAuctionBidEventProperties';
  amount: Scalars['String']['output'];
  amountPrice: PriceAtTime;
  bidder: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  extended: Scalars['Boolean']['output'];
  tokenId: Scalars['String']['output'];
};

export type NounsBuilderAuctionAuctionCreatedEventProperties = {
  __typename?: 'NounsBuilderAuctionAuctionCreatedEventProperties';
  endTime: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type NounsBuilderAuctionAuctionSettledEventProperties = {
  __typename?: 'NounsBuilderAuctionAuctionSettledEventProperties';
  amount: Scalars['String']['output'];
  amountPrice: PriceAtTime;
  tokenId: Scalars['String']['output'];
  winner: Scalars['String']['output'];
};

export type NounsBuilderAuctionConnection = {
  __typename?: 'NounsBuilderAuctionConnection';
  nodes: Array<NounsBuilderAuction>;
  pageInfo: PageInfo;
};

export type NounsBuilderAuctionDurationUpdatedEventProperties = {
  __typename?: 'NounsBuilderAuctionDurationUpdatedEventProperties';
  duration: Scalars['String']['output'];
};

export type NounsBuilderAuctionEvent = {
  __typename?: 'NounsBuilderAuctionEvent';
  address: Scalars['String']['output'];
  auction: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  governor: Scalars['String']['output'];
  manager: Scalars['String']['output'];
  metadata: Scalars['String']['output'];
  nounsBuilderAuctionEventType: NounsBuilderAuctionEventType;
  properties: NounsBuilderAuctionEventProperties;
  treasury: Scalars['String']['output'];
};

export type NounsBuilderAuctionEventProperties =
  | NounsBuilderAuctionAuctionBidEventProperties
  | NounsBuilderAuctionAuctionCreatedEventProperties
  | NounsBuilderAuctionAuctionSettledEventProperties
  | NounsBuilderAuctionDurationUpdatedEventProperties
  | NounsBuilderAuctionMinBidIncrementPercentageUpdatedEventProperties
  | NounsBuilderAuctionReservePriceUpdatedEventProperties
  | NounsBuilderAuctionTimeBufferUpdatedEventProperties;

export enum NounsBuilderAuctionEventType {
  NounsBuilderAuctionAuctionBidEvent = 'NOUNS_BUILDER_AUCTION_AUCTION_BID_EVENT',
  NounsBuilderAuctionAuctionCreatedEvent = 'NOUNS_BUILDER_AUCTION_AUCTION_CREATED_EVENT',
  NounsBuilderAuctionAuctionSettledEvent = 'NOUNS_BUILDER_AUCTION_AUCTION_SETTLED_EVENT',
  NounsBuilderAuctionDurationUpdatedEvent = 'NOUNS_BUILDER_AUCTION_DURATION_UPDATED_EVENT',
  NounsBuilderAuctionMinBidIncrementPercentageUpdatedEvent = 'NOUNS_BUILDER_AUCTION_MIN_BID_INCREMENT_PERCENTAGE_UPDATED_EVENT',
  NounsBuilderAuctionReservePriceUpdatedEvent = 'NOUNS_BUILDER_AUCTION_RESERVE_PRICE_UPDATED_EVENT',
  NounsBuilderAuctionTimeBufferUpdatedEvent = 'NOUNS_BUILDER_AUCTION_TIME_BUFFER_UPDATED_EVENT'
}

export type NounsBuilderAuctionMinBidIncrementPercentageUpdatedEventProperties =
  {
    __typename?: 'NounsBuilderAuctionMinBidIncrementPercentageUpdatedEventProperties';
    minBidIncrementPercentage: Scalars['String']['output'];
  };

export type NounsBuilderAuctionReservePriceUpdatedEventProperties = {
  __typename?: 'NounsBuilderAuctionReservePriceUpdatedEventProperties';
  reserve: Scalars['String']['output'];
  reservePrice: PriceAtTime;
};

export type NounsBuilderAuctionTimeBufferUpdatedEventProperties = {
  __typename?: 'NounsBuilderAuctionTimeBufferUpdatedEventProperties';
  timeBuffer: Scalars['String']['output'];
};

export type NounsBuilderGovernorEvent = {
  __typename?: 'NounsBuilderGovernorEvent';
  address: Scalars['String']['output'];
  auction: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  governor: Scalars['String']['output'];
  manager: Scalars['String']['output'];
  metadata: Scalars['String']['output'];
  nounsBuilderGovernorEventType: NounsBuilderGovernorEventType;
  properties: NounsBuilderGovernorEventProperties;
  treasury: Scalars['String']['output'];
};

export type NounsBuilderGovernorEventProperties =
  | NounsBuilderGovernorProposalCanceledEventProperties
  | NounsBuilderGovernorProposalCreatedEventProperties
  | NounsBuilderGovernorProposalExecutedEventProperties
  | NounsBuilderGovernorProposalQueuedEventProperties
  | NounsBuilderGovernorProposalThresholdBpsUpdatedEventProperties
  | NounsBuilderGovernorProposalVetoedEventProperties
  | NounsBuilderGovernorQuorumVotesBpsUpdated
  | NounsBuilderGovernorVetoerUpdatedEventProperties
  | NounsBuilderGovernorVoteCastEventProperties
  | NounsBuilderGovernorVotingDelayUpdatedEventProperties
  | NounsBuilderGovernorVotingPeriodUpdatedEventProperties;

export enum NounsBuilderGovernorEventType {
  NounsBuilderGovernorProposalCanceledEvent = 'NOUNS_BUILDER_GOVERNOR_PROPOSAL_CANCELED_EVENT',
  NounsBuilderGovernorProposalCreatedEvent = 'NOUNS_BUILDER_GOVERNOR_PROPOSAL_CREATED_EVENT',
  NounsBuilderGovernorProposalExecutedEvent = 'NOUNS_BUILDER_GOVERNOR_PROPOSAL_EXECUTED_EVENT',
  NounsBuilderGovernorProposalQueuedEvent = 'NOUNS_BUILDER_GOVERNOR_PROPOSAL_QUEUED_EVENT',
  NounsBuilderGovernorProposalVetoedEvent = 'NOUNS_BUILDER_GOVERNOR_PROPOSAL_VETOED_EVENT',
  NounsBuilderGovernorVetoerUpdatedEvent = 'NOUNS_BUILDER_GOVERNOR_VETOER_UPDATED_EVENT',
  NounsBuilderGovernorVoteCastEvent = 'NOUNS_BUILDER_GOVERNOR_VOTE_CAST_EVENT',
  NounsBuilderGovernorVotingDelayUpdatedEvent = 'NOUNS_BUILDER_GOVERNOR_VOTING_DELAY_UPDATED_EVENT',
  NounsBuilderGovernorVotingPeriodUpdatedEvent = 'NOUNS_BUILDER_GOVERNOR_VOTING_PERIOD_UPDATED_EVENT',
  NounsBuilderProposalThresholdBpsUpdated = 'NOUNS_BUILDER_PROPOSAL_THRESHOLD_BPS_UPDATED',
  NounsBuilderQuorumVotesBpsUpdated = 'NOUNS_BUILDER_QUORUM_VOTES_BPS_UPDATED'
}

export type NounsBuilderGovernorProposalCanceledEventProperties = {
  __typename?: 'NounsBuilderGovernorProposalCanceledEventProperties';
  proposalId: Scalars['String']['output'];
};

export type NounsBuilderGovernorProposalCreatedEventProperties = {
  __typename?: 'NounsBuilderGovernorProposalCreatedEventProperties';
  abstainVotes: Scalars['String']['output'];
  againstVotes: Scalars['String']['output'];
  calldatas: Array<Scalars['String']['output']>;
  canceled: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  descriptionHash: Scalars['String']['output'];
  executed: Scalars['Boolean']['output'];
  forVotes: Scalars['String']['output'];
  proposalId: Scalars['String']['output'];
  proposalNumber?: Maybe<Scalars['String']['output']>;
  proposalThreshold: Scalars['String']['output'];
  proposer: Scalars['String']['output'];
  quorumVotes: Scalars['String']['output'];
  targets: Array<Scalars['String']['output']>;
  timeCreated: Scalars['String']['output'];
  values: Array<Scalars['String']['output']>;
  vetoed: Scalars['Boolean']['output'];
  voteEnd: Scalars['String']['output'];
  voteStart: Scalars['String']['output'];
};

export type NounsBuilderGovernorProposalExecutedEventProperties = {
  __typename?: 'NounsBuilderGovernorProposalExecutedEventProperties';
  proposalId: Scalars['String']['output'];
};

export type NounsBuilderGovernorProposalQueuedEventProperties = {
  __typename?: 'NounsBuilderGovernorProposalQueuedEventProperties';
  eta: Scalars['String']['output'];
  proposalId: Scalars['String']['output'];
};

export type NounsBuilderGovernorProposalThresholdBpsUpdatedEventProperties = {
  __typename?: 'NounsBuilderGovernorProposalThresholdBpsUpdatedEventProperties';
  newBps: Scalars['String']['output'];
  prevBps: Scalars['String']['output'];
};

export type NounsBuilderGovernorProposalVetoedEventProperties = {
  __typename?: 'NounsBuilderGovernorProposalVetoedEventProperties';
  proposalId: Scalars['String']['output'];
};

export type NounsBuilderGovernorQuorumVotesBpsUpdated = {
  __typename?: 'NounsBuilderGovernorQuorumVotesBpsUpdated';
  newBps: Scalars['String']['output'];
  prevBps: Scalars['String']['output'];
};

export type NounsBuilderGovernorVetoerUpdatedEventProperties = {
  __typename?: 'NounsBuilderGovernorVetoerUpdatedEventProperties';
  newVetoer: Scalars['String']['output'];
  prevVetoer: Scalars['String']['output'];
};

export type NounsBuilderGovernorVoteCastEventProperties = {
  __typename?: 'NounsBuilderGovernorVoteCastEventProperties';
  proposalId: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  support: Scalars['String']['output'];
  voter: Scalars['String']['output'];
  weight: Scalars['String']['output'];
};

export type NounsBuilderGovernorVotingDelayUpdatedEventProperties = {
  __typename?: 'NounsBuilderGovernorVotingDelayUpdatedEventProperties';
  newVotingDelay: Scalars['String']['output'];
  prevVotingDelay: Scalars['String']['output'];
};

export type NounsBuilderGovernorVotingPeriodUpdatedEventProperties = {
  __typename?: 'NounsBuilderGovernorVotingPeriodUpdatedEventProperties';
  newVotingPeriod: Scalars['String']['output'];
  prevVotingPeriod: Scalars['String']['output'];
};

export type NounsBuilderManagerDaoDeployedEventProperties = {
  __typename?: 'NounsBuilderManagerDaoDeployedEventProperties';
  auction: Scalars['String']['output'];
  governor: Scalars['String']['output'];
  metadata: Scalars['String']['output'];
  token: Scalars['String']['output'];
  treasury: Scalars['String']['output'];
};

export type NounsBuilderManagerEvent = {
  __typename?: 'NounsBuilderManagerEvent';
  address: Scalars['String']['output'];
  nounsBuilderManagerEventType: NounsBuilderManagerEventType;
  properties: NounsBuilderManagerDaoDeployedEventProperties;
};

export enum NounsBuilderManagerEventType {
  NounsBuilderManagerDaoDeployedEvent = 'NOUNS_BUILDER_MANAGER_DAO_DEPLOYED_EVENT'
}

export type NounsDao = {
  __typename?: 'NounsDao';
  auctionAddress?: Maybe<Scalars['String']['output']>;
  collectionAddress: Scalars['String']['output'];
  contractAddress?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  governorAddress?: Maybe<Scalars['String']['output']>;
  metadataAddress?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  networkInfo: NetworkInfo;
  symbol?: Maybe<Scalars['String']['output']>;
  totalSupply?: Maybe<Scalars['Int']['output']>;
  treasuryAddress?: Maybe<Scalars['String']['output']>;
};

export type NounsDaoConnection = {
  __typename?: 'NounsDaoConnection';
  nodes: Array<NounsDao>;
  pageInfo: PageInfo;
};

export type NounsEvent = {
  __typename?: 'NounsEvent';
  collectionAddress: Scalars['String']['output'];
  eventType: NounsEventType;
  networkInfo: NetworkInfo;
  properties: NounsEventProperties;
  transactionInfo: TransactionInfo;
};

export type NounsEventConnection = {
  __typename?: 'NounsEventConnection';
  nodes: Array<NounsEvent>;
  pageInfo: PageInfo;
};

export type NounsEventProperties =
  | LilNounsAuctionEvent
  | NounsAuctionEvent
  | NounsBuilderAuctionEvent
  | NounsBuilderGovernorEvent
  | NounsBuilderManagerEvent;

export enum NounsEventType {
  LilNounsAuctionEvent = 'LIL_NOUNS_AUCTION_EVENT',
  NounsAuctionEvent = 'NOUNS_AUCTION_EVENT',
  NounsBuilderAuctionEvent = 'NOUNS_BUILDER_AUCTION_EVENT',
  NounsBuilderGovernorEvent = 'NOUNS_BUILDER_GOVERNOR_EVENT',
  NounsBuilderManagerEvent = 'NOUNS_BUILDER_MANAGER_EVENT'
}

export type NounsEventsQueryFilter = {
  nounsBuilderAuctionEventType?: InputMaybe<NounsBuilderAuctionEventType>;
  nounsBuilderGovernorEventType?: InputMaybe<NounsBuilderGovernorEventType>;
  nounsBuilderManagerEventType?: InputMaybe<NounsBuilderManagerEventType>;
  nounsEventTypes?: InputMaybe<Array<NounsEventType>>;
  timeFilter?: InputMaybe<TimeFilter>;
};

export type NounsEventsQueryInput = {
  auctionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  governorAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum NounsMarketType {
  LilNounsAuction = 'LIL_NOUNS_AUCTION',
  NounsAuction = 'NOUNS_AUCTION',
  NounsBuilderAuction = 'NOUNS_BUILDER_AUCTION'
}

export type NounsMarketsQueryFilter = {
  nounsMarketType?: InputMaybe<NounsMarketType>;
  status?: InputMaybe<MarketStatus>;
};

export type NounsMarketsQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export type NounsProposal = {
  __typename?: 'NounsProposal';
  abstainVotes: Scalars['Int']['output'];
  againstVotes: Scalars['Int']['output'];
  auction: Scalars['String']['output'];
  calldatas: Array<Scalars['String']['output']>;
  collectionAddress: Scalars['String']['output'];
  description: Scalars['String']['output'];
  descriptionHash: Scalars['String']['output'];
  executableFrom?: Maybe<Scalars['Int']['output']>;
  expiresAt?: Maybe<Scalars['Int']['output']>;
  forVotes: Scalars['Int']['output'];
  governor: Scalars['String']['output'];
  manager: Scalars['String']['output'];
  metadata: Scalars['String']['output'];
  networkInfo: NetworkInfo;
  proposalId: Scalars['String']['output'];
  proposalNumber: Scalars['Int']['output'];
  proposalThreshold: Scalars['Int']['output'];
  proposer: Scalars['String']['output'];
  quorumVotes: Scalars['Int']['output'];
  status: NounsProposalStatus;
  targets: Array<Scalars['String']['output']>;
  timeCreated: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  transactionInfo: TransactionInfo;
  treasury: Scalars['String']['output'];
  values: Array<Scalars['String']['output']>;
  voteEnd: Scalars['Int']['output'];
  voteStart: Scalars['Int']['output'];
  votes: Array<NounsProposalVote>;
};

export type NounsProposalConnection = {
  __typename?: 'NounsProposalConnection';
  nodes: Array<NounsProposal>;
  pageInfo: PageInfo;
};

export type NounsProposalQueryInput = {
  proposal?: InputMaybe<ProposalInput>;
  proposalId?: InputMaybe<Scalars['String']['input']>;
};

export enum NounsProposalSortKey {
  Created = 'CREATED',
  None = 'NONE'
}

export type NounsProposalSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: NounsProposalSortKey;
};

export enum NounsProposalStatus {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Created = 'CREATED',
  Defeated = 'DEFEATED',
  Executable = 'EXECUTABLE',
  Executed = 'EXECUTED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Queued = 'QUEUED',
  Succeeded = 'SUCCEEDED',
  Vetoed = 'VETOED'
}

export type NounsProposalVote = {
  __typename?: 'NounsProposalVote';
  proposalId: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  support: Support;
  transactionInfo: TransactionInfo;
  voter: Scalars['String']['output'];
  weight: Scalars['Int']['output'];
};

export type NounsProposalsQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  proposalIds?: InputMaybe<Array<Scalars['String']['input']>>;
  proposals?: InputMaybe<Array<ProposalInput>>;
};

export type NounsQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  memberAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NounsSearchFilter = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NounsSearchQueryInput = {
  text: Scalars['String']['input'];
};

export type NounsSearchResult = {
  __typename?: 'NounsSearchResult';
  collectionAddress: Scalars['String']['output'];
  entityType: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  networkInfo: NetworkInfo;
};

export type NounsSearchResultConnection = {
  __typename?: 'NounsSearchResultConnection';
  nodes: Array<NounsSearchResult>;
  pageInfo: PageInfo;
};

export enum NounsSortKey {
  Created = 'CREATED',
  None = 'NONE'
}

export type NounsSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: NounsSortKey;
};

export type OffchainOrder = {
  __typename?: 'OffchainOrder';
  calldata?: Maybe<Scalars['String']['output']>;
  collectionAddress?: Maybe<Scalars['String']['output']>;
  contractAddress: Scalars['String']['output'];
  endTime: Scalars['datetime']['output'];
  networkInfo: NetworkInfo;
  offerer: Scalars['String']['output'];
  orderType: Scalars['String']['output'];
  price: PriceAtTime;
  properties: SeaportOrder;
  startTime: Scalars['datetime']['output'];
  tokenId?: Maybe<Scalars['String']['output']>;
};

export enum OffchainOrderSortKey {
  ChainTokenPrice = 'CHAIN_TOKEN_PRICE',
  EndTime = 'END_TIME',
  NativePrice = 'NATIVE_PRICE',
  None = 'NONE',
  UsdcPrice = 'USDC_PRICE'
}

export type OffchainOrderSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: OffchainOrderSortKey;
};

export type OffchainOrderWithToken = {
  __typename?: 'OffchainOrderWithToken';
  offchainOrder: OffchainOrder;
  token?: Maybe<Token>;
};

export type OffchainOrderWithTokenConnection = {
  __typename?: 'OffchainOrderWithTokenConnection';
  nodes: Array<OffchainOrderWithToken>;
  pageInfo: PageInfo;
};

export type OffchainOrdersQueryFilter = {
  priceFilter?: InputMaybe<PriceFilter>;
};

export type OffchainOrdersQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  sellerAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export type OwnerCount = {
  __typename?: 'OwnerCount';
  count: Scalars['Int']['output'];
  latestMint: Scalars['datetime']['output'];
  owner: Scalars['String']['output'];
  tokenIds: Array<Scalars['String']['output']>;
};

export type OwnerCountConnection = {
  __typename?: 'OwnerCountConnection';
  nodes: Array<OwnerCount>;
  pageInfo: PageInfo;
};

export enum OwnerCountSortKey {
  Count = 'COUNT',
  LatestMint = 'LATEST_MINT',
  None = 'NONE'
}

export type OwnerCountSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: OwnerCountSortKey;
};

export type OwnersByCount1155QueryInput = {
  collectionAddress: Scalars['String']['input'];
  tokenId: Scalars['String']['input'];
};

export type OwnersByCountQueryInput = {
  attributes?: InputMaybe<Array<AttributeFilter>>;
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
};

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
};

export type PriceAtTime = {
  __typename?: 'PriceAtTime';
  blockNumber: Scalars['Int']['output'];
  chainTokenPrice?: Maybe<CurrencyAmount>;
  nativePrice: CurrencyAmount;
  usdcPrice?: Maybe<CurrencyAmount>;
};

export type PriceFilter = {
  currencyAddress?: InputMaybe<Scalars['String']['input']>;
  maximumChainTokenPrice?: InputMaybe<Scalars['String']['input']>;
  maximumNativePrice?: InputMaybe<Scalars['String']['input']>;
  minimumChainTokenPrice?: InputMaybe<Scalars['String']['input']>;
  minimumNativePrice?: InputMaybe<Scalars['String']['input']>;
};

export type ProposalInput = {
  address: Scalars['String']['input'];
  proposalNumber: Scalars['String']['input'];
};

export type ReceivedItem = {
  __typename?: 'ReceivedItem';
  address: Scalars['String']['output'];
  amount: Scalars['String']['output'];
  itemType: Scalars['String']['output'];
  price?: Maybe<PriceAtTime>;
  recipient: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type RootQuery = {
  __typename?: 'RootQuery';
  /** Gets the total set of NFT attributes */
  aggregateAttributes: Array<AggregateAttribute>;
  /** Gets counts, sales volume, and other statistics */
  aggregateStat: AggregateStat;
  /** NFT collection data */
  collections: CollectionConnection;
  /** Contract event information, e.g. Sales, Transfers, Mints, etc. */
  events: EventConnection;
  /** Real time data for active markets */
  market?: Maybe<ActiveMarket>;
  /** Data for specific ZORA markets, e.g. Buy Now, Auctions, Offers */
  markets: MarketWithTokenConnection;
  /** Returns comments made while minting */
  mintComments: MintComments;
  /** Historical minting data */
  mints: MintWithTokenAndMarketsConnection;
  /** Nouns Builder DAOs */
  nouns: Nouns;
  /** Offchain liquidity */
  offchainOrders: OffchainOrderWithTokenConnection;
  /** Historical sales data from ZORA, OpenSea, LooksRare, 0x, and more */
  sales: SaleWithTokenConnection;
  /** Returns search results for a query */
  search: SearchResultConnection;
  /** Gets data on a single token */
  token?: Maybe<TokenWithFullMarketHistory>;
  /** Gets data for multiple tokens */
  tokens: TokenWithMarketsSummaryConnection;
};

export type RootQueryAggregateAttributesArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  sort?: InputMaybe<AggregateAttributeSortKeySortInput>;
  where: AggregateAttributesQueryInput;
};

export type RootQueryCollectionsArgs = {
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<CollectionSortKeySortInput>;
  where?: InputMaybe<CollectionsQueryInput>;
};

export type RootQueryEventsArgs = {
  filter?: InputMaybe<EventsQueryFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<EventSortKeySortInput>;
  where?: InputMaybe<EventsQueryInput>;
};

export type RootQueryMarketArgs = {
  network?: InputMaybe<NetworkInput>;
  where: ActiveMarketQueryInput;
};

export type RootQueryMarketsArgs = {
  filter?: InputMaybe<MarketsQueryFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<MarketSortKeySortInput>;
  where?: InputMaybe<MarketsQueryInput>;
};

export type RootQueryMintCommentsArgs = {
  networks: Array<NetworkInput>;
  where: MintCommentsQueryInput;
};

export type RootQueryMintsArgs = {
  filter?: InputMaybe<MintsQueryFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<MintSortKeySortInput>;
  where?: InputMaybe<MintsQueryInput>;
};

export type RootQueryOffchainOrdersArgs = {
  filter?: InputMaybe<OffchainOrdersQueryFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<OffchainOrderSortKeySortInput>;
  where?: InputMaybe<OffchainOrdersQueryInput>;
};

export type RootQuerySalesArgs = {
  filter?: InputMaybe<SalesQueryFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SaleSortKeySortInput>;
  where?: InputMaybe<SalesQueryInput>;
};

export type RootQuerySearchArgs = {
  filter?: InputMaybe<SearchFilter>;
  pagination: SearchPaginationInput;
  query: SearchQueryInput;
};

export type RootQueryTokenArgs = {
  network?: InputMaybe<NetworkInput>;
  token: TokenInput;
};

export type RootQueryTokensArgs = {
  filter?: InputMaybe<TokensQueryFilter>;
  networks?: InputMaybe<Array<NetworkInput>>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<TokenSortInput>;
  where?: InputMaybe<TokensQueryInput>;
};

export type Sale = {
  __typename?: 'Sale';
  buyerAddress: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  networkInfo: NetworkInfo;
  price?: Maybe<PriceAtTime>;
  saleContractAddress?: Maybe<Scalars['String']['output']>;
  saleType: Scalars['String']['output'];
  sellerAddress: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
  transactionInfo: TransactionInfo;
};

export enum SaleSortKey {
  ChainTokenPrice = 'CHAIN_TOKEN_PRICE',
  NativePrice = 'NATIVE_PRICE',
  None = 'NONE',
  Time = 'TIME'
}

export type SaleSortKeySortInput = {
  sortDirection: SortDirection;
  sortKey: SaleSortKey;
};

export enum SaleType {
  CryptopunksSale = 'CRYPTOPUNKS_SALE',
  FoundationSale = 'FOUNDATION_SALE',
  LilNounsAuctionSale = 'LIL_NOUNS_AUCTION_SALE',
  LooksRareSale = 'LOOKS_RARE_SALE',
  NounsAuctionSale = 'NOUNS_AUCTION_SALE',
  NounsBuilderAuctionSale = 'NOUNS_BUILDER_AUCTION_SALE',
  OpenseaBundleSale = 'OPENSEA_BUNDLE_SALE',
  OpenseaSingleSale = 'OPENSEA_SINGLE_SALE',
  RaribleSale = 'RARIBLE_SALE',
  SeaportSale = 'SEAPORT_SALE',
  SuperrareSale = 'SUPERRARE_SALE',
  ZeroxSale = 'ZEROX_SALE',
  ZoraV2AuctionSale = 'ZORA_V2_AUCTION_SALE',
  ZoraV3AskSale = 'ZORA_V3_ASK_SALE',
  ZoraV3ReserveAuctionSale = 'ZORA_V3_RESERVE_AUCTION_SALE'
}

export type SaleWithToken = {
  __typename?: 'SaleWithToken';
  sale: Sale;
  token?: Maybe<Token>;
};

export type SaleWithTokenConnection = {
  __typename?: 'SaleWithTokenConnection';
  nodes: Array<SaleWithToken>;
  pageInfo: PageInfo;
};

export type SalesBucket = {
  __typename?: 'SalesBucket';
  count: Scalars['Int']['output'];
  date: Scalars['datetime']['output'];
};

export type SalesQueryFilter = {
  priceFilter?: InputMaybe<PriceFilter>;
  saleTypes?: InputMaybe<Array<SaleType>>;
  timeFilter?: InputMaybe<TimeFilter>;
};

export type SalesQueryInput = {
  buyerAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  sellerAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export type SalesVolume = {
  __typename?: 'SalesVolume';
  chainTokenPrice: Scalars['Float']['output'];
  totalCount: Scalars['Int']['output'];
  usdcPrice: Scalars['Float']['output'];
};

export type SalesVolumeFilter = {
  saleTypes?: InputMaybe<Array<SaleType>>;
  timeFilter?: InputMaybe<TimeFilter>;
};

export type SeaportCounterIncrementedProperties = {
  __typename?: 'SeaportCounterIncrementedProperties';
  newCounter: Scalars['String']['output'];
};

export type SeaportEvent = {
  __typename?: 'SeaportEvent';
  address: Scalars['String']['output'];
  eventType: SeaportEventType;
  offerer: Scalars['String']['output'];
  orderHash?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<SeaportEventProperties>;
  zone?: Maybe<Scalars['String']['output']>;
};

export type SeaportEventProperties =
  | SeaportCounterIncrementedProperties
  | SeaportOrderFulfilledProperties;

export enum SeaportEventType {
  SeaportCounterIncrementedEvent = 'SEAPORT_COUNTER_INCREMENTED_EVENT',
  SeaportOrderCancelledEvent = 'SEAPORT_ORDER_CANCELLED_EVENT',
  SeaportOrderFulfilledEvent = 'SEAPORT_ORDER_FULFILLED_EVENT',
  SeaportOrderValidatedEvent = 'SEAPORT_ORDER_VALIDATED_EVENT'
}

export type SeaportOrder = {
  __typename?: 'SeaportOrder';
  conduitKey: Scalars['String']['output'];
  considerations: Array<SeaportOrderItem>;
  counter: Scalars['String']['output'];
  endTime: Scalars['datetime']['output'];
  offerer: Scalars['String']['output'];
  offers: Array<SeaportOrderItem>;
  orderHash: Scalars['String']['output'];
  orderType: Scalars['String']['output'];
  price: PriceAtTime;
  salt: Scalars['String']['output'];
  schemaHash: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  startTime: Scalars['datetime']['output'];
  zone: Scalars['String']['output'];
  zoneHash: Scalars['String']['output'];
};

export type SeaportOrderFulfilledProperties = {
  __typename?: 'SeaportOrderFulfilledProperties';
  consideration: Array<ReceivedItem>;
  offer: Array<SpentItem>;
  recipient: Scalars['String']['output'];
};

export type SeaportOrderItem = {
  __typename?: 'SeaportOrderItem';
  address: Scalars['String']['output'];
  criteria?: Maybe<Scalars['String']['output']>;
  endAmount: Scalars['String']['output'];
  endPrice?: Maybe<PriceAtTime>;
  itemType: Scalars['String']['output'];
  recipient?: Maybe<Scalars['String']['output']>;
  startAmount: Scalars['String']['output'];
  startPrice?: Maybe<PriceAtTime>;
  tokenId?: Maybe<Scalars['String']['output']>;
};

export type SearchFilter = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  entityType?: InputMaybe<SearchableEntity>;
};

export type SearchPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
};

export type SearchQueryInput = {
  text: Scalars['String']['input'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  collectionAddress: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  entity?: Maybe<TokenCollection>;
  entityType: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  networkInfo: NetworkInfo;
  tokenId?: Maybe<Scalars['String']['output']>;
};

export type SearchResultConnection = {
  __typename?: 'SearchResultConnection';
  nodes: Array<SearchResult>;
  pageInfo: PageInfo;
};

export enum SearchableEntity {
  Collection = 'COLLECTION',
  Token = 'TOKEN'
}

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SpentItem = {
  __typename?: 'SpentItem';
  address: Scalars['String']['output'];
  amount: Scalars['String']['output'];
  itemType: Scalars['String']['output'];
  price?: Maybe<PriceAtTime>;
  tokenId: Scalars['String']['output'];
};

export enum Support {
  Abstain = 'ABSTAIN',
  Against = 'AGAINST',
  For = 'FOR'
}

export type TimeFilter = {
  endBlock?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  endDatetime?: InputMaybe<Scalars['datetime']['input']>;
  lookbackHours?: InputMaybe<Scalars['Int']['input']>;
  startBlock?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  startDatetime?: InputMaybe<Scalars['datetime']['input']>;
};

export type Token = {
  __typename?: 'Token';
  attributes?: Maybe<Array<TokenAttribute>>;
  collectionAddress: Scalars['String']['output'];
  collectionName?: Maybe<Scalars['String']['output']>;
  content?: Maybe<TokenContentMedia>;
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<TokenContentMedia>;
  lastRefreshTime?: Maybe<Scalars['datetime']['output']>;
  metadata?: Maybe<Scalars['JSONScalar']['output']>;
  mintInfo?: Maybe<MintInfo>;
  name?: Maybe<Scalars['String']['output']>;
  networkInfo: NetworkInfo;
  owner?: Maybe<Scalars['String']['output']>;
  tokenContract?: Maybe<TokenContract>;
  tokenId: Scalars['String']['output'];
  tokenStandard?: Maybe<TokenStandard>;
  tokenUrl?: Maybe<Scalars['String']['output']>;
  tokenUrlMimeType?: Maybe<Scalars['String']['output']>;
};

export type TokenAttribute = {
  __typename?: 'TokenAttribute';
  displayType?: Maybe<Scalars['String']['output']>;
  traitType?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type TokenCollection = Collection | Token;

export type TokenContentMedia = {
  __typename?: 'TokenContentMedia';
  mediaEncoding?: Maybe<ImageEncodingTypesVideoEncodingTypesAudioEncodingTypesUnsupportedEncodingTypes>;
  mimeType?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type TokenContract = {
  __typename?: 'TokenContract';
  chain: Scalars['Int']['output'];
  collectionAddress: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  network: Scalars['String']['output'];
  symbol?: Maybe<Scalars['String']['output']>;
  totalSupply?: Maybe<Scalars['Int']['output']>;
};

export type TokenInput = {
  address: Scalars['String']['input'];
  tokenId: Scalars['String']['input'];
};

export type TokenSortInput = {
  sortAxis?: InputMaybe<MarketCategory>;
  sortDirection: SortDirection;
  sortKey: TokenSortKey;
};

export enum TokenSortKey {
  ChainTokenPrice = 'CHAIN_TOKEN_PRICE',
  Minted = 'MINTED',
  NativePrice = 'NATIVE_PRICE',
  None = 'NONE',
  TimedSaleEnding = 'TIMED_SALE_ENDING',
  TokenId = 'TOKEN_ID',
  Transferred = 'TRANSFERRED'
}

export enum TokenStandard {
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155'
}

export type TokenWithFullMarketHistory = {
  __typename?: 'TokenWithFullMarketHistory';
  events: Array<Event>;
  markets: Array<Market>;
  sales: Array<Sale>;
  token: Token;
};

export type TokenWithFullMarketHistoryEventsArgs = {
  filter?: InputMaybe<EventsQueryFilter>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<EventSortKeySortInput>;
};

export type TokenWithFullMarketHistoryMarketsArgs = {
  filter?: InputMaybe<MarketsQueryFilter>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<MarketSortKeySortInput>;
};

export type TokenWithFullMarketHistorySalesArgs = {
  filter?: InputMaybe<SalesQueryFilter>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SaleSortKeySortInput>;
};

export type TokenWithMarketsSummary = {
  __typename?: 'TokenWithMarketsSummary';
  events: Array<Event>;
  marketsSummary: Array<Market>;
  sales: Array<Sale>;
  token: Token;
};

export type TokenWithMarketsSummaryEventsArgs = {
  filter?: InputMaybe<EventsQueryFilter>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<EventSortKeySortInput>;
};

export type TokenWithMarketsSummarySalesArgs = {
  filter?: InputMaybe<SalesQueryFilter>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SaleSortKeySortInput>;
};

export type TokenWithMarketsSummaryConnection = {
  __typename?: 'TokenWithMarketsSummaryConnection';
  nodes: Array<TokenWithMarketsSummary>;
  pageInfo: PageInfo;
};

export type TokensQueryFilter = {
  attributeFilters?: InputMaybe<Array<AttributeFilter>>;
  marketFilters?: InputMaybe<Array<MarketTypeFilter>>;
  mediaType?: InputMaybe<MediaType>;
  priceFilter?: InputMaybe<PriceFilter>;
  timeFilter?: InputMaybe<TimeFilter>;
};

export type TokensQueryInput = {
  collectionAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens?: InputMaybe<Array<TokenInput>>;
};

export type TransactionInfo = {
  __typename?: 'TransactionInfo';
  blockNumber: Scalars['Int']['output'];
  blockTimestamp: Scalars['datetime']['output'];
  logIndex?: Maybe<Scalars['Int']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type TransferEvent = {
  __typename?: 'TransferEvent';
  collectionAddress: Scalars['String']['output'];
  fromAddress: Scalars['String']['output'];
  toAddress: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type UnsupportedEncodingTypes = {
  __typename?: 'UnsupportedEncodingTypes';
  original: Scalars['String']['output'];
};

export type V1Ask = {
  __typename?: 'V1Ask';
  address: Scalars['String']['output'];
  amount: PriceAtTime;
  collectionAddress: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
  tokenOwner?: Maybe<Scalars['String']['output']>;
  v1AskStatus: Scalars['String']['output'];
};

export type V1BidShare = {
  __typename?: 'V1BidShare';
  address: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  creator: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  previousOwner: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
  v1BidShareStatus: Scalars['String']['output'];
};

export type V1MarketAskCreatedEventProperties = {
  __typename?: 'V1MarketAskCreatedEventProperties';
  amount: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  price: PriceAtTime;
};

export type V1MarketAskRemovedEventProperties = {
  __typename?: 'V1MarketAskRemovedEventProperties';
  amount: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  price: PriceAtTime;
};

export type V1MarketBidShareUpdatedEventProperties = {
  __typename?: 'V1MarketBidShareUpdatedEventProperties';
  creator: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  previousOwner: Scalars['String']['output'];
};

export type V1MarketEvent = {
  __typename?: 'V1MarketEvent';
  address: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  properties: V1MarketEventProperties;
  tokenId: Scalars['String']['output'];
  v1MarketEventType: V1MarketEventType;
};

export type V1MarketEventProperties =
  | V1MarketAskCreatedEventProperties
  | V1MarketAskRemovedEventProperties
  | V1MarketBidShareUpdatedEventProperties
  | V1MarketOfferCreatedEventProperties
  | V1MarketOfferFinalizedEventProperties
  | V1MarketOfferRemovedEventProperties;

export enum V1MarketEventType {
  V1MarketAskCreated = 'V1_MARKET_ASK_CREATED',
  V1MarketAskRemoved = 'V1_MARKET_ASK_REMOVED',
  V1MarketBidCreated = 'V1_MARKET_BID_CREATED',
  V1MarketBidFinalized = 'V1_MARKET_BID_FINALIZED',
  V1MarketBidRemoved = 'V1_MARKET_BID_REMOVED',
  V1MarketBidShareUpdated = 'V1_MARKET_BID_SHARE_UPDATED'
}

export type V1MarketOfferCreatedEventProperties = {
  __typename?: 'V1MarketOfferCreatedEventProperties';
  amount: Scalars['String']['output'];
  bidder: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  price: PriceAtTime;
  recipient: Scalars['String']['output'];
  sellOnShare: Scalars['String']['output'];
};

export type V1MarketOfferFinalizedEventProperties = {
  __typename?: 'V1MarketOfferFinalizedEventProperties';
  amount: Scalars['String']['output'];
  bidder: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  price: PriceAtTime;
  recipient: Scalars['String']['output'];
  sellOnShare: Scalars['String']['output'];
};

export type V1MarketOfferRemovedEventProperties = {
  __typename?: 'V1MarketOfferRemovedEventProperties';
  amount: Scalars['String']['output'];
  bidder: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  price: PriceAtTime;
  recipient: Scalars['String']['output'];
  sellOnShare: Scalars['String']['output'];
};

export type V1MediaEvent = {
  __typename?: 'V1MediaEvent';
  address: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  eventType: V1MediaEventType;
  owner: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
  uri: Scalars['String']['output'];
};

export enum V1MediaEventType {
  V1MediaTokenMetadataUriUpdatedEvent = 'V1_MEDIA_TOKEN_METADATA_URI_UPDATED_EVENT',
  V1MediaTokenUriUpdatedEvent = 'V1_MEDIA_TOKEN_URI_UPDATED_EVENT'
}

export type V1Offer = {
  __typename?: 'V1Offer';
  address: Scalars['String']['output'];
  amount: PriceAtTime;
  bidder: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  recipient: Scalars['String']['output'];
  sellOnShare: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
  v1OfferStatus: Scalars['String']['output'];
};

export type V2Auction = {
  __typename?: 'V2Auction';
  address: Scalars['String']['output'];
  amountCuratorReceived?: Maybe<PriceAtTime>;
  amountTokenOwnerReceived?: Maybe<PriceAtTime>;
  approved: Scalars['Boolean']['output'];
  auctionCurrency: Scalars['String']['output'];
  auctionId: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  curator: Scalars['String']['output'];
  curatorFeePercentage: Scalars['Int']['output'];
  duration: Scalars['String']['output'];
  estimatedExpirationTime?: Maybe<Scalars['datetime']['output']>;
  firstBidTime?: Maybe<Scalars['datetime']['output']>;
  highestBidPrice?: Maybe<PriceAtTime>;
  highestBidder?: Maybe<Scalars['String']['output']>;
  reservePrice: PriceAtTime;
  tokenId: Scalars['String']['output'];
  tokenOwner: Scalars['String']['output'];
  v2AuctionStatus: Scalars['String']['output'];
};

export type V2AuctionApprovalUpdatedEventProperties = {
  __typename?: 'V2AuctionApprovalUpdatedEventProperties';
  approved: Scalars['Boolean']['output'];
};

export type V2AuctionBidEventProperties = {
  __typename?: 'V2AuctionBidEventProperties';
  extended: Scalars['Boolean']['output'];
  firstBid: Scalars['Boolean']['output'];
  price: PriceAtTime;
  sender: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type V2AuctionCanceledEventProperties = {
  __typename?: 'V2AuctionCanceledEventProperties';
  tokenOwner: Scalars['String']['output'];
};

export type V2AuctionCreatedEventProperties = {
  __typename?: 'V2AuctionCreatedEventProperties';
  auctionCurrency: Scalars['String']['output'];
  curator: Scalars['String']['output'];
  curatorFeePercentage: Scalars['Int']['output'];
  duration: Scalars['String']['output'];
  price: PriceAtTime;
  reservePrice: Scalars['String']['output'];
  tokenOwner: Scalars['String']['output'];
};

export type V2AuctionDurationExtendedEventProperties = {
  __typename?: 'V2AuctionDurationExtendedEventProperties';
  duration: Scalars['String']['output'];
};

export type V2AuctionEndedEventProperties = {
  __typename?: 'V2AuctionEndedEventProperties';
  amount: Scalars['String']['output'];
  auctionCurrency: Scalars['String']['output'];
  curator: Scalars['String']['output'];
  curatorFee: Scalars['String']['output'];
  tokenOwner: Scalars['String']['output'];
  winner: Scalars['String']['output'];
};

export type V2AuctionEvent = {
  __typename?: 'V2AuctionEvent';
  address: Scalars['String']['output'];
  auctionId: Scalars['Int']['output'];
  collectionAddress: Scalars['String']['output'];
  properties: V2AuctionEventProperties;
  tokenId: Scalars['String']['output'];
  v2AuctionEventType: V2AuctionEventType;
};

export type V2AuctionEventProperties =
  | V2AuctionApprovalUpdatedEventProperties
  | V2AuctionBidEventProperties
  | V2AuctionCanceledEventProperties
  | V2AuctionCreatedEventProperties
  | V2AuctionDurationExtendedEventProperties
  | V2AuctionEndedEventProperties
  | V2AuctionReservePriceUpdatedEventProperties;

export enum V2AuctionEventType {
  V2AuctionApprovalUpdated = 'V2_AUCTION_APPROVAL_UPDATED',
  V2AuctionBid = 'V2_AUCTION_BID',
  V2AuctionCanceled = 'V2_AUCTION_CANCELED',
  V2AuctionCreated = 'V2_AUCTION_CREATED',
  V2AuctionDurationExtended = 'V2_AUCTION_DURATION_EXTENDED',
  V2AuctionEnded = 'V2_AUCTION_ENDED',
  V2AuctionReservePriceUpdated = 'V2_AUCTION_RESERVE_PRICE_UPDATED'
}

export type V2AuctionReservePriceUpdatedEventProperties = {
  __typename?: 'V2AuctionReservePriceUpdatedEventProperties';
  price: PriceAtTime;
  reservePrice: Scalars['String']['output'];
};

export type V3Ask = {
  __typename?: 'V3Ask';
  address: Scalars['String']['output'];
  askCurrency: Scalars['String']['output'];
  askPrice: PriceAtTime;
  buyer?: Maybe<Scalars['String']['output']>;
  collectionAddress: Scalars['String']['output'];
  finder?: Maybe<Scalars['String']['output']>;
  findersFeeBps?: Maybe<Scalars['Int']['output']>;
  seller: Scalars['String']['output'];
  sellerFundsRecipient?: Maybe<Scalars['String']['output']>;
  tokenId: Scalars['String']['output'];
  v3AskStatus: Scalars['String']['output'];
};

export type V3AskCanceledEventProperties = {
  __typename?: 'V3AskCanceledEventProperties';
  askCurrency: Scalars['String']['output'];
  askPrice: Scalars['String']['output'];
  findersFeeBps: Scalars['Int']['output'];
  price: PriceAtTime;
  seller: Scalars['String']['output'];
  sellerFundsRecipient: Scalars['String']['output'];
};

export type V3AskCreatedEventProperties = {
  __typename?: 'V3AskCreatedEventProperties';
  askCurrency: Scalars['String']['output'];
  askPrice: Scalars['String']['output'];
  findersFeeBps: Scalars['Int']['output'];
  price: PriceAtTime;
  seller: Scalars['String']['output'];
  sellerFundsRecipient: Scalars['String']['output'];
};

export type V3AskEvent = {
  __typename?: 'V3AskEvent';
  address: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  properties: V3AskEventProperties;
  tokenId: Scalars['String']['output'];
  v3AskEventType: V3AskEventType;
};

export type V3AskEventProperties =
  | V3AskCanceledEventProperties
  | V3AskCreatedEventProperties
  | V3AskFilledEventProperties
  | V3AskPriceUpdatedEventProperties
  | V3AsksCoreEthAskEventProperties
  | V3AsksCoreEthAskFilledEventProperties
  | V3AsksCoreEthRoyaltyPayoutEventProperties
  | V3PrivateAskEventProperties;

export enum V3AskEventType {
  V3AsksCoreEthCanceled = 'V3_ASKS_CORE_ETH_CANCELED',
  V3AsksCoreEthCreated = 'V3_ASKS_CORE_ETH_CREATED',
  V3AsksCoreEthFilled = 'V3_ASKS_CORE_ETH_FILLED',
  V3AsksCoreEthPriceUpdated = 'V3_ASKS_CORE_ETH_PRICE_UPDATED',
  V3AsksCoreEthRoyaltyPayout = 'V3_ASKS_CORE_ETH_ROYALTY_PAYOUT',
  V3AskCanceled = 'V3_ASK_CANCELED',
  V3AskCreated = 'V3_ASK_CREATED',
  V3AskFilled = 'V3_ASK_FILLED',
  V3AskPriceUpdated = 'V3_ASK_PRICE_UPDATED',
  V3PrivateAskCanceled = 'V3_PRIVATE_ASK_CANCELED',
  V3PrivateAskCreated = 'V3_PRIVATE_ASK_CREATED',
  V3PrivateAskFilled = 'V3_PRIVATE_ASK_FILLED',
  V3PrivateAskPriceUpdated = 'V3_PRIVATE_ASK_PRICE_UPDATED'
}

export type V3AskFilledEventProperties = {
  __typename?: 'V3AskFilledEventProperties';
  askCurrency: Scalars['String']['output'];
  askPrice: Scalars['String']['output'];
  buyer: Scalars['String']['output'];
  finder: Scalars['String']['output'];
  findersFeeBps: Scalars['Int']['output'];
  price: PriceAtTime;
  seller: Scalars['String']['output'];
  sellerFundsRecipient: Scalars['String']['output'];
};

export type V3AskPriceUpdatedEventProperties = {
  __typename?: 'V3AskPriceUpdatedEventProperties';
  askCurrency: Scalars['String']['output'];
  askPrice: Scalars['String']['output'];
  findersFeeBps: Scalars['Int']['output'];
  price: PriceAtTime;
  seller: Scalars['String']['output'];
  sellerFundsRecipient: Scalars['String']['output'];
};

export type V3AsksCoreEthAskEventProperties = {
  __typename?: 'V3AsksCoreEthAskEventProperties';
  askCurrency: Scalars['String']['output'];
  askPrice: Scalars['String']['output'];
  price: PriceAtTime;
  seller: Scalars['String']['output'];
  tokenContract: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type V3AsksCoreEthAskFilledEventProperties = {
  __typename?: 'V3AsksCoreEthAskFilledEventProperties';
  askCurrency: Scalars['String']['output'];
  askPrice: Scalars['String']['output'];
  buyer: Scalars['String']['output'];
  price: PriceAtTime;
  seller: Scalars['String']['output'];
  tokenContract: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type V3AsksCoreEthRoyaltyPayoutEventProperties = {
  __typename?: 'V3AsksCoreEthRoyaltyPayoutEventProperties';
  amount: PriceAtTime;
  askCurrency: Scalars['String']['output'];
  askPrice: Scalars['String']['output'];
  recipient: Scalars['String']['output'];
  tokenContract: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type V3ModuleManagerEvent = {
  __typename?: 'V3ModuleManagerEvent';
  address: Scalars['String']['output'];
  approved: Scalars['Boolean']['output'];
  eventType: V3ModuleManagerEventType;
  moduleAddress: Scalars['String']['output'];
  userAddress: Scalars['String']['output'];
};

export enum V3ModuleManagerEventType {
  V3ModuleManagerApproved = 'V3_MODULE_MANAGER_APPROVED'
}

export type V3PrivateAskEventProperties = {
  __typename?: 'V3PrivateAskEventProperties';
  askCurrency: Scalars['String']['output'];
  askPrice: Scalars['String']['output'];
  buyer: Scalars['String']['output'];
  price: PriceAtTime;
  seller: Scalars['String']['output'];
  tokenContract: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type V3ReserveAuction = {
  __typename?: 'V3ReserveAuction';
  address: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  duration: Scalars['String']['output'];
  estimatedDurationTime?: Maybe<Scalars['datetime']['output']>;
  extended: Scalars['Boolean']['output'];
  finder: Scalars['String']['output'];
  findersFeeBps: Scalars['String']['output'];
  firstBid: Scalars['Boolean']['output'];
  firstBidTime: Scalars['String']['output'];
  highestBid: Scalars['String']['output'];
  highestBidPrice?: Maybe<PriceAtTime>;
  highestBidder: Scalars['String']['output'];
  price?: Maybe<PriceAtTime>;
  reserve: Scalars['String']['output'];
  reservePrice: PriceAtTime;
  seller: Scalars['String']['output'];
  sellerFundsRecipient: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tokenId: Scalars['String']['output'];
};

export type V3ReserveAuctionAuctionProperties = {
  __typename?: 'V3ReserveAuctionAuctionProperties';
  currency: Scalars['String']['output'];
  duration: Scalars['String']['output'];
  finder: Scalars['String']['output'];
  findersFeeBps: Scalars['String']['output'];
  firstBidTime: Scalars['String']['output'];
  highestBid: Scalars['String']['output'];
  highestBidPrice: PriceAtTime;
  highestBidder: Scalars['String']['output'];
  reserve: Scalars['String']['output'];
  reservePrice: PriceAtTime;
  seller: Scalars['String']['output'];
  sellerFundsRecipient: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type V3ReserveAuctionEvent = {
  __typename?: 'V3ReserveAuctionEvent';
  address: Scalars['String']['output'];
  collectionAddress: Scalars['String']['output'];
  eventType: V3ReserveAuctionEventType;
  properties: V3ReserveAuctionEventProperties;
  tokenId: Scalars['String']['output'];
};

export type V3ReserveAuctionEventProperties =
  | V3ReserveAuctionV1AuctionBidProperties
  | V3ReserveAuctionV1AuctionCanceledProperties
  | V3ReserveAuctionV1AuctionCreatedProperties
  | V3ReserveAuctionV1AuctionEndedProperties
  | V3ReserveAuctionV1AuctionReservePriceUpdatedProperties;

export enum V3ReserveAuctionEventType {
  V3ReserveAuctionBid = 'V3_RESERVE_AUCTION_BID',
  V3ReserveAuctionCanceled = 'V3_RESERVE_AUCTION_CANCELED',
  V3ReserveAuctionCreated = 'V3_RESERVE_AUCTION_CREATED',
  V3ReserveAuctionEnded = 'V3_RESERVE_AUCTION_ENDED',
  V3ReserveAuctionReservePriceUpdated = 'V3_RESERVE_AUCTION_RESERVE_PRICE_UPDATED'
}

export type V3ReserveAuctionV1AuctionBidProperties = {
  __typename?: 'V3ReserveAuctionV1AuctionBidProperties';
  auction: V3ReserveAuctionAuctionProperties;
  extended: Scalars['Boolean']['output'];
  firstBid: Scalars['Boolean']['output'];
  price: PriceAtTime;
};

export type V3ReserveAuctionV1AuctionCanceledProperties = {
  __typename?: 'V3ReserveAuctionV1AuctionCanceledProperties';
  auction: V3ReserveAuctionAuctionProperties;
};

export type V3ReserveAuctionV1AuctionCreatedProperties = {
  __typename?: 'V3ReserveAuctionV1AuctionCreatedProperties';
  auction: V3ReserveAuctionAuctionProperties;
};

export type V3ReserveAuctionV1AuctionEndedProperties = {
  __typename?: 'V3ReserveAuctionV1AuctionEndedProperties';
  auction: V3ReserveAuctionAuctionProperties;
};

export type V3ReserveAuctionV1AuctionReservePriceUpdatedProperties = {
  __typename?: 'V3ReserveAuctionV1AuctionReservePriceUpdatedProperties';
  auction: V3ReserveAuctionAuctionProperties;
};

export type VideoEncodingTypes = {
  __typename?: 'VideoEncodingTypes';
  large?: Maybe<Scalars['String']['output']>;
  original: Scalars['String']['output'];
  poster?: Maybe<Scalars['String']['output']>;
  preview?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type TokenQueryVariables = Exact<{
  token: TokenInput;
  network?: InputMaybe<NetworkInput>;
}>;

export type TokenQuery = {
  __typename?: 'RootQuery';
  token?: {
    __typename?: 'TokenWithFullMarketHistory';
    token: {
      __typename?: 'Token';
      tokenStandard?: TokenStandard | null;
      collectionName?: string | null;
    };
  } | null;
};

export const TokenDocument = gql`
  query Token($token: TokenInput!, $network: NetworkInput) {
    token(token: $token, network: $network) {
      token {
        tokenStandard
        collectionName
      }
    }
  }
`;

/**
 * __useTokenQuery__
 *
 * To run a query within a React component, call `useTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *      network: // value for 'network'
 *   },
 * });
 */
export function useTokenQuery(
  baseOptions: Apollo.QueryHookOptions<TokenQuery, TokenQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TokenQuery, TokenQueryVariables>(
    TokenDocument,
    options
  );
}
export function useTokenLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TokenQuery, TokenQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TokenQuery, TokenQueryVariables>(
    TokenDocument,
    options
  );
}
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = Apollo.QueryResult<
  TokenQuery,
  TokenQueryVariables
>;

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    ActiveMarketProperties: [
      'LilNounsAuction',
      'NounsAuction',
      'NounsBuilderAuction',
      'V2Auction',
      'V3ReserveAuction'
    ],
    EventProperties: [
      'ApprovalEvent',
      'LilNounsAuctionEvent',
      'MintEvent',
      'NounsAuctionEvent',
      'Sale',
      'SeaportEvent',
      'TransferEvent',
      'V1MarketEvent',
      'V1MediaEvent',
      'V2AuctionEvent',
      'V3AskEvent',
      'V3ModuleManagerEvent',
      'V3ReserveAuctionEvent'
    ],
    ImageEncodingTypesVideoEncodingTypesAudioEncodingTypesUnsupportedEncodingTypes:
      [
        'AudioEncodingTypes',
        'ImageEncodingTypes',
        'UnsupportedEncodingTypes',
        'VideoEncodingTypes'
      ],
    LilNounsAuctionEventProperties: [
      'LilNounsAuctionBidEventProperties',
      'LilNounsAuctionCreatedEventProperties',
      'LilNounsAuctionExtendedEventProperties',
      'LilNounsAuctionMinBidIncrementPercentageUpdatedEventProperties',
      'LilNounsAuctionReservePriceUpdatedEventProperties',
      'LilNounsAuctionSettledEventProperties',
      'LilNounsAuctionTimeBufferUpdatedEventProperties'
    ],
    MarketProperties: [
      'LilNounsAuction',
      'NounsAuction',
      'NounsBuilderAuction',
      'V1Ask',
      'V1BidShare',
      'V1Offer',
      'V2Auction',
      'V3Ask',
      'V3ReserveAuction'
    ],
    NounsAuctionEventProperties: [
      'NounsAuctionBidEventProperties',
      'NounsAuctionCreatedEventProperties',
      'NounsAuctionExtendedEventProperties',
      'NounsAuctionMinBidIncrementPercentageUpdatedEventProperties',
      'NounsAuctionReservePriceUpdatedEventProperties',
      'NounsAuctionSettledEventProperties',
      'NounsAuctionTimeBufferUpdatedEventProperties'
    ],
    NounsBuilderAuctionEventProperties: [
      'NounsBuilderAuctionAuctionBidEventProperties',
      'NounsBuilderAuctionAuctionCreatedEventProperties',
      'NounsBuilderAuctionAuctionSettledEventProperties',
      'NounsBuilderAuctionDurationUpdatedEventProperties',
      'NounsBuilderAuctionMinBidIncrementPercentageUpdatedEventProperties',
      'NounsBuilderAuctionReservePriceUpdatedEventProperties',
      'NounsBuilderAuctionTimeBufferUpdatedEventProperties'
    ],
    NounsBuilderGovernorEventProperties: [
      'NounsBuilderGovernorProposalCanceledEventProperties',
      'NounsBuilderGovernorProposalCreatedEventProperties',
      'NounsBuilderGovernorProposalExecutedEventProperties',
      'NounsBuilderGovernorProposalQueuedEventProperties',
      'NounsBuilderGovernorProposalThresholdBpsUpdatedEventProperties',
      'NounsBuilderGovernorProposalVetoedEventProperties',
      'NounsBuilderGovernorQuorumVotesBpsUpdated',
      'NounsBuilderGovernorVetoerUpdatedEventProperties',
      'NounsBuilderGovernorVoteCastEventProperties',
      'NounsBuilderGovernorVotingDelayUpdatedEventProperties',
      'NounsBuilderGovernorVotingPeriodUpdatedEventProperties'
    ],
    NounsEventProperties: [
      'LilNounsAuctionEvent',
      'NounsAuctionEvent',
      'NounsBuilderAuctionEvent',
      'NounsBuilderGovernorEvent',
      'NounsBuilderManagerEvent'
    ],
    SeaportEventProperties: [
      'SeaportCounterIncrementedProperties',
      'SeaportOrderFulfilledProperties'
    ],
    TokenCollection: ['Collection', 'Token'],
    V1MarketEventProperties: [
      'V1MarketAskCreatedEventProperties',
      'V1MarketAskRemovedEventProperties',
      'V1MarketBidShareUpdatedEventProperties',
      'V1MarketOfferCreatedEventProperties',
      'V1MarketOfferFinalizedEventProperties',
      'V1MarketOfferRemovedEventProperties'
    ],
    V2AuctionEventProperties: [
      'V2AuctionApprovalUpdatedEventProperties',
      'V2AuctionBidEventProperties',
      'V2AuctionCanceledEventProperties',
      'V2AuctionCreatedEventProperties',
      'V2AuctionDurationExtendedEventProperties',
      'V2AuctionEndedEventProperties',
      'V2AuctionReservePriceUpdatedEventProperties'
    ],
    V3AskEventProperties: [
      'V3AskCanceledEventProperties',
      'V3AskCreatedEventProperties',
      'V3AskFilledEventProperties',
      'V3AskPriceUpdatedEventProperties',
      'V3AsksCoreEthAskEventProperties',
      'V3AsksCoreEthAskFilledEventProperties',
      'V3AsksCoreEthRoyaltyPayoutEventProperties',
      'V3PrivateAskEventProperties'
    ],
    V3ReserveAuctionEventProperties: [
      'V3ReserveAuctionV1AuctionBidProperties',
      'V3ReserveAuctionV1AuctionCanceledProperties',
      'V3ReserveAuctionV1AuctionCreatedProperties',
      'V3ReserveAuctionV1AuctionEndedProperties',
      'V3ReserveAuctionV1AuctionReservePriceUpdatedProperties'
    ]
  }
};
export default result;
