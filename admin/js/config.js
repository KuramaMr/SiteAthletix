import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "VOTRE_VRAIE_CLE_API",
    authDomain: "VOTRE_VRAI_DOMAINE",
    projectId: "VOTRE_VRAI_PROJET",
    storageBucket: "VOTRE_VRAI_BUCKET",
    messagingSenderId: "VOTRE_VRAI_SENDER",
    appId: "VOTRE_VRAI_APP_ID"
};

export const config = {
    imgbbApiKey: "VOTRE_VRAIE_CLE_IMGBB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);