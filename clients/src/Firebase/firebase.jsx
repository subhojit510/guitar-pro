// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBccRH5AgVdSZcteyGda3BOvKm8V1WFkZY",
  authDomain: "guitar-pro-admin.firebaseapp.com",
  projectId: "guitar-pro-admin",
  storageBucket: "guitar-pro-admin.appspot.com",
  messagingSenderId: "790379804327",
  appId: "1:790379804327:web:7e7258afac02c7101b8d82",
  measurementId: "G-EWLBQTSYL3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
