document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;
    let registeredUsers = [];

    // fungsi untuk load account profile
    function initializeProfilePage() {
        loadDataFromStorage();
        if (!currentUser) {
            // If no one is logged in, redirect to the main page to log in.
            alert('You must be logged in to view this page.');
            window.location.href = 'dashboard.html';
            return;
        }
        updateNavi();
        displayUserInfo();
        setupEventListeners();
    }

    // load data usernya
    function loadDataFromStorage() {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('fomaUsers')) || [];
            registeredUsers = storedUsers;
            
            const loggedInUser = localStorage.getItem('currentUser');
            if (loggedInUser) {
                currentUser = JSON.parse(loggedInUser);
            }
        } catch (error) {
            console.error('Could not load data from localStorage:', error);
        }
    }
    // fungsi untuk  load history
    function loadHistoryContent() {
        // Sembunyikan setiap bagian profil satu per satu berdasarkan kelasnya
        document.querySelector('.section-header').style.display = 'none';
        document.querySelector('.profile-details-card').style.display = 'none';
        document.querySelector('.account-actions-card').style.display = 'none';

        // Cari dan tampilkan iframe
        const frame = document.getElementById('historyFrame');
        frame.src = 'history.html'; // Pastikan path/nama file ini benar
        frame.style.display = 'block';
    }

    // Tambahkan event listener untuk tautan history
    const historyLink = document.getElementById('historyLink');
    if (historyLink) {
        historyLink.addEventListener('click', function(event) {
            event.preventDefault();
            loadHistoryContent();
        });
    }
    // 
    function saveUsersToStorage() {
        try {
            localStorage.setItem('fomaUsers', JSON.stringify(registeredUsers));
        } catch (error) {
            console.error('Could not save users to localStorage:', error);
        }
    }

    // --- UI Updates ---
    function displayUserInfo() {
        if (currentUser) {
            document.getElementById('profileName').textContent = currentUser.name;
            document.getElementById('profileEmail').textContent = currentUser.email;
            document.getElementById('profileRegDate').textContent = currentUser.registrationDate || 'Not available';
        }
    }

    function updateNavi() {
        const loginLink = document.getElementById('loginLink');
        const signupLink = document.getElementById('signupLink');
        const profileBtn = document.getElementById('profileBtn');
        const userInit = document.getElementById('userInit');
        const userName = document.getElementById('userName');

        if (currentUser) {
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';
            if (profileBtn) profileBtn.style.display = 'flex';
            
            if (userInit) userInit.textContent = currentUser.name.charAt(0).toUpperCase();
            if (userName) userName.textContent = currentUser.name.split(' ')[0];
        } else {
            // This case should be handled by the redirect, but as a fallback:
            if (loginLink) loginLink.style.display = 'inline-flex';
            if (signupLink) signupLink.style.display = 'inline-flex';
            if (profileBtn) profileBtn.style.display = 'none';
        }
    }

    // --- Event Handling ---
    function setupEventListeners() {
        const deleteBtn = document.getElementById('deleteAccountBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', handleDeleteAccount);
        }
        const backLink = document.getElementById('backToProfileLink');
        if (backLink) {
            backLink.addEventListener('click', function(event) {
                event.preventDefault(); // Mencegah link pindah halaman
                
                // Lakukan kebalikannya: tampilkan profil, sembunyikan riwayat
                document.getElementById('profile-info').style.display = 'block';
                document.getElementById('historyContent').style.display = 'none';
            });
        }
    }

    function handleDeleteAccount() {
        if (!currentUser) return;

        const isConfirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
        
        if (isConfirmed) {
            // Filter out the current user from the registered users list
            registeredUsers = registeredUsers.filter(user => user.email !== currentUser.email);
            
            // Save the updated user list
            saveUsersToStorage();
            
            // Log the user out by clearing currentUser from localStorage
            localStorage.removeItem('currentUser');
            
            alert('Your account has been successfully deleted.');
            
            // Redirect to the homepage
            window.location.href = 'dashboard.html';
        }
    }

    // --- Navigation Functions (for header to work) ---
    window.logout = function() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        alert('You have been logged out.');
        window.location.href = 'dashboard.html';
    }

    window.dropdown = function() {
        const dropdownEl = document.getElementById('dropdown');
        if (dropdownEl) {
            dropdownEl.classList.toggle('show');
            
            document.addEventListener('click', function closeOnClickOutside(e) {
                if (!e.target.closest('.profile-btn')) {
                    const dropdownEl = document.getElementById('dropdown');
                    if (dropdownEl) dropdownEl.classList.remove('show');
                    document.removeEventListener('click', closeOnClickOutside);
                }
            });
        }
    }
    // --- Start the application ---
    initializeProfilePage();
});
