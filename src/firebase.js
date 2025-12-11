import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZdBaa5iRbQJpiVk0Y50dVeIQFNxqLbto",
  authDomain: "tspicon-3a245.firebaseapp.com",
  databaseURL: "https://tspicon-3a245-default-rtdb.firebaseio.com",
  projectId: "tspicon-3a245",
  storageBucket: "tspicon-3a245.appspot.com", // ✅ FIXED
  messagingSenderId: "105374508296",
  appId: "1:105374508296:web:9d3b592fc00c2e43cb38bd",
  measurementId: "G-EYHE7SJ1R0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
