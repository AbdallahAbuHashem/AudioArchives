import firebase from 'firebase';

import "firebase/firestore";
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCFyqZ4LLTwx26fu9J_OnFf-ZncIs-C0_I",
    authDomain: "symmetric-stage-303601.firebaseapp.com",
    projectId: "symmetric-stage-303601",
    storageBucket: "symmetric-stage-303601.appspot.com",
    messagingSenderId: "1053147986656",
    appId: "1:1053147986656:web:52e9cbb3678443891bee85",
    measurementId: "G-WTR6EBT83Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

export default firestore