import { gql } from '@apollo/client'

export const MinimalProfileFields = gql`
  fragment MinimalProfileFields on Profile {
    id
    name
    handle
    bio
    ownedBy
    picture {
      ... on MediaSet {
        original {
          url
        }
      }
    }
  }
`
