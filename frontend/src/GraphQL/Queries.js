import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query {
    getPosts {
      id
      owner
      text
      media
      createdAt
      commentCount
      likeCount
      location {
        lat
        lng
      }
      likes {
        id
        owner
        createdAt
        colorCode
        displayName
        displayImage
      }
      muted {
        id
        owner
        postId
        createdAt
      }
    }
  }
`;

export const GET_POST = gql`
query($id: String!){
getPost(id: $id){
    id
    createdAt
    owner
    commentCount
    likeCount
    text
    location {
      lat
      lng
    }
    likes {
        id
        owner
        createdAt
        colorCode
        displayName
        displayImage
      }
    comments{
        id
        createdAt
        owner
        text
        displayName
        photoProfile
        colorCode
        }
    }
}
`;
export const GET_POSTS_BASED_ON_NEAREST_LOC = gql`
  query GetNearby($lat: String, $lng: String) {
    getPostBasedOnNearestLoc(lat: $lat, lng:$lng) {
      id
      owner
      text
      media
      createdAt
      commentCount
      likeCount
      location {
        lat
        lng
      }
      likes {
        id
        owner
        createdAt
        colorCode
        displayName
        displayImage
      }
      muted {
        id
        owner
        postId
        createdAt
      }
    }
  }
`

export const GET_USER_DATA = gql`
  query {
    getUserData {
      user {
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
      liked {
        id
        owner
        createdAt
        displayName
        displayImage
        colorCode
      }
    }
  }
`;
