import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query getPostNearby($lat: Float, $lng: Float, $range: Float) {
    getPosts(lat: $lat, lng: $lng, range: $range) {
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
      repost {
        id
        owner
        text
        media
        createdAt
        location {
          lat
          lng
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
  }
`;

export const GET_POPULAR_POSTS = gql`
  query getPosts($lat: Float, $lng: Float $range: Float) {
    getPopularPosts(lat: $lat, lng: $lng range: $range) {
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
      repost {
        id
        owner
        text
        media
        createdAt
        location {
          lat
          lng
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
  }
`;

export const GET_MUTED_POSTS = gql`
query {
  mutedPosts {
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
      repost {
        id
        owner
        text
        media
        createdAt
        location {
          lat
          lng
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
  }
`;

export const GET_SUBSCRIBED_POSTS = gql`
query {
  getSubscribePosts {
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
      repost {
        id
        owner
        text
        media
        createdAt
        location {
          lat
          lng
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
  }
`;

export const GET_PROFILE_POSTS = gql`
  query {
    getProfilePosts {
      id
      owner
      text
      media
      createdAt
      commentCount
      likeCount
      repost {
          id
          owner
          text
          media
          createdAt
          location {
            lat
            lng
          }
        }
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
export const GET_PROFILE_LIKED_POSTS = gql`
query{
  getProfileLikedPost{
      id
      owner
      text
      media
      createdAt
      commentCount
      likeCount
      repost {
          id
          owner
          text
          media
          createdAt
          location {
            lat
            lng
          }
        }
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

export const GET_POST = gql`
query getPost($id: ID!){
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
        displayImage
        photoProfile
        colorCode
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
      repost {
        id
        owner
        text
        media
        createdAt
        location {
          lat
          lng
        }
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

export const CREATE_POST = gql`
  mutation createPost(
    $text: String
    $media: [String]
    $location: Location!
    $repost: String
  ) {
    createPost(
    text: $text
    media: $media
    location: $location
    repost: $repost
  )
    {
      id
      owner
      text
      media
      createdAt
      location {
        lat
        lng
      }
      commentCount
      likeCount
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
      comments {
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
`