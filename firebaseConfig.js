import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEpNf-24ELlypgz9WzMPZIpJxUvcQSZHs",
    authDomain: "mcppuas-22253.firebaseapp.com",
    projectId: "mcppuas-22253",
    storageBucket: "mcppuas-22253.appspot.com",
    messagingSenderId: "714341127949",
    appId: "1:714341127949:web:0775b4ef675096bc2cc244",
    measurementId: "G-DEBLGRTNBZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);
