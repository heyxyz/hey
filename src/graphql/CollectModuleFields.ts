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
        }
        value
      }
    }
  }
`
