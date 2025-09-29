document.addEventListener('DOMContentLoaded', () => {

    // --- BAGIAN 1: MENGAMBIL ELEMEN DARI HTML ---
    const mainContent = document.querySelector('.content');
    const categoryList = document.getElementById('category-list');
    const threadsList = document.getElementById('threads-list');
    
    // Modal Post
    const postModal = document.getElementById('post-modal');
    const startPostBtn = document.getElementById('start-post-btn');
    const addThreadForm = document.getElementById('add-thread-form');
    
    // Modal Komunitas
    const communityModal = document.getElementById('community-modal');
    const createCommunityBtn = document.getElementById('create-community-btn');
    const addCommunityForm = document.getElementById('add-community-form');

    // Kontainer Tampilan
    const communityListPage = document.getElementById('community-list-page');
    const threadViewContainer = document.getElementById('thread-view-container');
    const communityCardsContainer = document.getElementById('community-cards-container');

    // Navigasi & Elemen Lainnya
    const navHome = document.getElementById('nav-home');
    const navCategory = document.getElementById('nav-category');
    const categorySelect = document.getElementById('thread-category');
    const newCategoryInput = document.getElementById('new-category-input');
    const postTypeSelect = document.getElementById('post-type');
    const eventFields = document.getElementById('event-fields');

    // --- BARU: Elemen untuk menu banner ---
    const bannerMenuTrigger = document.getElementById('banner-menu-trigger');
    const bannerDropdownMenu = document.getElementById('banner-dropdown-menu');
    const changeBannerAction = document.getElementById('change-banner-action');
    const changeBannerInput = document.getElementById('change-banner-input');


    // Variabel State
    let currentView = 'community-list';
    let currentCommunity = null;

    // --- BAGIAN 2: FUNGSI MENGELOLA DATA (localStorage) ---
    function getCommunities() {
        const communities = localStorage.getItem('forumCommunities');
        const initialCommunities = [
            { 
                name: 'Olahraga', 
                description: 'Diskusi segala jenis olahraga, dari sepak bola hingga catur.',
                bannerUrl: 'https://placehold.co/800x200/C20114/FFFFFF?text=Olahraga' 
            },
            { 
                name: 'Hobi', 
                description: 'Bagikan hobi Anda, mulai dari merakit model kit hingga berkebun.',
                bannerUrl: 'https://placehold.co/800x200/3B82F6/FFFFFF?text=Hobi'
            },
            { 
                name: 'Teknologi', 
                description: 'Semua tentang gadget, software, dan inovasi masa depan.',
                bannerUrl: 'https://placehold.co/800x200/10B981/FFFFFF?text=Teknologi'
            }
        ];
        return communities ? JSON.parse(communities) : initialCommunities;
    }

    function saveCommunities(communities) {
        localStorage.setItem('forumCommunities', JSON.stringify(communities));
    }

    function getThreads() {
        const threads = localStorage.getItem('forumThreads');
        const initialThreads = [
            { id: 1, type: 'penting', isImportant: true, title: 'Tips Lari Pagi untuk Pemula', description: 'Lari pagi adalah cara yang bagus untuk memulai hari.', author: 'Andi', community: 'Olahraga', likes: 15, dislikes: 2, replies: [{author: 'Budi', text: 'Sangat membantu!'}] },
            { id: 2, type: 'event', isImportant: false, title: 'Workshop Melukis Gundam', description: 'Belajar teknik dasar airbrushing.', author: 'Komunitas G-Force', community: 'Hobi', eventDate: '2025-10-15', eventLocation: 'Aula Kota', likes: 25, dislikes: 1, replies: [] }
        ];
        if (!threads) return initialThreads;
        
        let parsedThreads = JSON.parse(threads);
        parsedThreads.forEach(t => { 
            if (!t.replies) t.replies = []; 
            if (t.likes === undefined) t.likes = 0;
            if (t.dislikes === undefined) t.dislikes = 0;
            if (t.description === undefined) t.description = "Tidak ada deskripsi.";
            if (t.type === undefined) t.type = 'normal';
            if (t.category && !t.community) {
                t.community = t.category;
                delete t.category;
            }
        });
        return parsedThreads;
    }

    function saveThreads(threads) {
        localStorage.setItem('forumThreads', JSON.stringify(threads));
    }

    // --- BAGIAN 3: FUNGSI MENAMPILKAN DATA (RENDER) ---
    function renderCommunityListPage() {
        const communities = getCommunities();
        communityCardsContainer.innerHTML = '';
        if (communities.length === 0) {
            communityCardsContainer.innerHTML = "<p>Belum ada komunitas. Ayo buat yang pertama!</p>";
        } else {
            communities.forEach(community => {
                const card = document.createElement('div');
                card.className = 'community-card';
                card.dataset.communityName = community.name;
                card.innerHTML = `
                    <div class="card-banner" style="background-image: url('${community.bannerUrl}')"></div>
                    <div class="card-content">
                        <h3>r/${community.name}</h3>
                        <p>${community.description}</p>
                    </div>
                `;
                communityCardsContainer.appendChild(card);
            });
        }
    }

    function renderCommunityList() {
        const communities = getCommunities();
        categoryList.innerHTML = '';
        communities.forEach(community => {
            const li = document.createElement('li');
            li.textContent = `r/${community.name}`;
            li.dataset.communityName = community.name;
            categoryList.appendChild(li);
        });
    }

    function renderCommunityHeader() {
        if (currentCommunity) {
            const communityData = getCommunities().find(c => c.name === currentCommunity);
            const communityInfoEl = document.getElementById('community-info');
            const bannerImageEl = document.getElementById('community-banner-image');
            if (communityData) {
                communityInfoEl.innerHTML = `<h2>r/${communityData.name}</h2><p>${communityData.description}</p>`;
                bannerImageEl.style.backgroundImage = `url('${communityData.bannerUrl}')`;
            }
        }
    }

    function renderThreads(sortBy = 'default') {
        let allThreads = getThreads();
        threadsList.innerHTML = '';
        const filteredByCommunity = allThreads.filter(thread => thread.community === currentCommunity);
        filteredByCommunity.sort((a, b) => (b.isImportant - a.isImportant) || (sortBy === 'trending' ? b.likes - a.likes : b.id - a.id));

        if (filteredByCommunity.length === 0) {
            threadsList.innerHTML = `<p>Belum ada post di komunitas ini. Jadilah yang pertama!</p>`;
        } else {
            filteredByCommunity.forEach(thread => {
                const card = document.createElement('div');
                card.className = 'thread-card';
                let postLabel = '';
                if (thread.isImportant) {
                    postLabel = '<span class="post-label label-penting">⭐ PENTING</span>';
                } else if (thread.type === 'event') {
                    postLabel = '<span class="post-label label-event">📅 EVENT</span>';
                }
                let eventInfoHTML = '';
                if (thread.type === 'event') {
                    eventInfoHTML = `<div class="event-info">Lokasi: ${thread.eventLocation} | Tanggal: ${thread.eventDate}</div>`;
                }
                let repliesHTML = thread.replies.map(reply => `<div class="reply"><strong>${reply.author}:</strong><p>${reply.text}</p></div>`).join('');

                card.innerHTML = `
                    <h3>${thread.title} ${postLabel}</h3>
                    <div class="thread-meta"><span>Diposting oleh: <strong>${thread.author}</strong></span></div>
                    <p class="thread-description">${thread.description}</p>
                    ${eventInfoHTML}
                    <div class="card-actions">
                        <div class="action-item like-button" data-thread-id="${thread.id}"><i class="fa-solid fa-thumbs-up"></i> <span>Suka (${thread.likes})</span></div>
                        <div class="action-item dislike-button" data-thread-id="${thread.id}"><i class="fa-solid fa-thumbs-down"></i> <span>Tidak Suka (${thread.dislikes})</span></div>
                        <div class="action-item comment-toggle-button" data-thread-id="${thread.id}"><i class="fa-solid fa-comment"></i> <span>Balas (${thread.replies.length})</span></div>
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
    }
    
    function renderEventsSidebar(allThreads) {
        const eventListSidebar = document.getElementById('event-list-sidebar');
        if (!eventListSidebar) return;
        eventListSidebar.innerHTML = '';
        const latestEvents = allThreads.filter(t => t.type === 'event').slice(0, 3);
        if (latestEvents.length === 0) {
            eventListSidebar.innerHTML = '<li><small>Belum ada event.</small></li>';
        } else {
            latestEvents.forEach(event => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#">${event.title}</a><small>${event.eventDate}</small>`;
                eventListSidebar.appendChild(li);
            });
        }
    }

    function populateCommunitySelect() {
        const communities = getCommunities();
        categorySelect.innerHTML = '';
        communities.forEach(community => {
            const option = document.createElement('option');
            option.value = community.name;
            option.textContent = `r/${community.name}`;
            categorySelect.appendChild(option);
        });
        const createNewOption = document.createElement('option');
        createNewOption.value = 'new';
        createNewOption.textContent = 'Buat Komunitas Baru...';
        categorySelect.appendChild(createNewOption);
    }

    function renderPage(sortBy = 'default') {
        renderCommunityList();
        renderEventsSidebar(getThreads());
        if (currentView === 'community-list') {
            communityListPage.classList.remove('hidden');
            threadViewContainer.classList.add('hidden');
            renderCommunityListPage();
        } else {
            communityListPage.classList.add('hidden');
            threadViewContainer.classList.remove('hidden');
            renderCommunityHeader();
            renderThreads(sortBy);
        }
    }

    // --- BAGIAN 4: EVENT LISTENERS (AKSI PENGGUNA) ---
    function setActiveNavItem(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    mainContent.addEventListener('click', (e) => {
        const communityCard = e.target.closest('.community-card');
        if (communityCard) {
            currentView = 'thread-list';
            currentCommunity = communityCard.dataset.communityName;
            setActiveNavItem(null);
            renderPage();
        }
    });

    navHome.addEventListener('click', () => {
        currentView = 'community-list';
        currentCommunity = null;
        setActiveNavItem(navHome);
        renderPage();
    });

    navCategory.addEventListener('click', () => {
        categoryList.classList.toggle('hidden');
    });

    categoryList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            currentView = 'thread-list';
            currentCommunity = e.target.dataset.communityName;
            setActiveNavItem(navCategory);
            renderPage('default');
        }
    });

    createCommunityBtn.addEventListener('click', () => {
        communityModal.classList.remove('hidden');
    });

    communityModal.querySelector('.close-button').addEventListener('click', () => {
        communityModal.classList.add('hidden');
    });

   addCommunityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('community-name').value.trim();
    const desc = document.getElementById('community-desc').value.trim();
    const bannerFile = document.getElementById('community-banner-upload').files[0];

    if (!name || !desc) {
        alert("Nama dan deskripsi komunitas tidak boleh kosong!");
        return;
    }

    const communities = getCommunities();
    if (communities.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert("Komunitas dengan nama tersebut sudah ada!");
        return;
    }

    let bannerUrl = `https://placehold.co/800x200/6D7275/FFFFFF?text=${name}`;
    if (bannerFile) {
        bannerUrl = await fileToBase64(bannerFile);
    }

    communities.push({ name, description: desc, bannerUrl });
    saveCommunities(communities);

    addCommunityForm.reset();
    communityModal.classList.add('hidden');
    renderPage();
});

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

    startPostBtn.addEventListener('click', () => {
        postModal.classList.remove('hidden');
        populateCommunitySelect();
        if (currentCommunity) {
            categorySelect.value = currentCommunity;
            categorySelect.disabled = true;
        } else {
            categorySelect.disabled = false;
        }
    });

    postModal.querySelector('.close-button').addEventListener('click', () => {
        postModal.classList.add('hidden');
    });
    
    postTypeSelect.addEventListener('change', () => {
        eventFields.classList.toggle('hidden', postTypeSelect.value !== 'event');
    });

    categorySelect.addEventListener('change', () => {
        newCategoryInput.classList.toggle('hidden', categorySelect.value !== 'new');
    });

    addThreadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const postType = postTypeSelect.value;
        let communityValue = categorySelect.value;
        
        if (communityValue === 'new') {
            const newCommunityName = newCategoryInput.value.trim();
            if (newCommunityName) {
                const communities = getCommunities();
                if (communities.some(c => c.name.toLowerCase() === newCommunityName.toLowerCase())) {
                    alert("Komunitas dengan nama tersebut sudah ada!");
                    return;
                }
                const bannerUrl = `https://placehold.co/800x200/6D7275/FFFFFF?text=${newCommunityName}`;
                communities.push({ name: newCommunityName, description: 'Deskripsi default.', bannerUrl });
                saveCommunities(communities);
                communityValue = newCommunityName;
            }
        }
        
        const threads = getThreads();
        threads.push({
            id: Date.now(),
            type: postType,
            isImportant: postType === 'penting',
            title: document.getElementById('thread-title').value,
            description: document.getElementById('thread-description').value,
            author: document.getElementById('thread-author').value,
            community: communityValue,
            eventDate: document.getElementById('event-date').value,
            eventLocation: document.getElementById('event-location').value,
            likes: 0,
            dislikes: 0,
            replies: []
        });
        saveThreads(threads);
        
        addThreadForm.reset();
        postModal.classList.add('hidden');
        renderPage();
    });

    threadsList.addEventListener('click', (e) => {
        const actionButton = e.target.closest('.action-item');
        if (!actionButton) return;
        const threads = getThreads();
        const threadId = Number(actionButton.dataset.threadId);
        const threadToUpdate = threads.find(t => t.id === threadId);
        if (!threadToUpdate) return;
        let needsRender = false;

        if (actionButton.classList.contains('like-button')) {
            threadToUpdate.likes++;
            needsRender = true;
        } else if (actionButton.classList.contains('dislike-button')) {
            threadToUpdate.dislikes++;
            needsRender = true;
        } else if (actionButton.classList.contains('comment-toggle-button')) {
            actionButton.closest('.thread-card').querySelector('.replies-wrapper').classList.toggle('visible');
        }

        if (needsRender) {
            saveThreads(threads);
            renderPage();
        }
    });

    threadsList.addEventListener('submit', (e) => {
        if (e.target.classList.contains('reply-form')) {
            e.preventDefault();
            const threadId = Number(e.target.dataset.threadId);
            const author = e.target.querySelector('.reply-author-input').value.trim();
            const text = e.target.querySelector('.reply-text-input').value.trim();
            if (!author || !text) { alert('Nama dan isi balasan tidak boleh kosong!'); return; }
            const threads = getThreads();
            const threadToUpdate = threads.find(t => t.id === threadId);
            if (threadToUpdate) {
                threadToUpdate.replies.push({ author, text });
                saveThreads(threads);
                renderPage();
                const newCard = document.querySelector(`.action-item[data-thread-id="${threadId}"]`).closest('.thread-card');
                if (newCard) { newCard.querySelector('.replies-wrapper').classList.add('visible'); }
            }
        }
    });

    // --- DIMODIFIKASI: Logika untuk menu ganti banner ---

    // Menampilkan/menyembunyikan dropdown menu saat ikon tiga titik diklik
    bannerMenuTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Mencegah event klik menyebar ke window/document
        bannerDropdownMenu.classList.toggle('hidden');
    });

    // Memicu klik pada input file tersembunyi saat opsi "Ganti Banner" diklik
    changeBannerAction.addEventListener('click', () => {
        changeBannerInput.click();
        bannerDropdownMenu.classList.add('hidden'); // Sembunyikan menu setelah diklik
    });

    // Event listener ini tetap sama, akan berjalan setelah file dipilih
    changeBannerInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file || !currentCommunity) return;
        const newBannerUrl = await fileToBase64(file);

        const communities = getCommunities();
        const targetCommunity = communities.find(c => c.name === currentCommunity);
        if (targetCommunity) {
            targetCommunity.bannerUrl = newBannerUrl;
            saveCommunities(communities);
            renderCommunityHeader(); // Render ulang header untuk menampilkan banner baru
        }
    });

    // Menutup dropdown menu jika user mengklik di luar area menu
    document.addEventListener('click', (e) => {
        if (!bannerDropdownMenu.classList.contains('hidden')) {
             if (!bannerMenuTrigger.contains(e.target) && !bannerDropdownMenu.contains(e.target)) {
                bannerDropdownMenu.classList.add('hidden');
            }
        }
    });


    // --- BAGIAN 5: INISIALISASI ---
    renderPage();
});