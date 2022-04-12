import { gql } from '@apollo/client'

export const HAS_PUBLICATION_INDEXED_QUERY = gql`
  query HasPubicationIndexed($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        id
      }
    }
  }
`
