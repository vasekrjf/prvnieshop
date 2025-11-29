// Firebase konfigurace a inicializace
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnZeIK4cVcVmZJV8E_-8KcnGGh7Sml0bU",
  authDomain: "admin-bcc73.firebaseapp.com",
  projectId: "admin-bcc73",
  storageBucket: "admin-bcc73.appspot.com",
  messagingSenderId: "1065437996732",
  appId: "1:1065437996732:web:f0de91e92b872f8c6892b9",
  measurementId: "G-2ZXW5JD5DR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);