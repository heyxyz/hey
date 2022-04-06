import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import { lensStylePagination } from '@lib/lensStylePagination'
import jwtDecode from 'jwt-decode'

import { API_URL } from './constants'

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

const httpLink = new HttpLink({
  uri: API_URL,
  fetch
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('accessToken')

  if (token === 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('selectedProfile')
    location.href = '/'

    return forward(operation)
  } else {
    operation.setContext({
      headers: {
        'x-access-token': token ? `Bearer ${token}` : ''
      }
    })

    // @ts-ignore
    const { exp }: { exp: any } = token ? jwtDecode(token) : ''

    if (Date.now() >= exp * 1000) {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken: localStorage.getItem('refreshToken') }
          }
        })
      })
        .then((res) => res.json())
        .then((res) => {
          operation.setContext({
            headers: {
              'x-access-token': token
                ? `Bearer ${res?.data?.refresh?.accessToken}`
                : ''
            }
          })
          localStorage.setItem('accessToken', res?.data?.refresh?.accessToken)
          localStorage.setItem('refreshToken', res?.data?.refresh?.refreshToken)
        })
    }

    return forward(operation)
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // timeline: lensStylePagination(['request', ['profileId']]),
          publications: lensStylePagination([
            'request',
            ['profileId', 'commentsOf', 'publicationTypes', 'limit']
          ]),
          explorePublications: lensStylePagination([
            'request',
            ['sortCriteria', 'sources']
          ]),
          followers: lensStylePagination(['request', ['profileId']]),
          following: lensStylePagination(['request', ['address']]),
          whoCollectedPublication: lensStylePagination([
            'request',
            ['publicationId']
          ]),
          nfts: lensStylePagination(['request', ['ownerAddress', 'chainIds']]),
          notifications: lensStylePagination(['request', ['profileId']])
        }
      }
    }
  })
})

export default client
