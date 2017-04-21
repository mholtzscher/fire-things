// Initialize Firebase
import Firebase from 'firebase'

let config = {
  apiKey: "AIzaSyBZLv0K6ASM1BnLeoRjDmcHmgDO2DHXXnI",
  authDomain: "fire-things.firebaseapp.com",
  databaseURL: "https://fire-things.firebaseio.com",
  projectId: "fire-things",
  storageBucket: "fire-things.appspot.com",
  messagingSenderId: "462800717505"
};
let firebaseApp = Firebase.initializeApp(config)

export default firebaseApp