import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACNUzRWJv8bfbOBb3M5zEv9xHDNprKqsY",
  authDomain: "task-manager-635f4.firebaseapp.com",
  projectId: "task-manager-635f4",
  storageBucket: "task-manager-635f4.firebasestorage.app",
  messagingSenderId: "192786955893",
  appId: "1:192786955893:web:ef3bec8c1e75991aa0023c",
  measurementId: "G-P2Q7XHPHD5",
};

// Initialize Firebase (once)
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Analytics only works in the browser, and can fail in some environments —
// guard it so it doesn't crash your dev server
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});