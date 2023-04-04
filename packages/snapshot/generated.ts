import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Any: any;
};

export type Alias = {
  __typename?: 'Alias';
  address: Scalars['String'];
  alias: Scalars['String'];
  created: Scalars['Int'];
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
};

export type AliasWhere = {
  address?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  alias?: InputMaybe<Scalars['String']>;
  alias_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  created?: InputMaybe<Scalars['Int']>;
  created_gt?: InputMaybe<Scalars['Int']>;
  created_gte?: InputMaybe<Scalars['Int']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  created_lt?: InputMaybe<Scalars['Int']>;
  created_lte?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ipfs?: InputMaybe<Scalars['String']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Follow = {
  __typename?: 'Follow';
  created: Scalars['Int'];
  follower: Scalars['String'];
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  space: Space;
};

export type FollowWhere = {
  created?: InputMaybe<Scalars['Int']>;
  created_gt?: InputMaybe<Scalars['Int']>;
  created_gte?: InputMaybe<Scalars['Int']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  created_lt?: InputMaybe<Scalars['Int']>;
  created_lte?: InputMaybe<Scalars['Int']>;
  follower?: InputMaybe<Scalars['String']>;
  follower_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ipfs?: InputMaybe<Scalars['String']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  space?: InputMaybe<Scalars['String']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['String'];
  spacesCount?: Maybe<Scalars['Int']>;
};

export type Message = {
  __typename?: 'Message';
  address?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  ipfs?: Maybe<Scalars['String']>;
  mci?: Maybe<Scalars['Int']>;
  receipt?: Maybe<Scalars['String']>;
  sig?: Maybe<Scalars['String']>;
  space?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type MessageWhere = {
  id?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  mci?: InputMaybe<Scalars['Int']>;
  mci_gt?: InputMaybe<Scalars['Int']>;
  mci_gte?: InputMaybe<Scalars['Int']>;
  mci_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  mci_lt?: InputMaybe<Scalars['Int']>;
  mci_lte?: InputMaybe<Scalars['Int']>;
  space?: InputMaybe<Scalars['String']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Proposal = {
  __typename?: 'Proposal';
  app?: Maybe<Scalars['String']>;
  author: Scalars['String'];
  body?: Maybe<Scalars['String']>;
  choices: Array<Maybe<Scalars['String']>>;
  created: Scalars['Int'];
  discussion: Scalars['String'];
  end: Scalars['Int'];
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  network: Scalars['String'];
  plugins: Scalars['Any'];
  privacy?: Maybe<Scalars['String']>;
  quorum: Scalars['Float'];
  scores?: Maybe<Array<Maybe<Scalars['Float']>>>;
  scores_by_strategy?: Maybe<Scalars['Any']>;
  scores_state?: Maybe<Scalars['String']>;
  scores_total?: Maybe<Scalars['Float']>;
  scores_updated?: Maybe<Scalars['Int']>;
  snapshot?: Maybe<Scalars['String']>;
  space?: Maybe<Space>;
  start: Scalars['Int'];
  state?: Maybe<Scalars['String']>;
  strategies: Array<Maybe<Strategy>>;
  symbol: Scalars['String'];
  title: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  validation?: Maybe<Validation>;
  votes?: Maybe<Scalars['Int']>;
};

export type ProposalWhere = {
  app?: InputMaybe<Scalars['String']>;
  app_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  app_not?: InputMaybe<Scalars['String']>;
  app_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  author?: InputMaybe<Scalars['String']>;
  author_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  created?: InputMaybe<Scalars['Int']>;
  created_gt?: InputMaybe<Scalars['Int']>;
  created_gte?: InputMaybe<Scalars['Int']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  created_lt?: InputMaybe<Scalars['Int']>;
  created_lte?: InputMaybe<Scalars['Int']>;
  end?: InputMaybe<Scalars['Int']>;
  end_gt?: InputMaybe<Scalars['Int']>;
  end_gte?: InputMaybe<Scalars['Int']>;
  end_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  end_lt?: InputMaybe<Scalars['Int']>;
  end_lte?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ipfs?: InputMaybe<Scalars['String']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  network?: InputMaybe<Scalars['String']>;
  network_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  plugins_contains?: InputMaybe<Scalars['String']>;
  scores_state?: InputMaybe<Scalars['String']>;
  scores_state_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  space?: InputMaybe<Scalars['String']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  start?: InputMaybe<Scalars['Int']>;
  start_gt?: InputMaybe<Scalars['Int']>;
  start_gte?: InputMaybe<Scalars['Int']>;
  start_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  start_lt?: InputMaybe<Scalars['Int']>;
  start_lte?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<Scalars['String']>;
  strategies_contains?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  validation?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  aliases?: Maybe<Array<Maybe<Alias>>>;
  follows?: Maybe<Array<Maybe<Follow>>>;
  messages?: Maybe<Array<Maybe<Message>>>;
  networks?: Maybe<Array<Maybe<Item>>>;
  plugins?: Maybe<Array<Maybe<Item>>>;
  proposal?: Maybe<Proposal>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  skins?: Maybe<Array<Maybe<Item>>>;
  space?: Maybe<Space>;
  spaces?: Maybe<Array<Maybe<Space>>>;
  strategies?: Maybe<Array<Maybe<StrategyItem>>>;
  strategy?: Maybe<StrategyItem>;
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  validations?: Maybe<Array<Maybe<Item>>>;
  vote?: Maybe<Vote>;
  votes?: Maybe<Array<Maybe<Vote>>>;
  vp?: Maybe<Vp>;
};

export type QueryAliasesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AliasWhere>;
};

export type QueryFollowsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<FollowWhere>;
};

export type QueryMessagesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MessageWhere>;
};

export type QueryProposalArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryProposalsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ProposalWhere>;
};

export type QuerySpaceArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QuerySpacesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<SpaceWhere>;
};

export type QueryStrategyArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QuerySubscriptionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<SubscriptionWhere>;
};

export type QueryUserArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryUsersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UsersWhere>;
};

export type QueryVoteArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VoteWhere>;
};

export type QueryVpArgs = {
  proposal?: InputMaybe<Scalars['String']>;
  space: Scalars['String'];
  voter: Scalars['String'];
};

export type Space = {
  __typename?: 'Space';
  about?: Maybe<Scalars['String']>;
  admins?: Maybe<Array<Maybe<Scalars['String']>>>;
  avatar?: Maybe<Scalars['String']>;
  categories?: Maybe<Array<Maybe<Scalars['String']>>>;
  children?: Maybe<Array<Maybe<Space>>>;
  coingecko?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  filters?: Maybe<SpaceFilters>;
  followersCount?: Maybe<Scalars['Int']>;
  github?: Maybe<Scalars['String']>;
  guidelines?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  members?: Maybe<Array<Maybe<Scalars['String']>>>;
  moderators?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  network?: Maybe<Scalars['String']>;
  parent?: Maybe<Space>;
  plugins?: Maybe<Scalars['Any']>;
  private?: Maybe<Scalars['Boolean']>;
  proposalsCount?: Maybe<Scalars['Int']>;
  skin?: Maybe<Scalars['String']>;
  strategies?: Maybe<Array<Maybe<Strategy>>>;
  symbol?: Maybe<Scalars['String']>;
  template?: Maybe<Scalars['String']>;
  terms?: Maybe<Scalars['String']>;
  treasuries?: Maybe<Array<Maybe<Treasury>>>;
  twitter?: Maybe<Scalars['String']>;
  validation?: Maybe<Validation>;
  voteValidation?: Maybe<Validation>;
  voting?: Maybe<SpaceVoting>;
  website?: Maybe<Scalars['String']>;
};

export type SpaceFilters = {
  __typename?: 'SpaceFilters';
  minScore?: Maybe<Scalars['Float']>;
  onlyMembers?: Maybe<Scalars['Boolean']>;
};

export type SpaceVoting = {
  __typename?: 'SpaceVoting';
  aliased?: Maybe<Scalars['Boolean']>;
  blind?: Maybe<Scalars['Boolean']>;
  delay?: Maybe<Scalars['Int']>;
  hideAbstain?: Maybe<Scalars['Boolean']>;
  period?: Maybe<Scalars['Int']>;
  privacy?: Maybe<Scalars['String']>;
  quorum?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
};

