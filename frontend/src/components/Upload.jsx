import React from 'react'
import { Upload, Button } from 'antd';

const fileList = [];

function UploadFile() {
  return(
    <>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture"
        FileList={[...fileList]}
      >
        <i className="image outline icon" style={{ marginRight: 463 }}></i>
      </Upload>
    </>
  )
}

export default UploadFile;