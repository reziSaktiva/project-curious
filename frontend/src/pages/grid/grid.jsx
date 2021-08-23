import React, { useContext } from 'react'
import Sidebar from '../../components/Sidebar'
import Notification from '../../components/Notification/Notification'
import AddPosts from '../../components/AddPost/index'
import ButtonAdd from '../../components/AddPost/ButtonAdd';
import BottomBar from '../../components/BottomBar';
import './grid-style.css'
import { AuthContext } from '../../context/auth';
import Container from '../../library/Container';


export default function Grid({ children }) {
    console.log(children);
    const { user } = useContext(AuthContext)
    if (user) {
        return (
            <Container>
                <div className="grid-container">
                    <div className="grid-sidebar">
                        {user && <Sidebar  />}
                    </div>
                    <div className="grid-content">
                        {children}
                    </div>
                    <div className="grid-notif">
                        {user && <Notification />}
                        {user && (
                            <>
                                <ButtonAdd />
                                <AddPosts />
                            </>
                        )}
                    </div>
                <BottomBar />
            </div>
            </Container>
            
            
        )
    } else return <div>{children}</div>
}
