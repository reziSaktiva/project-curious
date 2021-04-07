import { gql } from '@apollo/client'

export const GET_POSTS = gql`
    query{
        getPosts{
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

export const GET_USER_DATA = gql`
    query{
      getUserData{
    user{
      id
      username
      email
      mobileNumber
      gender
      birthday
      createdAt
      profilePicture
    }
    notifications {
      recipient
      sender
      read
      postId
      id
      type
      createdAt
      displayName
      displayImage
      colorCode
    }
    liked{
      id
      owner
      createdAt
      displayName
      displayImage
      colorCode
    }
  }
  }
`