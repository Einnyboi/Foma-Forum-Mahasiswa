// Global variables
let currentUser = null;
let registeredUsers = [];

// --- NAVIGATION FIX ---
// This function handles the "Log in here" link at the bottom of the signup page.
function showpage(pageID) {
    // FIX: Always redirect to the standalone login file
    if (pageID === 'login') {
        window.location.href = 'login.html';
        return;
    }
    // If someone calls this with 'home' or 'profile' from the signup page,
    // we assume they want to go to the main dashboard.
    window.location.href = 'dashboard.html';
}

// Validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateName(name) {
    // Allows only letters and spaces, between 3 and 32 characters
    const re = /^[a-zA-Z\s]{3,32}$/;
    return re.test(name);
}

// Helper functions
function findUserByEmail(email) {
    return registeredUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function clearError() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => element.textContent = '');
}

// --- INITIALIZATION AND FORM HANDLER ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Load existing users from Local Storage (Ensures no hardcoded users and no array merging)
    try {
        const existingUsers = JSON.parse(localStorage.getItem('fomaUsers')) || [];
        registeredUsers = existingUsers; 
    } catch (error) {
        console.error('Error loading users from LocalStorage:', error);
    }

    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault(); // <-- Prevents default form submission (CRITICAL FOR VALIDATION)
            clearError();

            const email = document.getElementById('signupEmail').value.trim();
            const pass = document.getElementById('signupPass').value;
            const confpass = document.getElementById('confirmPass').value;
            const name = document.getElementById('fullName').value.trim();

            let isValid = true; // Start with true
            
            // --- VALIDATION BLOCKS ---
            // If any check fails, isValid is set to false.
            if (!name) { 
                document.getElementById('fullNameError').textContent = 'Nama harus diisi!'; 
                isValid = false; 
            } else if (!validateName(name)) { 
                document.getElementById('fullNameError').textContent = 'Format nama Anda salah! Nama terdiri atas 3-32 karakter tanpa angka atau simbol.'; 
                isValid = false; 
            }

            if (!email) { 
                document.getElementById('signupEmailError').textContent = 'Email harus diisi!'; 
                isValid = false; 
            } else if (!validateEmail(email)) { 
                document.getElementById('signupEmailError').textContent = 'Format email Anda tidak valid!'; 
                isValid = false; 
            } else if (findUserByEmail(email)) { 
                document.getElementById('signupEmailError').textContent = 'Email sudah terdaftar!'; 
                isValid = false; 
            }

            if (!pass) { 
                document.getElementById('signupPassError').textContent = 'Password harus diisi!'; 
                isValid = false; 
            } else if (pass.length < 8) { 
                document.getElementById('signupPassError').textContent = 'Password minimal 8 karakter!'; 
                isValid = false; 
            }

            // FIX for Password Mismatch: This block guarantees isValid=false if they don't match.
            if (!confpass) { 
                document.getElementById('confirmPassError').textContent = 'Konfirmasi password harus diisi!'; 
                isValid = false; 
            } else if (pass !== confpass) { 
                document.getElementById('confirmPassError').textContent = 'Konfirmasi Password tidak sesuai dengan Password!'; 
                isValid = false; 
            }
            // --- END VALIDATION ---


            // Only run the submission/redirect code if isValid is true
            if (isValid) {
                const newUser = {
                    email: email,
                    password: pass,
                    name: name,
                    registrationDate: new Date().toLocaleDateString('id-ID'),
                    role: 'user'
                };
                
                registeredUsers.push(newUser);
                
                try {
                    localStorage.setItem('fomaUsers', JSON.stringify(registeredUsers));
                } catch (error) {
                    console.error('Error during saving to LocalStorage:', error);
                }
                
                alert('Pendaftaran akun berhasil!');
                
                document.getElementById('signupForm').reset();
                clearError();
                
                // FINAL FIX for Redirect: Go directly to the correct file
                setTimeout(() => {
                    window.location.href = 'login.html'; 
                }, 1000);
            } 
            // If isValid is false, the function simply exits here, keeping the errors visible
            // and preventing the redirect.
        });
    }
});

// Utility function to go back to dashboard
function goToDashboard() {
    window.location.href = 'dashboard.html';
}