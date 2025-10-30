// Shop Page JavaScript

// Sample Product Data
const products = [
    { id: 1, name: 'Vitamin C 1000mg', price: 12.99, category: 'vitamins', brand: 'nature-made', rating: 4.5, popularity: 95, image: 'assets/images/product1.jpg' },
    { id: 2, name: 'Daily Multivitamin', price: 18.99, category: 'vitamins', brand: 'centrum', rating: 5.0, popularity: 98, image: 'assets/images/product2.jpg' },
    { id: 3, name: 'Omega-3 Fish Oil', price: 15.99, category: 'vitamins', brand: 'nordic-naturals', rating: 4.0, popularity: 85, image: 'assets/images/product3.jpg' },
    { id: 4, name: 'Probiotic Complex', price: 22.99, category: 'vitamins', brand: 'blackmores', rating: 4.7, popularity: 90, image: 'assets/images/product4.jpg' },
    { id: 5, name: 'Vitamin D3', price: 10.99, category: 'vitamins', brand: 'nature-made', rating: 4.6, popularity: 88, image: 'assets/images/product1.jpg' },
    { id: 6, name: 'Calcium + Magnesium', price: 14.99, category: 'vitamins', brand: 'centrum', rating: 4.3, popularity: 82, image: 'assets/images/product2.jpg' },
    { id: 7, name: 'Zinc Supplement', price: 9.99, category: 'vitamins', brand: 'nature-made', rating: 4.4, popularity: 80, image: 'assets/images/product3.jpg' },
    { id: 8, name: 'Iron Tablets', price: 11.99, category: 'vitamins', brand: 'blackmores', rating: 4.2, popularity: 75, image: 'assets/images/product4.jpg' },
    { id: 9, name: 'B-Complex Vitamins', price: 13.99, category: 'vitamins', brand: 'centrum', rating: 4.8, popularity: 92, image: 'assets/images/product1.jpg' },
    { id: 10, name: 'Glucosamine Joint Support', price: 24.99, category: 'vitamins', brand: 'blackmores', rating: 4.6, popularity: 87, image: 'assets/images/product2.jpg' },
    { id: 11, name: 'Paracetamol 500mg', price: 5.99, category: 'medicines', brand: 'nature-made', rating: 4.9, popularity: 99, image: 'assets/images/product3.jpg' },
    { id: 12, name: 'Ibuprofen 200mg', price: 6.99, category: 'medicines', brand: 'centrum', rating: 4.7, popularity: 93, image: 'assets/images/product4.jpg' },
    { id: 13, name: 'Hand Sanitizer 500ml', price: 7.99, category: 'personal-care', brand: 'nature-made', rating: 4.5, popularity: 91, image: 'assets/images/product1.jpg' },
    { id: 14, name: 'Face Mask (50 pcs)', price: 12.99, category: 'personal-care', brand: 'blackmores', rating: 4.6, popularity: 89, image: 'assets/images/product2.jpg' },
    { id: 15, name: 'Digital Thermometer', price: 19.99, category: 'medical-devices', brand: 'nordic-naturals', rating: 4.8, popularity: 86, image: 'assets/images/product3.jpg' },
    { id: 16, name: 'Blood Pressure Monitor', price: 45.99, category: 'medical-devices', brand: 'centrum', rating: 4.7, popularity: 84, image: 'assets/images/product4.jpg' },
    { id: 17, name: 'Baby Diapers (Pack of 50)', price: 29.99, category: 'baby-care', brand: 'nature-made', rating: 4.9, popularity: 96, image: 'assets/images/product1.jpg' },
    { id: 18, name: 'Baby Wipes (80 sheets)', price: 8.99, category: 'baby-care', brand: 'blackmores', rating: 4.8, popularity: 94, image: 'assets/images/product2.jpg' }
];

// Load products from localStorage or use default
function getProducts() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : products;
}

let allProducts = getProducts();
let filteredProducts = [...allProducts];

// Check if user is logged in
function checkUserAccess() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please login to access the shop');
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// Render products
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    const productCount = document.getElementById('productCount');
    const noProducts = document.getElementById('noProducts');

    if (productsToRender.length === 0) {
        grid.innerHTML = '';
        noProducts.style.display = 'block';
        productCount.textContent = '0';
        return;
    }

    noProducts.style.display = 'none';
    productCount.textContent = productsToRender.length;

    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/product1.jpg'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.category.replace('-', ' ')}</p>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.rating})</span>
                </div>
                <div class="product-footer">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate star ratings
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Add to cart function
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Visual feedback
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        button.style.background = '#00cc66';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Filter and sort products
function filterAndSortProducts() {
    let result = [...allProducts];

    // Search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        result = result.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    const categoryCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"][value]:not([value="all"])');
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    if (selectedCategories.length > 0) {
        result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Brand filter
    const brandCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"][value^="nature-"], .filter-options input[type="checkbox"][value^="centrum"], .filter-options input[type="checkbox"][value^="blackmores"], .filter-options input[type="checkbox"][value^="nordic-"]');
    const selectedBrands = Array.from(brandCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    if (selectedBrands.length > 0) {
        result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Price filter
    const maxPrice = parseFloat(document.getElementById('priceRange').value);
    result = result.filter(p => p.price <= maxPrice);

    // Sort
    const sortBy = document.getElementById('sortBy').value;
    switch(sortBy) {
        case 'price-low':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-za':
            result.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'popularity':
            result.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
    }

    filteredProducts = result;
    renderProducts(filteredProducts);
}

// Initialize shop page
document.addEventListener('DOMContentLoaded', function() {
    // Check user access
    const user = checkUserAccess();
    if (!user) return;

    // Initial render
    renderProducts(filteredProducts);
    updateCartCount();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filterAndSortProducts);

    // Category and brand filters
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'all') {
                checkboxes.forEach(cb => {
                    if (cb.value !== 'all') cb.checked = false;
                });
            } else {
                const allCheckbox = document.querySelector('input[value="all"]');
                if (allCheckbox) allCheckbox.checked = false;
            }
            filterAndSortProducts();
        });
    });

    // Price range
    const priceRange = document.getElementById('priceRange');
    const maxPriceLabel = document.getElementById('maxPrice');
    priceRange.addEventListener('input', function() {
        maxPriceLabel.textContent = `$${this.value}`;
        filterAndSortProducts();
    });

    // Sort dropdown
    const sortBy = document.getElementById('sortBy');
    sortBy.addEventListener('change', filterAndSortProducts);

    // Clear filters
    const clearFiltersBtn = document.querySelector('.clear-filters');
    clearFiltersBtn.addEventListener('click', function() {
        searchInput.value = '';
        checkboxes.forEach(cb => {
            cb.checked = cb.value === 'all';
        });
        priceRange.value = 100;
        maxPriceLabel.textContent = '$100';
        sortBy.value = 'default';
        filterAndSortProducts();
    });
});
