import firebase from "firebase/compact/app";
import "firebase/compact/messaging";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
  
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

export const requestNotificationPermission = async () => {
  try {
    await Notification.requestPermission();
    const token = await messaging.getToken();
    console.log('Notification Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting notification permission:', error);
  }
};
