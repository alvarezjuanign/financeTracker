importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey: "AIzaSyBKivfg3SRbG4oeMuKirQ5B8VpfjhS2WsU",
  authDomain: "financetracker-e64c5.firebaseapp.com",
  projectId: "financetracker-e64c5",
  storageBucket: "financetracker-e64c5.firebasestorage.app",
  messagingSenderId: "899044632876",
  appId: "1:899044632876:web:56d324338ca27ba06e2489"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/web-app-manifest-192x192.png",
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});