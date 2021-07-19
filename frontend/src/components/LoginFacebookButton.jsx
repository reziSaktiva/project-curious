import React, { useContext, useState } from 'react'
import { Button } from 'antd'

import { AuthContext } from '../context/auth'
import { FacebookProvider, auth } from '../util/Firebase'
import { gql, useMutation } from '@apollo/client'
import { LOGIN_USER_FACEBOOK } from '../GraphQL/Mutations'

const CHECK_USER_BY_FACEBOOK = gql`
  mutation check($username: String!){
    checkUserWithFacebook(username: $username)
  }
`

export default function LoginFacebookButton({ props }) {
  const { loadFacebookData, login } = useContext(AuthContext)
  const [dataFacebook, setFacebookData] = useState({})

  // const [loginFacebook] = useMutation(LOGIN_USER_FACEBOOK, {
  //   update(_, { data: { loginWithFacebook } }) {

  //     login(loginWithFacebook)
  //   }
  // })

  const [check] = useMutation(CHECK_USER_BY_FACEBOOK, {
    update(_, { data: { checkUserWithFacebook } }) {
      if (!checkUserWithFacebook) {
        loadFacebookData(dataFacebook)
        props.history.push('/register/facebook')
      } else {
        const { token } = dataFacebook
        // loginFacebook({ variables: { username, token } })
        login(token)
        props.history.push('/')
      }
    },
    onError(err) {
      console.log(err.message)
    }
  })

  const signInWithFacebook = async () => {
    auth.signInWithPopup(FacebookProvider).then(function (result) {
      let user = result.user;
      let facebookData = {
        username: user.displayName,
        email: user.email,
        imageUrl: user.photoURL,
        id: user.uid
      }
      user.getIdToken().then(token => {
        facebookData.token = token
      })
      setFacebookData(facebookData)

      check({ variables: { username: user.displayName } })
    })
  }

  return (
    <Button onClick={signInWithFacebook} className="landing-big-button" style={{fontSize: '18px', color: 'white', background: '#7F57FF' }}>
      <i className="facebook icon" />
          Continue with Facebook
    </Button>
  )
}

