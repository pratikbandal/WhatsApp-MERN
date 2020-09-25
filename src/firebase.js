import firebase from 'firebase/app';
import 'firebase/auth'

const firebaseApp= firebase.initializeApp ({
    apiKey: "AIzaSyASJqn3HApeNLgToHsU9Sz3uBCArgHlMDg",
    authDomain: "whatsapp-mern-3c485.firebaseapp.com",
    databaseURL: "https://whatsapp-mern-3c485.firebaseio.com",
    projectId: "whatsapp-mern-3c485",
    storageBucket: "whatsapp-mern-3c485.appspot.com",
    messagingSenderId: "372632568693",
    appId: "1:372632568693:web:8f900a459467d79dc0493c"
});

const auth= firebaseApp.auth();
const provider= new firebase.auth.GoogleAuthProvider()

export {auth, provider}