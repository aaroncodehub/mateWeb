import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// firebase init goes here
const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "mysharpeyemate",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "G-274K5GPPX7"
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()



// firebase collections
const usersCollection = db.collection('users')
const feedbackCollection = db.collection('feedback')
const customersCollection = db.collection('customers')



export {
    db,
    auth,
    usersCollection,
    feedbackCollection,
    customersCollection
}
