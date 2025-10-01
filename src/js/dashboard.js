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
    showpage('home');
    console.log('Dashboard loaded successfully!');
}

// Load users from localStorage or initialize with test data
function loadUsersFromStorage()
{
    try
    {
        const storedUsers = JSON.parse(localStorage.getItem('fomaUsers')) || [];
        registeredUsers = storedUsers;
        
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
        
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser)
        {
            currentUser = JSON.parse(loggedInUser);
        }
    } 
    catch (error)
    {
        console.log('LocalStorage not available, using memory storage only');
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
    const postForm = document.getElementById('postForm');
    if (postForm)
    {
        postForm.addEventListener('submit', handlePostSubmit);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput)
    {
        searchInput.addEventListener('input', handleSearch);
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
    
    createPostSection.style.display = 'none';
    
    switch(pageID)
    {
        case 'home':
            pageTitle.textContent = 'Latest Discussions';
            updateCreatePostVisibility();
            loadPostsContent();
            break;
            
        case 'trending':
            pageTitle.textContent = 'Trending Topics';
            createPostBtn.style.display = 'none';
            loadTrendingContent();
            break;
            
        case 'programming':
            pageTitle.textContent = 'Programming Discussions';
            updateCreatePostVisibility();
            loadCategoryContent('programming');
            break;
            
        case 'general':
            pageTitle.textContent = 'General Discussions';
            updateCreatePostVisibility();
            loadCategoryContent('general');
            break;
            
        case 'login':
            pageTitle.textContent = 'Login to Your Account';
            createPostBtn.style.display = 'none';
            loadLoginContent();
            break;
            
        case 'signup':
            pageTitle.textContent = 'Sign Up to Your Account';
            createPostBtn.style.display = 'none';
            loadSignupContent();
            break;

        default:
            pageTitle.textContent = 'Latest Discussions';
            updateCreatePostVisibility();
            loadPostsContent();
    }
}

// Generic function to load external HTML content
function loadExternalContent(filePath, selector = '.auth-container')
{
    const mainContentArea = document.getElementById('mainContentArea');
    
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
                mainContentArea.innerHTML = content.innerHTML;
                return true;
            }
            else
            {
                throw new Error('Content selector not found');
            }
        })
        .catch(error =>
        {
            console.error(`Error loading ${filePath}:`, error);
            mainContentArea.innerHTML = `<div class="placeholder-section"><h3>Unable to load content</h3><p>Please try <a href="${filePath}">clicking here</a> to open the page.</p></div>`;
            return false;
        });
}

// Load login.html
function loadLoginContent()
{
    loadExternalContent('login.html', '.auth-container')
        .then(success =>
        {
            if (success)
            {
                // Re-attach event listener after loading
                setTimeout(() =>
                {
                    const loginForm = document.getElementById('loginForm');
                    if (loginForm)
                    {
                        loginForm.addEventListener('submit', handleLogin);
                    }
                }, 100);
            }
        }
    );
}

// Load Signup.html
function loadSignupContent()
{
    loadExternalContent('signup.html', '.auth-container')
        .then(success =>
        {
            if (success)
                {
                // Re-attach event listener after loading
                setTimeout(() =>
                {
                    const signupForm = document.getElementById('signupForm');
                    if (signupForm)
                    {
                        signupForm.addEventListener('submit', handleSignup);
                    }
                }, 100);
            }
        }
    );
}

