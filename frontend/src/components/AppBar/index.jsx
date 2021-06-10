// Modules
import {  Col, Row } from 'antd';
import { useHistory } from 'react-router-dom'

// Styles
import './style.css';

const AppBar = props => {
  const { title = 'My Profile' } = props;
  const history = useHistory();

  return (
    <div className="app-bar">
      <Row>
          <Col span={6}>
            <button class="ui inverted basic button" type="text" onClick={() => history.goBack()}>
              <i class="chevron left icon" style={{ color: 'black' }}></i>
            </button>
          </Col>
          <Col span={12} style={{textAlign: "center", justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
            <h4>{title}</h4>
          </Col>
          <Col span={6} style={{textAlign: "right"}}>
            
          </Col>
      </Row>
      <div style={{width: "100%"}}>
        <div class="ui divider"/>
      </div>
    </div>
  )
}

export default AppBar;
