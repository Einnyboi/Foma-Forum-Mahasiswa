document.addEventListener('DOMContentLoaded', () => {

    // --- BAGIAN 1: MENGAMBIL ELEMEN DARI HTML ---
    const searchInput = document.querySelector('.search-box .input');
    const searchButton = document.querySelector('.search-box .button');
    const popularCategories = document.querySelectorAll('.filter-section .btn-secondary');
    const searchResultsSection = document.querySelector('.search-results');

    // --- BAGIAN 2: DATA DUMMY (Sesuai dengan konten yang mungkin ada) ---
    // Ini adalah array objek yang akan Anda cari.
    // Anda bisa mengganti data ini nanti dengan data dari database, API, atau localStorage.
    const allContent = [
        { id: 1, type: 'thread', title: 'Lowongan magang di perusahaan teknologi', category: 'Info Karir', description: 'Beberapa lowongan magang terbaru untuk mahasiswa IT, cocok untuk pemula.' },
        { id: 2, type: 'thread', title: 'Rekomendasi tempat nongkrong di Jakarta', category: 'Hobi & Hiburan', description: 'Daftar kafe dengan Wi-Fi kencang dan suasana nyaman untuk nugas atau sekadar santai.' },
        { id: 3, type: 'thread', title: 'Tips belajar efektif untuk ujian semester', category: 'Akademik', description: 'Metode belajar yang terbukti meningkatkan nilai dan mengurangi stres.' },
        { id: 4, type: 'thread', title: 'Cara membuat robot sederhana dari barang bekas', category: 'Hobi & Hiburan', description: 'Panduan langkah demi langkah untuk proyek DIY robotik.' },
        { id: 5, type: 'thread', title: 'Beasiswa ke luar negeri tahun 2025', category: 'Info Karir', description: 'Informasi lengkap tentang beasiswa fully-funded di berbagai negara.' },
        { id: 6, type: 'thread', title: 'Forum tanya jawab seputar tugas akhir', category: 'Akademik', description: 'Tempat diskusi untuk membantu mahasiswa menyelesaikan skripsi.' },
        { id: 7, type: 'popular', title: 'Lowongan magang', category: null, description: null },
        { id: 8, type: 'popular', title: 'Rekomendasi tempat nongkrong', category: null, description: null }
    ];

    // --- BAGIAN 3: FUNGSI UTAMA PENCARIAN & RENDERING ---
    
    /**
     * Merender hasil pencarian ke dalam halaman.
     * @param {Array} results - Array dari objek konten yang akan ditampilkan.
     */
    function renderResults(results) {
    const searchResultsSection = document.querySelector('.search-results');
    searchResultsSection.innerHTML = '';
    
    const heading = document.createElement('h6');
    heading.textContent = results.length > 0 ? 'Hasil Pencarian:' : 'Tidak Ditemukan';
    searchResultsSection.appendChild(heading);

    if (results.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'Maaf, tidak ada hasil yang cocok dengan pencarian Anda.';
        searchResultsSection.appendChild(noResultsMessage);
        return;
    }

    // Menggunakan Fragment untuk performa yang lebih baik
    const fragment = document.createDocumentFragment();

    results.forEach(item => {
        // HANYA RENDER ITEM JIKA BUKAN "POPULAR" SEARCH
        if (item.type !== 'popular') {
            // Buat kontainer div untuk setiap item hasil pencarian
            const resultItemDiv = document.createElement('div');
            resultItemDiv.className = 'popular-search-item'; // Gunakan kelas ini untuk styling kolom

            // Tambahkan judul dan deskripsi ke dalam div
            const titleElement = document.createElement('strong');
            titleElement.textContent = item.title;
            
            const descriptionElement = document.createElement('small');
            descriptionElement.textContent = item.description;

            resultItemDiv.appendChild(titleElement);
            if (item.description) {
                resultItemDiv.appendChild(document.createElement('br'));
                resultItemDiv.appendChild(descriptionElement);
            }
            
            fragment.appendChild(resultItemDiv);
        }
    });

    searchResultsSection.appendChild(fragment);
}

    /**
     * Menangani logika pencarian berdasarkan kata kunci.
     * @param {string} searchTerm - Kata kunci dari input pencarian.
     */
    function handleSearch(searchTerm) {
        const filteredResults = allContent.filter(item => {
            // Saring berdasarkan judul atau deskripsi
            const titleMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
            const descriptionMatch = item.description ? item.description.toLowerCase().includes(searchTerm.toLowerCase()) : false;
            return titleMatch || descriptionMatch;
        });
        
        renderResults(filteredResults);
    }
    
    /**
     * Menangani logika filter berdasarkan kategori.
     * @param {string} category - Nama kategori yang dipilih.
     */
    function handleCategoryFilter(category) {
        const filteredResults = allContent.filter(item => {
            // Saring hanya item yang memiliki kategori yang cocok
            return item.category && item.category.toLowerCase() === category.toLowerCase();
        });

        renderResults(filteredResults);
    }

    // --- BAGIAN 4: EVENT LISTENERS ---

    // Mengaktifkan pencarian saat tombol "Cari" diklik
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            handleSearch(searchTerm);
        } else {
            // Jika input kosong, tampilkan kembali "Pencarian Populer"
            renderResults(allContent.filter(item => item.type === 'popular'));
        }
    });

    // Mengaktifkan pencarian saat tombol "Enter" ditekan di input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchButton.click(); // Memicu event klik pada tombol cari
        }
    });

    // Mengaktifkan filter kategori saat tombol kategori diklik
    popularCategories.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.textContent;
            searchInput.value = ''; // Kosongkan input pencarian untuk kejelasan
            handleCategoryFilter(category);
        });
    });

    // Inisialisasi: Tampilkan "Pencarian Populer" saat halaman pertama kali dimuat
    renderResults(allContent.filter(item => item.type === 'popular'));

});