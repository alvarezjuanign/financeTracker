import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyBKivfg3SRbG4oeMuKirQ5B8VpfjhS2WsU",
  authDomain: "financetracker-e64c5.firebaseapp.com",
  projectId: "financetracker-e64c5",
  storageBucket: "financetracker-e64c5.firebasestorage.app",
  messagingSenderId: "899044632876",
  appId: "1:899044632876:web:56d324338ca27ba06e2489"
};


const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);