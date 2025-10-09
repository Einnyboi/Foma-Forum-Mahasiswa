function initializeCommunityPage() {
    // --- 1. DATA KOMUNITAS ---
    let communities = [
        {
            id: 1,
            name: 'Pecinta Front-End',
            category: 'Teknologi',
            description: 'Grup untuk diskusi seputar HTML, CSS, JavaScript, dan framework modern seperti React atau Vue.',
            members: 124,
            image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            id: 2,
            name: 'Klub Debat Bahasa Inggris',
            category: 'Akademik',
            description: 'Asah kemampuan berpikir kritis dan public speaking dalam bahasa Inggris bersama kami.',
            members: 88,
            image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            id: 3,
            name: 'Fotografi Lensa Kampus',
            category: 'Hobi',
            description: 'Tempat berkumpul para pegiat fotografi, dari pemula hingga mahir. Adakan hunting foto bareng!',
            members: 212,
            image: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
    ];

    // --- 2. REFERENSI ELEMEN ---
    const communityGrid = document.getElementById('communityGrid');
    const searchInput = document.getElementById('communitySearchInput');
    const createCommunityBtn = document.getElementById('createCommunityBtn');

    // View modal elements
    const viewModal = document.getElementById('communityDetailModal');
    const closeViewModalBtn = document.getElementById('closeCommunityModalBtn');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalTag = document.getElementById('modalTag');
    const modalDescription = document.getElementById('modalDescription');
    const modalMembers = document.getElementById('modalMembers');

    // Create modal elements
    const createModal = document.getElementById('createCommunityModal');
    const createCommunityForm = document.getElementById('createCommunityForm');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    const cancelFormBtn = document.getElementById('cancelFormBtn');

    // --- 3. RENDER COMMUNITY CARDS ---
    function renderCommunities(communityArray) {
        communityGrid.innerHTML = '';

        if (communityArray.length === 0) {
            communityGrid.innerHTML = '<p>No community found.</p>';
            return;
        }

        communityArray.forEach(community => {
            const cardHTML = `
                <div class="community-card" data-id="${community.id}">
                    <img src="${community.image}" alt="Logo ${community.name}">
                    <div class="card-content">
                        <h2>${community.name}</h2>
                        <span class="category-tag">${community.category}</span>
                    </div>
                    
                    <div class="card-popup-info">
                        <p class="popup-description">${community.description}</p>
                        <div class="popup-footer">
                            <span>${community.members} Members</span>
                            <a href="#" class="btn btn-primary">+ Join</a>
                        </div>
                    </div>
                </div>
            `;
            communityGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- 4. OPEN & CLOSE VIEW MODAL ---
    function openCommunityModal(communityId) {
        const community = communities.find(c => c.id === communityId);
        if (!community) return;

        modalImage.src = community.image;
        modalTitle.textContent = community.name;
        modalTag.textContent = community.category;
        modalDescription.textContent = community.description;
        modalMembers.textContent = `${community.members} Members`;

        viewModal.classList.add('visible');
    }

    function closeCommunityModal() {
        viewModal.classList.remove('visible');
    }

    // --- 5. CREATE MODAL FUNCTIONS ---
    function openCreateModal() {
        createModal.classList.add('visible');
    }

    function closeCreateModal() {
        createCommunityForm.reset();
        createModal.classList.remove('visible');
    }

    // --- 6. EVENT LISTENERS ---

    // Search communities
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = communities.filter(c => c.name.toLowerCase().includes(searchTerm));
        renderCommunities(filtered);
    });

    // Click on a community card → open detail modal
    communityGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.community-card');
        if (card) {
            const id = parseInt(card.dataset.id);
            openCommunityModal(id);
        }
    });

    // Close view modal
    closeViewModalBtn.addEventListener('click', closeCommunityModal);
    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) closeCommunityModal();
    });

    // Open and close create modal
    createCommunityBtn.addEventListener('click', openCreateModal);
    cancelCreateBtn.addEventListener('click', closeCreateModal);
    cancelFormBtn.addEventListener('click', closeCreateModal);
    createModal.addEventListener('click', (e) => {
        if (e.target === createModal) closeCreateModal();
    });

    // Submit create form
    createCommunityForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newName = document.getElementById('communityNameInput').value.trim();
        const newDescription = document.getElementById('communityDescInput').value.trim();

        if (!newName || !newDescription) {
            alert('Please fill out all fields.');
            return;
        }

        const newCommunity = {
            id: Date.now(),
            name: newName,
            category: 'New',
            description: newDescription,
            members: 1,
            image: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        };

        communities.unshift(newCommunity);
        renderCommunities(communities);
        closeCreateModal();
    });

    // --- INITIALIZE ---
    renderCommunities(communities);
}
