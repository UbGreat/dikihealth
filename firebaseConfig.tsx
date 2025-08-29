// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAT7wkFpvPlK5tRiooso_aigKuB09p_J_s",
  authDomain: "dikihealthpro.firebaseapp.com",
  projectId: "dikihealthpro",
  storageBucket: "dikihealthpro.firebasestorage.app",
  messagingSenderId: "251453588617",
  appId: "1:251453588617:web:f4f07b06bf4032f0baf258",
  measurementId: "G-YH32DMT7GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()