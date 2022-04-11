import { gql } from '@apollo/client'

export const CollectModuleFields = gql`
  fragment CollectModuleFields on CollectModule {
    ... on FeeCollectModuleSettings {
      type
      recipient
      referralFee
      followerOnly
      amount {
        asset {
          symbol
          address
        }
        value
      }
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      recipient
      referralFee
      followerOnly
      amount {
        asset {
          symbol
          address
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
      followerOnly
      amount {
        asset {
          symbol
          address
        }
        value
      }
    }
    ... on TimedFeeCollectModuleSettings {
      type
      recipient
      endTimestamp
      referralFee
      followerOnly
      amount {
        asset {
          symbol
          address
        }
        value
      }
    }
  }
`

export const MinimalCollectModuleFields = gql`
  fragment MinimalCollectModuleFields on CollectModule {
    ... on FeeCollectModuleSettings {
      type
    }
    ... on LimitedFeeCollectModuleSettings {
      type
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
    }
  }
`
