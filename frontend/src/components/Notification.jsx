import React, { useContext } from "react";
import { Card } from "antd";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  READ_ALL_NOTIFICATIONS,
  READ_NOTIFICATION,
} from "../GraphQL/Mutations";
import { Row, Col, Dropdown, Menu } from "antd";

import { EllipsisOutlined } from "@ant-design/icons";
import { CLEAR_ALL_NOTIF } from "../GraphQL/Mutations";
import NoNotif from "../assets/NoNotif.jpg";

export default function Notification() {
  const { notifications, notificationRead, readAllNotificatons } =
    useContext(AuthContext);
  const { clearNotifications } = useContext(AuthContext);

  const [readNotification] = useMutation(READ_NOTIFICATION, {
    update(_, { data: { readNotification } }) {
      notificationRead(readNotification);
    },
  });

  const [readNotifications] = useMutation(READ_ALL_NOTIFICATIONS, {
    update(_, { data: { readAllNotification } }) {
      console.log(readAllNotification);
      readAllNotificatons(readAllNotification);
    },
  });

  const [clearNotif] = useMutation(CLEAR_ALL_NOTIF, {
    update(_, { data: { clearAllNotif } }) {
      clearNotifications();
      alert(clearAllNotif);
    },
  });

  return (
    <div className="notif__fixed">
      <div className="notif__width">
        <Card
          title={
        <h3 style={{textAlign: 'center'}}>Notification {
          notificationRead.length > 1 && <p className="notifCounter">
              {notifications.length > 99 ?
               ('99+') :
                (notifications.length)}
                </p>}</h3>
          }
          extra={
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="0" onClick={readNotifications}>
                    READ ALL
                  </Menu.Item>
                  <Menu.Item key="1" onClick={clearNotif}>
                    CLEAR ALL
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
              placement="bottomRight"
            >
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <EllipsisOutlined />
              </a>
            </Dropdown>
          }
          style={{ width: "100%" }}
          className="testttttt"
        >
          <div style={{ margin: -22, overflowY: "auto", overflowX :'hidden', height: 342 }}>
            {(notifications && notifications.length ? (
                notifications.map((notif, key) => {
                  let type = "";
                  let text = "";
                  switch (notif.type) {
                    case "LIKE":
                      type = "liked";
                      text = "iike";
                      break;
                    case "REPOST":
                      type = "repost";
                      text = "repost";
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
                      style={
                        notif.read
                          ? { fontSize: 13, color: "black" }
                          : { fontSize: 13, fontWeight: "bold", color: "black" }
                      }
                    >
                      <div className="notifContainer">
                        <Row>
                          <Col span={22}>
                            <p style={{ marginBottom: 5 }}>
                              {notif.displayName}{" "}
                              <span>{`${type} your post.`}</span>{" "}
                            </p>
                          </Col>
                          <Col span={2} style={{ color: "#7958f5" }}>
                            {!notif.read && <p>&#8226;</p>}
                          </Col>
                        </Row>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="noNotif"/>
              )
            )
            }
          </div>
        </Card>
      </div>
    </div>
  );
}
