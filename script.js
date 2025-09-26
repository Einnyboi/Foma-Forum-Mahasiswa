document.addEventListener('DOMContentLoaded', () => {

    // --- BAGIAN 1: MENGAMBIL ELEMEN DARI HTML ---
    const categoryList = document.getElementById('category-list');
    const threadsList = document.getElementById('threads-list');
    const postModal = document.getElementById('post-modal');
    const startPostBtn = document.getElementById('start-post-btn');
    const closeModalBtn = document.querySelector('.close-button');
    const addThreadForm = document.getElementById('add-thread-form');
    const categorySelect = document.getElementById('thread-category');
    const newCategoryInput = document.getElementById('new-category-input');
    const navHome = document.getElementById('nav-home');
    const navTrending = document.getElementById('nav-trending');
    const navCategory = document.getElementById('nav-category');

    let currentCategoryFilter = 'Semua';

    // --- BAGIAN 2: FUNGSI MENGELOLA DATA (localStorage) ---
    function getCategories() {
        const categories = localStorage.getItem('forumCategories');
        return categories ? JSON.parse(categories) : ['Semua', 'Olahraga', 'Hobi', 'Teknologi'];
    }

    function saveCategories(categories) {
        localStorage.setItem('forumCategories', JSON.stringify(categories));
    }

    function getThreads() {
        const threads = localStorage.getItem('forumThreads');
        const initialThreads = [
            { id: 1, title: 'Tips Lari Pagi untuk Pemula', description: 'Lari pagi adalah cara yang bagus untuk memulai hari.', author: 'Andi', category: 'Olahraga', isImportant: true, likes: 15, dislikes: 2, replies: [{author: 'Budi', text: 'Sangat membantu!'}] },
            { id: 2, title: 'Rekomendasi Keyboard Mechanical 2025', description: 'Mencari keyboard baru?', author: 'Cindy', category: 'Teknologi', isImportant: false, likes: 8, dislikes: 0, replies: [] }
        ];
        if (!threads) return initialThreads;
        
        let parsedThreads = JSON.parse(threads);
        parsedThreads.forEach(t => { 
            if (!t.replies) t.replies = []; 
            if (t.likes === undefined) t.likes = 0;
            if (t.dislikes === undefined) t.dislikes = 0;
            if (t.description === undefined) t.description = "Tidak ada deskripsi.";
        });
        return parsedThreads;
    }

    function saveThreads(threads) {
        localStorage.setItem('forumThreads', JSON.stringify(threads));
    }

    // --- BAGIAN 3: FUNGSI MENAMPILKAN DATA (RENDER) ---
    function renderCategories() {
        const categories = getCategories().filter(c => c !== 'Semua');
        categoryList.innerHTML = ''; 
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.dataset.category = category;
            categoryList.appendChild(li);
        });
    }

    function renderThreads(sortBy = 'default') {
        let threads = getThreads();
        threadsList.innerHTML = '';
        
        if (sortBy === 'trending') {
            threads.sort((a, b) => b.likes - a.likes);
        } else {
            threads.sort((a, b) => (b.isImportant - a.isImportant) || (b.id - a.id));
        }

        const filteredThreads = threads.filter(thread => 
            currentCategoryFilter === 'Semua' || thread.category === currentCategoryFilter
        );

        if (filteredThreads.length === 0) {
            threadsList.innerHTML = '<p>Tidak ada thread yang cocok.</p>';
        }

        filteredThreads.forEach(thread => {
            const card = document.createElement('div');
            card.className = 'thread-card';
            const importantTag = thread.isImportant ? '<span class="important-tag">📌 PENTING</span>' : '';
            let repliesHTML = thread.replies.map(reply => `<div class="reply"><strong>${reply.author}:</strong><p>${reply.text}</p></div>`).join('');

            card.innerHTML = `
                <h3>${thread.title} ${importantTag}</h3>
                <div class="thread-meta"><span>Diposting oleh: <strong>${thread.author}</strong></span> | <span>Kategori: <strong>${thread.category}</strong></span></div>
                <p class="thread-description">${thread.description}</p>
                <div class="card-actions">
                    <div class="action-item like-button" data-thread-id="${thread.id}">
                        <i class="fa-solid fa-thumbs-up"></i>
                        <span>Suka (${thread.likes})</span>
                    </div>
                    <div class="action-item dislike-button" data-thread-id="${thread.id}">
                        <i class="fa-solid fa-thumbs-down"></i>
                        <span>Tidak Suka (${thread.dislikes})</span>
                    </div>
                    <div class="action-item comment-toggle-button" data-thread-id="${thread.id}">
                        <i class="fa-solid fa-comment"></i>
                        <span>Balas (${thread.replies.length})</span>
                    </div>
                </div>
                <div class="replies-wrapper">
                    <div class="replies-section">
                        <h4>Balasan</h4>
                        <div class="replies-container">${repliesHTML || '<p>Belum ada balasan.</p>'}</div>
                        <form class="reply-form" data-thread-id="${thread.id}">
                            <input type="text" class="reply-author-input" placeholder="Nama Anda" required>
                            <input type="text" class="reply-text-input" placeholder="Tulis balasan..." required>
                            <button type="submit">Kirim</button>
                        </form>
                    </div>
                </div>
            `;
            threadsList.appendChild(card);
        });
    }
    
    function populateCategorySelect() {
        const categories = getCategories().filter(c => c !== 'Semua');
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        const createNewOption = document.createElement('option');
        createNewOption.value = 'new';
        createNewOption.textContent = 'Buat Kategori Baru...';
        categorySelect.appendChild(createNewOption);
    }

    function renderAll(sortBy = 'default') {
        renderCategories();
        renderThreads(sortBy);
    }

    // --- BAGIAN 4: EVENT LISTENERS (AKSI PENGGUNA) ---
    startPostBtn.addEventListener('click', () => { postModal.classList.remove('hidden'); populateCategorySelect(); });
    closeModalBtn.addEventListener('click', () => postModal.classList.add('hidden'));
    categorySelect.addEventListener('change', () => { newCategoryInput.classList.toggle('hidden', categorySelect.value !== 'new'); });

    addThreadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let categories = getCategories();
        let categoryValue = categorySelect.value;
        if (categoryValue === 'new') {
            categoryValue = newCategoryInput.value.trim();
            if (categoryValue && !categories.includes(categoryValue)) {
                categories.push(categoryValue);
                saveCategories(categories);
            }
        }
        const threads = getThreads();
        const newThread = { id: Date.now(), title: document.getElementById('title').value, description: document.getElementById('description').value, author: document.getElementById('author').value, category: categoryValue, isImportant: document.getElementById('is-important-checkbox').checked, likes: 0, dislikes: 0, replies: [] };
        threads.push(newThread);
        saveThreads(threads);
        addThreadForm.reset();
        postModal.classList.add('hidden');
        newCategoryInput.classList.add('hidden');
        renderAll();
    });

    function setActiveNavItem(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        if(activeItem) { activeItem.classList.add('active'); }
    }
    navHome.addEventListener('click', () => { currentCategoryFilter = 'Semua'; setActiveNavItem(navHome); categoryList.classList.add('hidden'); renderAll('default'); });
    navTrending.addEventListener('click', () => { currentCategoryFilter = 'Semua'; setActiveNavItem(navTrending); categoryList.classList.add('hidden'); renderAll('trending'); });
    navCategory.addEventListener('click', () => { categoryList.classList.toggle('hidden'); });
    categoryList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') { currentCategoryFilter = e.target.dataset.category; setActiveNavItem(null); renderAll('default'); }
    });

    threadsList.addEventListener('click', (e) => {
        const actionButton = e.target.closest('.action-item');
        if (!actionButton) return;
        const threads = getThreads();
        const threadId = Number(actionButton.dataset.threadId);
        const threadToUpdate = threads.find(t => t.id === threadId);

        if (actionButton.classList.contains('like-button')) {
            if (threadToUpdate) { threadToUpdate.likes++; saveThreads(threads); actionButton.querySelector('span').textContent = `Suka (${threadToUpdate.likes})`; }
        }
        if (actionButton.classList.contains('dislike-button')) {
            if (threadToUpdate) { threadToUpdate.dislikes++; saveThreads(threads); actionButton.querySelector('span').textContent = `Tidak Suka (${threadToUpdate.dislikes})`; }
        }
        if (actionButton.classList.contains('comment-toggle-button')) {
            const card = actionButton.closest('.thread-card');
            const repliesWrapper = card.querySelector('.replies-wrapper');
            if (repliesWrapper) { repliesWrapper.classList.toggle('visible'); }
        }
    });

    threadsList.addEventListener('submit', (e) => {
        if (e.target.classList.contains('reply-form')) {
            e.preventDefault();
            const threadId = Number(e.target.dataset.threadId);
            const author = e.target.querySelector('.reply-author-input').value;
            const text = e.target.querySelector('.reply-text-input').value;
            if (!author || !text) return;
            const threads = getThreads();
            const threadToUpdate = threads.find(t => t.id === threadId);
            threadToUpdate.replies.push({ author, text });
            saveThreads(threads);
            renderAll();
        }
    });

    // --- BAGIAN 5: INISIALISASI ---
    renderAll();
});