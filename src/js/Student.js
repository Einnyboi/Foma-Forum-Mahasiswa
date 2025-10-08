document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');

    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah halaman reload

            // Ambil data event yang sudah ada dari localStorage, atau buat array baru jika kosong
            const existingEvents = JSON.parse(localStorage.getItem('eventSuggestions')) || [];

            // Kumpulkan data dari form ke dalam satu objek
            const newEvent = {
                id: Date.now(), // ID unik menggunakan timestamp
                title: document.getElementById('event-title').value,
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value,
                location: document.getElementById('event-location').value,
                description: document.getElementById('event-description').value,
                category: document.getElementById('event-category').value,
                submitter: document.getElementById('student-name').value || 'Anonymous',
                status: 'Pending' // Status awal untuk semua pengajuan baru
            };

            // Tambahkan event baru ke dalam array
            existingEvents.push(newEvent);

            // Simpan kembali array yang sudah diupdate ke localStorage
            localStorage.setItem('eventSuggestions', JSON.stringify(existingEvents));

            // Beri notifikasi dan reset form
            alert('Event suggestion submitted successfully for review!');
            eventForm.reset();
        });
    }
});