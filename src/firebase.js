import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZdBaa5iRbQJpiVk0Y50dVeIQFNxqLbto",
  authDomain: "tspicon-3a245.firebaseapp.com",
  projectId: "tspicon-3a245",
  storageBucket: "tspicon-3a245.appspot.com",
  messagingSenderId: "105374508296",
  appId: "1:105374508296:web:9d3b592fc00c2e43cb38bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore database
export const db = getFirestore(app);
console.log(db);
