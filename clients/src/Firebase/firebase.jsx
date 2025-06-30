// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyBK96lKTo76ph8l568gXs9iOqorIDyyw8k",
authDomain: "guitar-pro-player.firebaseapp.com",
projectId: "guitar-pro-player",
storageBucket: "guitar-pro-player.firebasestorage.app",
messagingSenderId: "717841901750",
appId: "1:717841901750:web:43f8ca2131a50b9d505e17",
measurementId: "G-32W56KHS3C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
