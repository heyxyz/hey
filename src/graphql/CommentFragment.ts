import { gql } from '@apollo/client'

import { CollectModuleFragment } from './CollectModuleFragment'
import { PublicationProfileFragment } from './PublicationProfileFragment'

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    id
    profile {
      ...PublicationProfileFragment
    }
    collectedBy {
      address
      defaultProfile {
        handle
      }
    }
    collectModule {
      ...CollectModuleFragment
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
        ...CommentOnPublicationFragment
      }
      ... on Comment {
        ...CommentOnPublicationFragment
      }
      ... on Mirror {
        ...CommentOnPublicationFragment
      }
    }
    createdAt
    appId
  }
  ${PublicationProfileFragment}
  ${CollectModuleFragment}

  fragment CommentOnPublicationFragment on Publication {
    id
    profile {
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
    metadata {
      name
      content
    }
  }
`