// Load Posts.html
function loadPostsContent()
{
    const mainContentArea = document.getElementById('mainContentArea');
    
    const samplePosts =
    [
        {
            id: 'sample1',
            category: 'programming',
            title: 'How to optimize database queries in Node.js?',
            author: 'Ahmad Rahman',
            timestamp: '2 hours ago',
            replies: 12,
            views: 45
        },
        {
            id: 'sample2', 
            category: 'general',
            title: 'Study group for calculus - anyone interested?',
            author: 'Sarah Kim',
            timestamp: '4 hours ago',
            replies: 8,
            views: 23
        },
        {
            id: 'sample3',
            category: 'programming',
            title: 'Best practices for React component structure?',
            author: 'David Chen',
            timestamp: '6 hours ago',
            replies: 15,
            views: 67
        }
    ];

    const allPosts = [...posts, ...samplePosts];
    
    const postsHtml = allPosts.map(post => 
    `
        <div class="thread-item" onclick="openThread('${post.id}')">
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

    mainContentArea.innerHTML = postsHtml || '<div class="placeholder-section"><h3>No posts found</h3><p>Be the first to start a discussion!</p></div>';
}

// Load Trending.html
function loadTrendingContent()
{
    const mainContentArea = document.getElementById('mainContentArea');
    
    const trendingHtml =
    `
        <div class="placeholder-section">
            <h3>🔥 Trending This Week</h3>
            <p>Most popular discussions based on views and replies</p>
        </div>
        
        <div class="thread-item" onclick="openThread('trend1')">
            <div class="category-highlight">Programming</div>
            <div class="thread-title">JavaScript vs Python: Which should beginners learn first?</div>
            <div class="thread-header">
                <div>
                    <div class="thread-meta">by <span class="thread-author">Tech Mentor</span> • 1 day ago</div>
                </div>
                <div class="thread-stats">
                    <span>89 replies</span>
                    <span>1.2k views</span>
                </div>
            </div>
        </div>
        
        <div class="thread-item" onclick="openThread('trend2')">
            <div class="category-highlight">General</div>
            <div class="thread-title">Tips for effective online learning during university</div>
            <div class="thread-header">
                <div>
                    <div class="thread-meta">by <span class="thread-author">Student Helper</span> • 2 days ago</div>
                </div>
                <div class="thread-stats">
                    <span>67 replies</span>
                    <span>890 views</span>
                </div>
            </div>
        </div>
        
        <div class="thread-item" onclick="openThread('trend3')">
            <div class="category-highlight">Programming</div>
            <div class="thread-title">Free resources for learning web development</div>
            <div class="thread-header">
                <div>
                    <div class="thread-meta">by <span class="thread-author">Code Guru</span> • 3 days ago</div>
                </div>
                <div class="thread-stats">
                    <span>45 replies</span>
                    <span>678 views</span>
                </div>
            </div>
        </div>
    `;
    
    mainContentArea.innerHTML = trendingHtml;
}

// Load Category.html (specific content based on category)
function loadCategoryContent(category)
{
    const mainContentArea = document.getElementById('mainContentArea');
    
    const samplePosts =
    [
        {
            id: 'sample1',
            category: 'programming',
            title: 'How to optimize database queries in Node.js?',
            author: 'Ahmad Rahman',
            timestamp: '2 hours ago',
            replies: 12,
            views: 45
        },
        {
            id: 'sample2', 
            category: 'general',
            title: 'Study group for calculus - anyone interested?',
            author: 'Sarah Kim',
            timestamp: '4 hours ago',
            replies: 8,
            views: 23
        },
        {
            id: 'sample3',
            category: 'programming',
            title: 'Best practices for React component structure?',
            author: 'David Chen',
            timestamp: '6 hours ago',
            replies: 15,
            views: 67
        }
    ];

    const allPosts = [...posts, ...samplePosts];
    const filteredPosts = allPosts.filter(post => post.category === category);
    
    if (filteredPosts.length === 0)
    {
        mainContentArea.innerHTML =
        `
            <div class="placeholder-section">
                <h3>No ${category} discussions yet</h3>
                <p>Be the first to start a ${category} discussion!</p>
            </div>
        `;
        return;
    }
    
    const postsHtml = filteredPosts.map(post =>
    `
        <div class="thread-item" onclick="openThread('${post.id}')">
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

    mainContentArea.innerHTML = postsHtml;
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
        
        updateCreatePostVisibility();
    }
    else
    {
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
            timestamp: 'just now',
            replies: 0,
            views: 0
        };

        posts.push(newPost);
        saveToStorage();
        document.getElementById('postForm').reset();
        toggleCreatePost();
        loadPostsContent();
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
        showpage('home');
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