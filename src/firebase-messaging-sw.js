importScripts('https://www.gstatic.com/firebasejs/8.6.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.7/firebase-messaging.js');
// firebase.initializeApp(
//   {
//     apiKey: "AIzaSyA8NqvDWdMndSaxxGGBkj0rhtm19lNhXXQ",
//     authDomain: "capstone-7071e.firebaseapp.com",
//     databaseURL: "",
//     projectId: "capstone-7071e",
//     storageBucket: "capstone-7071e.appspot.com",
//     messagingSenderId: "85671425902",
//     appId: "1:85671425902:web:a3b495f5ae77e1ac87f37f",
//     measurementId: "G-4V3YLW14CB"
//   }
// );
firebase.initializeApp(
  {
    apiKey: "AIzaSyBHrI1bDdG56ELUdBh05f3yOkNliAy8GUY",
    authDomain: "unilinks-41d0e.firebaseapp.com",
    projectId: "unilinks-41d0e",
    storageBucket: "unilinks-41d0e.appspot.com",
    messagingSenderId: "1039354207577",
    appId: "1:1039354207577:web:aa6c8dd47b91a492670048",
    measurementId: "G-4HT7GTTN56"
  }
);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const channel = new BroadcastChannel('sw-messages');
  // channel.postMessage({msg: payload.data.id});
  const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: payload.notification.imageUrl
  // };

  self.registration.showNotification(notificationTitle);
});