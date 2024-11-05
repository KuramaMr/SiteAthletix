import { auth } from '/admin/js/config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

console.log('1. Script de login chargé');
console.log('2. Auth object:', auth);

auth.onAuthStateChanged((user) => {
    console.log('3. Changement état auth:', user);
    if (user) {
        console.log('4. Utilisateur connecté, redirection...');
        window.location.href = '/admin/dashboard.html';
    } else {
        console.log('5. Aucun utilisateur connecté');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('6. Formulaire soumis');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('7. Email utilisé:', email);
    
    try {
        console.log('8. Tentative de connexion...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('9. Connexion réussie:', userCredential);
        window.location.href = '/admin/dashboard.html';
    } catch (error) {
        console.error('10. ERREUR - Code:', error.code);
        console.error('11. ERREUR - Message:', error.message);
        console.error('12. ERREUR - Détails complets:', error);
        
        errorMessage.textContent = 'Email ou mot de passe incorrect';
    }
});

console.log('13. Formulaire trouvé:', loginForm);