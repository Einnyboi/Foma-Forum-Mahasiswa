// This script runs immediately when loaded by the dashboard.

// This script's only job is to render the list of all discussions.
const mainContentArea = document.querySelector('.main-content');

// 1. --- DATA SOURCE ---
// Access the global variables created by dashboard.js.
const dashboardPosts = window.posts || [];
const dashboardAllContent = window.allContent || [];
let threads = [...dashboardPosts, ...dashboardAllContent];

// --- RENDER FUNCTION ---
function renderThreads() {
    if (!mainContentArea) {
        console.error("Main content area not found!");
        return;
    }

    if (!threads || threads.length === 0) {
        mainContentArea.innerHTML = '<p>No discussions have been posted yet.</p>';
        return;
    }

    const threadsHTML = threads.map(thread => {
        const tag = thread.category === 'Academics' ? `<span class="post-label label-penting">ACADEMICS</span>` :
                    thread.category === 'Programming' ? `<span class="post-label label-event">CODE</span>` : '';
        
        const replies = thread.replies || [];
        const repliesHTML = replies.map(reply => `
            <div class="reply"><strong>${reply.author}:</strong> <p>${reply.text}</p></div>
        `).join('');

        return `
        <div class="thread-card" data-thread-id="${thread.id}">
            <h3>${thread.title} ${tag}</h3>
            <div class="thread-meta">Posted by: <strong>${thread.author || 'Anonymous'}</strong></div>
            <p class="thread-description">${thread.description}</p>
            
            <div class="card-actions">
                <div class="action-item like-button">
                    <i class="fa-solid fa-thumbs-up"></i> 
                    <span>Like (${thread.likes || 0})</span>
                </div>
                <div class="action-item dislike-button">
                    <i class="fa-solid fa-thumbs-down"></i> 
                    <span>Dislike (${thread.dislikes || 0})</span>
                </div>
                <div class="action-item comment-toggle-button">
                    <i class="fa-solid fa-comment"></i> 
                    <span>Replies (${replies.length})</span>
                </div>
            </div>

            <div class="replies-wrapper">
                <div class="replies-section">
                    <h4>Replies</h4>
                    <div class="replies-container">${repliesHTML || '<p>No replies yet.</p>'}</div>
                    <form class="reply-form">
                        <input type="text" class="reply-text-input" placeholder="Write a reply..." required>
                        <button type="submit" class="submit-reply-btn">Send</button>
                    </form>
                </div>
            </div>
        </div>
        `;
    }).join('');

    mainContentArea.innerHTML = `<div id="threads-list">${threadsHTML}</div>`;
}

// --- EVENT LISTENERS for Likes, Dislikes, and Replies ---
if (mainContentArea) {
    mainContentArea.addEventListener('click', (e) => {
        const threadCard = e.target.closest('.thread-card');
        if (!threadCard) return;

        const threadId = parseInt(threadCard.dataset.threadId);
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;

        if (e.target.closest('.like-button')) {
            thread.likes = (thread.likes || 0) + 1;
            renderThreads(); 
        }
        if (e.target.closest('.dislike-button')) {
            thread.dislikes = (thread.dislikes || 0) + 1;
            renderThreads(); 
        }
        if (e.target.closest('.comment-toggle-button')) {
            threadCard.querySelector('.replies-wrapper').classList.toggle('visible');
        }
    });

    mainContentArea.addEventListener('submit', (e) => {
        if (e.target.classList.contains('reply-form')) {
            e.preventDefault();
            const threadCard = e.target.closest('.thread-card');
            const threadId = parseInt(threadCard.dataset.threadId);
            const thread = threads.find(t => t.id === threadId);
            const replyInput = e.target.querySelector('.reply-text-input');

            if (thread && replyInput.value) {
                if (!thread.replies) thread.replies = [];
                thread.replies.push({ author: 'You', text: replyInput.value });
                replyInput.value = ''; 
                renderThreads(); 
            }
        }
    });
}

// --- INITIALIZATION ---
// This will now run as soon as the script is loaded.
renderThreads();