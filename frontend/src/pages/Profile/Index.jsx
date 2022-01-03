import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { AuthContext } from '../../context/auth';
import OtherProfile from './OtherProfile';
import Profile from './Profile';

export default function Index() {
    const { user } = useContext(AuthContext);

    const pathname = useHistory().location.pathname
    const [isMyProfile, setIsMyProfile] = useState()

    useEffect(() => {
        const name = pathname.split('/')[1]
    
        if (name === user.username || name === user.newUsername) setIsMyProfile(true)
        else setIsMyProfile(false)
      }, [pathname, user])

    return (
        <div>
            {isMyProfile ? <Profile /> : <OtherProfile username={pathname.split('/')[1]}/>}
        </div>
    )
}
