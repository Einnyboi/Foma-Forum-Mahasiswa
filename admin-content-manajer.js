document.addEventListener('DOMContentLoaded', () => {

    // --- FUNGSI JEMBATAN (SAMA PERSIS DENGAN DI script.js) ---
    // Fungsi ini membaca data dari localStorage, sumber yang sama dengan threads.html
    function getThreads() {
        const threads = localStorage.getItem('forumThreads');
        if (!threads) return []; // Jika tidak ada data, kembalikan array kosong
        return JSON.parse(threads);
    }

    // Fungsi ini menyimpan data kembali ke localStorage setelah ada perubahan (misal: hapus)
    function saveThreads(threads) {
        localStorage.setItem('forumThreads', JSON.stringify(threads));
    }


    // --- FUNGSI UNTUK MENAMPILKAN DATA KE TABEL ADMIN ---
    function renderThreadsTable() {
        const tableBody = document.getElementById('threads-management-table-body');
        if (!tableBody) return; // Hentikan jika elemen tidak ditemukan

        const allThreads = getThreads();
        tableBody.innerHTML = ''; // Kosongkan tabel sebelum mengisi data baru

        if (allThreads.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Belum ada thread untuk dikelola.</td></tr>';
            return;
        }

        allThreads.forEach(thread => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${thread.title}</td>
                <td>${thread.author}</td>
                <td>${thread.category}</td>
                <td>
                    <button class="action-btn delete-btn" data-thread-id="${thread.id}">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }


    // --- FUNGSI UNTUK MENGELOLA AKSI (HAPUS THREAD) ---
    function setupEventListeners() {
        const tableBody = document.getElementById('threads-management-table-body');
        if (!tableBody) return;

        tableBody.addEventListener('click', (e) => {
            // Cek apakah yang diklik adalah tombol dengan kelas 'delete-btn'
            if (e.target.classList.contains('delete-btn')) {
                const threadId = Number(e.target.dataset.threadId);
                
                // Konfirmasi sebelum menghapus
                if (confirm('Anda yakin ingin menghapus thread ini secara permanen?')) {
                    handleDeleteThread(threadId);
                }
            }
        });
    }

    function handleDeleteThread(threadId) {
        let threads = getThreads();
        // Buat array baru yang berisi semua thread KECUALI yang ID-nya cocok
        const updatedThreads = threads.filter(t => t.id !== threadId);
        
        saveThreads(updatedThreads); // Simpan array baru ke localStorage
        renderThreadsTable();      // Tampilkan ulang tabel dengan data terbaru
    }


    // --- INISIALISASI ---
    // Tampilkan tabel saat halaman dimuat
    renderThreadsTable();
    // Siapkan event listener untuk tombol hapus
    setupEventListeners();

    // Tambahan: Agar data di-refresh setiap kali menu "Kelola Konten" diklik
    const navContent = document.querySelector('.nav-item[data-page="content"]');
    if(navContent) {
        navContent.addEventListener('click', renderThreadsTable);
    }
});