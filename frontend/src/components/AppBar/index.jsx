// Modules
import {  Col, Row } from 'antd';
import { useHistory } from 'react-router-dom'
import { TagRemove } from '../../library/Icon';

// Styles
import './style.css';

const AppBar = props => {
  const { title = 'My Profile' } = props;
  const history = useHistory();
  const handleClose = () => props.setOpenModal(false)
  return (
    <div className="app-bar">
      <Row>
          <Col span={6}>
          {!props.setOpenModal && <button className="ui inverted basic button" type="text" onClick={props.postsLocation ? props.onClick : () => history.goBack()}>
              <i className="chevron left icon" style={{ color: 'black' }}></i>
            </button>
            }
          </Col>
          <Col span={12} style={{textAlign: "center", }}>
            <h4>{title}</h4>
          </Col>
          <Col span={6} style={{textAlign: "right", display: 'flex', flexDirection:'row-reverse', alignItems: 'center'}}>
            {props.setOpenModal && <div onClick={handleClose}><TagRemove /></div>}
          </Col>
      </Row>
      <div style={{width: "100%"}}>
        <div className="ui divider"/>
      </div>
    </div>
  )
}

export default AppBar;
