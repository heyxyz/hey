import { gql } from '@apollo/client'

export const CommunityFields = gql`
  fragment CommunityFields on Post {
    id
    metadata {
      name
      description
      content
      attributes {
        value
      }
      cover {
        original {
          url
        }
      }
    }
    stats {
      totalAmountOfCollects
      totalAmountOfComments
    }
    createdAt
  }
`
