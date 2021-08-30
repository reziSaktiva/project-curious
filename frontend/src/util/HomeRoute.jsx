import React, { useContext, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { AuthContext } from '../context/auth';
import nearby from '../pages/Home/nearby';

function HomeRoute({ component: Component, ...rest }) {
    const { setLocationAllow } = useContext(AuthContext)
    const user = localStorage.token
    useEffect(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    // Success function
                    showPosition, 
                    // Error function
                    setLocationAllow(false), 
                    // Options. See MDN for details.
                    {
                       enableHighAccuracy: true,
                       timeout: 5000,
                       maximumAge: 0
                    });
            } else { 
                console.log("hi");
            }
    }, [])
    function showPosition(position) {
        console.log(position);
        setLocationAllow(true)
    }
    return (
        <Route
            {...rest}
            render={props =>
                user ? <Route exact path="/" component={nearby} /> : <Component {...props} />
            }
        />
    )
}

export default HomeRoute;