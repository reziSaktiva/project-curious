import React, { useContext, useState, useEffect } from 'react'
import {
    List,
    Card,
    Row,
    Avatar,
    Col,
    Dropdown,
    Menu,
    Button,
    Image
} from "antd";
import Meta from "antd/lib/card/Meta";
import { EllipsisOutlined } from "@ant-design/icons";
import moment from "moment";

import { useMutation } from '@apollo/client';
import { DELETE_COMMENT } from "../../GraphQL/Mutations";
import { PostContext } from '../../context/posts';

export default function Comments({ post, loading, user, setReply, form }) {
    const [ parentComments, setParentComment ] = useState([])

    const { commentDelete } = useContext(PostContext)

    const [deleteComment] = useMutation(DELETE_COMMENT, {
        onError(err) {
            console.log(err.message);
        }, update(_, { data: { deleteComment: commentData } }) {

            commentDelete(commentData)
        },
    })

    //reply func
    const handleReply = item => {
        setReply({
            username: item.displayName,
            id: item.id
        })

        form.setFieldsValue({
            comment: `Reply to ${item.displayName}: `
        })
    }

    useEffect(() => {
        const parentComments = post.comments.filter(comment => !comment.reply.id && !comment.reply.username)
        setParentComment(parentComments)
    }, [post])
    
    return (
        <div>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={parentComments || []}
                renderItem={(comment) => (
                    <Card
                        style={{
                            width: "100%",
                            backgroundColor: "#ececec",
                            marginBottom: -20,
                        }}
                        loading={loading}
                    >
                        <Meta
                            avatar={
                                <div>
                                    {post.comments.filter(data => data.reply.id === comment.id) && post.comments.filter(data => data.reply.id === comment.id).length && <div className="commentContainer" />}
                                    <Avatar
                                        size={50}
                                        style={{
                                            backgroundImage: `url(${comment.displayImage})`,
                                            backgroundColor: comment.colorCode,
                                            backgroundSize: 50,
                                        }}
                                    />
                                </div>

                            }
                            title={
                                <Row>
                                    <Col span={12}>
                                        <p style={{ fontWeight: "bold" }}>{comment.displayName}</p>
                                    </Col>
                                    <Col span={12} style={{ textAlign: "right" }}>
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    {comment.owner === user.username ? (
                                                        <Menu.Item onClick={() => deleteComment({ variables: { postId: post.id, commentId: comment.id, room: post.room } })}>Delete Comment</Menu.Item>
                                                    ) : null}
                                                    <Menu.Item key="3">Report</Menu.Item>
                                                    <Menu.Item key="4">Delete</Menu.Item>
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
                                    </Col>
                                </Row>
                            }
                            description={<div>
                                <p style={{ color: "black" }}>{comment.text}</p>
                                {comment.photo ? (
                                    <div style={{ width: '80%' }}>
                                        <Image
                                            style={{
                                                height: 220,
                                                borderRadius: 10,
                                                objectFit: "cover",
                                                maxHeight: 300,
                                                objectFit: "cover",
                                            }}
                                            src={comment.photo}
                                        />
                                    </div>

                                ) : null}
                            </div>}
                        />
                        <div
                            style={{
                                marginTop: 20,
                                display: "inline-block",
                                marginBottom: -20,
                            }}
                        >
                            <p>
                                {moment(comment.createdAt).fromNow()}

                                <Button
                                    type="link"
                                    onClick={() => handleReply(comment)}
                                    style={{
                                        fontWeight: "bold",
                                        display: "inline-block",
                                        marginLeft: 10,
                                        color: "black"
                                    }}
                                >
                                    Reply
                                </Button>
                            </p>
                        </div>
                        <div>
                            <List
                                className="commentContainerReply"
                                itemLayout="vertical"
                                size="large"
                                dataSource={post.comments.filter(data => data.reply.id === comment.id) || []}
                                renderItem={(item, key) => (
                                    <Card
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#ececec",
                                            marginBottom: -20,
                                        }}
                                        loading={loading}
                                    >
                                        <Meta
                                            avatar={
                                                <>
                                                    {comment && post.comments.filter(data => data.reply.id === comment.id).length !== key + 1 && <div className="commentContainer" />}
                                                    <Avatar
                                                        size={50}
                                                        style={{
                                                            backgroundColor: item.colorCode,
                                                            backgroundImage: `url('${item.displayImage}')`,
                                                            backgroundSize: 50,
                                                        }}
                                                    />
                                                </>
                                            }
                                            title={
                                                <Row>
                                                    <Col span={12}>
                                                        <p style={{ fontWeight: "bold" }}>{item.displayName}</p>
                                                    </Col>
                                                    <Col span={12} style={{ textAlign: "right" }}>
                                                        <Dropdown
                                                            overlay={
                                                                <Menu>
                                                                    {item.owner === user.username ? (
                                                                        <Menu.Item onClick={() => deleteComment({ variables: { postId: post.id, commentId: item.id, room: post.room } })}>Delete Comment</Menu.Item>
                                                                    ) : null}
                                                                    <Menu.Item key="3">Report</Menu.Item>
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
                                                    </Col>
                                                </Row>
                                            }
                                            description={<p style={{ color: "black" }}>{item.text}</p>}
                                        />
                                        <div
                                            style={{
                                                marginTop: 20,
                                                display: "inline-block",
                                                marginBottom: -20,
                                            }}
                                        >
                                            <p>
                                                {moment(item.createdAt).fromNow()}

                                                <Button
                                                    type="link"
                                                    onClick={() => handleReply(item)}
                                                    style={{
                                                        fontWeight: "bold",
                                                        display: "inline-block",
                                                        marginLeft: 10,
                                                        color: "black"
                                                    }}
                                                >
                                                    Reply
                                                </Button>
                                            </p>
                                        </div>
                                        <div>
                                        </div>
                                    </Card>
                                )}>
                            </List>
                        </div>
                    </Card>
                )}>
            </List>

        </div>


    )
}
