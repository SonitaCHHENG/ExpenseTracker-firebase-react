// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdDtfdTjbIwFYbjMn496rVnrjGXJmGspw",
  authDomain: "expense-tracker-c49c8.firebaseapp.com",
  projectId: "expense-tracker-c49c8",
  storageBucket: "expense-tracker-c49c8.firebasestorage.app",
  messagingSenderId: "620157606114",
  appId: "1:620157606114:web:bcd2493210aadde67b66bb",
  measurementId: "G-WD89T0WQHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
//fire base login
//fire base init
//firebase deploy