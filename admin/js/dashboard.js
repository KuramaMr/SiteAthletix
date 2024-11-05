import { auth, db } from './config.js';
import { config } from './config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Pas besoin d'importer Swal car il est déjà disponible globalement via le CDN
const Swal = window.Swal;

// Fonction pour uploader une image sur ImgBB
async function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('key', config.imgbbApiKey);

    try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('Échec du téléchargement de l\'image');
        }
    } catch (error) {
        console.error('Erreur upload image:', error);
        throw error;
    }
}

// Vérification de l'authentification
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'admin-login.html';
    }
});

const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');
const logoutBtn = document.getElementById('logoutBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Remplacer les alerts par des SweetAlert2
async function showSuccessMessage(message) {
    await Swal.fire({
        title: 'Succès !',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4CAF50',
        timer: 2000,
        timerProgressBar: true
    });
}

async function showErrorMessage(message) {
    await Swal.fire({
        title: 'Erreur',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f44336'
    });
}

async function showConfirmDialog(message) {
    const result = await Swal.fire({
        title: 'Confirmation',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#f44336'
    });
    return result.isConfirmed;
}

// Gestion de la déconnexion
logoutBtn.addEventListener('click', async () => {
    if (await showConfirmDialog('Voulez-vous vraiment vous déconnecter ?')) {
        try {
            await auth.signOut();
            window.location.href = 'admin-login.html';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            await showErrorMessage('Erreur lors de la déconnexion');
        }
    }
});

// Chargement des produits
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        productsList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productElement = createProductElement(doc.id, product);
            productsList.appendChild(productElement);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
    }
}

// Création d'un élément produit
function createProductElement(id, product) {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p class="price">${product.price}€</p>
        <p>Catégorie: ${product.category}</p>
        <div class="product-actions">
            <button onclick="editProduct('${id}')" class="cta-button edit-btn">Modifier</button>
            <button onclick="deleteProduct('${id}')" class="cta-button delete-btn">Supprimer</button>
        </div>
    `;
    return div;
}

// Ajout de la fonction d'édition
window.editProduct = async (productId) => {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        const product = docSnap.data();
        
        // Remplir le formulaire avec les données existantes
        document.getElementById('title').value = product.title;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;
        
        // Retirer l'attribut required de l'input file
        document.getElementById('image').removeAttribute('required');
        
        // Changer le bouton submit
        const submitBtn = productForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Modifier le produit';
        
        // Afficher le bouton annuler
        cancelEditBtn.style.display = 'block';
        
        // Stocker l'ID du produit en cours d'édition
        productForm.dataset.editId = productId;
        productForm.dataset.currentImageUrl = product.imageUrl;
        
        // Scroll vers le formulaire
        productForm.scrollIntoView({ behavior: 'smooth' });
    }
};

// Modifier le gestionnaire du formulaire pour gérer l'édition
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const category = document.getElementById('category').value;
    const imageFile = document.getElementById('image').files[0];
    const displayIn = Array.from(document.getElementById('displayIn').selectedOptions).map(option => option.value);
    const editId = productForm.dataset.editId;

    try {
        let imageUrl = productForm.dataset.currentImageUrl;
        
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }

        const productData = {
            title,
            description,
            price,
            category,
            imageUrl,
            displayIn,
            updatedAt: new Date().toISOString()
        };

        if (editId) {
            await updateDoc(doc(db, 'products', editId), productData);
        } else {
            productData.createdAt = new Date().toISOString();
            await addDoc(collection(db, 'products'), productData);
        }

        resetForm();
        loadProducts();
        await showSuccessMessage(editId ? 'Produit modifié avec succès!' : 'Produit ajouté avec succès!');
    } catch (error) {
        console.error('Erreur:', error);
        await showErrorMessage('Erreur lors de l\'opération');
    }
});

// Suppression d'un produit
window.deleteProduct = async (productId) => {
    if (await showConfirmDialog('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
            await deleteDoc(doc(db, 'products', productId));
            loadProducts();
            await showSuccessMessage('Produit supprimé avec succès!');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            await showErrorMessage('Erreur lors de la suppression du produit');
        }
    }
};

// Chargement initial des produits
loadProducts();

// Fonction pour réinitialiser le formulaire
function resetForm() {
    productForm.reset();
    delete productForm.dataset.editId;
    delete productForm.dataset.currentImageUrl;
    
    // Remettre l'attribut required sur l'input file
    document.getElementById('image').setAttribute('required', '');
    
    // Restaurer le texte du bouton
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Ajouter le produit';
    
    // Cacher le bouton annuler
    cancelEditBtn.style.display = 'none';
}

// Ajouter l'événement pour le bouton annuler
cancelEditBtn.addEventListener('click', async () => {
    if (await showConfirmDialog('Voulez-vous vraiment annuler les modifications ?')) {
        resetForm();
    }
});