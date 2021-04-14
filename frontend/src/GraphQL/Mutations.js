import { gql } from '@apollo/client'

export const CREATE_POST = gql`
    mutation createPost( $text: String!, $lat: Float, $lng: Float ) {
  createPost(text: $text, location:{
    lat : $lat
    lng: $lng
  }){
    id
    text
  	owner
  	createdAt
    likeCount
    commentCount
    location {
      lat
      lng
    }
  }   
}
`

export const GET_POST = gql`
mutation getPost($id: ID!) {
  getPost(id:"0XW5NbsMpvfd5z54FGpS"){
    id
    owner
    text
    createdAt
    location{
      lat
      lng
    }
    likeCount
    commentCount
    likes{
      id
      owner
      createdAt
      colorCode
      displayName
      displayImage
    }
    comments{
      id
      owner
      createdAt
      colorCode
      displayName
      displayImage
      text
    }
  }
}
`

export const GET_MORE_POSTS = gql`
    mutation nextPosts($id: ID!) {
        nextPosts(id: $id){
            id
            owner
            text
            createdAt
            commentCount
            likeCount
            location{
                lat
                lng
            }
        }
}
`

export const LIKE_POST = gql`
mutation likePost($id: ID!){
  likePost(id: $id){  
      id
      owner
      createdAt
      colorCode
      displayName
      displayImage
  }
}
`

export const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
    login(username: $username, password: $password)
    {
            id
            username
            email
            token
            createdAt
            profilePicture
            gender
            birthday
            mobileNumber
        }
}
`

export const LOGIN_USER_FACEBOOK = gql`
    mutation loginFacebook(
        $username: String!
        $token: String!
    ){
    loginWithFacebook(username: $username, token: $token){
            id
            username
            email
            token
            createdAt
            profilePicture
            gender
            birthday
            mobileNumber
        }
}
`

export const REGISTER_USER_FACEBOOK = gql`
    mutation registerUserFacebook(
        $username: String!
        $email: String!
        $imageUrl: String!
        $token: String!
        $mobileNumber: String!
        $gender: String!
        $birthday: String!
        $id: String!
    ) {
        registerUserWithFacebook(facebookData : {
    mobileNumber: $mobileNumber
    id: $id
    email: $email
    token: $token
    imageUrl: $imageUrl 
    gender: $gender 
    birthday: $birthday
    username: $username
  }){
    id
    username
    email
    token
    createdAt
    profilePicture
    gender
    birthday
    mobileNumber
  }
    }
`

export const REGISTER_USER = gql`
    mutation registerUser(
        $username: String!
        $email: String!
        $password: String!
        $mobileNumber: String!
        $gender: String!
        $birthday: String!
    ) {
        registerUser(registerInput : {
    mobileNumber: $mobileNumber
    email: $email
    password: $password 
    gender: $gender 
    birthday: $birthday
    username: $username
  }){
    id
    username
    email
    token
    createdAt
    profilePicture
    gender
    birthday
    mobileNumber
  }
    }
`