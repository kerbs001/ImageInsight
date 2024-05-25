document.getElementById('registrationForm').addEventListener('submit', function(event) {
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var usernameError = document.getElementById('usernameError');
    var emailError = document.getElementById('emailError');
    var passwordError = document.getElementById('passwordError');
    var confirmPasswordError = document.getElementById('confirmPasswordError');
    var isValid = true;

    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';

    if (username.length < 4) {
        usernameError.textContent = 'Username must be at least 4 characters';
        isValid = false;
    }

    if (!email.includes('@')) {
        emailError.textContent = 'Invalid email address';
        isValid = false;
    }

    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        isValid = false;
    }

    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }
});