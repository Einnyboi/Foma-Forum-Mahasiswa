function initializeThreadsPage() {
    // --- 1. SAMPLE DATA ---
    // In a real app, this would come from a database/API
    const posts = [
        {
            id: 1,
            author: 'Budi Santoso',
            avatar: 'https://i.pravatar.cc/150?u=budi',
            title: 'Tips for Effective Time Management for Students',
            content: 'I\'ve been struggling to balance my studies, part-time job, and social life. What are your best tips for managing time effectively? I\'m particularly interested in tools or techniques that have worked for you.',
            tags: ['Academic', 'Productivity'],
            likes: 42,
            comments: [
                { author: 'Citra Lestari', text: 'I highly recommend the Pomodoro Technique! It really helps me stay focused.' },
                { author: 'Doni Firmansyah', text: 'Using a digital calendar like Google Calendar to block out study time has been a game-changer for me.' }
            ]
        },
        {
            id: 2,
            author: 'Ani Yuliani',
            avatar: 'https://i.pravatar.cc/150?u=ani',
            title: 'Which programming language to learn for Web Dev in 2025?',
            content: 'I am new to programming and want to get into web development. There are so many options like JavaScript, Python, etc. What do you guys think is the best language to start with right now?',
            tags: ['Programming', 'Technology', 'WebDev'],
            likes: 78,
            comments: [
                { author: 'Eko Prasetyo', text: 'You can never go wrong with JavaScript. It\'s the foundation of the web.' }
            ]
        }
    ];

    // --- 2. ELEMENT REFERENCES ---
    const discussionList = document.getElementById('discussionList');
    const createDiscBtn = document.getElementById('createDiscussionBtn');
    
    // Create Modal Elements
    const createModal = document.getElementById('createPostModal');
    const closeCreateModalBtn = document.getElementById('closeCreateModalBtn');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');

    // View Modal Elements
    const viewModal = document.getElementById('viewPostModal');
    const closeViewModalBtn = document.getElementById('closeViewModalBtn');
    const viewPostTitle = document.getElementById('viewPostTitle');
    const viewPostContent = document.getElementById('viewPostContent');
    const commentSection = document.getElementById('commentSection');

    if (!discussionList) {
        console.error("Discussion list element not found!");
        return;
    }

    // --- 3. FUNCTIONS ---

    /**
     * Renders a list of posts to the page
     * @param {Array} postsArray The array of post objects to render
     */
    function renderPosts(postsArray) {
        discussionList.innerHTML = ''; // Clear current posts
        postsArray.forEach(post => {
            const tagsHTML = post.tags.map(tag => `<span>${tag}</span>`).join('');
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.dataset.postId = post.id; // Store post id on the element

            postCard.innerHTML = `
                <div class="post-actions">
                    <button class="action-btn like-btn" title="Like">👍</button>
                    <span class="likes-count">${post.likes}</span>
                    <button class="action-btn dislike-btn" title="Dislike">👎</button>
                </div>
                <div class="post-details">
                    <div class="post-author">
                        <img src="${post.avatar}" alt="${post.author}" class="author-avatar">
                        <div>
                            <span class="author-name">${post.author}</span>
                            <span class="post-time">posted 2 hours ago</span>
                        </div>
                    </div>
                    <h3>${post.title}</h3>
                    <div class="post-tags">
                        ${tagsHTML}
                    </div>
                </div>
            `;
            discussionList.appendChild(postCard);
        });
    }

    /**
     * Opens the modal to view a specific post
     * @param {number} postId The ID of the post to view
     */
    function openViewPostModal(postId) {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        // Populate modal with post data
        viewPostTitle.textContent = post.title;

        const tagsHTML = post.tags.map(tag => `<span>${tag}</span>`).join('');
        viewPostContent.innerHTML = `
            <div class="post-author view-post-author">
                By <strong>${post.author}</strong>
            </div>
            <div class="view-post-body">
                <p>${post.content}</p>
            </div>
            <div class="post-tags">${tagsHTML}</div>
        `;

        // Populate comments
        commentSection.innerHTML = '';
        post.comments.forEach(comment => {
            commentSection.innerHTML += `
                <div class="comment">
                    <p class="comment-author">${comment.author}</p>
                    <p>${comment.text}</p>
                </div>
            `;
        });
        
        viewModal.classList.add('visible');
    }

    // --- 4. EVENT LISTENERS ---

    // Open "Create Post" modal
    createDiscBtn.addEventListener('click', () => {
        createModal.classList.add('visible');
    });

    // Close "Create Post" modal
    closeCreateModalBtn.addEventListener('click', () => {
        createModal.classList.remove('visible');
    });
    cancelCreateBtn.addEventListener('click', () => {
        createModal.classList.remove('visible');
    });
    
    // Close "View Post" modal
    closeViewModalBtn.addEventListener('click', () => {
        viewModal.classList.remove('visible');
    });

    // Close modals if background is clicked
    window.addEventListener('click', (e) => {
        if (e.target === createModal) createModal.classList.remove('visible');
        if (e.target === viewModal) viewModal.classList.remove('visible');
    });
    
    // Event delegation for dynamically created post cards
    discussionList.addEventListener('click', (e) => {
        const card = e.target.closest('.post-card');
        if (!card) return;

        // Handle like/dislike clicks
        if (e.target.matches('.like-btn') || e.target.matches('.dislike-btn')) {
            e.stopPropagation(); // Prevent modal from opening
            alert('Like/Dislike functionality would be handled here!');
            return;
        }

        // Handle card click to open view modal
        const postId = parseInt(card.dataset.postId);
        openViewPostModal(postId);
    });

    // --- 5. INITIALIZATION ---
    renderPosts(posts);
}

// **IMPORTANT**: Call this function after the threads.html has been loaded into your dashboard.
// For example:
// loadContent('threads.html', () => {
//     initializeThreadsPage();
// });