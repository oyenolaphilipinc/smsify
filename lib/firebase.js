// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDVFDvrXkc3xK1OamXlDNPtYcyyUgKHm4A',
  authDomain: 'realtor-d828f.firebaseapp.com',
  projectId: 'realtor-d828f',
  storageBucket: 'realtor-d828f.firebasestorage.app',
  messagingSenderId: '117637196849',
  appId: '1:117637196849:web:4a60905d275cd28f1af910',
  measurementId: 'G-TV020R6SB3',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);
export { auth };
