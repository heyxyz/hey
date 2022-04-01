import { gql } from '@apollo/client'

export const CommunityFragment = gql`
  fragment CommunityFragment on Post {
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
