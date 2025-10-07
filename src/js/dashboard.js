// Global variables
let currentUser = null;
let registeredUsers = [];
let posts = [];
// Data 
const allContent =
[
    { id: 1, type: 'thread', title: 'Internship vacancies in tech companies', category: 'Career Info', author: 'Ahmad Rahman', description: 'Some of the latest internship vacancies for IT students, suitable for beginners.' },
    { id: 2, type: 'thread', title: 'Recommended hangout spots in Jakarta', category: 'Hobbies & Entertainment', author: 'Sarah Kim', description: 'A list of cafes with fast Wi-Fi and a comfortable atmosphere for work or just relaxing.' },
    { id: 3, type: 'thread', title: 'Effective study tips for semester exams', category: 'Academics', author: 'David Chen', description: 'Study methods proven to increase grades and reduce stress.' },
    { id: 4, type: 'thread', title: 'How to make a simple robot from recycled materials', category: 'Hobbies & Entertainment', author: 'Tech Mentor', description: 'A step-by-step guide for a DIY robotics project.' },
    { id: 5, type: 'thread', title: 'Scholarships abroad in 2025', category: 'Career Info', author: 'Code Guru', description: 'Complete information about fully-funded scholarships in various countries.' },
    { id: 6, type: 'thread', title: 'Q&A forum about final projects', category: 'Academics', author: 'Student Helper', description: 'A discussion space to help students complete their theses.' },
    { id: 7, type: 'thread', title: 'JavaScript vs Python: Which should beginners learn first?', category: 'Programming', author: 'Tech Mentor', description: 'A deep dive into the pros and cons of each language for newcomers.' }
];

// Initialize and load data on page load
document.addEventListener('DOMContentLoaded', function()
{
    initializeApp();
    setupEventListeners();
});

// Initialize the application
function initializeApp()
{
    loadUsersFromStorage();
    loadPostsFromStorage();

    // DELETE THIS LATER AFTER LOGIN IS INTEGRATED
    if (!currentUser && registeredUsers.length > 0) {
        // Set the current user to the first registered user, but only if they are not the admin
        const defaultUser = registeredUsers.find(u => u.role === 'user');
        if (defaultUser) {
            currentUser = defaultUser; 
            saveToStorage(); 
        }
    }


    // DELETE THIS LATER AFTER LOGIN IS INTEGRATED
    if (!currentUser && registeredUsers.length > 0) {
        currentUser = registeredUsers[0]; // Set the current user to the first registered user.
        saveToStorage(); // Save this login state to localStorage.
    }

    updateNavi();
    showpage('home');
    console.log('Dashboard loaded successfully!');
}

// Load users from localStorage or initialize with test data
function loadUsersFromStorage()
{
    try
    {
        let storedUsers = JSON.parse(localStorage.getItem('fomaUsers')) || [];
        
        // Ensure all users have a 'role' property (migration/safety check)
        registeredUsers = storedUsers.map(user => ({
            ...user,
            role: user.role || (user.email === 'admin@foma.com' ? 'admin' : 'user')
        }));
        
        if (registeredUsers.length === 0 || !registeredUsers.some(u => u.role === 'admin'))
        {
            // Standard Test User
            registeredUsers.push(
            {
                name: "Test User",
                email: "test@gmail.com",
                password: "12345678",
                registrationDate: new Date().toLocaleDateString('id-ID'),
                role: "user" 
            });
            // Admin User for testing (Use admin@foma.com/adminpassword to test)
            registeredUsers.push( 
            {
                name: "Admin",
                email: "admin@gmail.com", 
                password: "71757678188",
                registrationDate: new Date().toLocaleDateString('id-ID'),
                role: "admin" 
            });
        }
        
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser)
        {
            currentUser = JSON.parse(loggedInUser);
        }
    } 
    catch (error)
    {
        console.log('LocalStorage not available, using memory storage only');
        // Fallback for Standard Test User in memory if storage fails
        registeredUsers.push(
        {
            name: "Test User",
            email: "test@gmail.com",
            password: "12345678",
            registrationDate: new Date().toLocaleDateString('id-ID'),
            role: "user"
        });
        // Fallback for Admin User in memory if storage fails
        registeredUsers.push( 
        {
            name: "Admin",
            email: "admin@gmail.com", 
            password: "71757678188",
            registrationDate: new Date().toLocaleDateString('id-ID'),
            role: "admin"
        });
    }
}

