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

// [PENAMBAHAN] Fungsi untuk membuat diagram donat
function createUserDistributionChart() {
    const ctx = document.getElementById('userDistributionChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Member', 'Moderator', 'Admin'],
            datasets: [{
                label: 'Distribusi Pengguna',
                data: [1200, 45, 5], // Data contoh
                backgroundColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(255, 99, 132)'
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
            if (pageName === 'content') {
                if (typeof displayThreadsInAdmin === 'function') {
                    displayThreadsInAdmin();
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
    // [PENAMBAHAN] Panggil fungsi untuk diagram donat
    createUserDistributionChart();
});