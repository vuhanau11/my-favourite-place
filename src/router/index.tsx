import React, { useMemo } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
  ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { MainScreen } from '../screen/MainScreen'
import { LoginScreen } from '../screen/Login'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message }) => console.log(`Error: ${message}`))
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const Router = React.memo(() => {
  let appToken: string = ''
  if (typeof window !== 'undefined') {
    appToken = localStorage.getItem('APP_TOKEN')
  }

  const authLink = new HttpLink({
    uri: process.env.APP_BASE_HOST_URI,
    headers: {
      authorization: `Bearer ${appToken}`,
    }
  })

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, authLink]),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      }
    }
  })

  const screen = useMemo(() => {
    if (appToken) {
      return <MainScreen key="app-main-screen" />
    }
    return <LoginScreen />
  }, [appToken])

  return <ApolloProvider client={client}>{screen}</ApolloProvider>
})

Router.displayName = 'Router'
