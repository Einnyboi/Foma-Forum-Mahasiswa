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
        loadEventsWidget();
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

function loadSidebarCSS(href) 
{
    document.querySelectorAll('.external-sidebar-style').forEach(link => link.remove());
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.className = 'external-sidebar-style';
    document.head.appendChild(link);
}

// Dynamically load JS file specifically for the sidebar widget
function loadSidebarJS(src)
{
    document.querySelectorAll('.external-sidebar-script').forEach(script => script.remove());
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.className = 'external-sidebar-script';
    script.onerror = function()
    {
        console.error(`Failed to load external sidebar script: ${src}`);
    };
    document.body.appendChild(script);
}

function unloadSidebarAssets() 
{
    // Remove previous external sidebar CSS
    document.querySelectorAll('.external-sidebar-style').forEach(link => link.remove());
    
    // Remove previous external sidebar JS
    document.querySelectorAll('.external-sidebar-script').forEach(script => script.remove());
}

function loadExternalSidebarContent(targetElementId, htmlPath, contentSelector, cssPath = null, jsPath = null)
{
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return Promise.resolve(false);
    
    // Show loading state
    targetElement.innerHTML = `<div style="text-align: center; padding: 10px; font-style: italic;">Loading events...</div>`;

    return fetch(htmlPath)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html =>
        {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            // Assuming the friend's HTML has a main container we want to inject
            const content = doc.querySelector(contentSelector);
            
            if (content)
            {
                // 1. Insert the HTML content (injecting only the content INSIDE the selector)
                targetElement.innerHTML = content.innerHTML;
                
                // 2. Load the specific CSS 
                if (cssPath) loadSidebarCSS(cssPath);

                // 3. Load the specific JavaScript (after DOM insertion)
                if (jsPath) loadSidebarJS(jsPath);
                
                return true;
            }
            else
            {
                throw new Error(`Content selector (${contentSelector}) not found in ${htmlPath}. Check the class/ID in your friend's HTML.`);
            }
        })
        .catch(error =>
        {
            console.error(`Error loading sidebar content from ${htmlPath}:`, error);
            targetElement.innerHTML = 
            `
                <div style="text-align: center; color: var(--error-red); padding: 10px; font-size: 0.9rem;">
                    Failed to load events. (Check file paths and selector)
                </div>
            `;
            return false;
        });
}

function loadEventsWidget()
{
    // You may need to adjust the paths based on your actual file structure
    loadExternalSidebarContent('eventsListContainer', 'Index(Student).html', '.events-list-container', '../src/css/Style(Student).css', '../src/js/Script(Student).js');
}