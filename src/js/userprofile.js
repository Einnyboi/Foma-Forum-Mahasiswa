document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;
    let registeredUsers = [];

    // --- MAIN INITIALIZATION ---
    function initializeProfilePage() {
        loadDataFromStorage();
        if (!currentUser) {
            alert('You must be logged in to view this page.');
            window.location.href = 'dashboard.html';
            return;
        }
        updateNavi();
        displayUserInfo();
        setupEventListeners(); // Setup all click handlers
    }

    // --- DATA HANDLING ---
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

    function saveUsersToStorage() {
        try {
            localStorage.setItem('fomaUsers', JSON.stringify(registeredUsers));
        } catch (error) {
            console.error('Could not save users to localStorage:', error);
        }
    }

    // --- EVENT HANDLING ---
    function setupEventListeners() {
        // Handle clicking the "Delete Account" button
        const deleteBtn = document.getElementById('deleteAccountBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', handleDeleteAccount);
        }

        // Handle clicking the "Post History" link
        const historyLink = document.getElementById('historyLink');
        if (historyLink) {
            historyLink.addEventListener('click', function(event) {
                event.preventDefault();
                loadHistoryContent();
            });
        }

        // Handle clicking the "Profile Settings" link to go back
        const profileLink = document.getElementById('profileSettingsLink');
        if (profileLink) {
            profileLink.addEventListener('click', function(event) {
                event.preventDefault();
                loadProfileContent();
            });
        }
    }

    // --- CONTENT SWITCHING LOGIC ---

    // Function to show the HISTORY view
    function loadHistoryContent() {
        // Hide profile elements
        document.querySelector('.section-header').style.display = 'none';
        document.querySelector('.profile-details-card').style.display = 'none';
        document.querySelector('.account-actions-card').style.display = 'none';

        // Show history iframe
        const frame = document.getElementById('historyFrame');
        if (frame.src === '') { // Only load it once
            frame.src = 'history.html';
        }
        frame.style.display = 'block';

        // Update sidebar highlighting
        updateSidebarActiveState('historyLink');
    }

    // Function to show the PROFILE view
    function loadProfileContent() {
        // Show profile elements
        document.querySelector('.section-header').style.display = 'block';
        document.querySelector('.profile-details-card').style.display = 'block';
        document.querySelector('.account-actions-card').style.display = 'block';

        // Hide history iframe
        document.getElementById('historyFrame').style.display = 'none';

        // Update sidebar highlighting
        updateSidebarActiveState('profileSettingsLink');
    }


    // --- UI UPDATE FUNCTIONS ---

    // Helper function to manage which sidebar link is highlighted
    function updateSidebarActiveState(activeId) {
        document.getElementById('profileSettingsLink').classList.remove('active');
        document.getElementById('historyLink').classList.remove('active');
        document.getElementById(activeId).classList.add('active');
    }

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
            if (loginLink) loginLink.style.display = 'inline-flex';
            if (signupLink) signupLink.style.display = 'inline-flex';
            if (profileBtn) profileBtn.style.display = 'none';
        }
    }
    
    function handleDeleteAccount() {
        if (!currentUser) return;
        const isConfirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
        
        if (isConfirmed) {
            registeredUsers = registeredUsers.filter(user => user.email !== currentUser.email);
            saveUsersToStorage();
            localStorage.removeItem('currentUser');
            alert('Your account has been successfully deleted.');
            window.location.href = 'dashboard.html';
        }
    }

    // --- GLOBAL NAVIGATION FUNCTIONS (for header to work) ---
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

    // --- START THE APPLICATION ---
    initializeProfilePage();
});