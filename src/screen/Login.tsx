import React, { Fragment } from 'react'
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
        localStorage.setItem('APP_TOKEN', token)
      }
      window.location.reload()
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Fragment>
      <div className={styles.buttonLogin}>
        <GoogleLogin
          clientId={process.env.CLIENT_ID}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy="single_host_origin"
        />
      </div>
    </Fragment>
  )
}
