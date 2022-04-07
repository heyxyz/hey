import { gql } from '@apollo/client'

export const PublicationProfileFields = gql`
  fragment PublicationProfileFields on Profile {
    id
    name
    handle
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
