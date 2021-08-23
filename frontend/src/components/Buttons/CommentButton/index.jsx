import React from 'react'

import { Button } from 'antd';

import './style.css';

export default function CommentButton({ commentCount, icon }) {
    return (
        <div className="ui labeled btn-comment" tabIndex="0">
            <div className="btn-comment__icon">
              <Button shape="circle" style={{width: 3}}   icon={icon} />
            </div>
            <div className="btn-comment__wrapper">
              <div className="ui basic label float btn-comment__label font_responsive ">
                <p>{commentCount} comment</p>
              </div>
            </div>
        </div>
    )
}