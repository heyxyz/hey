import { gql } from '@apollo/client'

import { PostCollectionFragment } from './CollectionFragment'
import { PublicationProfileFragment } from './PublicationProfileFragment'

export const PostFragment = gql`
  fragment PostFragment on Post {
    pubId: id
    profile {
      ...PublicationProfileFragment
    }
    collectedBy {
      defaultProfile {
        handle
      }
    }
    ...PostCollectionFragment
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
    createdAt
    appId
  }
  ${PublicationProfileFragment}
  ${PostCollectionFragment}
`
