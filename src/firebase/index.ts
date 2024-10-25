import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA39phSfqOwITLGh7c3oBH7Eclw5eGlHDQ",
  authDomain: "pt-genios-app.firebaseapp.com",
  projectId: "pt-genios-app",
  storageBucket: "pt-genios-app.appspot.com",
  messagingSenderId: "623128419354",
  appId: "1:623128419354:web:6499b9af67db8ffab645a3",
  measurementId: "G-LJRZL5FR1G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth};