import { auth } from './config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

// Vérifier si l'utilisateur est déjà connecté
auth.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = '/admin/dashboard.html';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/admin/dashboard.html';
    } catch (error) {
        errorMessage.textContent = 'Email ou mot de passe incorrect';
        console.error('Erreur de connexion:', error);
    }
});