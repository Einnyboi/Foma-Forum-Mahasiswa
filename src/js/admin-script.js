// DATA DUMMY PENGGUNA
const dummyUsers = [
    { id: 1, name: 'Budi Santoso', email: 'budi.s@example.com', role: 'Member' },
    { id: 2, name: 'Citra Lestari', email: 'citra.l@example.com', role: 'Member' },
    { id: 3, name: 'Ahmad Dahlan', email: 'ahmad.d@example.com', role: 'Moderator' },
    { id: 4, name: 'Dewi Ayu', email: 'dewi.a@example.com', role: 'Member' },
    { id: 5, name: 'Eko Prasetyo', email: 'eko.p@example.com', role: 'Member' },
    { id: 6, name: 'Admin Utama', email: 'admin@foma.com', role: 'Admin' }
];


// FUNGSI UNTUK MENAMPILKAN PENGGUNA DI TABEL

function displayUsersInAdmin() {
    // Cari <tbody> dari tabel di dalam #users-content
    const tableBody = document.querySelector('#users-content table tbody');
    if (!tableBody) return;

    // Kosongkan tabel terlebih dahulu
    tableBody.innerHTML = '';

    // Jika tidak ada data, tampilkan pesan
    if (dummyUsers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Tidak ada data pengguna.</td></tr>';
        return;
    }

    // Buat satu baris tabel (<tr>) untuk setiap data pengguna
    dummyUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn-primary" style="background-color: #f59e0b; margin-right: 5px;">Edit</button>
                <button class="btn-primary" style="background-color: #ef4444;">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


// FUNGSI UNTUK GRAFIK (TETAP SAMA)

function createActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;

    const labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const newUsersData = [12, 19, 3, 5, 2, 3, 9];
    const newPostsData = [7, 11, 5, 8, 3, 7, 4];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pengguna Baru',
                    data: newUsersData,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1
                },
                {
                    label: 'Post Baru',
                    data: newPostsData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' }, title: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function createUserDistributionChart() {
    const ctx = document.getElementById('userDistributionChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Member', 'Moderator'], 
            datasets: [{
                label: 'Distribusi Pengguna',
                data: [1200, 45], 
                backgroundColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// EVENT LISTENER UTAMA (DENGAN PENAMBAHAN)
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.sidebar-item');
    const pageTitle = document.getElementById('page-title');
    const contentPages = document.querySelectorAll('.page-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (item.id === 'logout-btn') {
                alert('Fungsi Logout dijalankan!');
                return; 
            }

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const pageName = item.dataset.page;

            // [PENAMBAHAN] Panggil fungsi untuk menampilkan pengguna
            if (pageName === 'users') {
                displayUsersInAdmin();
            }

            if (pageName === 'content') {
                if (typeof displayThreadsInAdmin === 'function') {
                    displayThreadsInAdmin();
                }
            }

            if (pageName === 'approvals') {
                if (typeof displayEventProposals === 'function') {
                    displayEventProposals();
                }
            }

            contentPages.forEach(page => {
                page.style.display = 'none';
            });

            const targetPage = document.getElementById(pageName + '-content');
            if (targetPage) {
                targetPage.style.display = 'block';
            }

            if (item.querySelector('span')) {
                pageTitle.textContent = item.querySelector('span').textContent;
            }
        });
    });

    const dashboardItem = document.querySelector('.sidebar-item[data-page="dashboard"]');
    if (dashboardItem) {
        dashboardItem.click();
    }

    createActivityChart();
    createUserDistributionChart();
});