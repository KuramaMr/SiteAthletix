import { auth } from '/admin/js/config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

console.log('Login script chargé'); // Debug

auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user); // Debug
    if (user) {
        console.log('Utilisateur connecté, redirection...'); // Debug
        window.location.href = '/admin/dashboard.html';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Tentative de connexion...'); // Debug
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        console.log('Tentative de connexion avec:', email); // Debug
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Connexion réussie:', userCredential); // Debug
        window.location.href = '/admin/dashboard.html';
    } catch (error) {
        console.error('Code erreur:', error.code); // Debug détaillé
        console.error('Message erreur:', error.message); // Debug détaillé
        
        let messageErreur = 'Email ou mot de passe incorrect';
        if (error.code === 'auth/invalid-credential') {
            messageErreur = 'Identifiants invalides';
        } else if (error.code === 'auth/too-many-requests') {
            messageErreur = 'Trop de tentatives, réessayez plus tard';
        }
        
        errorMessage.textContent = messageErreur;
    }
});