// Load posts from localStorage
function loadPostsFromStorage()
{
    try
    {
        const storedPosts = JSON.parse(localStorage.getItem('fomaPosts')) || [];
        posts = storedPosts;
    }
    catch (error)
    {
        console.log('Could not load posts from storage');
        posts = [];
    }
}

// Save data to localStorage
function saveToStorage()
{
    try
    {
        localStorage.setItem('fomaUsers', JSON.stringify(registeredUsers));
        localStorage.setItem('fomaPosts', JSON.stringify(posts));
        if (currentUser)
        {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        else
        {
            localStorage.removeItem('currentUser');
        }
    } 
    catch (error)
    {
        console.log('Could not save to localStorage');
    }
}

// Setup all event listeners
function setupEventListeners()
{
    const postForm = document.getElementById('postForm');
    if (postForm)
    {
        postForm.addEventListener('submit', handlePostSubmit);
    }

    // New search event listeners
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event)
        {
            if (event.key === 'Enter')
            {
                handleSearch(event);
            }
        });
    }

    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon)
    {
        searchIcon.addEventListener('click', handleSearch);
    }
}

// Page navigation function
function showpage(pageID)
{
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => item.classList.remove('active'));
    
    const activeSidebarItem = document.querySelector(`.sidebar-item[onclick*="'${pageID}'"]`);
    if (activeSidebarItem)
    {
        activeSidebarItem.classList.add('active');
    }

    closeDropdown();
    loadPageContent(pageID);
}

// Load different page content dynamically
function loadPageContent(pageID)
{
    const pageTitle = document.getElementById('pageTitle');
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostSection = document.getElementById('createPostSection');
    
    // Always unload external assets before loading new content
    unloadExternalAssets(); 

    // Hide create post by default for new pages
    if (createPostSection) createPostSection.style.display = 'none';
    if (createPostBtn) createPostBtn.style.display = 'none';

    switch(pageID)
    {
        case 'home':
            pageTitle.textContent = 'Latest Discussions';
            loadPostsContent(); // This calls loadExternalContent for threads.html
            break;
            
        case 'community':
            pageTitle.textContent = 'Communities';
            loadCommunityContent();
            break;

        case 'profile':
            pageTitle.textContent = 'User Profile';
            loadProfileContent();
            break;            
            
        case 'programming':
        case 'general':
            pageTitle.textContent = pageID.charAt(0).toUpperCase() + pageID.slice(1) + ' Discussions';
            updateCreatePostVisibility();
            loadCategoryContent(pageID);
            break;
            
        case 'login':
            pageTitle.textContent = 'Login to Your Account';
            loadLoginContent();
            break;
            
        case 'signup':
            pageTitle.textContent = 'Sign Up to Your Account';
            loadSignupContent();
            break;

        case 'community':
            pageTitle.textContent = 'Explore Communities';
            createPostBtn.style.display = 'none';
            loadCommunityContent();
            break;

        default:
            pageTitle.textContent = 'Latest Discussions';
            updateCreatePostVisibility();
            loadPostsContent();
    }
}

function loadExternalContent(filePath, selector, cssPath = null, jsPath = null)
{
    const mainContentArea = document.getElementById('mainContentArea');
    
    // 1. Determine base name and default paths
    const fileName = filePath.split('/').pop();
    const baseName = fileName.replace('.html', '');

    const finalCssPath = cssPath || `../src/css/${baseName}.css`; 
    const finalJsPath = jsPath || `../src/js/${baseName}.js`; 
    
    // Ensure all previous external assets are unloaded
    unloadExternalAssets(); 

    return fetch(filePath)
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
            const content = doc.querySelector(selector);
            
            if (content)
            {
                // 2. Insert the HTML content first
                mainContentArea.innerHTML = content.innerHTML;
                
                // 3. Load the specific CSS (scoped to main content)
                if (finalCssPath) loadCSS(finalCssPath);

                // 4. Load the specific JavaScript (after DOM insertion)
                if (finalJsPath) loadJS(finalJsPath);
                
                // 5. Re-attach general event listeners after DOM insertion
                setupEventListeners(); 
                
                return true;
            }
            else
            {
                throw new Error(`Content selector (${selector}) not found in ${fileName}`);
            }
        })
        .catch(error =>
        {
            console.error(`Error loading ${filePath}:`, error);
            mainContentArea.innerHTML = 
                `<div class="placeholder-section error-section">
                    <h3>Unable to load this content right now</h3>
                </div>`;
            return false;
        });
}

