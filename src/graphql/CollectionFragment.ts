import { gql } from '@apollo/client'

const CollectionFragment = gql`
  fragment CollectionFragment on CollectModule {
    ... on FeeCollectModuleSettings {
      type
      recipient
      referralFee
      amount {
        asset {
          symbol
        }
        value
      }
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      recipient
      referralFee
      amount {
        asset {
          symbol
        }
        value
      }
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      recipient
      endTimestamp
      referralFee
      amount {
        asset {
          symbol
        }
        value
      }
    }
    ... on TimedFeeCollectModuleSettings {
      type
      recipient
      endTimestamp
      referralFee
      amount {
        asset {
          symbol
        }
        value
      }
    }
  }
`

export const PostCollectionFragment = gql`
  fragment PostCollectionFragment on Post {
    collectModule {
      ...CollectionFragment
    }
  }
  ${CollectionFragment}
`

export const CommentCollectionFragment = gql`
  fragment CommentCollectionFragment on Comment {
    collectModule {
      ...CollectionFragment
    }
  }
  ${CollectionFragment}
`
