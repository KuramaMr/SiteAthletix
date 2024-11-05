import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyADu1FtAILOLXEtwHOKHv1ZGrg131dIqho",
    authDomain: "siteatletix-9eb85.firebaseapp.com",
    projectId: "siteatletix-9eb85",
    storageBucket: "siteatletix-9eb85.firebasestorage.app",
    messagingSenderId: "457700397446",
    appId: "1:457700397446:web:0400f54c009dbb715adc07"
};

export const config = {
    imgbbApiKey: "8683f1bc1a36bcbb4862475d39e1bad4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
