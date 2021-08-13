import React, { useContext, useState } from 'react'
import { Button } from 'antd'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { AuthContext } from '../context/auth'
import { GoogleProvider, auth } from '../util/Firebase'
import { gql, useMutation } from '@apollo/client'

const CHECK_USER_BY_GOOGLE = gql`
  mutation check($username: String!){
    checkUserWithGoogle(username: $username)
  }
`

export default function LoginGoogleButton() {
  let history = useHistory()
  const { loadGoogleData, login, setLoginLoader } = useContext(AuthContext)
  const [dataGoogle, setGoogleData] = useState({})

  const [check] = useMutation(CHECK_USER_BY_GOOGLE, {
    update(_, { data: { checkUserWithGoogle } }) {
      if (!checkUserWithGoogle) {
        loadGoogleData(dataGoogle)
        setLoginLoader(false)
        history.push('/register/google')
      } else {
        const { token } = dataGoogle

        login(token)
        setLoginLoader(false)
        history.push('/')
      }
    },
    onError(err) {
      console.log(err.message)
    }
  })

  const signInWithGoogle = async () => {
    
    auth.signInWithPopup(GoogleProvider).then(function (result) {
      setLoginLoader(true)
      let user = result.user;
      let googleData = {
        username: user.displayName,
        email: user.email,
        imageUrl: user.photoURL,
        id: user.uid,
        token: user._lat
      }
      setGoogleData(googleData)
      check({ variables: { username: user.displayName } })
    })
  }

  return (
    <Button onClick={signInWithGoogle} className="landing-big-button" style={{ fontSize: "18px" ,  marginTop: 15, }}>
      <i className="google icon" />
          Continue with Google
    </Button>
  )
}

