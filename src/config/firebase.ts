// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDM1m7lr5byet4RWyMQSQLPDrmatiJIEAo",
    authDomain: "desarrolloweb4045.firebaseapp.com",
    projectId: "desarrolloweb4045",
    storageBucket: "desarrolloweb4045.firebasestorage.app",
    messagingSenderId: "864849603270",
    appId: "1:864849603270:web:21786d74208a9225a385c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
