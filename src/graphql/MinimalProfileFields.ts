import { gql } from '@apollo/client'

export const MinimalProfileFields = gql`
  fragment MinimalProfileFields on Profile {
    id
    name
    handle
    bio
    ownedBy
    attributes {
      key
      value
    }
    picture {
      ... on MediaSet {
        original {
          url
        }
      }
    }
    followModule {
      __typename
    }
  }
`
