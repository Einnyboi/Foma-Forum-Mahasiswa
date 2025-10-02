// Menunggu seluruh konten HTML dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // --- [BAGIAN 1] PENGAMBILAN ELEMEN HTML & INISIALISASI ---

    // Mengambil elemen-elemen utama dari layout
    const mainContentArea = document.querySelector('.main-content'); // Area konten utama yang baru
    const leftSidebar = document.querySelector('.left-sidebar');

    // Elemen Navigasi & Otentikasi
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const profileBtn = document.getElementById('profileBtn');
    const authButtons = document.querySelector('.auth-buttons'); // Kontainer untuk tombol Masuk/Daftar
    
    // Variabel Global untuk state aplikasi
    let currentUser = null; // Menyimpan data user yang sedang login
    let currentView = 'community-list'; // Mengontrol tampilan (daftar komunitas atau daftar thread)
    let currentCommunity = null; // Menyimpan nama komunitas yang sedang dilihat

    // --- [BAGIAN 2] FUNGSI MANAJEMEN PENGGUNA (DARI SCRIPT KEDUA) ---

    // Mengambil data pengguna dari localStorage
    function getUsers() {
        const users = localStorage.getItem('forumUsers');
        // Jika tidak ada user, buat user 'test' sebagai contoh
        return users ? JSON.parse(users) : [{ name: "Test User", email: "test@example.com", password: "password123" }];
    }

    // Menyimpan data pengguna ke localStorage
    function saveUsers(users) {
        localStorage.setItem('forumUsers', JSON.stringify(users));
    }

    // Memperbarui tampilan navigasi berdasarkan status login
    function updateNavUI() {
        const userInit = document.getElementById('userInit');
        const userName = document.getElementById('userName');

        if (currentUser) {
            // Jika ada user login, tampilkan tombol profil dan sembunyikan tombol Masuk/Daftar
            if (authButtons) authButtons.style.display = 'none';
            if (profileBtn) profileBtn.style.display = 'flex';
            
            if (userInit) userInit.textContent = currentUser.name.charAt(0).toUpperCase();
            if (userName) userName.textContent = currentUser.name.split(' ')[0];
        } else {
            // Jika tidak ada user login, lakukan sebaliknya
            if (authButtons) authButtons.style.display = 'flex';
            if (profileBtn) profileBtn.style.display = 'none';
        }
    }

    // Fungsi untuk logout
    function logout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        alert('Anda berhasil logout.');
        updateNavUI();
        // Kembali ke halaman utama setelah logout
        currentView = 'community-list';
        renderPage();
    }
    
    // --- [BAGIAN 3] FUNGSI MANAJEMEN DATA FORUM (DARI SCRIPT PERTAMA) ---

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

    // --- [BAGIAN 4] FUNGSI RENDER TAMPILAN (GABUNGAN) ---

    // Fungsi utama untuk menampilkan konten berdasarkan state `currentView`
    function renderPage() {
        mainContentArea.innerHTML = ''; // Kosongkan area konten utama

        switch (currentView) {
            case 'community-list':
                renderCommunityListPage();
                setActiveSidebarItem('nav-home');
                break;
            case 'thread-list':
                renderThreadView();
                setActiveSidebarItem(null); // Tidak ada item aktif saat di dalam komunitas
                break;
            case 'login':
                renderAuthPage('login');
                setActiveSidebarItem(null);
                break;
            case 'signup':
                renderAuthPage('signup');
                setActiveSidebarItem(null);
                break;
            default:
                renderCommunityListPage();
        }
        renderCommunityListSidebar();
        renderEventsSidebar();
    }

    // Menampilkan halaman daftar komunitas
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

    // Menampilkan halaman daftar thread dalam satu komunitas
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
             let repliesHTML = (thread.replies || []).map(reply => `<div class="reply"><strong>${reply.author}:</strong><p>${reply.text}</p></div>`).join('');
            
            return `
            <div class="thread-card">
                <h3>${thread.title} ${postLabel}</h3>
                <div class="thread-meta">Diposting oleh: <strong>${thread.author}</strong></div>
                <p class="thread-description">${thread.description}</p>
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
                            <button type="submit">Kirim</button>
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

    // Menampilkan halaman login atau signup
    function renderAuthPage(type) {
        const isLogin = type === 'login';
        mainContentArea.innerHTML = `
            <div class="auth-container">
                <h2>${isLogin ? 'Login ke Akun Anda' : 'Buat Akun Baru'}</h2>
                <form id="${isLogin ? 'login-form' : 'signup-form'}">
                    ${!isLogin ? `
                        <div class="form-group">
                            <label for="fullName">Nama Lengkap</label>
                            <input type="text" id="fullName" required>
                        </div>` : ''}
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required>
                    </div>
                     ${!isLogin ? `
                        <div class="form-group">
                            <label for="confirmPass">Konfirmasi Password</label>
                            <input type="password" id="confirmPass" required>
                        </div>` : ''}
                    <button type="submit" class="btn btn-primary">${isLogin ? 'Masuk' : 'Daftar'}</button>
                    <p class="auth-switch">${isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'} <a href="#" id="auth-switch-link">${isLogin ? 'Daftar di sini' : 'Masuk di sini'}</a></p>
                </form>
            </div>`;
    }
    
    // Render elemen-elemen di sidebar
    function renderCommunityListSidebar() {
        const communities = getCommunities();
        const categoryListEl = document.getElementById('categoryList');
        if (categoryListEl) {
            categoryListEl.innerHTML = communities.map(c => `<div class="sidebar-item category-link" data-community-name="${c.name}">${c.name}</div>`).join('');
        }
    }
    function renderEventsSidebar() {
        const eventListSidebar = document.querySelector('.right-sidebar .sidebar-card:last-child ul');
        if (!eventListSidebar) { // Jika struktur event di sidebar kanan belum ada, buat
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

    // Meng-handle semua klik di dokumen untuk navigasi dan aksi
    document.body.addEventListener('click', async (e) => {
        // Navigasi Sidebar
        if (e.target.closest('#nav-home')) { currentView = 'community-list'; renderPage(); }
        if (e.target.closest('.category-link')) { currentCommunity = e.target.dataset.communityName; currentView = 'thread-list'; renderPage(); }
        
        // Navigasi Otentikasi
        if (e.target.closest('#loginLink')) { e.preventDefault(); currentView = 'login'; renderPage(); }
        if (e.target.closest('#signupLink')) { e.preventDefault(); currentView = 'signup'; renderPage(); }
        if (e.target.id === 'auth-switch-link') { e.preventDefault(); currentView = (currentView === 'login' ? 'signup' : 'login'); renderPage(); }
        if (e.target.closest('.dropdown-item span')?.textContent === 'Logout') { logout(); }

        // Interaksi dalam Konten
        if (e.target.closest('.community-card')) { currentCommunity = e.target.closest('.community-card').dataset.communityName; currentView = 'thread-list'; renderPage(); }
        if (e.target.closest('#create-community-btn')) { if (!currentUser) { alert('Silakan login untuk membuat komunitas.'); return; } renderModal('community'); }
        if (e.target.closest('#start-post-btn')) { if (!currentUser) { alert('Silakan login untuk membuat post.'); return; } renderModal('post'); }
        if (e.target.closest('.modal .close-button')) { document.querySelector('.modal')?.remove(); }
        if (e.target.closest('.like-button')) handleLikeDislike(e.target.closest('.like-button').dataset.threadId, 'like');
        if (e.target.closest('.dislike-button')) handleLikeDislike(e.target.closest('.like-button').dataset.threadId, 'dislike');
        if (e.target.closest('.comment-toggle-button')) e.target.closest('.thread-card').querySelector('.replies-wrapper').classList.toggle('visible');

        // Menu Banner
        if (e.target.closest('#banner-menu-trigger')) document.getElementById('banner-dropdown-menu').classList.toggle('hidden');
        if (e.target.closest('#change-banner-action')) document.getElementById('change-banner-input').click();
    });
    
    // Meng-handle semua submit form
    document.body.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (e.target.id === 'login-form') handleLogin(e.target);
        if (e.target.id === 'signup-form') handleSignup(e.target);
        if (e.target.id === 'add-community-form') handleAddCommunity(e.target);
        if (e.target.id === 'add-thread-form') handleAddThread(e.target);
        if (e.target.classList.contains('reply-form')) handleAddReply(e.target);
    });
    
    // Handler untuk Ganti Banner
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
                renderPage(); // Render ulang seluruh halaman untuk update banner
            }
        }
    });

    // --- [BAGIAN 6] FUNGSI HANDLER UNTUK AKSI ---

    function handleLogin(form) {
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const user = getUsers().find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert(`Selamat datang kembali, ${currentUser.name}!`);
            updateNavUI();
            currentView = 'community-list';
            renderPage();
        } else {
            alert('Email atau password salah.');
        }
    }

    function handleSignup(form) {
        const name = form.querySelector('#fullName').value;
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const confirmPass = form.querySelector('#confirmPass').value;
        
        if (password !== confirmPass) { alert('Konfirmasi password tidak cocok!'); return; }
        
        const users = getUsers();
        if (users.some(u => u.email === email)) { alert('Email sudah terdaftar.'); return; }
        
        users.push({ name, email, password });
        saveUsers(users);
        alert('Pendaftaran berhasil! Silakan login.');
        currentView = 'login';
        renderPage();
    }
    
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
    
    function handleAddThread(form) {
        const threads = getThreads();
        const postType = form.querySelector('#post-type').value;
        threads.push({
            id: Date.now(),
            type: postType,
            isImportant: postType === 'penting',
            title: form.querySelector('#thread-title').value,
            description: form.querySelector('#thread-description').value,
            author: currentUser.name, // Otomatis dari user yang login
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
        if (!currentUser) { alert('Silakan login untuk memberi rating.'); return; }
        const threads = getThreads();
        const thread = threads.find(t => t.id == threadId);
        if(thread) {
            if(action === 'like') thread.likes++;
            else thread.dislikes++;
            saveThreads(threads);
            renderPage();
        }
    }

    function handleAddReply(form) {
        if (!currentUser) { alert('Silakan login untuk membalas.'); return; }
        const text = form.querySelector('.reply-text-input').value;
        const threadId = form.dataset.threadId;
        const threads = getThreads();
        const thread = threads.find(t => t.id == threadId);
        if (thread) {
            if (!thread.replies) thread.replies = [];
            thread.replies.push({ author: currentUser.name, text });
            saveThreads(threads);
            renderPage();
        }
    }

    // --- [BAGIAN 7] FUNGSI UTILITAS & INISIALISASI AKHIR ---

    // Menampilkan modal
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
                <button type="submit">Publikasikan</button>
            </form>`;
        }
        modal.innerHTML = `<div class="modal-content"><span class="close-button">&times;</span>${contentHTML}</div>`;
        document.body.appendChild(modal);
        
        // Listener untuk select tipe post di dalam modal
        const postTypeSelect = modal.querySelector('#post-type');
        if(postTypeSelect) {
            postTypeSelect.addEventListener('change', () => {
                modal.querySelector('#event-fields').classList.toggle('hidden', postTypeSelect.value !== 'event');
            });
        }
    }
    
    // Memberi tanda aktif pada item sidebar
    function setActiveSidebarItem(id) {
        document.querySelectorAll('.left-sidebar .sidebar-item').forEach(item => item.classList.remove('active'));
        if (id) document.getElementById(id)?.closest('.sidebar-item').classList.add('active');
    }
    
    // Fungsi inisialisasi utama aplikasi
    function initializeApp() {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            currentUser = JSON.parse(loggedInUser);
        }
        updateNavUI();
        renderPage();
    }

    initializeApp(); // Jalankan aplikasi!
});