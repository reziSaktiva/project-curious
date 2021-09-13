import { gql } from '@apollo/client'

export const notificationDetailFragment = gql`
    fragment NotificationDetail on Notification {
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
`

export const commentDetailFragment = gql`
    fragment CommentDetail on Comment {
  id
  owner
  text
  createdAt
  colorCode
  photo
  displayName
  displayImage
  reply {
    username
    id
    }
  }
`

export const userDataFragment = gql`
    fragment UserData on UserData {
      user {
        id
        username
        email
        mobileNumber
        gender
        birthday
        createdAt
        profilePicture
        newUsername
        private
        postsCount
        repostCount
        likesCount
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
      liked {
        id
        owner
        createdAt
        displayName
        displayImage
        colorCode
      }
    }
`

export const postDetailFragment = gql`
    fragment PostDetail on Post {
      id
      owner
      text
      media
      createdAt
      commentCount
      repostCount
      likeCount
      room
      rank
      location {
        lat
        lng
        location
      }
      likes {
        id
        owner
        createdAt
        colorCode
        displayName
        displayImage
      }
      comments {
        id
        createdAt
        owner
        text
        photoProfile
        photo
        displayName
        displayImage
        colorCode
        reply {
          id
          username
        }
      }
      muted {
        id
        owner
        postId
        createdAt
      }
      repost {
        id
        owner
        text
        media
        createdAt
        location {
          lat
          lng
          location
        }
      }
      subscribe {
          postId
          owner
          createdAt
          displayName
          displayImage
          colorCode
      }
    }
`