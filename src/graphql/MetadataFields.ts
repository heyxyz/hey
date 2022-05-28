import { gql } from '@apollo/client'

export const MetadataFields = gql`
  fragment MetadataFields on MetadataOutput {
    name
    description
    content
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
`
