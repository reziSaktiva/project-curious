import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/app-check';

import Config from './Config';


 firebase.initializeApp(Config)

// export const appCheck = app.appCheck()

// appCheck.activate('6LcYfzocAAAAALi0-lrtXpRWZQKGUX9G7EErRlv7',

//     // Optional argument. If true, the SDK automatically refreshes App Check
//     // tokens as needed.
//     true);

export const db = firebase.firestore();

export const auth = firebase.auth();

export const FacebookProvider = new firebase.auth.FacebookAuthProvider();

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();

GoogleProvider.setCustomParameters({ prompt: 'select_account' })