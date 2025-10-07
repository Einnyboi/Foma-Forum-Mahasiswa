function initializeCommunityPage() {
    // --- 1. DATA KOMUNITAS ---
    let communities = [
        {
            name: 'Pecinta Front-End',
            category: 'Teknologi',
            description: 'Grup untuk diskusi seputar HTML, CSS, JavaScript, dan framework modern seperti React atau Vue.',
            members: 124,
            image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            name: 'Klub Debat Bahasa Inggris',
            category: 'Akademik',
            description: 'Asah kemampuan berpikir kritis dan public speaking dalam bahasa Inggris bersama kami.',
            members: 88,
            image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            name: 'Fotografi Lensa Kampus',
            category: 'Hobi',
            description: 'Tempat berkumpul para pegiat fotografi, dari pemula hingga mahir. Adakan hunting foto bareng!',
            members: 212,
            image: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
    ];

    // --- 2. REFERENSI ELEMEN HTML ---
    // Note: These elements only exist AFTER community.html is loaded.
    const communityGrid = document.getElementById('communityGrid');
    const searchInput = document.getElementById('searchInput');
    const createCommunityBtn = document.getElementById('createCommunityBtn');

    // Check if elements exist before adding listeners
    if (!communityGrid || !searchInput || !createCommunityBtn) {
        console.error("Community elements not found! Make sure community.html is loaded correctly.");
        return;
    }

    // Replace the existing renderCommunities function with this one
    function renderCommunities(communityArray) {
        const communityGrid = document.getElementById('communityGrid');
        communityGrid.innerHTML = '';

        if (communityArray.length === 0) {
            communityGrid.innerHTML = '<p>Community not found.</p>';
            return;
        }

        communityArray.forEach(community => {
            const cardHTML = `
                <div class="community-card">
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
            communityGrid.innerHTML += cardHTML;
        });
    }

    // --- 4. FUNGSI PENCARIAN (SEARCH) ---
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCommunities = communities.filter(community => {
            return community.name.toLowerCase().includes(searchTerm);
        });
        renderCommunities(filteredCommunities);
    });

    // --- 5. FUNGSI BUAT KOMUNITAS BARU ---
    createCommunityBtn.addEventListener('click', () => {
        const newName = prompt("Masukkan nama komunitas baru:");
        if (!newName) return;
        const newDescription = prompt("Masukkan deskripsi singkat untuk " + newName + ":");
        if (!newDescription) return;
        const newCommunity = {
            name: newName,
            category: 'Baru',
            description: newDescription,
            members: 1,
            image: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        };
        communities.unshift(newCommunity);
        renderCommunities(communities);
    });

    // --- INISIASI ---
    renderCommunities(communities);
}