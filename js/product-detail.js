import { db } from '../admin/js/config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

async function loadProductDetail() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            window.location.href = '/index.html';
            return;
        }

        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const product = docSnap.data();
            
            document.title = `${product.title} - Athletix`;
            
            const imageContainer = document.querySelector('.product-image');
            imageContainer.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.title}">
            `;
            
            const infoContainer = document.querySelector('.product-info');
            infoContainer.innerHTML = `
                <div class="product-header">
                    <span class="category">${product.category}</span>
                    <h1>${product.title}</h1>
                    <p class="price">${product.price}€</p>
                </div>
                
                <div class="product-description">
                    <p>${product.description}</p>
                </div>

                <div class="product-info-details">
                    <div class="info-item">
                        <span class="icon">🚚</span>
                        <div class="info-text">
                            <h3>Livraison gratuite</h3>
                            <p>À partir de 50€ d'achat</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="icon">↩️</span>
                        <div class="info-text">
                            <h3>Retours gratuits</h3>
                            <p>Sous 30 jours</p>
                        </div>
                    </div>
                </div>

                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus">−</button>
                        <input type="number" value="1" min="1" max="10" class="quantity-input">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="add-to-cart">Ajouter au panier</button>
                </div>
            `;

            // Gestion des boutons de quantité
            const quantityInput = infoContainer.querySelector('.quantity-input');
            const minusBtn = infoContainer.querySelector('.minus');
            const plusBtn = infoContainer.querySelector('.plus');

            minusBtn.addEventListener('click', () => {
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                }
            });

            plusBtn.addEventListener('click', () => {
                if (quantityInput.value < 10) {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                }
            });
        }
    } catch (error) {
        console.error('Erreur:', error);
        window.location.href = '/index.html';
    }
}

document.addEventListener('DOMContentLoaded', loadProductDetail);