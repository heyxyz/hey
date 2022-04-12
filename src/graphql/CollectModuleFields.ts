import { gql } from '@apollo/client'

export const CollectModuleFields = gql`
  fragment CollectModuleFields on CollectModule {
    ... on FreeCollectModuleSettings {
      type
      contractAddress
      followerOnly
    }
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
    ... on FreeCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          address
        }
      }
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
        }
      }
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
        }
      }
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          address
        }
      }
    }
  }
`
