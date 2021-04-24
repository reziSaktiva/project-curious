import jwtDecode from 'jwt-decode'

import { LS_DATA_USER, LS_TOKEN, LS_LOCATION } from '../context/constant';

export const Session = ({
    onLogout = () => { }
}) => {
    const { token, location } = getSession();

    if (token) {
        const decodedToken = jwtDecode(token)

        if (decodedToken.exp * 1000 < Date.now()) {
            destorySession();
            onLogout();

            return
        }
        
        const locationData = JSON.parse(location)

        return { location: locationData, user: decodedToken, token }
    }
};

export const getSession = () => {
    const token = localStorage.getItem(LS_TOKEN);
    const user = localStorage.getItem(LS_DATA_USER);
    const location = localStorage.getItem(LS_LOCATION);

    return { token, user, location };
};

export const destorySession = () => {
    try {
        localStorage.removeItem(LS_TOKEN)
        localStorage.removeItem(LS_DATA_USER)
        localStorage.removeItem(LS_LOCATION)
    } catch (e) {
        console.log('error destroy session: ', e);
    }
};
