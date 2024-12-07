import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD66Wkai6rxYrLKmbkREjwJeIByp5Vp9nY",
    authDomain: "utslab-7ff84.firebaseapp.com",
    projectId: "utslab-7ff84",
    storageBucket: "utslab-7ff84.appspot.com",
    messagingSenderId: "28916181527",
    appId: "1:28916181527:web:6411a47d049264f4a80a52",
    measurementId: "G-FL1440WEY5"
};

// Initialize Firebase only if no apps are initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);
