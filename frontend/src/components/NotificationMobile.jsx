import React, { useContext, useEffect, useState } from "react";
import { Card, Skeleton } from "antd";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  READ_ALL_NOTIFICATIONS,
  READ_NOTIFICATION,
} from "../GraphQL/Mutations";
import { Row, Col, Dropdown, Menu } from "antd";

import { DropIcon } from "../library/Icon";
import { CLEAR_ALL_NOTIF } from "../GraphQL/Mutations";
import NoNotif from "../assets/NoNotif.jpg";
import { PostContext } from "../context/posts";
import { db } from "../util/Firebase";
import moment from "moment";
import './Notification/notif-style.css'
export default function NotificationMobile() {
  const { isNavMobileOpen, setNavMobileOpen } = useContext(PostContext)
  const { notificationRead, readAllNotificatons, user } = useContext(AuthContext);
  const { clearNotifications } = useContext(AuthContext);
  const [state, setstate] = useState([])
  const [loading, setLoading] = useState(false)

  function getNotifications(){
    setLoading(true)
    db.collection(`users/${user.username}/notifications`).orderBy('createdAt', 'desc').onSnapshot((data) => {
      const notifications = []
      data.forEach(doc => {
        notifications.push(doc.data())
      });
      setstate(notifications)
      setLoading(false)
    })
  }

  useEffect(() => {
    if(user){
      getNotifications();
    }
  }, [user])

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
      clearNotifications(clearAllNotif);
    },
  });
  
  return (
    <div className={isNavMobileOpen? "notifmobilecoy open" : "notifmobilecoy"}>
      <div style={{ position: "absolute", left: 0, right: 0, width: "100%" }}>
        <Card
        >
          <div style={{ margin: -22, height: '100vh' }}>
          <div >
          <Row >
          <Col span={6}>
            <button className="ui inverted basic button" type="text" onClick={() => setNavMobileOpen(false)}>
              <i className="chevron left icon" style={{ color: 'black' }}></i>
            </button>
          </Col>
          <Col span={12} style={{textAlign: "center", justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
            <h4>Notification</h4>
          </Col>
          <Col span={6} style={{textAlign: "right"}}>
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
                <div style={{marginTop: 5, position: "relative", right: 8}}>
                  <DropIcon />
                </div>
              </a>
            </Dropdown>
          </Col>
          <div style={{width: "100%", marginTop: -10}}>
        <div className="ui divider"/>
      </div>
      </Row>
          </div>
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
                      <div className="notifContainer" style={{padding: "2px 18px"}}>
                        <Row>
                          <Col span={22}>
                            <p style={{ marginBottom: 15 }}>
                              {notif.displayName}{" "}
                              <span>{`${type} your post.`}</span>{" "}
                              <br />
                              <p>{moment(notif.createdAt).fromNow()}</p>
                            </p>
                          </Col>
                          <Col span={2} style={{ color: "var(--primary-color)" }}>
                            {!notif.read && <p>&#8226;</p>}
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
