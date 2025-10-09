document.addEventListener('DOMContentLoaded', () => {
    displayApprovedEvents();
    setupModalListeners();
});

// Fungsi utama untuk menampilkan daftar event yang disetujui
function displayApprovedEvents() {
    const eventsContainer = document.getElementById('approved-events-list');
    if (!eventsContainer) return;

    const allEvents = JSON.parse(localStorage.getItem('eventSuggestions')) || [];
    const approvedEvents = allEvents.filter(event => event.status === 'Approved');
    
    eventsContainer.innerHTML = '';
    if (approvedEvents.length === 0) {
        eventsContainer.innerHTML = '<p class="no-events-message">There are no approved events yet. Suggest one!</p>';
        return;
    }

    approvedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    approvedEvents.forEach(event => {
        // [PERUBAHAN] Membuat struktur kartu event yang baru
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.dataset.eventId = event.id; // Menambahkan ID event untuk dicari saat diklik

        // Avatar placeholder (bisa diganti jika Anda punya data gambar user)
        const avatarUrl = 'https://i.pravatar.cc/30?u=' + event.submitter;

        eventCard.innerHTML = `
            <div class="event-card-votes">
                <span class="thumb">👍</span>
                <span>42</span>
            </div>
            <div class="event-card-main">
                <div class="event-card-header">
                    <img src="${avatarUrl}" alt="Author Avatar">
                    <div class="event-card-author-info">
                        <strong>${event.submitter}</strong> posted ${getRelativeTime(event.id)}
                    </div>
                </div>
                <h3 class="event-card-title">${event.title}</h3>
                <div class="event-card-tags">
                    <span class="tag">${event.category}</span>
                    <span class="tag">Productivity</span>
                </div>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

// Fungsi untuk menampilkan modal dengan detail event
function showEventModal(eventId) {
    const allEvents = JSON.parse(localStorage.getItem('eventSuggestions')) || [];
    const event = allEvents.find(e => e.id == eventId);

    if (!event) return;

    const modalBody = document.getElementById('modal-body-content');
    const modal = document.getElementById('eventModal');

    modalBody.innerHTML = `
        <h2 class="modal-title">${event.title}</h2>
        <p class="modal-author">By ${event.submitter}</p>
        <p class="modal-description">${event.description}</p>
        <div class="modal-tags">
            <span class="tag">${event.category}</span>
            <span class="tag">Productivity</span>
        </div>
        <div class="modal-comments-section">
            <h4>Comments</h4>
            <div class="modal-comment">
                <strong>Citra Lestari</strong>
                <p>I highly recommend the Pomodoro Technique! It really helps me stay focused.</p>
            </div>
            <div class="modal-comment">
                <strong>Doni Firmansyah</strong>
                <p>Using a digital calendar like Google Calendar to block out study time has been a game-changer for me.</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Fungsi untuk menyembunyikan modal
function hideEventModal() {
    const modal = document.getElementById('eventModal');
    modal.style.display = 'none';
}

// Fungsi untuk mengatur semua event listener yang berhubungan dengan modal
function setupModalListeners() {
    const eventsContainer = document.getElementById('approved-events-list');
    const modal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.modal-close-btn');

    // Listener saat kartu event di-klik (menggunakan event delegation)
    if (eventsContainer) {
        eventsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.event-card');
            if (card && card.dataset.eventId) {
                showEventModal(card.dataset.eventId);
            }
        });
    }

    // Listener untuk tombol tutup (X)
    if (closeBtn) {
        closeBtn.addEventListener('click', hideEventModal);
    }
    
    // Listener untuk menutup modal saat mengklik area luar (overlay)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideEventModal();
            }
        });
    }
}

// Fungsi helper untuk mendapatkan waktu relatif (misal: "2 hours ago")
function getRelativeTime(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    return `${days} days ago`;
}