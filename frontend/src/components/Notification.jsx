import React, { useContext } from "react";
import { Card, Button } from "antd";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { READ_NOTIFICATION } from "../GraphQL/Mutations";

export default function Notification() {
  const { notifications, notificationRead } = useContext(AuthContext);

  const [readNotification] = useMutation(READ_NOTIFICATION, {
    update(_, { data: { readNotification } }) {
      console.log(readNotification);
      notificationRead(readNotification);
    },
  });

  return (
    <div>
      <div style={{ position: "fixed", zIndex: 1 }}>
        <Card
          title="Notification"
          extra={
            <a href="#">
              <i
                className="ellipsis horizontal icon"
                style={{ color: "black" }}
              ></i>
            </a>
          }
          style={{ width: "100%" }}
        >
          {notifications &&
            notifications.map((notif, key) => {
              let type = "";
              let text = "";
              switch (notif.type) {
                case "LIKE":
                  type = "liked";
                  text = "iike";
                  break;
                case "COMMENT":
                  type = "commented";
                  text = "comment";
                default:
                  break;
              }

              return (
                <Link
                  to={`/post/${notif.postId}`}
                  onClick={() =>
                    readNotification({ variables: { id: notif.id } })
                  }
                  name={notif.id}
                  key={`notif${key}`}
                  style={notif.read ? { fontSize: 10, color: "black" } : { fontSize: 10, fontWeight: "bold", color: "black" }}
                >
                  <p>
                    {notif.displayName}{" "}
                    <span>{`${type}: this is a ${text} post.`}</span>{" "}
                  </p>
                </Link>
              );
            })}
        </Card>
      </div>
    </div>
  );
}