// Load threads.html
function loadPostsContent()
{
    loadExternalContent('threads.html', '.thread-list-container', '../src/css/threads-style.css', '../src/js/script.js')
        .then(success =>
        {
            if (success)
            {
                console.log('Threads content and script.js loaded. Thread logic is now handled by script.js.');
            }
        }
    );
}

function loadProfileContent()
{
    loadExternalContent('userprofile.html', '.container', '../src/css/userprofile.css', '../src/js/userprofile.js')
        .then(success =>
        {
            if (success)
            {
                console.log('Profile content and userprofile.js loaded. Profile logic is now handled by userprofile.js.');
            }
        }
    );
}

function loadStudentEventsWidget()
{
    loadExternalSidebarContent('Index(Student).html', 'eventsListContainer', '.events-list-container', '../src/css/Style(Student).css', '../src/js/Script(Student).js')
        .then(success =>
        {
            if (success)
            {
                console.log('Event content and Script(Student).js loaded. Event logic is now handled by Script(Student).js.');
            }
        }
    );
}

// Load login.html and login.js
function loadLoginContent()
{
    loadExternalContent('Index(Login).html', '.login-container', '../src/css/Style(Login).css', '../src/js/Script(Login).js')
        .then(success =>
        {
            if (success)
            {
                console.log('Login content and login.js loaded. Login logic is now handled by login.js.');
            }
        }
    );
}

// Load Signup.html and signup.js
function loadSignupContent()
{
    loadExternalContent('signup.html', '.auth-container', '../src/css/signup.css', '../src/js/signup.js')
        .then(success =>
        {
            if (success)
            {
                console.log('Signup content and signup.js loaded. Signup logic is now handled by signup.js.');
            }
        }
    );
}

function loadSearchPage(searchTerm)
{
    const createPostBtn = document.getElementById('createPostBtn');
    if (createPostBtn) createPostBtn.style.display = 'none';

    // Load the external HTML, CSS, and JS using the friend's search files
    loadExternalContent('searchPage.html', '.search-container', '../src/css/searchstyle.css', '../src/js/search.js')
        .then(success =>
        {
            if (success)
            {
                // Update the page header
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle) pageTitle.textContent = `Search Results for: "${searchTerm}"`;
                
                // IMPORTANT: Call a function in the newly loaded search.js script to render results
                if (window.renderSearchResults)
                {
                    window.renderSearchResults(searchTerm, posts, allContent);
                }
                else
                {
                    console.warn('search.js did not expose a global renderSearchResults function. Search results will not be displayed automatically.');
                }
            }
        });
}

// Load Community.html
function loadCommunityContent() {
    const mainContentArea = document.getElementById('mainContentArea');
    const communityStylesheet = document.createElement('link');

    communityStylesheet.id = 'community-styles'; // Unique ID to find it later
    communityStylesheet.rel = 'stylesheet';
    communityStylesheet.href = '../src/css/community.css'; // Make sure this path is correct
    document.head.appendChild(communityStylesheet);

    fetch('community.html') 
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            mainContentArea.innerHTML = html;
            // Assuming initializeCommunityPage is a function defined elsewhere or in the dashboard.js file
            if (typeof initializeCommunityPage === 'function') {
                initializeCommunityPage(); 
            } else {
                console.warn('initializeCommunityPage function not found.');
            }
        })
        .catch(error => {
            console.error('Error loading community page:', error);
            mainContentArea.innerHTML = 
                `<div class="placeholder-section error-section">
                    <h3>Unable to load this content right now</h3>
                </div>`;
            return false;
        });
}

