import { gql } from '@apollo/client'

export const PublicationProfileFragment = gql`
  fragment PublicationProfileFragment on Profile {
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
