document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            
            // Reset error messages
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            
            // Simple validation
            let isValid = true;
            
            // Email validation
            if (!email || !validateEmail(email)) {
                emailError.style.display = 'block';
                isValid = false;
            }
            
            // Password validation (just checking if it's not empty)
            if (!password) {
                passwordError.style.display = 'block';
                isValid = false;
            }
            
            // If valid, you would typically send the data to a server
            if (isValid) {
                // Simulate login process
                alert('Login berhasil!');
                // Here you would typically redirect to the forum page
                // window.location.href = 'forum.html';
            }
        });
        
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }