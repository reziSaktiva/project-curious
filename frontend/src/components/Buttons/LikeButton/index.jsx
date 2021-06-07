import React, { useContext, useEffect } from "react";
import { HeartOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMutation } from "@apollo/client";
import { LIKE_POST } from "../../../GraphQL/Mutations";
import { PostContext } from "../../../context/posts";
import { AuthContext } from "../../../context/auth";

import './style.css';

export default function LikeButton({ likeCount, id, likes, room }) {
  const { like } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  const [likePost] = useMutation(LIKE_POST, {
    update(_, { data: { likePost } }) {
      like(likePost, id, room);
    },
  });

  const onLike = () => {
    likePost({ variables: { id, room } });
  };

  return (
    <div className="ui labeled btn-like" tabIndex="0">
      <div className="btn-like__icon">
        <Button
          onClick={onLike}
          shape="circle"
          className="likeButton"
          icon={
            // <HeartOutlined />
            user && likes.find((like) => like.owner === user.username) ? (
              <HeartOutlined style={{ color: "red" }} />
            ) : (
              <HeartOutlined />
            )
          }
        />
      </div>
      <div className="btn-like__wrapper">
        <div className="ui basic label float btn-like__label">
          <p>{likeCount} likes</p>
        </div>
      </div>
    </div>
  );
}
