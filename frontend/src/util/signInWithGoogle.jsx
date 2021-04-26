import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import config from './Config'

export const apps = firebase.initializeApp(config);
export const  storage = firebase.storage()

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Google Auth
const GoogleProvider = new  firebase.auth.GoogleAuthProvider();

GoogleProvider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () => {
  auth.signInWithPopup(GoogleProvider)
}