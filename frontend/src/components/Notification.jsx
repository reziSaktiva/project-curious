import React, { useContext } from "react";
import { Card, Button } from "antd";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { READ_NOTIFICATION } from "../GraphQL/Mutations";
import { Row, Col, Dropdown, Menu} from 'antd';

import { EllipsisOutlined } from "@ant-design/icons";

export default function Notification() {
  const { notifications, notificationRead } = useContext(AuthContext);

  const [readNotification] = useMutation(READ_NOTIFICATION, {
    update(_, { data: { readNotification } }) {
      console.log(readNotification);
      notificationRead(readNotification);
    },
  });

  return (
    <div style={{ position: 'sticky', zIndex: 1}}>
      <div style={{ position: "absolute", left: 0, right: 0, width: '100%', }}>
        <Card
          title="Notification"
          extra={
            <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="0">READ ALL</Menu.Item>
                          <Menu.Item key="1" onClick={(e) => console.log(e)}>
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
          <div style={{margin: -22}}>

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
                  style={notif.read ? { fontSize: 13, color: "black",  } : { fontSize: 13, fontWeight: "bold", color: "black", }}
                >
                  <div className='notifContainer'>
                    <Row>
                      <Col span={22}>
                      <p style={{ marginBottom: 5}}>
                    {notif.displayName}{" "}
                    <span>{`${type} your post.`}</span>{" "}
                  </p>
                      </Col>
                      <Col span={2} style={{color: '#7958f5'}}>
                        {!notif.read && <p>&#8226;</p> }
                      
                      </Col>
                    </Row>
                  </div>
                  

                  
                </Link>
              );
            })}
          </div>
          
        </Card>
      </div>
    </div>
    
  );
}
