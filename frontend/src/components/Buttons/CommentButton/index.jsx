import React from 'react'
import { MessageOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import './style.css';

export default function CommentButton({ commentCount }) {
    return (
        <div className="ui labeled btn-comment" tabIndex="0">
            <div className="btn-comment__icon">
              <Button shape="circle" className="likeButton"  icon={<MessageOutlined />} />
            </div>
            <div className="btn-comment__wrapper">
              <div className="ui basic label float btn-comment__label">
                <p>{commentCount} comment</p>
              </div>
            </div>
        </div>
    )
}