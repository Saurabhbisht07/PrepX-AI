
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interview-9f6d7.firebaseapp.com",
  projectId: "interview-9f6d7",
  storageBucket: "interview-9f6d7.firebasestorage.app",
  messagingSenderId: "526457175780",
  appId: "1:526457175780:web:4a9809ea358f08cac2f6f1"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}