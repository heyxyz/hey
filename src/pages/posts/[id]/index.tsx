import { gql } from '@apollo/client'
import ViewPost from '@components/Post'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import { GetStaticPaths, GetStaticProps } from 'next'
import { nodeClient as client } from 'src/apollo'

export const POST_QUERY = gql`
  query Post($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
      ... on Comment {
        ...CommentFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
      ... on Mirror {
        ...MirrorFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

export const getStaticProps: GetStaticProps<{}, { id: string }> = async (
  context
) => {
  const { id } = context.params!
  const { data } = await client.query({
    query: POST_QUERY,
    variables: { request: { publicationId: id } }
  })

  return {
    props: { id, post: data }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export default ViewPost
