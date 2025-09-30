// Menunggu sampai seluruh halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA KOMUNITAS ---
    // Di proyek nyata, data ini datang dari database.
    // Untuk sekarang, kita simpan di sini sebagai array of objects.
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
    const communityGrid = document.getElementById('communityGrid');
    const searchInput = document.getElementById('searchInput');
    const createCommunityBtn = document.getElementById('createCommunityBtn');


    // --- 3. FUNGSI UNTUK MENAMPILKAN KOMUNITAS ---
    // Fungsi ini akan mengambil data dari array 'communities' dan mengubahnya menjadi kartu HTML
    function renderCommunities(communityArray) {
        // Kosongkan grid terlebih dahulu
        communityGrid.innerHTML = '';

        // Jika tidak ada komunitas yang cocok, tampilkan pesan
        if (communityArray.length === 0) {
            communityGrid.innerHTML = '<p>Komunitas tidak ditemukan.</p>';
            return;
        }

        // Loop untuk setiap objek di dalam array dan buat kartu HTML-nya
        communityArray.forEach(community => {
            const cardHTML = `
                <div class="community-card">
                    <img src="${community.image}" alt="Logo ${community.name}">
                    <div class="card-content">
                        <h2>${community.name}</h2>
                        <span class="category-tag">${community.category}</span>
                        <p>${community.description}</p>
                        <div class="card-footer">
                            <span>${community.members} Anggota</span>
                            <a href="#" class="btn btn-primary">+ Join</a>
                        </div>
                    </div>
                </div>
            `;
            // Masukkan kartu yang sudah jadi ke dalam grid
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
        if (!newName) return; // Jika pengguna klik cancel

        const newDescription = prompt("Masukkan deskripsi singkat untuk " + newName + ":");
        if (!newDescription) return;

        // Buat objek komunitas baru
        const newCommunity = {
            name: newName,
            category: 'Baru',
            description: newDescription,
            members: 1, // Dimulai dari 1 anggota (si pembuat)
            image: 'https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' // Gambar default
        };

        // Tambahkan komunitas baru ke awal array
        communities.unshift(newCommunity);

        // Tampilkan ulang semua komunitas, termasuk yang baru
        renderCommunities(communities);
    });


    // --- INISIASI: TAMPILKAN SEMUA KOMUNITAS SAAT HALAMAN PERTAMA KALI DIBUKA ---
    renderCommunities(communities);

});
