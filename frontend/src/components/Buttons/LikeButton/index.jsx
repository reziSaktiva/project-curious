import React, { useContext } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useMutation } from "@apollo/client";
import { LIKE_POST } from "../../../GraphQL/Mutations";
import { PostContext } from "../../../context/posts";
import { AuthContext } from "../../../context/auth";

import './style.css';
export default function LikeButton({ likeCount, id, likes, room, type }) {
  const { like } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  const isLike = user && likes.find((like) => like.owner === user.username)

  const [likePost] = useMutation(LIKE_POST, {
    onError (){
      like({ owner : user.username, isLike : likes.find((like) => like.owner === user.username) }, id, room, type)
    }
  });

  const onLike = () => {
    like({ owner : user.username, isLike: !likes.find((like) => like.owner === user.username) }, id, room, type)
    likePost({ variables: { id, room } });
  };

  return (
    <div className="ui labeled btn-like" tabIndex="0">
      <div className="btn-like__icon" >
        <Button
          onClick={onLike}
          shape="circle"
          className="likeButton"
          icon={
            // <HeartOutlined />
            isLike ? (
              <HeartFilled style={{ color: "#FF0073" }} />
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
