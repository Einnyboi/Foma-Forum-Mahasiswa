// Global variables
let currentUser = null;
let registeredUsers = [];
let posts = [];
// Data 
// REPLACE your old allContent array with this
const allContent = [
    { 
        id: 1, 
        type: 'thread', 
        title: 'Internship vacancies in tech companies', 
        category: 'Career Info',    
        author: 'Ahmad Rahman', 
        description: 'Here is a list of some of the latest internship vacancies for IT students, suitable for beginners. Feel free to add more in the comments if you find any!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        likes: 25,
        dislikes: 2,
        comments: []
    },
    { 
        id: 2, 
        type: 'thread', 
        title: 'JavaScript vs Python: Which should beginners learn first?', 
        category: 'Programming', 
        author: 'Tech Mentor', 
        description: 'A deep dive into the pros and cons of each language for newcomers. JavaScript is essential for web development, while Python is known for its simplicity and use in data science. What are your thoughts?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        likes: 42,
        dislikes: 5,
        comments: [
            { id: 101, author: 'Sarah Kim', text: 'I started with Python and found the transition to other languages easier!' },
            { id: 102, author: 'David Chen', text: 'Disagree, learning JavaScript first gives you a direct path to building visible projects on the web.' }
        ]
    },
    // ... add more posts in this format if you want
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

    updateNavi();
    showpage('home');
    loadEventsWidget();
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
        if(storedPosts && storedPosts.length > 0){
            posts = storedPosts;
        }else{
            posts = allContent;
            saveToStorage();
        }
    }
    catch (error)
    {
        console.log('Could not load posts from storage');
        posts = allContent;
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

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}

// Page navigation function
function showpage(pageID)
{
    if (pageID === 'home')
    {
        loadUsersFromStorage();
        updateNavi();
    }
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => item.classList.remove('active'));
    
    const activeSidebarItem = document.querySelector(`.sidebar-item[onclick*="'${pageID}'"]`);
    if (activeSidebarItem)
    {
        activeSidebarItem.classList.add('active');
    }
    // Setiap kali pindah halaman, sembunyikan iframe pencarian
    const searchFrame = document.getElementById('searchFrame');
    if (searchFrame) searchFrame.style.display = 'none';

    // tampilkan kembali konten utama
    const mainContentArea = document.getElementById('mainContentArea');
    const sectionHeader = document.getElementById('sectionHeader');
    if (mainContentArea) mainContentArea.style.display = 'block';
    if (sectionHeader) sectionHeader.style.display = 'flex'; 
   
    closeDropdown();
    loadPageContent(pageID);
}

function updateCreatePostVisibility()
{
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostSection = document.getElementById('createPostSection');
    
    // Check if the current user is an admin
    const isAdmin = currentUser && currentUser.role === 'admin';

    if (currentUser && !isAdmin) // Only show for logged-in users who are NOT admin
    {
        if (createPostBtn) createPostBtn.style.display = 'inline-flex';
    }
    else
    {
        if (createPostBtn) createPostBtn.style.display = 'none';
        if (createPostSection) createPostSection.style.display = 'none';
    }
}

