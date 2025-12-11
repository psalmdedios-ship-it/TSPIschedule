 // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/firestore";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDZdBaa5iRbQJpiVk0Y50dVeIQFNxqLbto",
    authDomain: "tspicon-3a245.firebaseapp.com",
    databaseURL: "https://tspicon-3a245-default-rtdb.firebaseio.com",
    projectId: "tspicon-3a245",
    storageBucket: "tspicon-3a245.firebasestorage.app",
    messagingSenderId: "105374508296",
    appId: "1:105374508296:web:9d3b592fc00c2e43cb38bd",
    measurementId: "G-EYHE7SJ1R0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app)
  const db = getFirestore(app);
console.log(db);