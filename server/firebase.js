// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9jaDq6XAhK7C7iGs_iI_theFtDYf6hTE",
  authDomain: "fsdpassg.firebaseapp.com",
  databaseURL: "https://fsdpassg-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fsdpassg",
  storageBucket: "fsdpassg.appspot.com",
  messagingSenderId: "326585788538",
  appId: "1:326585788538:web:ba85ec38ff7d515b31b3c3",
  measurementId: "G-DJH524QR0K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { db };