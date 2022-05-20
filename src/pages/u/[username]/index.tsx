import ViewProfile, { PROFILE_QUERY } from '@components/Profile'
import { GetStaticPaths, GetStaticProps } from 'next'
import { nodeClient as client } from 'src/apollo'

export const getStaticProps: GetStaticProps<{}, { username: string }> = async (
  context
) => {
  const { username } = context.params!
  const { data } = await client.query({
    query: PROFILE_QUERY,
    variables: { request: { handles: username } }
  })

  return {
    props: { profile: data?.profiles?.items?.[0] },
    revalidate: 1
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export default ViewProfile
