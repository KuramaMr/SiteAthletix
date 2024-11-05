import { db } from '/admin/js/config.js';
import { collection, getDocs, query, where, limit } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const slidersConfig = {
    slider1: {
        title: "Promotions",
        subtitle: "Découvrez nos meilleures offres",
        currentSlide: 0,
        interval: null
    },
    slider2: {
        title: "Nouveautés",
        subtitle: "Les derniers articles arrivés",
        currentSlide: 0,
        interval: null
    }
};

async function loadSliderProducts() {
    try {
        const productsRef = collection(db, 'products');
        
        for (const sliderId of Object.keys(slidersConfig)) {
            const q = query(
                productsRef,
                where('displayIn', 'array-contains', sliderId),
                limit(3)
            );
            
            const querySnapshot = await getDocs(q);
            const products = [];
            
            querySnapshot.forEach(doc => {
                products.push({...doc.data(), id: doc.id});
            });
            
            if (products.length > 0) {
                const slider = document.getElementById(sliderId);
                if (slider) {
                    // Nettoyer le slider
                    slider.innerHTML = `
                        <div class="slider-content"></div>
                        <div class="slider-dots"></div>
                    `;
                    
                    // Ajouter les dots
                    const dotsContainer = slider.querySelector('.slider-dots');
                    dotsContainer.innerHTML = products.map((_, i) => `
                        <div class="slider-dot ${i === 0 ? 'active' : ''}"></div>
                    `).join('');
                    
                    // Ajouter les événements sur les dots
                    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, index) => {
                        dot.addEventListener('click', () => {
                            clearInterval(slidersConfig[sliderId].interval);
                            showSlide(sliderId, index, products);
                            slidersConfig[sliderId].interval = setInterval(() => {
                                const nextIndex = (index + 1) % products.length;
                                showSlide(sliderId, nextIndex, products);
                            }, 5000);
                        });
                    });

                    // Démarrer le slider
                    showSlide(sliderId, 0, products);
                    slidersConfig[sliderId].interval = setInterval(() => {
                        const nextIndex = (slidersConfig[sliderId].currentSlide + 1) % products.length;
                        showSlide(sliderId, nextIndex, products);
                    }, 5000);
                }
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des sliders:', error);
    }
}

function showSlide(sliderId, index, products) {
    const slider = document.getElementById(sliderId);
    const product = products[index];
    const content = slider.querySelector('.slider-content');
    
    slidersConfig[sliderId].currentSlide = index;
    
    // Mettre à jour les dots
    slider.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    // Mettre à jour le contenu avec le lien vers la page détail
    content.innerHTML = `
        <div class="slider-product-content">
            <div class="slider-text">
                <h2>${slidersConfig[sliderId].title}</h2>
                <p>${slidersConfig[sliderId].subtitle}</p>
                <h3>${product.title}</h3>
                <p class="price">${product.price}€</p>
                <a href="/product-detail.html?id=${product.id}" class="cta-button">Voir le détail</a>
            </div>
            <div class="slider-image">
                <img src="${product.imageUrl}" alt="${product.title}">
            </div>
        </div>
    `;
}

// Initialiser les sliders au chargement de la page
document.addEventListener('DOMContentLoaded', loadSliderProducts);