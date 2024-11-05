import { auth } from './config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

console.log('Login script chargé'); // Debug

// Vérifier si l'utilisateur est déjà connecté
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user); // Debug
    if (user) {
        console.log('Utilisateur connecté, redirection...'); // Debug
        window.location.href = 'dashboard.html';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Tentative de connexion...'); // Debug
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        console.log('Appel à signInWithEmailAndPassword...'); // Debug
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Connexion réussie:', userCredential); // Debug
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Erreur détaillée:', error); // Debug détaillé
        errorMessage.textContent = 'Email ou mot de passe incorrect';
    }
});