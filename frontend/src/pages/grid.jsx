import React, { useContext } from 'react'
import { Container } from 'semantic-ui-react';
import Sidebar from '../components/Sidebar'
import Notification from '../components/Notification'
import AddPosts from '../components/AddPost/index'
import ButtonAdd from '../components/AddPost/ButtonAdd';
import BottomBar from '../components/BottomBar';

import { AuthContext } from '../context/auth'

// ant design
import { Row, Col } from 'antd';

export default function Grid({ children }) {
    const { user } = useContext(AuthContext)

    if (user) {
        return (
            <Container>
                <Row>
                    <Col xs={0} sm={0} md={3} lg={6} xl={6} >
                        {user && <Sidebar />}
                    </Col>
                    <Col xs={24} sm={24} md={15} lg={12} xl={12} style={{borderRight: "1px #cccccc solid" }}>
                        {children}
                    </Col>
                    <Col xs={0} sm={24} md={6} lg={6} xl={6}>
                        {user && <Notification />}
                        {user && (
                            <>
                                <ButtonAdd />
                                <AddPosts />
                            </>
                        )}
                    </Col>
                </Row>
                {window.isMobile && <BottomBar />}
            </Container>
            
        )
    } else return <div>{children}</div>
}
