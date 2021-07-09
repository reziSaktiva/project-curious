import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function GoogleAuthRoute({ component: Component, ...rest }) {
    const { googleData } = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={props => 
                !googleData ? <Redirect to='/' /> : <Component {...props} /> 
            }
        />
    )
}

export default GoogleAuthRoute;