import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDdDtfdTjbIwFYbjMn496rVnrjGXJmGspw",
  authDomain: "expense-tracker-c49c8.firebaseapp.com",
  projectId: "expense-tracker-c49c8",
  storageBucket: "expense-tracker-c49c8.firebasestorage.app",
  messagingSenderId: "620157606114",
  appId: "1:620157606114:web:bcd2493210aadde67b66bb",
  measurementId: "G-WD89T0WQHH"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // Optional: kept for Google login option
export const db = getFirestore(app);