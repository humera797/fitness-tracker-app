// Firebase configuration and initialization for the App

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU2Dd0XgQZiP3LjlVdvRzKTFXU2PuiscM",
  authDomain: "fitnesstracker-e1a36.firebaseapp.com",
  projectId: "fitnesstracker-e1a36",
  storageBucket: "fitnesstracker-e1a36.firebasestorage.app",
  messagingSenderId: "718667380343",
  appId: "1:718667380343:web:8113d9220c2379e15bf872"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);