import { gql } from "@apollo/client";
import { notificationDetailFragment } from './Fragment'

export const NOTIFICATION_ADDED = gql`
    subscription {
      notificationAdded {
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
  }
`;