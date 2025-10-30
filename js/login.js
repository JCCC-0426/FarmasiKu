// Login Page JavaScript

// Demo Accounts (for testing purposes)
const demoAccounts = [
    {
        email: 'admin@farmasiku.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
    },
    {
        email: 'seller@farmasiku.com',
        password: 'seller123',
        name: 'Seller User',
        role: 'seller'
    },
    {
        email: 'user@farmasiku.com',
        password: 'user123',
        name: 'Customer User',
        role: 'user'
    }
];

// Get registered users from localStorage
function getRegisteredUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}

// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Verify login credentials
function verifyLogin(email, password) {
    // Check demo accounts
    const demoUser = demoAccounts.find(account => 
        account.email === email && account.password === password
    );
    
    if (demoUser) {
        return { success: true, user: demoUser };
    }
    
    // Check registered users
    const registeredUsers = getRegisteredUsers();
    const registeredUser = registeredUsers.find(user => 
        user.email === email && user.password === password
    );
    
    if (registeredUser) {
        return { success: true, user: registeredUser };
    }
    
    return { success: false };
}

// Login Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Display demo account info
    console.log('=== Demo Accounts for Testing ===');
    console.log('ADMIN - Email: admin@farmasiku.com | Password: admin123');
    console.log('SELLER - Email: seller@farmasiku.com | Password: seller123');
    console.log('USER - Email: user@farmasiku.com | Password: user123');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;
            
            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Show loading state
            const loginBtn = this.querySelector('.login-btn');
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            loginBtn.disabled = true;
            
            // Verify credentials
            setTimeout(() => {
                const loginResult = verifyLogin(email, password);
                
                if (loginResult.success) {
                    // Success
                    const userRole = loginResult.user.role || 'user';
                    const roleText = userRole.charAt(0).toUpperCase() + userRole.slice(1);
                    alert(`Welcome back, ${loginResult.user.name}!\nRole: ${roleText}`);
                    
                    // Store user info (in a real app, use proper authentication)
                    localStorage.setItem('currentUser', JSON.stringify({
                        email: loginResult.user.email,
                        name: loginResult.user.name,
                        role: userRole,
                        loginTime: new Date().toISOString()
                    }));
                    
                    if (remember) {
                        localStorage.setItem('rememberUser', email);
                    } else {
                        localStorage.removeItem('rememberUser');
                    }
                    
                    // Redirect based on user role
                    if (userRole === 'seller' || userRole === 'admin') {
                        window.location.href = 'seller-dashboard.html';
                    } else {
                        window.location.href = 'shop.html';
                    }
                } else {
                    // Failed login
                    alert('Invalid email or password. Please try again.\n\nDemo Accounts:\nAdmin: admin@farmasiku.com / admin123\nSeller: seller@farmasiku.com / seller123\nUser: user@farmasiku.com / user123');
                    loginBtn.innerHTML = originalText;
                    loginBtn.disabled = false;
                }
            }, 1000);
        });
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google login will be implemented here');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            alert('Facebook login will be implemented here');
        });
    }
    
    // Auto-fill email if "remember me" was checked
    const rememberedEmail = localStorage.getItem('rememberUser');
    if (rememberedEmail && loginForm) {
        document.getElementById('email').value = rememberedEmail;
        document.querySelector('input[name="remember"]').checked = true;
    }
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        console.log('User already logged in:', user.name, '-', user.email);
    }
});
