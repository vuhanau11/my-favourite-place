import React, { Fragment } from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import { Router } from '../src/router/index'

const HomeIndex: NextPage = () => {

  return (
    <>
      <Head>
        <title>{'Home'}</title>
        <link key='mapbox-gl.css' rel='stylesheet' type='text/css' href='/css/mapbox-gl.css' />
      </Head>
      <Router />
    </>
  )
}

HomeIndex.getInitialProps = async () => ({
  namespacesRequired: ["common"]
})

export default (HomeIndex)
