import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Config from './Config';

firebase.initializeApp(Config);

export const db = firebase.firestore();

export const auth = firebase.auth();

export const FacebookProvider = new firebase.auth.FacebookAuthProvider();

export const GoogleProvider = new  firebase.auth.GoogleAuthProvider();

GoogleProvider.setCustomParameters({ prompt: 'select_account' })