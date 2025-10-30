// Seller Dashboard JavaScript

// Sample product data
const defaultProducts = [
    { id: 1, name: 'Vitamin C 1000mg', price: 12.99, category: 'vitamins', brand: 'nature-made', rating: 4.5, popularity: 95, image: 'assets/images/product1.jpg' },
    { id: 2, name: 'Daily Multivitamin', price: 18.99, category: 'vitamins', brand: 'centrum', rating: 5.0, popularity: 98, image: 'assets/images/product2.jpg' },
    { id: 3, name: 'Omega-3 Fish Oil', price: 15.99, category: 'vitamins', brand: 'nordic-naturals', rating: 4.0, popularity: 85, image: 'assets/images/product3.jpg' },
    { id: 4, name: 'Probiotic Complex', price: 22.99, category: 'vitamins', brand: 'blackmores', rating: 4.7, popularity: 90, image: 'assets/images/product4.jpg' }
];

// Check seller access
function checkSellerAccess() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please login to access the dashboard');
        window.location.href = 'login.html';
        return null;
    }
    
    const user = JSON.parse(currentUser);
    if (user.role !== 'seller' && user.role !== 'admin') {
        alert('Access denied. This page is only for sellers.');
        window.location.href = 'index.html';
        return null;
    }
    
    return user;
}

// Get products from localStorage
function getProducts() {
    const products = localStorage.getItem('products');
    if (!products) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(products);
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Render products table
function renderProductsTable(products) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-box-open" style="font-size: 3rem; color: #ccc;"></i>
                    <p style="margin-top: 1rem; color: #999;">No products found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category.replace('-', ' ')}</td>
            <td>${product.brand.replace('-', ' ')}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.rating} ⭐</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Update dashboard stats
function updateStats(products) {
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = Math.floor(Math.random() * 50) + 20;
    const revenue = products.reduce((sum, p) => sum + p.price * (Math.random() * 10), 0);
    document.getElementById('totalRevenue').textContent = `$${revenue.toFixed(2)}`;
}

// Open add product modal
function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').classList.add('active');
}

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Edit product
function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    if (product) {
        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productRating').value = product.rating;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productPopularity').value = product.popularity;
        document.getElementById('productModal').classList.add('active');
    }
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderProductsTable(products);
        updateStats(products);
        alert('Product deleted successfully!');
    }
}

// Save product (Add or Edit)
function saveProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('productId').value;
    const product = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        rating: parseFloat(document.getElementById('productRating').value),
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value,
        image: document.getElementById('productImage').value || 'assets/images/product1.jpg',
        popularity: parseInt(document.getElementById('productPopularity').value)
    };
    
    let products = getProducts();
    
    if (id) {
        // Edit existing product
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = product;
            alert('Product updated successfully!');
        }
    } else {
        // Add new product
        products.push(product);
        alert('Product added successfully!');
    }
    
    saveProducts(products);
    renderProductsTable(products);
    updateStats(products);
    closeProductModal();
}

// Search products
function searchProducts(query) {
    const products = getProducts();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
    );
    renderProductsTable(filtered);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check access
    const user = checkSellerAccess();
    if (!user) return;

    console.log(`%c=== Seller Dashboard ===`, 'color: #4ecdc4; font-weight: bold; font-size: 14px');
    console.log(`Welcome, ${user.name}!`);

    // Load products
    const products = getProducts();
    renderProductsTable(products);
    updateStats(products);

    // Product form submission
    document.getElementById('productForm').addEventListener('submit', saveProduct);

    // Search functionality
    const searchInput = document.getElementById('searchProducts');
    searchInput.addEventListener('input', (e) => searchProducts(e.target.value));

    // Close modal when clicking outside
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeProductModal();
        }
    });
});
