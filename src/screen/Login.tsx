import React from 'react'
import Head from 'next/head'
import { useMutation } from '@apollo/client'
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login'
import { LOGIN_REQUEST, LoginResponse } from '../schema/mutations/login'
import styles from '../../styles/screens/loginScreen.module.scss'

export const LoginScreen = () => {
  const [login] = useMutation<LoginResponse>(LOGIN_REQUEST)

  const responseGoogle = async (response: GoogleLoginResponse) => {
    const { email, familyName, givenName, imageUrl } = response?.profileObj
    try {
      const response = await login({
        variables: {
          input: {
            email,
            firstName: familyName,
            lastName: givenName,
            avatar: imageUrl,
          }
        },
      })
      if (response && response.data) {
        const token = response?.data?.login?.token
        const user = response?.data?.login?.user?.firstName + ' ' + response?.data?.login?.user?.lastName
        const avatar = response?.data?.login?.user?.avatar
        localStorage.setItem('APP_TOKEN', token)
        localStorage.setItem('USER', user)
        localStorage.setItem('AVATAR', avatar)
      }
      window.location.reload()
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>{'Login'}</title>
        <link key='mapbox-gl.css' rel='stylesheet' type='text/css' href='/css/mapbox-gl.css' />
      </Head>
      <div className={styles.buttonLogin}>
        <GoogleLogin
          clientId={process.env.CLIENT_ID}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy="single_host_origin"
        />
      </div>
    </>
  )
}