function loadCategoryContent(category)
{
    const mainContentArea = document.getElementById('mainContentArea');

    const allPosts = [...posts];
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

function scopeExternalCSS(href)
{
    // Find the newly loaded stylesheet
    const sheets = document.styleSheets;
    let targetSheet = null;
    
    for (let i = sheets.length - 1; i >= 0; i--)
    {
        try
        {
            if (sheets[i].href && sheets[i].href.includes(href))
            {
                targetSheet = sheets[i];
                break;
            }
        }
        catch (e)
        {
            // Cross-origin stylesheets can't be accessed
            continue;
        }
    }
    
    if (!targetSheet) return;
    
    try
    {
        const rules = Array.from(targetSheet.cssRules || targetSheet.rules || []);
        
        // Remove all rules
        while (targetSheet.cssRules.length > 0)
        {
            targetSheet.deleteRule(0);
        }
        
        // Re-add rules with scoping
        rules.forEach(rule =>
        {
            let ruleText = rule.cssText;
            
            // Skip @import, @font-face, @keyframes, and other @ rules
            if (ruleText.startsWith('@'))
            {
                targetSheet.insertRule(ruleText, targetSheet.cssRules.length);
                return;
            }
            
            // Extract selector and styles
            const match = ruleText.match(/^([^{]+)\{(.+)\}$/);
            if (!match) return;
            
            let selector = match[1].trim();
            const styles = match[2];
            
            // Don't scope selectors that already target specific elements
            // or are too broad (html, body, *)
            if (selector === '*' || selector === 'body' || selector === 'html')
            {
                // Skip these to prevent overriding dashboard styles
                return;
            }
            
            // Scope the selector to main content area
            const scopedSelectors = selector.split(',').map(s =>
            {
                s = s.trim();
                return `#mainContentArea ${s}`;
            }).join(', ');
            
            const scopedRule = `${scopedSelectors} { ${styles} }`;
            
            try
            {
                targetSheet.insertRule(scopedRule, targetSheet.cssRules.length);
            }
            catch (e)
            {
                console.warn('Could not scope rule:', ruleText, e);
            }
        });
    }
    catch (e)
    {
        console.warn('Could not scope external CSS:', e);
    }
}

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
                    Failed to load events.
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

function unloadExternalAssets() 
{
    // Remove previous external CSS
    const oldLink = document.querySelector(`.external-style`);
    if (oldLink) 
    {
        oldLink.remove();
        currentExternalCss = null;
    }
    
    // Remove previous external JS
    const oldScript = document.querySelector(`.external-script`);
    if (oldScript)
    {
        oldScript.remove();
        currentExternalJs = null;
    }
}

function loadCSS(href) 
{
    // Remove previous external CSS first
    const oldLink = document.querySelector(`.external-style`);
    if (oldLink) 
    {
        oldLink.remove();
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.className = 'external-style';
    
    // Add scoping by wrapping all CSS rules to only affect #mainContentArea
    link.onload = function()
    {
        scopeExternalCSS(href);
    };
    
    document.head.appendChild(link);
    currentExternalCss = href;
}

function loadJS(src, callback)
{
    // Remove previous external JS first
    const oldScript = document.querySelector('.external-script');
    if (oldScript)
    {
        oldScript.remove();
    }

    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.className = 'external-script';
    
    script.onload = function()
    {
        console.log(`External script loaded: ${src}`);
        if (typeof callback === 'function') {
            callback(); // ✅ Run callback after script loads
        }
    };
    
    script.onerror = function()
    {
        console.error(`Failed to load external script: ${src}`);
    };
    
    document.body.appendChild(script);
    currentExternalJs = src;
}

// Load different page content dynamically
function loadPageContent(pageID)
{
    const pageTitle = document.getElementById('pageTitle'); // Might be null!
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
            if (pageTitle)
            {
                pageTitle.textContent = 'Latest Discussions';
            }
            loadPostsContent(); 
            pageTitle.textContent = 'Latest Discussions';
            initializeThreadsFeature();
            break;
            
        case 'community':
            if (pageTitle)
            {
                pageTitle.textContent = 'Communities';
            }
            loadCommunityContent();
            break;
            
        case 'profile':
            if (pageTitle)
            {
                pageTitle.textContent = 'User Profile';
            }
            loadProfileContent();
            break;            
            
        case 'programming':
        case 'general':
            if (pageTitle)
            {
                pageTitle.textContent = pageID.charAt(0).toUpperCase() + pageID.slice(1) + ' Discussions';
            }
            updateCreatePostVisibility();
            loadCategoryContent(pageID);
            break;
            
        case 'login':
            if (pageTitle)
            {
                pageTitle.textContent = 'Login to Your Account';
            }
            loadLoginContent();
            break;
            
        case 'signup':
            if (pageTitle)
            {
                pageTitle.textContent = 'Sign Up to Your Account';
            }
            loadSignupContent();
            break;   

        case 'event':
            if (pageTitle)
            {
                pageTitle.textContent = 'Create Your Own Events';
            }
            loadEventContent();
            break;

        default:
            if (pageTitle)
            {
                pageTitle.textContent = 'Latest Discussions';
            }
            updateCreatePostVisibility();
            initializeThreadsFeature();
    }
}

let isThreadsListenerActive = false; // Prevents adding multiple listeners

// 1. MAIN ENTRY POINT for the threads feature
function initializeThreadsFeature()
{
    console.log("Initializing threads feature...");

    fetch('../views/threads.html')
        .then(response => response.text())
        .then(html =>
        {
            const mainContentArea = document.getElementById('mainContentArea');
            mainContentArea.innerHTML = html;

            // NOW the HTML (including #discussionList) exists!
            loadJS('../src/js/threads.js');
            loadCSS('../src/css/threads-style.css')

            // Wait a bit to ensure threads.js is ready
            setTimeout(() =>
            {
                if (typeof initializeThreadsPage === 'function')
                {
                    initializeThreadsPage();
                }
                else
                {
                    console.warn("initializeThreadsPage() not found yet.");
                }
            }, 200);
        })
        .catch(err => console.error("Error loading threads.html:", err));
}

// 2. RENDER THE LIST OF ALL THREADS (LAYER 1)
function renderThreadList()
{
    const mainContentArea = document.getElementById('mainContentArea');
    if (!mainContentArea)
    {
        console.error("Fatal Error: mainContentArea not found!");
        return;
    }
    console.log("4. Rendering thread list...");

    // Show the main page title, hide the back button
    document.getElementById('pageTitle').style.display = 'block';
    document.getElementById('backToListBtn').style.display = 'none';

    let postsHtml = '';
    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    posts.forEach(post =>
    {
        postsHtml +=
        `
            <div class="thread-card" data-post-id="${post.id}">
                <h3>${post.title}</h3>
                <div class="thread-meta">
                    by <strong>${post.author}</strong> • ${getRelativeTime(new Date(post.timestamp))}
                </div>
                <p class="thread-description">${post.description.substring(0, 150)}...</p>
                <div class="card-actions">
                    <div class="action-item">👍 <span>${post.likes}</span></div>
                    <div class="action-item">💬 <span>${post.comments?.length ?? 0} Comments</span></div>
                </div>
            </div>
        `;
    });
    
    mainContentArea.innerHTML = postsHtml;
    console.log("5. Thread list rendered to DOM.");
    updateCreatePostVisibility();
}

// 3. RENDER THE DETAILED VIEW OF A SINGLE THREAD (LAYER 2)
function renderSingleThread(postId)
{
    const mainContentArea = document.getElementById('mainContentArea');
    const post = posts.find(p => p.id == postId);
    if (!post)
    {
        renderThreadList(); // If post not found, go back to the list
        return;
    }

    let commentsHtml = '';
    post.comments.forEach(comment =>
    {
        commentsHtml +=
        `
            <div class="reply">
                <strong>${comment.author}</strong>
                <p>${comment.text}</p>
            </div>
        `;
    });

    const threadDetailHtml =
    `
        <div class="section-header">
            <button id="backToListBtn" class="btn btn-outline">&larr; Back to Discussions</button>
        </div>
        <div class="thread-item-full">
            <div class="category-highlight">${post.category}</div>
            <h2 class="thread-title-full">${post.title}</h2>
            <div class="thread-meta">by <span class="thread-author">${post.author}</span> • ${getRelativeTime(new Date(post.timestamp))}</div>
            <p class="thread-description">${post.description}</p>
            <div class="thread-actions">
                <button class="btn-action like-btn">👍 Like (${post.likes})</button>
                <button class="btn-action dislike-btn">👎 Dislike (${post.dislikes})</button>
            </div>
        </div>
        <div class="replies-section">
            <h4>${post.comments.length} Comments</h4>
            <div class="replies-container">${commentsHtml}</div>
            <form id="commentForm" class="reply-form">
                <input type="text" id="commentInput" class="reply-text-input" placeholder="Write a comment..." required>
                <button type="submit" class="submit-reply-btn">➔</button>
            </form>
        </div>
    `;
    mainContentArea.innerHTML = threadDetailHtml;
}

// 4. FUNCTION TO OPEN THE "CREATE POST" MODAL
function openCreatePostModal()
{
    const existingModal = document.getElementById('createPostModal');
    if(existingModal) existingModal.remove();
    
    const modalHtml =
    `
        <div class="modal" id="createPostModal">
            <div class="modal-content">
                <span class="close-button" id="closeModalBtn">&times;</span>
                <form id="postForm">
                    <h3>Create a New Post</h3>
                    <div class="form-group">
                        <label for="postTitle">Title</label>
                        <input type="text" id="postTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="postCategory">Category</label>
                        <select id="postCategory">
                            <option value="Programming">Programming</option>
                            <option value="Career Info">Career Info</option>
                            <option value="Academics">Academics</option>
                            <option value="Hobbies & Entertainment">Hobbies & Entertainment</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="postDescription">Description</label>
                        <textarea id="postDescription" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Post</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 5. SETUP ALL EVENT LISTENERS FOR THE FEATURE
function setupThreadsEventListeners()
{
    const mainContent = document.querySelector('.main-content');
    if (!mainContent)
    {
        console.error("Critical error: .main-content container not found.");
        return;
    }

    mainContent.addEventListener('click', function(e)
    {
        if (e.target.closest('#createPostBtn'))
        {
            if (!currentUser)
            {
                alert('You must be logged in to create a post!');
                return;
            }
            openCreatePostModal();
            return; // Stop here
        }
        
        if (e.target.closest('#backToListBtn'))
        {
            renderThreadList();
            return; // Stop here
        }
        
        const card = e.target.closest('.thread-card');
        // This remains the same
        if (card)
        {
            const postId = card.dataset.postId;
            // Only navigate if the user didn't click a specific action button inside the card
            if (!e.target.closest('.like-btn') && !e.target.closest('.dislike-btn'))
            {
                renderSingleThread(postId);
            }
        }
    });

    // --- Listeners for the MODAL (outside main content area) ---
    document.body.addEventListener('click', function(e)
    {
        const modal = document.getElementById('createPostModal');
        if (!modal) return;

        if (e.target.id === 'closeModalBtn' || e.target.classList.contains('modal'))
        {
            modal.remove();
        }
    });
    
    document.body.addEventListener('submit', function(e)
    {
        if (e.target.id === 'postForm') {
            e.preventDefault();
            const newPost =
            {
                id: Date.now(),
                type: 'thread',
                title: document.getElementById('postTitle').value,
                category: document.getElementById('postCategory').value,
                author: currentUser.name,
                description: document.getElementById('postDescription').value,
                timestamp: new Date(),
                likes: 0,
                dislikes: 0,
                comments: []
            };
            posts.unshift(newPost); // Add to the beginning of the array
            saveToStorage();
            document.getElementById('createPostModal').remove();
            renderThreadList();
            alert('Post created successfully!');
        }
        
        if (e.target.id === 'commentForm')
        {
            e.preventDefault();
            if (!currentUser) { alert('You must be logged in to comment!'); return; }
            const text = document.getElementById('commentInput').value.trim();
            const postId = document.querySelector('.thread-item-full').dataset.postId;
            const post = posts.find(p => p.id == postId);
            if (text && post)
            {
                const newComment = { id: Date.now(), author: currentUser.name, text: text };
                post.comments.push(newComment);
                saveToStorage();
                renderSingleThread(postId);
            }
        }
    });

    console.log("✅ Smart event listeners are now active.");
    isThreadsListenerActive = true;
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
    loadExternalContent('threads.html', '.threads-page', '../src/css/threads-style.css', '../src/js/threads.js')
        .then(success =>
        {
            if (success)
            {
                console.log('Threads content and script.js loaded. Thread logic is now handled by script.js.');
            }
        }
    );
}

// Load login.html and login.js
function loadLoginContent()
{
    loadExternalContent('Login.html', '.auth-container', '../src/css/Login.css', '../src/js/Login.js')
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

function loadEventContent()
{
    loadExternalContent('Student.HTML', '.main-container', '../src/css/Student.css', '../src/js/Student.js')
        .then(success =>
        {
            if (success)
            {
                console.log('Event content and Student.js loaded. Student logic is now handled by Student.js.');
            }
        }
    );
}

function loadEventContent()
{
    loadExternalContent('Student.HTML', '.main-container', '../src/css/Student.css', '../src/js/Student.js')
        .then(success =>
        {
            if (success)
            {
                console.log('Event content and Student.js loaded. Student logic is now handled by Student.js.');
            }
        }
    );
}

function loadSearchPage(searchTerm)
{
    const createPostBtn = document.getElementById('createPostBtn');
    if (createPostBtn) createPostBtn.style.display = 'none';

    // Load the external HTML, CSS, and JS using the friend's search files
    loadExternalContent('searchPage.html', '.container', '../src/css/searchstyle.css', '../src/js/search.js')
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
function loadCommunityContent()
{
    const mainContentArea = document.getElementById('mainContentArea');
    const communityStylesheet = document.createElement('link');

    communityStylesheet.id = 'community-styles'; // Unique ID to find it later
    communityStylesheet.rel = 'stylesheet';
    communityStylesheet.href = '../src/css/community.css'; // Make sure this path is correct
    document.head.appendChild(communityStylesheet);

    fetch('community.html') 
        .then(response =>
        {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html =>
        {
            mainContentArea.innerHTML = html;
            // Assuming initializeCommunityPage is a function defined elsewhere or in the dashboard.js file
            if (typeof initializeCommunityPage === 'function')
            {
                initializeCommunityPage(); 
            }
            else
            {
                console.warn('initializeCommunityPage function not found.');
            }
        })
        .catch(error =>
        {
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
        loadSearchInIframe(searchTerm); 
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
// fungsi loadSearchResults
function loadSearchInIframe(searchTerm) {
    const mainContentArea = document.getElementById('mainContentArea');
    const sectionHeader = document.getElementById('sectionHeader');
    const searchFrame = document.getElementById('searchFrame');

    // Sembunyikan konten utama dashboard
    if (mainContentArea) mainContentArea.style.display = 'none';
    if (sectionHeader) sectionHeader.style.display = 'none';

    //  Tampilkan iframe dan atur sumbernya
    if (searchFrame) {
        searchFrame.src = `searchPage.html?query=${encodeURIComponent(searchTerm)}`;
        searchFrame.style.display = 'block';
    }
}
// Fungsi untuk menampilkan hasil
function loadSearchResults(searchTerm) {
    const mainContentArea = document.getElementById('mainContentArea');
    const pageTitle = document.getElementById('pageTitle');
    const createPostBtn = document.getElementById('createPostBtn');

    if (pageTitle) pageTitle.textContent = `Search Results for: "${searchTerm}"`;
    if (createPostBtn) createPostBtn.style.display = 'none';

    // Filter data untuk menemukan yang cocok
    const filteredResults = allContent.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let resultsHtml = '';
    if (filteredResults.length === 0) {
        resultsHtml = `<div class="placeholder-section"><h3>No Results Found</h3><p>Sorry, no results matched your search.</p></div>`;
    } else {
        resultsHtml = filteredResults.map(item => `
            <div class="thread-item">
                <div class="category-highlight">${item.category}</div>
                <div class="thread-title">${item.title}</div>
                <div class="thread-description" >${item.description}</div>
                <div class="thread-header">
                    <div class="thread-meta" >by <span class="thread-author">${item.author}</span></div>
                </div>
            </div>
        `).join('');
    }
    mainContentArea.innerHTML = resultsHtml;
}


// Console helpers for development
console.log('Available functions: testLogin(), showpage(pageID), logout()');
if (registeredUsers.length > 0)
{
    console.log('Test user available - call testLogin() to test login functionality. Use email: admin@foma.com, password: adminpassword to test admin login.');
}