// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app); // Initialize Firebase Messaging

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

if ('serviceWorker' in navigator) {
  // Register the service worker if not already registered
  navigator.serviceWorker
    .getRegistration('../public/firebase-messaging-sw.js')
    .then((registration) => {
      if (registration) {
        console.log('Service Worker already registered with scope:', registration.scope);
      } else {
        navigator.serviceWorker.register('../public/firebase-messaging-sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Error fetching service worker registration:', error);
    });
}

// Function to request notification permission and get the token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Get the FCM token with VAPID key
      const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPIDKEY });
      console.log("Notification Token:", token);
      return token;
    } else {
      console.error("Notification permission denied");
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
};
