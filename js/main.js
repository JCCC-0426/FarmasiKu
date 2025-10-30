// Main JavaScript for FarmasiKu

// Cart functionality
let cart = [];

// Check if user is logged in
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        console.log(`Logged in as: ${user.name} (${user.role})`);
        
        // Update user icon to show logged in status
        const userIcon = document.querySelector('.nav-icons a[href="login.html"]');
        if (userIcon) {
            userIcon.innerHTML = `<i class="fas fa-user-circle"></i>`;
            userIcon.title = `${user.name} (${user.role})`;
        }
        
        return user;
    }
    return null;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberUser');
        alert('You have been logged out successfully!');
        window.location.reload();
    }
}

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    
    // Check login status
    const user = checkLoginStatus();
    
    // Display user info in console
    if (user) {
        const roleColors = {
            admin: '#ff6b6b',
            seller: '#4ecdc4',
            user: '#45b7d1'
        };
        console.log('%c=== User Information ===', 'color: #0066cc; font-weight: bold; font-size: 14px');
        console.log(`%cName: ${user.name}`, 'font-size: 12px');
        console.log(`%cEmail: ${user.email}`, 'font-size: 12px');
        console.log(`%cRole: ${user.role.toUpperCase()}`, `color: ${roleColors[user.role] || '#333'}; font-weight: bold; font-size: 12px`);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Check if user is logged in
            if (!user) {
                alert('Please login to add items to cart');
                window.location.href = 'login.html';
                return;
            }
            
            // Add animation
            this.innerHTML = '<i class="fas fa-check"></i> Added';
            this.style.background = '#00cc66';
            
            // Update cart count
            cart.push({});
            cartCount.textContent = cart.length;

            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.style.background = '';
            }, 2000);
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            alert(`Thank you for subscribing! Confirmation sent to ${email}`);
            this.reset();
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add logout option for logged in users
    if (user) {
        const userIcon = document.querySelector('.nav-icons a[href="login.html"]');
        if (userIcon) {
            userIcon.addEventListener('click', function(e) {
                e.preventDefault();
                const choice = confirm(`Logged in as: ${user.name} (${user.role})\n\nDo you want to logout?`);
                if (choice) {
                    logout();
                }
            });
        }
    }
});