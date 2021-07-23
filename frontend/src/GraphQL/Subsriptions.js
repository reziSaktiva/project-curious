import { gql } from "@apollo/client";
import { notificationDetailFragment } from './Fragment'

export const NOTIFICATION_ADDED = gql`
    subscription notificationAdded( $username: String ) {
      notificationAdded( username: $username ) {
        ...NotificationDetail
    }
  }
  ${notificationDetailFragment}
`;