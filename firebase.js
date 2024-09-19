import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkX9wCz1qoMYyRa7WQ6879BptG3Jw8TVk",
  authDomain: "clearwayapp-1.firebaseapp.com",
  projectId: "clearwayapp-1",
  storageBucket: "clearwayapp-1.appspot.com",
  messagingSenderId: "606810364203",
  appId: "1:606810364203:web:1:606810364203:android:c29fc0578642cc4418cd6e" // This will be different from your Android app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
