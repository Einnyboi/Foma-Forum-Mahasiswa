// Menunggu seluruh konten HTML dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // --- [BAGIAN 1] PENGAMBILAN ELEMEN HTML & INISIALISASI ---

    const mainContentArea = document.querySelector('.main-content');
    const leftSidebar = document.querySelector('.left-sidebar');
    
    let currentView = 'community-list';
    let currentCommunity = null;

    // --- [BAGIAN 3] FUNGSI MANAJEMEN DATA FORUM ---

    function getCommunities() {
        const communities = localStorage.getItem('forumCommunities');
        const initialCommunities = [
            { name: 'Olahraga', description: 'Diskusi segala jenis olahraga, dari sepak bola hingga catur.', bannerUrl: 'https://placehold.co/800x200/C20114/FFFFFF?text=Olahraga' },
            { name: 'Hobi', description: 'Bagikan hobi Anda, mulai dari merakit model kit hingga berkebun.', bannerUrl: 'https://placehold.co/800x200/3B82F6/FFFFFF?text=Hobi' },
            { name: 'Teknologi', description: 'Semua tentang gadget, software, dan inovasi masa depan.', bannerUrl: 'https://placehold.co/800x200/10B981/FFFFFF?text=Teknologi' }
        ];
        return communities ? JSON.parse(communities) : initialCommunities;
    }
    function saveCommunities(communities) {
        localStorage.setItem('forumCommunities', JSON.stringify(communities));
    }
    function getThreads() {
        const threads = localStorage.getItem('forumThreads');
        return threads ? JSON.parse(threads) : [];
    }
    function saveThreads(threads) {
        localStorage.setItem('forumThreads', JSON.stringify(threads));
    }
     function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // --- [BAGIAN 4] FUNGSI RENDER TAMPILAN ---

    function renderPage() {
        mainContentArea.innerHTML = ''; 

        switch (currentView) {
            case 'community-list':
                renderCommunityListPage();
                setActiveSidebarItem('nav-home');
                break;
            case 'thread-list':
                renderThreadView();
                setActiveSidebarItem(null); 
                break;
            default:
                renderCommunityListPage();
        }
        renderCommunityListSidebar();
        renderEventsSidebar();
    }

    function renderCommunityListPage() {
        const communities = getCommunities();
        let communityCardsHTML = communities.map(community => `
            <div class="community-card" data-community-name="${community.name}">
                <div class="card-banner" style="background-image: url('${community.bannerUrl}')"></div>
                <div class="card-content">
                    <h3>r/${community.name}</h3>
                    <p>${community.description}</p>
                </div>
            </div>
        `).join('');

        mainContentArea.innerHTML = `
            <div id="community-list-page">
                <div class="content-header">
                    <h2>Jelajahi Komunitas</h2>
                    <button id="create-community-btn" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Buat Komunitas</button>
                </div>
                <div id="community-cards-container">${communityCardsHTML}</div>
            </div>`;
    }

    function renderThreadView() {
        const community = getCommunities().find(c => c.name === currentCommunity);
        if (!community) {
            currentView = 'community-list';
            renderPage();
            return;
        }

        const threads = getThreads().filter(thread => thread.community === currentCommunity).sort((a, b) => b.isImportant - a.isImportant);
        let threadsHTML = threads.map(thread => {
             let postLabel = thread.isImportant ? '<span class="post-label label-penting">⭐ PENTING</span>' : 
                            (thread.type === 'event' ? '<span class="post-label label-event">📅 EVENT</span>' : '');
             let eventInfoHTML = thread.type === 'event' ? `<div class="event-info">Lokasi: ${thread.eventLocation} | Tanggal: ${thread.eventDate}</div>` : '';
            
            // --- [PERUBAHAN 1.A] MEMPROSES TAMPILAN GAMBAR DI BALASAN ---
            let repliesHTML = (thread.replies || []).map(reply => {
                const replyImageHTML = reply.imageUrl 
                    ? `<div class="reply-image-container"><img src="${reply.imageUrl}" alt="Gambar balasan"></div>`
                    : '';
                return `
                    <div class="reply">
                        <strong>${reply.author}:</strong>
                        <p>${reply.text}</p>
                        ${replyImageHTML}
                    </div>`;
            }).join('');
            
            let imageHTML = thread.imageUrl 
                ? `<div class="thread-image-container"><img src="${thread.imageUrl}" alt="Gambar post"></div>` 
                : '';

            return `
            <div class="thread-card">
                <h3>${thread.title} ${postLabel}</h3>
                <div class="thread-meta">Diposting oleh: <strong>${thread.author}</strong></div>
                <p class="thread-description">${thread.description}</p>
                ${imageHTML}
                ${eventInfoHTML}
                <div class="card-actions">
                    <div class="action-item like-button" data-thread-id="${thread.id}"><i class="fa-solid fa-thumbs-up"></i> <span>Suka (${thread.likes})</span></div>
                    <div class="action-item dislike-button" data-thread-id="${thread.id}"><i class="fa-solid fa-thumbs-down"></i> <span>Tidak Suka (${thread.dislikes})</span></div>
                    <div class="action-item comment-toggle-button"><i class="fa-solid fa-comment"></i> <span>Balas (${(thread.replies || []).length})</span></div>
                </div>
                <div class="replies-wrapper">
                    <div class="replies-section">
                        <h4>Balasan</h4>
                        <div class="replies-container">${repliesHTML || '<p>Belum ada balasan.</p>'}</div>
                        <form class="reply-form" data-thread-id="${thread.id}">
                            <input type="text" class="reply-text-input" placeholder="Tulis balasan..." required>
                            <input type="file" class="reply-image-input" accept="image/*" style="display: none;">
                            <button type="button" class="attach-reply-image-btn" title="Lampirkan gambar">
                                <i class="fa-solid fa-paperclip"></i>
                            </button>
                            <button type="submit" class="submit-reply-btn">Kirim</button>
                        </form>
                    </div>
                </div>
            </div>`;
        }).join('');

        mainContentArea.innerHTML = `
            <div id="thread-view-container">
                <div id="community-banner">
                    <div id="community-banner-image" style="background-image: url('${community.bannerUrl}')">
                        <div class="banner-menu-container">
                            <i class="fa-solid fa-ellipsis-vertical" id="banner-menu-trigger"></i>
                            <div id="banner-dropdown-menu" class="dropdown-menu hidden">
                                <ul><li id="change-banner-action">Ganti Banner</li></ul>
                            </div>
                        </div>
                    </div>
                    <input type="file" id="change-banner-input" accept="image/*" class="hidden">
                    <div id="community-header" class="content-header community-header-card">
                        <div id="community-info"><h2>r/${community.name}</h2><p>${community.description}</p></div>
                        <button id="start-post-btn" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Buat Post</button>
                    </div>
                </div>
                <div id="threads-list">${threadsHTML || '<p>Belum ada post di komunitas ini.</p>'}</div>
            </div>`;
    }

    function renderCommunityListSidebar() {
        const communities = getCommunities();
        const categoryListEl = document.getElementById('categoryList');
        if (categoryListEl) {
            categoryListEl.innerHTML = communities.map(c => `<div class="sidebar-item category-link" data-community-name="${c.name}">${c.name}</div>`).join('');
        }
    }
    function renderEventsSidebar() {
        const eventListSidebar = document.querySelector('.right-sidebar .sidebar-card:last-child ul');
        if (!eventListSidebar) { 
            const rightSidebar = document.querySelector('.right-sidebar');
            const eventCard = document.createElement('div');
            eventCard.className = 'sidebar-card';
            eventCard.innerHTML = '<h4>Events Terbaru</h4><ul id="event-list-sidebar"></ul>';
            rightSidebar.appendChild(eventCard);
        }
        const events = getThreads().filter(t => t.type === 'event').slice(0, 3);
        const ul = document.getElementById('event-list-sidebar');
        ul.innerHTML = events.length > 0 ? events.map(e => `<li><a href="#">${e.title}</a><small>${e.eventDate}</small></li>`).join('') : '<li><small>Belum ada event.</small></li>';
    }


    // --- [BAGIAN 5] EVENT LISTENERS & LOGIKA APLIKASI ---

    document.body.addEventListener('click', async (e) => {
        if (e.target.closest('#nav-home')) { currentView = 'community-list'; renderPage(); }
        if (e.target.closest('.category-link')) { currentCommunity = e.target.dataset.communityName; currentView = 'thread-list'; renderPage(); }
        if (e.target.closest('.community-card')) { currentCommunity = e.target.closest('.community-card').dataset.communityName; currentView = 'thread-list'; renderPage(); }
        if (e.target.closest('#create-community-btn')) { renderModal('community'); }
        if (e.target.closest('#start-post-btn')) { renderModal('post'); }
        if (e.target.closest('.modal .close-button')) { document.querySelector('.modal')?.remove(); }
        if (e.target.closest('.like-button')) handleLikeDislike(e.target.closest('.like-button').dataset.threadId, 'like');
        if (e.target.closest('.dislike-button')) handleLikeDislike(e.target.closest('.dislike-button').dataset.threadId, 'dislike');
        if (e.target.closest('.comment-toggle-button')) e.target.closest('.thread-card').querySelector('.replies-wrapper').classList.toggle('visible');
        if (e.target.closest('#banner-menu-trigger')) document.getElementById('banner-dropdown-menu').classList.toggle('hidden');
        if (e.target.closest('#change-banner-action')) document.getElementById('change-banner-input').click();

        // --- [PERUBAHAN 2] EVENT HANDLER UNTUK TOMBOL LAMPIRKAN FILE ---
        if (e.target.closest('.attach-reply-image-btn')) {
            // Cari input file tersembunyi di dalam form yang sama dan klik
            e.target.closest('.reply-form').querySelector('.reply-image-input').click();
        }
    });
    
    document.body.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (e.target.id === 'add-community-form') handleAddCommunity(e.target);
        if (e.target.id === 'add-thread-form') await handleAddThread(e.target);
        // --- [PERUBAHAN 4] MENJADIKAN PANGGILAN FUNGSI ASYNCHRONOUS ---
        if (e.target.classList.contains('reply-form')) await handleAddReply(e.target);
    });
    
    document.body.addEventListener('change', async (e) => {
        if (e.target.id === 'change-banner-input') {
            const file = e.target.files[0];
            if (!file || !currentCommunity) return;
            const newBannerUrl = await fileToBase64(file);
            const communities = getCommunities();
            const targetCommunity = communities.find(c => c.name === currentCommunity);
            if (targetCommunity) {
                targetCommunity.bannerUrl = newBannerUrl;
                saveCommunities(communities);
                renderPage(); 
            }
        }
    });

    // --- [BAGIAN 6] FUNGSI HANDLER UNTUK AKSI ---
    
    function handleAddCommunity(form) {
        const name = form.querySelector('#community-name').value;
        const desc = form.querySelector('#community-desc').value;
        const bannerFile = form.querySelector('#community-banner-upload').files[0];
        const communities = getCommunities();
        if (communities.some(c => c.name.toLowerCase() === name.toLowerCase())) { alert("Komunitas sudah ada!"); return; }
        
        let bannerUrl = `https://placehold.co/800x200/6D7275/FFFFFF?text=${name}`;
        if(bannerFile) {
            fileToBase64(bannerFile).then(url => {
                 communities.push({ name, description: desc, bannerUrl: url });
                 saveCommunities(communities);
                 document.querySelector('.modal')?.remove();
                 renderPage();
            });
        } else {
             communities.push({ name, description: desc, bannerUrl });
             saveCommunities(communities);
             document.querySelector('.modal')?.remove();
             renderPage();
        }
    }
    
    async function handleAddThread(form) {
        const threads = getThreads();
        const postType = form.querySelector('#post-type').value;
        const imageFile = form.querySelector('#thread-image-upload').files[0];
        let imageUrl = null;

        if (imageFile) {
            try {
                imageUrl = await fileToBase64(imageFile);
            } catch (error) {
                console.error("Gagal mengubah gambar:", error);
                alert("Gagal mengunggah gambar.");
                return;
            }
        }

        threads.push({
            id: Date.now(),
            type: postType,
            isImportant: postType === 'penting',
            title: form.querySelector('#thread-title').value,
            description: form.querySelector('#thread-description').value,
            author: form.querySelector('#thread-author').value || 'Anonymous',
            imageUrl: imageUrl,
            community: currentCommunity,
            eventDate: form.querySelector('#event-date').value,
            eventLocation: form.querySelector('#event-location').value,
            likes: 0, dislikes: 0, replies: []
        });

        saveThreads(threads);
        document.querySelector('.modal')?.remove();
        renderPage();
    }
    
    function handleLikeDislike(threadId, action) {
        const threads = getThreads();
        const thread = threads.find(t => t.id == threadId);
        if(thread) {
            if(action === 'like') thread.likes++;
            else thread.dislikes++;
            saveThreads(threads);
            renderPage();
        }
    }

    // --- [PERUBAHAN 3] FUNGSI HANDLEADDREPLY DIPERBARUI UNTUK MEMPROSES GAMBAR ---
    async function handleAddReply(form) {
        const text = form.querySelector('.reply-text-input').value;
        const threadId = form.dataset.threadId;
        const imageFile = form.querySelector('.reply-image-input').files[0];
        let imageUrl = null;

        if (imageFile) {
            try {
                imageUrl = await fileToBase64(imageFile);
            } catch (error) {
                console.error("Gagal mengubah gambar balasan:", error);
                alert("Gagal mengunggah gambar balasan.");
                return;
            }
        }

        const threads = getThreads();
        const thread = threads.find(t => t.id == threadId);
        if (thread) {
            if (!thread.replies) thread.replies = [];
            thread.replies.push({ author: 'Guest', text, imageUrl }); // Tambahkan imageUrl
            saveThreads(threads);
            renderPage();

            const repliedCard = document.querySelector(`.reply-form[data-thread-id='${threadId}']`);
            if (repliedCard) {
                repliedCard.closest('.thread-card').querySelector('.replies-wrapper').classList.add('visible');
            }
        }
    }

    // --- [BAGIAN 7] FUNGSI UTILITAS & INISIALISASI AKHIR ---

    function renderModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        let contentHTML = '';

        if (type === 'community') {
            contentHTML = `
            <h2>Buat Komunitas Baru</h2>
            <form id="add-community-form">
                <label>Nama Komunitas (tanpa "r/")</label><input type="text" id="community-name" required>
                <label>Deskripsi</label><textarea id="community-desc" required></textarea>
                <label>Gambar Banner</label><input type="file" id="community-banner-upload" accept="image/*">
                <button type="submit">Buat Komunitas</button>
            </form>`;
        } else if (type === 'post') {
            contentHTML = `
            <h2>Buat Post Baru</h2>
            <form id="add-thread-form">
                <select id="post-type"><option value="normal">Normal</option><option value="penting">Penting</option><option value="event">Event</option></select>
                <div id="event-fields" class="hidden"><input type="date" id="event-date"><input type="text" id="event-location" placeholder="Lokasi"></div>
                <input type="text" id="thread-title" placeholder="Judul Post" required>
                <textarea id="thread-description" placeholder="Deskripsi..." required></textarea>
                <label style="display:block; margin-bottom: 0.5rem; font-size: 0.9rem;">Gambar (Opsional)</label>
                <input type="file" id="thread-image-upload" accept="image/*">
                <input type="text" id="thread-author" placeholder="Nama Anda" required style="margin-top: 1rem;">
                <button type="submit">Publikasikan</button>
            </form>`;
        }
        modal.innerHTML = `<div class="modal-content"><span class="close-button">&times;</span>${contentHTML}</div>`;
        document.body.appendChild(modal);
        
        const postTypeSelect = modal.querySelector('#post-type');
        if(postTypeSelect) {
            postTypeSelect.addEventListener('change', () => {
                modal.querySelector('#event-fields').classList.toggle('hidden', postTypeSelect.value !== 'event');
            });
        }
    }
    
    function setActiveSidebarItem(id) {
        document.querySelectorAll('.left-sidebar .sidebar-item').forEach(item => item.classList.remove('active'));
        if (id) document.getElementById(id)?.closest('.sidebar-item').classList.add('active');
    }
    
    function initializeApp() {
        renderPage();
    }

    initializeApp();
});