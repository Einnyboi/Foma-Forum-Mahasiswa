// Global variables
let currentUser = null;
let registeredUsers = [];
let posts = [];

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
    updateNavi();
    loadPosts();
    console.log('Dashboard loaded successfully!');
}

// Load users from localStorage or initialize with test data
function loadUsersFromStorage()
{
    try 
    {
        const storedUsers = JSON.parse(localStorage.getItem('fomaUsers')) || [];
        registeredUsers = storedUsers;
        
        // Add test user if no users exist
        if (registeredUsers.length === 0)
        {
            registeredUsers.push(
            {
                name: "Test",
                email: "test@gmail.com",
                password: "12345678",
                registrationDate: new Date().toLocaleDateString('id-ID')
            });
        }
        
        // Check for logged in user
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser)
        {
            currentUser = JSON.parse(loggedInUser);
        }
    }
    catch (error)
    {
        console.log('LocalStorage not available, using memory storage only');
        // Initialize with test user
        registeredUsers.push(
        {
            name: "Test",
            email: "test@gmail.com",
            password: "12345678",
            registrationDate: new Date().toLocaleDateString('id-ID')
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
    // Post form handler
    const postForm = document.getElementById('postForm');
    if (postForm)
    {
        postForm.addEventListener('submit', handlePostSubmit);
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput)
    {
        searchInput.addEventListener('input', handleSearch);
    }

    // Login form handler (if exists on page)
    const loginForm = document.getElementById('loginForm');
    if (loginForm)
    {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form handler (if exists on page)
    const signupForm = document.getElementById('signupForm');
    if (signupForm)
    {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Page navigation function
function showpage(pageID)
{
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageID);
    if (targetPage)
    {
        targetPage.classList.add('active');
    }

    // Update sidebar active state
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => item.classList.remove('active'));
    
    // Set active sidebar item based on page
    const activeSidebarItem = document.querySelector(`.sidebar-item[onclick="showpage('${pageID}')"]`);
    if (activeSidebarItem)
    {
        activeSidebarItem.classList.add('active');
    }

    // Close dropdown if open
    closeDropdown();
    
    // Update navigation based on page
    if (pageID === 'home')
    {
        updateCreatePostVisibility();
    }
}

// Dropdown functionality
function dropdown()
{
    const dropdownEl = document.getElementById('dropdown');
    if (dropdownEl)
    {
        dropdownEl.classList.toggle('show');
        
        // Close dropdown when clicking outside
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
        // Hide login/signup, show profile
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'flex';
        
        // Set user info
        if (userInit) userInit.textContent = currentUser.name.charAt(0).toUpperCase();
        if (userName) userName.textContent = currentUser.name.split(' ')[0];
        
        updateCreatePostVisibility();
    }
    else
    {
        // Show login/signup, hide profile
        if (loginLink) loginLink.style.display = 'inline-flex';
        if (signupLink) signupLink.style.display = 'inline-flex';
        if (profileBtn) profileBtn.style.display = 'none';
        updateCreatePostVisibility();
    }
}

// Update create post button visibility
function updateCreatePostVisibility()
{
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostSection = document.getElementById('createPostSection');
    
    if (currentUser)
    {
        if (createPostBtn) createPostBtn.style.display = 'inline-flex';
    }
    else
    {
        if (createPostBtn) createPostBtn.style.display = 'none';
        if (createPostSection) createPostSection.style.display = 'none';
    }
}

// Toggle create post form
function toggleCreatePost()
{
    const createSection = document.getElementById('createPostSection');
    if (createSection)
    {
        if (createSection.style.display === 'none' || !createSection.style.display)
        {
            createSection.style.display = 'block';
        }
        else
        {
            createSection.style.display = 'none';
        }
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

// Open thread function (placeholder)
function openThread(threadId)
{
    alert(`Opening thread ${threadId} - This would navigate to the full thread view`);
}

// Load and display posts
function loadPosts()
{
    const postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) return;
    
    // Sample posts HTML
    const samplePosts =
    `
        <div class="thread-item" onclick="openThread(1)">
            <div class="category-highlight">Programming</div>
            <div class="thread-title">How to optimize database queries in Node.js?</div>
            <div class="thread-header">
                <div>
                    <div class="thread-meta">by <span class="thread-author">Ahmad Rahman</span> • 2 hours ago</div>
                </div>
                <div class="thread-stats">
                    <span>12 replies</span>
                    <span>45 views</span>
                </div>
            </div>
        </div>
        <div class="thread-item" onclick="openThread(2)">
            <div class="category-highlight">General</div>
            <div class="thread-title">Study group for calculus - anyone interested?</div>
            <div class="thread-header">
                <div>
                    <div class="thread-meta">by <span class="thread-author">Sarah Kim</span> • 4 hours ago</div>
                </div>
                <div class="thread-stats">
                    <span>8 replies</span>
                    <span>23 views</span>
                </div>
            </div>
        </div>
    `;

    // User posts HTML
    const userPostsHtml = posts.map(post =>
    `
        <div class="thread-item" onclick="openThread(${post.id})">
            <div class="category-highlight">${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</div>
            <div class="thread-title">${post.title}</div>
            <div class="thread-header">
                <div>
                    <div class="thread-meta">by <span class="thread-author">${post.author}</span> • ${post.timestamp}</div>
                </div>
                <div class="thread-stats">
                    <span>${post.replies} replies</span>
                    <span>${post.views} views</span>
                </div>
            </div>
        </div>
    `).join('');

    postsContainer.innerHTML = userPostsHtml + samplePosts;
}

// Handle post form submission
function handlePostSubmit(e)
{
    e.preventDefault();

    if (!currentUser)
    {
        alert('You must be logged in to create a post!');
        return;
    }

    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const category = document.getElementById('postCategory').value;

    if (title && content)
    {
        const newPost =
        {
            id: Date.now(),
            title: title,
            content: content,
            category: category,
            author: currentUser.name,
            authorEmail: currentUser.email,
            date: new Date().toLocaleDateString('id-ID'),
            timestamp: getRelativeTime(new Date()),
            replies: 0,
            views: 0
        };

        posts.push(newPost);
        saveToStorage();
        document.getElementById('postForm').reset();
        toggleCreatePost();
        loadPosts();
        alert('Post berhasil dibuat!');
    }
}

// Handle search functionality
function handleSearch(e)
{
    const searchTerm = e.target.value.toLowerCase();
    const threadItems = document.querySelectorAll('.thread-item');
    
    threadItems.forEach(item =>
    {
        const title = item.querySelector('.thread-title')?.textContent.toLowerCase() || '';
        const author = item.querySelector('.thread-author')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || author.includes(searchTerm))
        {
            item.style.display = 'block';
        }
        else
        {
            item.style.display = searchTerm === '' ? 'block' : 'none';
        }
    });
}

// Handle login form submission
function handleLogin(e)
{
    e.preventDefault();
    clearError();

    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPass')?.value;

    if (!email || !password)
    {
        if (!email)
        {
            const emailError = document.getElementById('loginEmailError');
            if (emailError) emailError.textContent = 'Email harus diisi!';
        }
        if (!password)
        {
            const passError = document.getElementById('loginPassError');
            if (passError) passError.textContent = 'Password harus diisi!';
        }
        return;
    }

    if (login(email, password))
    {
        alert(`Selamat datang kembali, ${currentUser.name}!`);
        window.location.href = 'dashboard.html';
    }
    else
    {
        const emailError = document.getElementById('loginEmailError');
        if (emailError) emailError.textContent = 'Email atau password tidak valid!';
    }
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
        const nameError = document.getElementById('fullNameError');
        if (nameError) nameError.textContent = 'Nama harus diisi!';
        isValid = false;
    }
    else if (!validateName(name))
    {
        const nameError = document.getElementById('fullNameError');
        if (nameError) nameError.textContent = 'Format nama Anda salah! Nama terdiri atas 3-32 karakter tanpa angka';
        isValid = false;
    }

    // Email validation
    if (!email) 
    {
        const emailError = document.getElementById('signupEmailError');
        if (emailError) emailError.textContent = 'Email harus diisi!';
        isValid = false;
    }
    else if (!validateEmail(email))
    {
        const emailError = document.getElementById('signupEmailError');
        if (emailError) emailError.textContent = 'Format email Anda tidak valid!';
        isValid = false;
    }
    else if (findUserByEmail(email))
    {
        const emailError = document.getElementById('signupEmailError');
        if (emailError) emailError.textContent = 'Email sudah terdaftar!';
        isValid = false;
    }

    // Password validation
    if (!pass)
    {
        const passError = document.getElementById('signupPassError');
        if (passError) passError.textContent = 'Password harus diisi!';
        isValid = false;
    }
    else if (pass.length < 8)
    {
        const passError = document.getElementById('signupPassError');
        if (passError) passError.textContent = 'Password minimal 8 karakter!';
        isValid = false;
    }

    // Confirm password validation
    if (pass !== confpass)
    {
        const confPassError = document.getElementById('confirmPassError');
        if (confPassError) confPassError.textContent = 'Konfirmasi Password tidak sesuai dengan Password!';
        isValid = false;
    }

    if (isValid)
    {
        const newUser =
        {
            email: email,
            password: pass,
            name: name,
            registrationDate: new Date().toLocaleDateString('id-ID')
        };
        
        registeredUsers.push(newUser);
        saveToStorage();
        alert('Pendaftaran akun berhasil!');
        
        const form = document.getElementById('signupForm');
        if (form) form.reset();
        
        setTimeout(() =>
        {
            showpage('login');
        }, 500);
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
        currentUser = registeredUsers[0];
        saveToStorage();
        updateNavi();
        showpage('home');
        alert(`Welcome back, ${currentUser.name}!`);
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
    console.log('Test user available - call testLogin() to test login functionality');
}