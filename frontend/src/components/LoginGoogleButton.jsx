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

export default function LoginGoogleButton({ props }) {
  let history = useHistory()
  const { loadGoogleData, login } = useContext(AuthContext)
  const [dataGoogle, setGoogleData] = useState({})

  const [check] = useMutation(CHECK_USER_BY_GOOGLE, {
    update(_, { data: { checkUserWithGoogle } }) {
      console.log("checkUserWithGoogle", checkUserWithGoogle);
      if (!checkUserWithGoogle) {
        loadGoogleData(dataGoogle)
        props.history.push('/register/google')
      } else {
        const { token } = dataGoogle
        console.log();
        // loginFacebook({ variables: { username, token } })
        login(token)
        props.history.push('/')
      }
    },
    onError(err) {
      console.log(err.message)
    }
  })

  const signInWithGoole = async () => {
    auth.signInWithPopup(GoogleProvider).then(function (result) {
      console.log("result", result);
      console.log("result", result.user._lat, typeof(result.user._lat));
      let user = result.user;
      let googleData = {
        username: user.displayName,
        email: user.email,
        imageUrl: user.photoURL,
        id: user.uid,
        token: user._lat
      }
      setGoogleData(googleData)
      history.push('/register/google')

      check({ variables: { username: user.displayName } })
    })
  }

  return (
    <Button onClick={signInWithGoole} className="ui black basic button" style={{ width: 300, fontSize: "18px" , height: 45, marginTop: 15, borderRadius: 5 }}>
      <i className="google icon" />
          Continue with Google
    </Button>
  )
}

