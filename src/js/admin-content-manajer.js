// File ini berfungsi untuk mengelola konten thread dari halaman admin.

// Fungsi untuk mengambil data threads dari localStorage (kunci yang sama dengan script.js utama)
function getThreadsFromStorage() {
    const threads = localStorage.getItem('forumThreads');
    return threads ? JSON.parse(threads) : [];
}

// Fungsi untuk menyimpan kembali data threads ke localStorage
function saveThreadsToStorage(threads) {
    localStorage.setItem('forumThreads', JSON.stringify(threads));
}

// Fungsi untuk menampilkan semua threads di dalam tabel admin
function displayThreadsInAdmin() {
    const threads = getThreadsFromStorage();
    const tableBody = document.getElementById('threads-management-table-body');

    // Kosongkan tabel terlebih dahulu
    tableBody.innerHTML = '';

    if (threads.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Belum ada konten thread.</td></tr>';
        return;
    }

    // Buat satu baris tabel (<tr>) untuk setiap data thread
    threads.forEach(thread => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${thread.title}</td>
            <td>${thread.author}</td>
            <td>${thread.community}</td>
            <td>
                <button class="btn-primary edit-btn" data-id="${thread.id}" style="background-color: #f59e0b; margin-right: 5px;">Edit</button>
                <button class="btn-primary delete-btn" data-id="${thread.id}" style="background-color: #ef4444;">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fungsi untuk menghapus thread
function deleteThread(threadId) {
    if (!confirm('Apakah Anda yakin ingin menghapus thread ini?')) {
        return; // Batalkan jika pengguna menekan "Cancel"
    }

    let threads = getThreadsFromStorage();
    // Filter threads, simpan semua kecuali yang ID-nya cocok
    threads = threads.filter(thread => thread.id !== threadId);
    saveThreadsToStorage(threads);
    
    // Tampilkan ulang data di tabel setelah dihapus
    displayThreadsInAdmin(); 
}

// Fungsi untuk mengedit thread
function editThread(threadId) {
    let threads = getThreadsFromStorage();
    const threadToEdit = threads.find(thread => thread.id === threadId);

    if (!threadToEdit) {
        alert('Thread tidak ditemukan!');
        return;
    }

    // Gunakan prompt sederhana untuk mengedit (bisa dikembangkan menjadi modal)
    const newTitle = prompt('Masukkan judul baru:', threadToEdit.title);
    const newDescription = prompt('Masukkan deskripsi baru:', threadToEdit.description);

    // Jika pengguna tidak membatalkan prompt
    if (newTitle !== null && newDescription !== null) {
        threadToEdit.title = newTitle;
        threadToEdit.description = newDescription;
        saveThreadsToStorage(threads);
        displayThreadsInAdmin(); // Tampilkan ulang data setelah di-edit
    }
}


// Event listener utama untuk tombol di dalam tabel "Kelola Konten"
document.addEventListener('click', (event) => {
    // Cek apakah tombol hapus yang diklik
    if (event.target.classList.contains('delete-btn')) {
        const threadId = parseInt(event.target.dataset.id, 10);
        deleteThread(threadId);
    }

    // Cek apakah tombol edit yang diklik
    if (event.target.classList.contains('edit-btn')) {
        const threadId = parseInt(event.target.dataset.id, 10);
        editThread(threadId);
    }
});