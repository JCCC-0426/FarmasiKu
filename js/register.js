// Register Page JavaScript

// Save new user to localStorage
function saveUser(fullname, email, password, role) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Add new user
    users.push({
        name: fullname,
        email: email,
        password: password, // In production, this should be hashed!
        role: role,
        registeredAt: new Date().toISOString()
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return { success: true };
}

// Toggle Password Visibility
function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);
    
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

// Register Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccepted = document.querySelector('input[name="terms"]').checked;
            
            // Validation
            if (!fullname || !email || !role || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Password strength validation
            if (password.length < 8) {
                alert('Password must be at least 8 characters long');
                return;
            }
            
            // Password match validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Terms acceptance
            if (!termsAccepted) {
                alert('Please accept the Terms & Conditions');
                return;
            }
            
            // Simulate registration (replace with actual API call)
            const registerBtn = this.querySelector('.login-btn');
            const originalText = registerBtn.innerHTML;
            registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            registerBtn.disabled = true;
            
            // Save user
            const saveResult = saveUser(fullname, email, password, role);
            
            // Simulate API call
            setTimeout(() => {
                if (saveResult.success) {
                    // Success
                    const roleText = role.charAt(0).toUpperCase() + role.slice(1);
                    alert(`Account created successfully! Welcome, ${fullname}!\n\nRole: ${roleText}\nEmail: ${email}\n\nYou can now login with your credentials.`);
                    
                    // Store current user info
                    localStorage.setItem('currentUser', JSON.stringify({
                        email: email,
                        name: fullname,
                        role: role,
                        loginTime: new Date().toISOString()
                    }));
                    
                    // Redirect based on role
                    if (role === 'seller' || role === 'admin') {
                        window.location.href = 'seller-dashboard.html';
                    } else {
                        window.location.href = 'shop.html';
                    }
                } else {
                    // Failed registration
                    alert(saveResult.message);
                    registerBtn.innerHTML = originalText;
                    registerBtn.disabled = false;
                }
            }, 1000);
        });
    }
    
    // Social signup buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google signup will be implemented here');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            alert('Facebook signup will be implemented here');
        });
    }
    
    // Real-time password strength indicator (optional enhancement)
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;
            
            // You can add visual feedback here
            console.log('Password strength:', strength);
        });
    }
});