// Dropdown profile
function dropdown()
{
    const dropdownEl = document.getElementById('dropdown');
    if (dropdownEl)
    {
        dropdownEl.classList.toggle('show');
        
        document.addEventListener('click', function closeOnClickOutside(e)
        {
            if (!e.target.closest('.profile-btn'))
            {
                closeDropdown();
                document.removeEventListener('click', closeOnClickOutside);
            }
        });
    }
}

function closeDropdown()
{
    const dropdownEl = document.getElementById('dropdown');
    if (dropdownEl)
    {
        dropdownEl.classList.remove('show');
    }
}

// Update navigation based on login status
function updateNavi()
{
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const profileBtn = document.getElementById('profileBtn');
    const userInit = document.getElementById('userInit');
    const userName = document.getElementById('userName');

    if (currentUser)
    {
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'flex';
        
        if (userInit) userInit.textContent = currentUser.name.charAt(0).toUpperCase();
        if (userName) userName.textContent = currentUser.name.split(' ')[0];
    }
    else
    {
        if (loginLink) loginLink.style.display = 'inline-flex';
        if (signupLink) signupLink.style.display = 'inline-flex';
        if (profileBtn) profileBtn.style.display = 'none';
    }
}

// Toggle categories
function toggleCategories()
{
    const categoryList = document.getElementById('categoryList');
    if (categoryList)
    {
        if (categoryList.style.display === 'none' || !categoryList.style.display)
        {
            categoryList.style.display = 'block';
        }
        else
        {
            categoryList.style.display = 'none';
        }
    }
}

// Handle search functionality
function handleSearch(e)
{
    e.preventDefault(); // Mencegah form mengirim data secara default
    
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm)
    {
        loadSearchPage(searchTerm); 
    }
    return false;
}

// Logout function
function logout()
{
    currentUser = null;
    saveToStorage();
    updateNavi();
    showpage('home');
    closeDropdown();
    alert('Anda berhasil logout');
}

// Login function
function login(email, password)
{
    const user = findUserByEmail(email);
    if (user && user.password === password)
    {
        currentUser = user;
        saveToStorage();
        updateNavi();
        
        // **UPDATED: Redirect Admin immediately to their separate HTML file**
        if (currentUser.role === 'admin') {
            // Note: The path below assumes Index(Admin).html is at the same level as dashboard.html
            window.location.href = 'Index(Admin).html'; 
            return true;
        }

        return true;
    }
    return false;
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

// Handle signup form submission
function handleSignup(e)
{
    e.preventDefault();
    clearError();

    const email = document.getElementById('signupEmail')?.value.trim();
    const pass = document.getElementById('signupPass')?.value;
    const confpass = document.getElementById('confirmPass')?.value;
    const name = document.getElementById('fullName')?.value.trim();

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
            registrationDate: new Date().toLocaleDateString('id-ID'),
            role: "user" // New registered users are standard users
        };
        
        registeredUsers.push(newUser);
        saveToStorage();
        
        alert('Pendaftaran akun berhasil! Silakan login.');
        showpage('login');
    }
}

// Utility function to get relative time
function getRelativeTime(date)
{
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
}

// Test login function for development
function testLogin()
{
    if (registeredUsers.length > 0)
    {
        // Try to get a standard user first
        let userToLogin = registeredUsers.find(u => u.role === 'user'); 
        if (!userToLogin)
        {
            // Fallback to admin if no user (e.g., if you only have the test admin)
            userToLogin = registeredUsers.find(u => u.role === 'admin'); 
        }
        
        if (userToLogin) {
            currentUser = userToLogin;
            saveToStorage();
            updateNavi();
            
            // **Redirect if testing admin login**
            if (currentUser.role === 'admin')
            {
                window.location.href = 'Index(Admin).html';
            }
            else
            {
                showpage('home');
            }
            alert(`Welcome back, ${currentUser.name}!`);
        }
        else
        {
            alert('No test users available');
        }
    }
    else
    {
        alert('No test users available');
    }
}

// Console helpers for development
console.log('Available functions: testLogin(), showpage(pageID), logout()');
if (registeredUsers.length > 0)
{
    console.log('Test user available - call testLogin() to test login functionality. Use email: admin@foma.com, password: adminpassword to test admin login.');
}