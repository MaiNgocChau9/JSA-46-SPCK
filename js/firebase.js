// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8huygjO3NPAq3v42nGpbw9WiroQ3hWDs",
  authDomain: "jsi-31.firebaseapp.com",
  databaseURL: "https://jsi-31-default-rtdb.firebaseio.com",
  projectId: "jsi-31",
  storageBucket: "jsi-31.firebasestorage.app",
  messagingSenderId: "320863785460",
  appId: "1:320863785460:web:3150be47b8b9d70607a9a1",
  measurementId: "G-2VNGMVYMME",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
