document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const pageTitle = document.getElementById('page-title');
    const contentPages = document.querySelectorAll('.page-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 1. Logika untuk tombol Logout
            if (item.id === 'logout-btn') {
                alert('Fungsi Logout dijalankan!');
                return; 
            }

            // 2. Hapus kelas 'active' dari SEMUA menu
            navItems.forEach(nav => nav.classList.remove('active'));

            // 3. Tambahkan kelas 'active' HANYA ke menu yang diklik
            item.classList.add('active');

            // 4. Dapatkan nama halaman dari atribut data-page
            const pageName = item.dataset.page; // Contoh: "dashboard", "users"

            // 5. Sembunyikan SEMUA halaman konten
            contentPages.forEach(page => {
                page.style.display = 'none';
            });

            // 6. Tampilkan HANYA halaman yang sesuai dengan menu yang diklik
            const targetPage = document.getElementById(pageName + '-content');
            if (targetPage) {
                targetPage.style.display = 'block';
            }

            // 7. (Opsional) Ubah judul header utama
            pageTitle.textContent = item.querySelector('span').textContent;
        });
    });
});