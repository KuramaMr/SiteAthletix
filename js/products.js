import { db } from '../admin/js/config.js';
import { collection, getDocs, query, where, limit } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

console.log('1. Products.js chargé');
console.log('2. DB object:', db);

async function loadProductsByCategory(category, containerId, maxItems = 4) {
    console.log('3. Tentative de chargement pour:', category);
    try {
        const productsRef = collection(db, 'products');
        const q = query(
            productsRef,
            where('category', '==', category),
            limit(maxItems)
        );
        
        console.log('4. Requête préparée');
        const querySnapshot = await getDocs(q);
        console.log('5. Données reçues:', querySnapshot.size);
        
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const product = { ...doc.data(), id: doc.id };
                console.log('6. Produit trouvé:', product);
                const productCard = createProductCard(product);
                container.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('ERREUR chargement produits:', error);
    }
}

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p class="price">${product.price}€</p>
        <a href="/product-detail.html?id=${product.id}" class="cta-button">Voir le détail</a>
    `;
    return div;
}

// Charger les produits pour chaque catégorie
document.addEventListener('DOMContentLoaded', () => {
    const categories = ['tshirts', 'chaussures', 'shorts', 'chaussettes', 'accessoires'];
    categories.forEach(category => {
        loadProductsByCategory(category, `${category}-products`);
    });
});