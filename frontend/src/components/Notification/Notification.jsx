import React, { useContext, useEffect } from "react";
import { Card } from "antd";
import { AuthContext } from "../../context/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  READ_ALL_NOTIFICATIONS,
  READ_NOTIFICATION,
} from "../../GraphQL/Mutations";
import { Row, Col, Dropdown, Menu } from "antd";

import { CLEAR_ALL_NOTIF } from "../../GraphQL/Mutations";
import { DropIcon } from "../../library/Icon";

import { db } from "../../util/Firebase";

import './notif-style.css'
import moment from "moment";
import { useState } from "react";
import { PostContext } from "../../context/posts";

export default function Notification() {
  const {  notificationRead, readAllNotificatons } = useContext(AuthContext);
  const { clearNotifications, user } = useContext(AuthContext);
  const { setNotifLength, notifLength } = useContext(PostContext);
  const [state, setstate] = useState([])
  const [loading, setLoading] = useState(false)

  
  function getNotifications(){
    setLoading(true)
    db.collection(`users/${user.username}/notifications`).orderBy('createdAt', 'desc').onSnapshot((data) => {
      const notifications = []
      data.forEach(doc => {
        notifications.push(doc.data())
      });
      setNotifLength(notifications.filter(notif => notif.read === false).length)
      setstate(notifications)
      setLoading(false)
    })
  }
  
  useEffect(() => {
    getNotifications();
  }, [user])



  // useSubscription(NOTIFICATION_ADDED, {
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     console.log(subscriptionData.data.notificationAdded);
  //     notificationAdded(subscriptionData.data.notificationAdded);
  //   },
  //   variables: { username: user.username }
  // })

  const [readNotification] = useMutation(READ_NOTIFICATION, {
    update(_, { data: { readNotification } }) {
      notificationRead(readNotification);
    },
  });

  const [readNotifications] = useMutation(READ_ALL_NOTIFICATIONS, {
    update(_, { data: { readAllNotification } }) {
      readAllNotificatons(readAllNotification);
    },
  });

  const [clearNotif] = useMutation(CLEAR_ALL_NOTIF, {
    update(_, { data: { clearAllNotif } }) {
      clearNotifications();
    },
  });

  

  return (
    <div className="notif__fixed">
      <div className="notif__width">
        <Card
          title={
            <h3 style={{ textAlign: 'center' }}>Notification  {
              state.length > 1 && <div className="notifCounter">
                <p style={{ display: 'flex', justifyContent: 'center', marginTop: 2, color: "white" }}>{notifLength > 99 ?
                  ('99+') :
                  (notifLength)}</p>
              </div>}</h3>
          }
          extra={
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="0" onClick={readNotifications}>
                    Read All
                  </Menu.Item>
                  <Menu.Item key="1" onClick={clearNotif}>
                    Clear All
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
                <div style={{ display: "flex", alignItems: 'center', position: "absolute", right: 12 }}>
                  <DropIcon />
                </div>
              </a>
            </Dropdown>
          }
          className="testttttt"
        >
          <div style={{ margin: -22, overflowY: "auto", overflowX: 'hidden', height: 342 }}>
            {(state && state.length ? (
              state.map((notif, key) => {
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
                    break;
                  case "REPLY_COMMENT":
                    type = "reply";
                    text = "reply";
                    break;
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
                      <Row style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Col span={22} style={{color: "red"}}>
                          <p style={{ marginBottom: 5 }}>
                            {notif.displayName}{" "}
                            <span>{type === "reply" ? `${type} your comment` : `${type} your post.`}</span>{" "} <br />
                          {moment(notif.createdAt).fromNow()}
                          </p>
                          
                        </Col>
                        <Col span={2} style={{ color: "var(--primary-color)" }}>
                          {!notif.read && <p style={{ textAlign: 'right' }}>&#8226;</p>}
                        </Col>
                      </Row>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div>
                <div className="noNotif" />

                <p style={{ textAlign: "center", fontWeight: 700 }}>No Notifications yet</p>
              </div>

            )
            )
            }
          </div>
        </Card>
      </div>
    </div>
  );
}
