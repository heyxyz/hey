import { gql } from '@apollo/client'

import { CollectModuleFields } from './CollectModuleFields'
import { PublicationProfileFields } from './PublicationProfileFields'

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    profile {
      ...PublicationProfileFields
    }
    collectedBy {
      address
      defaultProfile {
        handle
      }
    }
    collectModule {
      ...CollectModuleFields
    }
    stats {
      totalAmountOfComments
      totalAmountOfMirrors
      totalAmountOfCollects
    }
    metadata {
      name
      description
      content
      description
      media {
        original {
          url
          mimeType
        }
      }
      attributes {
        value
      }
    }
    commentOn {
      ... on Post {
        id
        profile {
          ...PublicationProfileFields
        }
        metadata {
          name
          content
        }
      }
      ... on Comment {
        id
        profile {
          ...PublicationProfileFields
        }
        metadata {
          name
          content
        }
      }
      ... on Mirror {
        id
        profile {
          ...PublicationProfileFields
        }
        metadata {
          name
          content
        }
      }
    }
    createdAt
    appId
  }
  ${PublicationProfileFields}
  ${CollectModuleFields}
`
