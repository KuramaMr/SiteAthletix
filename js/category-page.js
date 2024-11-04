import { db } from '/SiteAthletix/admin/js/config.js';
import { collection, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Obtenir la catégorie depuis l'URL
const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

async function loadCategoryProducts(category) {
    try {
        const productsRef = collection(db, 'products');
        const q = query(
            productsRef,
            where('category', '==', category)
        );
        
        const querySnapshot = await getDocs(q);
        const productsContainer = document.getElementById('products');
        
        productsContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const product = { ...doc.data(), id: doc.id };
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
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

// Gestion du tri
document.getElementById('sort').addEventListener('change', (e) => {
    const sortValue = e.target.value;
    sortProducts(sortValue);
});

function sortProducts(sortType) {
    const products = Array.from(document.querySelectorAll('.product-card'));
    const container = document.getElementById('products');

    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').textContent);
        const priceB = parseFloat(b.querySelector('.price').textContent);

        if (sortType === 'price-asc') {
            return priceA - priceB;
        } else if (sortType === 'price-desc') {
            return priceB - priceA;
        }
    });

    container.innerHTML = '';
    products.forEach(product => container.appendChild(product));
}

// Charger les produits au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadCategoryProducts(currentPage);
});
