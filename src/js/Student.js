// ==========================================================================
// BAGIAN ASLI ANDA (TETAP ADA)
// ==========================================================================

// Event class to represent an event suggestion
class EventSuggestion {
    constructor(title, date, time, location, description, category, image, studentName) {
        this.id = Date.now(); // Menggunakan timestamp sebagai ID
        this.title = title;
        this.date = date;
        this.time = time;
        this.location = location;
        this.description = description || '';
        this.category = category;
        this.image = image || ''; // Menyimpan gambar sebagai base64
        this.submitter = studentName || 'Anonymous';
        this.status = 'Pending'; // Status awal
        this.reason = ''; // Alasan penolakan (awalnya kosong)
    }
}

// Fungsi-fungsi ini tetap ada jika Anda membutuhkannya di tempat lain
function displayEvents(events) {
    console.log('Events loaded:', events.length);
}
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
function initializeSampleData() {
    // Fungsi ini tidak kita gunakan untuk alur utama tapi tetap ada
}


// ==========================================================================
// PENGGABUNGAN DAN PENAMBAHAN FUNGSI (BAGIAN YANG DIPERBARUI)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');

    if (eventForm) {
        // HANYA SATU EVENT LISTENER UNTUK SUBMIT FORM
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah reload

            // [PERBAIKAN] Mengambil semua nilai dari form dengan ID yang BENAR (case-sensitive)
            const title = document.getElementById('Event-title').value;
            const date = document.getElementById('Event-date').value;
            const time = document.getElementById('Event-time').value;
            const location = document.getElementById('Event-location').value;
            const description = document.getElementById('Event-description').value;
            const category = document.getElementById('Event-category').value;
            const studentName = document.getElementById('Student-name').value;
            const imageInput = document.getElementById('Event-image');

            // Logika untuk membaca file gambar
            if (imageInput && imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageData = e.target.result; // Gambar dalam format base64
                    completeSubmission(title, date, time, location, description, category, imageData, studentName);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                // Jika tidak ada gambar, lanjutkan dengan string kosong
                completeSubmission(title, date, time, location, description, category, '', studentName);
            }
        });
    }

    // Memanggil fungsi untuk menampilkan event di halaman mahasiswa saat halaman dimuat
    // Anda bisa memanggil fungsi-fungsi ini jika sudah menyiapkan div-nya di HTML
    // displayApprovedEvents();
    // displayMySubmissions();
});

function completeSubmission(title, date, time, location, description, category, image, studentName) {
    // Membuat objek event baru menggunakan class yang sudah Anda buat
    const newEvent = new EventSuggestion(title, date, time, location, description, category, image, studentName);

    // Ambil data yang sudah ada dari localStorage
    const existingEvents = JSON.parse(localStorage.getItem('eventSuggestions')) || [];
    
    // Tambahkan event baru
    existingEvents.push(newEvent);

    // Simpan kembali ke localStorage dengan key 'eventSuggestions' agar bisa dibaca admin
    localStorage.setItem('eventSuggestions', JSON.stringify(existingEvents));

    // Reset form dan beri notifikasi
    document.getElementById('event-form').reset();
    alert('Event suggestion submitted successfully for review!');
    
    // Perbarui tampilan di halaman mahasiswa (jika ada)
    // displayMySubmissions();
}


// ==========================================================================
// FUNGSI BARU YANG DITAMBAHKAN (bisa Anda gunakan nanti)
// ==========================================================================

/**
 * [FUNGSI BARU]
 * Menampilkan event yang statusnya sudah 'Approved' oleh admin.
 */
function displayApprovedEvents() {
    const eventsContainer = document.getElementById('approved-events-container');
    if (!eventsContainer) return;

    const allEvents = JSON.parse(localStorage.getItem('eventSuggestions')) || [];
    const approvedEvents = allEvents.filter(event => event.status === 'Approved');

    eventsContainer.innerHTML = '';
    if (approvedEvents.length === 0) {
        eventsContainer.innerHTML = '<p>No approved events yet.</p>';
        return;
    }
    approvedEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <h4>${event.title}</h4>
            <p><strong>Date:</strong> ${event.date} at ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

/**
 * [FUNGSI BARU]
 * Menampilkan status semua event yang pernah diajukan oleh mahasiswa.
 */
function displayMySubmissions() {
    const submissionsContainer = document.getElementById('my-submissions-container');
    if (!submissionsContainer) return;
    
    const currentStudentName = document.getElementById('Student-name').value || 'Anonymous';
    const allEvents = JSON.parse(localStorage.getItem('eventSuggestions')) || [];
    const myEvents = allEvents.filter(event => event.submitter === currentStudentName);

    submissionsContainer.innerHTML = '';
    if (myEvents.length === 0) {
        submissionsContainer.innerHTML = '<p>You have not submitted any events.</p>';
        return;
    }
    myEvents.forEach(event => {
        const submissionCard = document.createElement('div');
        submissionCard.className = 'submission-card';
        
        let statusInfo = `Status: ${event.status}`;
        if (event.status === 'Rejected' && event.reason) {
            statusInfo += `<br><small><strong>Reason:</strong> ${event.reason}</small>`;
        }

        submissionCard.innerHTML = `
            <h4>${event.title}</h4>
            <p><strong>Date Submitted:</strong> ${new Date(event.id).toLocaleDateString()}</p>
            <p>${statusInfo}</p>
        `;
        submissionsContainer.appendChild(submissionCard);
    });
}