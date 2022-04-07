import { gql } from '@apollo/client'

export const CollectModuleFields = gql`
  fragment CollectModuleFields on CollectModule {
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
