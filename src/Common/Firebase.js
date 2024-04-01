// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcnPF09ouLS8DFQewSDzeCyv47T2lc4Ls",
  authDomain: "collaborative--canvas.firebaseapp.com",
  projectId: "collaborative--canvas",
  storageBucket: "collaborative--canvas.appspot.com",
  messagingSenderId: "541393061294",
  appId: "1:541393061294:web:d20728d3bf8519b27bf43f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
