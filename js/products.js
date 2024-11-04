import { db } from '/SiteAthletix/admin/js/config.js';
import { collection, getDocs, query, where, limit } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

async function loadProductsByCategory(category, containerId, maxItems = 4) {
    try {
        const productsRef = collection(db, 'products');
        const q = query(
            productsRef,
            where('category', '==', category),
            limit(maxItems)
        );
        
        const querySnapshot = await getDocs(q);
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const product = { ...doc.data(), id: doc.id };
                const productCard = createProductCard(product);
                container.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error(`Erreur lors du chargement des produits ${category}:`, error);
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
        <a href="/SiteAthletix/product-detail.html?id=${product.id}" class="cta-button">Voir le détail</a>
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