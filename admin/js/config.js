import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "VOTRE_CLE_API",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "VOTRE_DOMAINE",
    projectId: process.env.FIREBASE_PROJECT_ID || "VOTRE_PROJET",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "VOTRE_BUCKET",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "VOTRE_SENDER",
    appId: process.env.FIREBASE_APP_ID || "VOTRE_APP_ID"
};

export const config = {
    imgbbApiKey: process.env.IMGBB_API_KEY || "VOTRE_CLE_IMGBB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);