import firebase from 'firebase';

import "firebase/firestore";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBlVjNxMWVnhMVO7po6uvCOCGu2EFxiyLk",
    authDomain: "lecture7b-1f2a6.firebaseapp.com",
    projectId: "lecture7b-1f2a6",
    storageBucket: "lecture7b-1f2a6.appspot.com",
    messagingSenderId: "620265504628",
    appId: "1:620265504628:web:d44abf7df32c0d80017621",
    measurementId: "G-3K6E02K4HY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

export default firestore