export type SpaceWhere = {
  id?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Strategy = {
  __typename?: 'Strategy';
  name: Scalars['String'];
  network?: Maybe<Scalars['String']>;
  params?: Maybe<Scalars['Any']>;
};

export type StrategyItem = {
  __typename?: 'StrategyItem';
  about?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  examples?: Maybe<Array<Maybe<Scalars['Any']>>>;
  id: Scalars['String'];
  schema?: Maybe<Scalars['Any']>;
  spacesCount?: Maybe<Scalars['Int']>;
  version?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  address: Scalars['String'];
  created: Scalars['Int'];
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  space: Space;
};

export type SubscriptionWhere = {
  address?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  created?: InputMaybe<Scalars['Int']>;
  created_gt?: InputMaybe<Scalars['Int']>;
  created_gte?: InputMaybe<Scalars['Int']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  created_lt?: InputMaybe<Scalars['Int']>;
  created_lte?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ipfs?: InputMaybe<Scalars['String']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  space?: InputMaybe<Scalars['String']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Treasury = {
  __typename?: 'Treasury';
  address?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  network?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  about?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  created: Scalars['Int'];
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type UsersWhere = {
  created?: InputMaybe<Scalars['Int']>;
  created_gt?: InputMaybe<Scalars['Int']>;
  created_gte?: InputMaybe<Scalars['Int']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  created_lt?: InputMaybe<Scalars['Int']>;
  created_lte?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ipfs?: InputMaybe<Scalars['String']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Validation = {
  __typename?: 'Validation';
  name: Scalars['String'];
  params?: Maybe<Scalars['Any']>;
};

export type Vote = {
  __typename?: 'Vote';
  app?: Maybe<Scalars['String']>;
  choice: Scalars['Any'];
  created: Scalars['Int'];
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['Any']>;
  proposal?: Maybe<Proposal>;
  reason?: Maybe<Scalars['String']>;
  space: Space;
  voter: Scalars['String'];
  vp?: Maybe<Scalars['Float']>;
  vp_by_strategy?: Maybe<Array<Maybe<Scalars['Float']>>>;
  vp_state?: Maybe<Scalars['String']>;
};

export type VoteWhere = {
  app?: InputMaybe<Scalars['String']>;
  app_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  app_not?: InputMaybe<Scalars['String']>;
  app_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  created?: InputMaybe<Scalars['Int']>;
  created_gt?: InputMaybe<Scalars['Int']>;
  created_gte?: InputMaybe<Scalars['Int']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  created_lt?: InputMaybe<Scalars['Int']>;
  created_lte?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ipfs?: InputMaybe<Scalars['String']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  proposal?: InputMaybe<Scalars['String']>;
  proposal_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  reason?: InputMaybe<Scalars['String']>;
  reason_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  reason_not?: InputMaybe<Scalars['String']>;
  reason_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  space?: InputMaybe<Scalars['String']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  voter?: InputMaybe<Scalars['String']>;
  voter_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  vp?: InputMaybe<Scalars['Float']>;
  vp_gt?: InputMaybe<Scalars['Float']>;
  vp_gte?: InputMaybe<Scalars['Float']>;
  vp_in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  vp_lt?: InputMaybe<Scalars['Float']>;
  vp_lte?: InputMaybe<Scalars['Float']>;
  vp_state?: InputMaybe<Scalars['String']>;
  vp_state_in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Vp = {
  __typename?: 'Vp';
  vp?: Maybe<Scalars['Float']>;
  vp_by_strategy?: Maybe<Array<Maybe<Scalars['Float']>>>;
  vp_state?: Maybe<Scalars['String']>;
};

export type ProposalQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;

export type ProposalQuery = {
  __typename?: 'Query';
  proposal?: {
    __typename?: 'Proposal';
    id: string;
    author: string;
    state?: string | null;
    title: string;
    choices: Array<string | null>;
    scores?: Array<number | null> | null;
    scores_total?: number | null;
    space?: { __typename?: 'Space'; id: string; name?: string | null } | null;
  } | null;
};

export type VotesQueryVariables = Exact<{
  where?: InputMaybe<VoteWhere>;
}>;

export type VotesQuery = {
  __typename?: 'Query';
  votes?: Array<{ __typename?: 'Vote'; choice: any } | null> | null;
};

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {}
};
export default result;

export const ProposalDocument = gql`
  query Proposal($id: String) {
    proposal(id: $id) {
      id
      author
      state
      title
      space {
        id
        name
      }
      choices
      scores
      scores_total
    }
  }
`;

/**
 * __useProposalQuery__
 *
 * To run a query within a React component, call `useProposalQuery` and pass it any options that fit your needs.
 * When your component renders, `useProposalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProposalQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProposalQuery(
  baseOptions?: Apollo.QueryHookOptions<ProposalQuery, ProposalQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProposalQuery, ProposalQueryVariables>(ProposalDocument, options);
}
export function useProposalLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProposalQuery, ProposalQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProposalQuery, ProposalQueryVariables>(ProposalDocument, options);
}
export type ProposalQueryHookResult = ReturnType<typeof useProposalQuery>;
export type ProposalLazyQueryHookResult = ReturnType<typeof useProposalLazyQuery>;
export type ProposalQueryResult = Apollo.QueryResult<ProposalQuery, ProposalQueryVariables>;
export const VotesDocument = gql`
  query Votes($where: VoteWhere) {
    votes(where: $where) {
      choice
    }
  }
`;

/**
 * __useVotesQuery__
 *
 * To run a query within a React component, call `useVotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVotesQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useVotesQuery(baseOptions?: Apollo.QueryHookOptions<VotesQuery, VotesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<VotesQuery, VotesQueryVariables>(VotesDocument, options);
}
export function useVotesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<VotesQuery, VotesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<VotesQuery, VotesQueryVariables>(VotesDocument, options);
}
export type VotesQueryHookResult = ReturnType<typeof useVotesQuery>;
export type VotesLazyQueryHookResult = ReturnType<typeof useVotesLazyQuery>;
export type VotesQueryResult = Apollo.QueryResult<VotesQuery, VotesQueryVariables>;
