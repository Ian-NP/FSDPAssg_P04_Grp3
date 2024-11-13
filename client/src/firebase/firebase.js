// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration (replace with your actual Firebase project config)
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
const database = getDatabase(app); // Initialize Realtime Database

export { database }; // Export the database
