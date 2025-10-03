// Global variables
let currentUser = null;
let registeredUsers = [];

// Initialize with some test users
registeredUsers.push(
{
    name: "Test",
    email: "test@gmail.com",
    password: "12345678",
    registrationDate: new Date().toLocaleDateString('id-ID')
});

// Page navigation function
function showpage(pageID)
{
    // If we're trying to navigate to a page that doesn't exist in this context
    // redirect to dashboard.html
    if (pageID === 'login' || pageID === 'home' || pageID === 'profile')
    {
        window.location.href = 'dashboard.html';
        return;
    }
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageID);
    if (targetPage)
    {
        targetPage.classList.add('active');
    }
}

// Logout function
function logout()
{
    currentUser = null;
    updateNavi();
    showpage('home');
    alert('Anda berhasil logout');
}

// Validation functions
function validateEmail(email)
{
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateName(name)
{
    const re = /^[a-zA-Z\s]{3,32}$/;
    return re.test(name);
}

// Find user by email
function findUserByEmail(email)
{
    return registeredUsers.find(user => user.email === email);
}

// Clear error and success messages
function clearError()
{
    const errorElements = document.querySelectorAll('.error');
    const successElements = document.querySelectorAll('.success');
    errorElements.forEach(element => element.textContent = '');
    successElements.forEach(element => element.textContent = '');
}

// Update navigation (placeholder for consistency)
function updateNavi()
{
    // This function exists for compatibility but doesn't do much in signup page
    console.log('Navigation updated');
}

// Main signup form handler
document.addEventListener('DOMContentLoaded', function()
{
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm)
    {
        signupForm.addEventListener('submit', function(e)
        {
            e.preventDefault();
            clearError();

            const email = document.getElementById('signupEmail').value.trim();
            const pass = document.getElementById('signupPass').value;
            const confpass = document.getElementById('confirmPass').value;
            const name = document.getElementById('fullName').value.trim();

            let isValid = true;

            // Name validation
            if (!name)
            {
                document.getElementById('fullNameError').textContent = 'Nama harus diisi!';
                isValid = false;
            }
            else if (!validateName(name))
            {
                document.getElementById('fullNameError').textContent = 'Format nama Anda salah! Nama terdiri atas 3-32 karakter tanpa angka';
                isValid = false;
            }

            // Email validation
            if (!email)
            {
                document.getElementById('signupEmailError').textContent = 'Email harus diisi!';
                isValid = false;
            }
            else if (!validateEmail(email))
            {
                document.getElementById('signupEmailError').textContent = 'Format email Anda tidak valid!';
                isValid = false;
            }
            else if (findUserByEmail(email))
            {
                document.getElementById('signupEmailError').textContent = 'Email sudah terdaftar!';
                isValid = false;
            }

            // Password validation
            if (!pass)
            {
                document.getElementById('signupPassError').textContent = 'Password harus diisi!';
                isValid = false;
            }
            else if (pass.length < 8) 
            {
                document.getElementById('signupPassError').textContent = 'Password minimal 8 karakter!';
                isValid = false;
            }

            // Confirm password validation
            if (!confpass)
            {
                document.getElementById('confirmPassError').textContent = 'Konfirmasi password harus diisi!';
                isValid = false;
            }
            else if (pass !== confpass)
            {
                document.getElementById('confirmPassError').textContent = 'Konfirmasi Password tidak sesuai dengan Password!';
                isValid = false;
            }

            // If all validations pass
            if (isValid)
            {
                const newUser =
                {
                    email: email,
                    password: pass,
                    name: name,
                    registrationDate: new Date().toLocaleDateString('id-ID')
                };
                
                // Add user to registered users array
                registeredUsers.push(newUser);
                
                // Store in localStorage for persistence across pages
                try
                {
                    const existingUsers = JSON.parse(localStorage.getItem('fomaUsers')) || [];
                    existingUsers.push(newUser);
                    localStorage.setItem('fomaUsers', JSON.stringify(existingUsers));
                }
                catch (error)
                {
                    console.log('LocalStorage not available, using memory storage only');
                }
                
                // Success message
                alert('Pendaftaran akun berhasil!');
                
                // Clear form
                document.getElementById('signupForm').reset();
                clearError();
                
                // Redirect to login page after short delay
                setTimeout(() =>
                {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }

    // Load existing users from localStorage if available
    try
    {
        const existingUsers = JSON.parse(localStorage.getItem('fomaUsers')) || [];
        registeredUsers = [...registeredUsers, ...existingUsers];
    }
    catch (error)
    {
        console.log('LocalStorage not available, using default users only');
    }
});

// Utility function to go back to dashboard
function goToDashboard() 
{
    window.location.href = 'dashboard.html';
}

// Console helper for development
console.log('Signup page loaded successfully!');
console.log('Available functions: goToDashboard()');

// Export functions for use in other files (if needed)
if (typeof module !== 'undefined' && module.exports)
{
    module.exports =
    {
        validateEmail,
        validateName,
        findUserByEmail,
        registeredUsers
    };
}