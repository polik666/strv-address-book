const initializeApp = require("firebase/app").initializeApp
const fbDatabase = require('firebase/database')
const ref = fbDatabase.ref;
const child = fbDatabase.child;
const set = fbDatabase.set;
const push = fbDatabase.push;
const update = fbDatabase.update;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {      
  apiKey: "AIzaSyCvJWKVbIdl5i4-pRx-1Cx28ku6rtL7b1c",
  authDomain: "strv-addressbook-knotek-pavel.firebaseapp.com",
  databaseURL: "https://strv-addressbook-knotek-pavel-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "strv-addressbook-knotek-pavel",
  storageBucket: "strv-addressbook-knotek-pavel.appspot.com",
  messagingSenderId: "1037462773831",
  appId: "1:1037462773831:web:aef97ea84235ad43699162",
  measurementId: "G-97PW6W7R0K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



const database = fbDatabase.getDatabase(app);

// function writeUserData(owner, name) {
//   const db = fbDatabase.getDatabase();
// //   set(ref(db, 'contacts/' + owner), {
// //     xxx: []
// //   });
// const newPostKey = push(child(ref(db), '/contacts/' + owner)).key;
// const postData = {
//     name: name,
//     address: 'Address of ' + name,
//     key: newPostKey
// }

//  const updates = {};
//  console.log(newPostKey)
//   updates['/contacts/' + owner + '/' + name + '_' + newPostKey] = postData;
//   update(ref(db), updates);
// }



// writeUserData('pavel', 'Karel Novak xx')
// writeUserData('lukas', 'Karel Novak xx')
// writeUserData('pavel', 'Jaja Baka')
// writeUserData('tomas', 'Karel Novak xx')
// writeUserData('brada', '34')


const getAuth = require("firebase/auth")
const signInWithCustomToken = require("firebase/auth");

const token = 'HelloWorld'
const auth = getAuth.getAuth();
signInWithCustomToken.signInWithCustomToken(auth, token)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('##### userCredential')
    console.log(userCredential)
    const xxx = getAuth.getIdToken(auth.user);
    console.log(xxx)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
    console.log(error)
  });





console.log('Up and running')