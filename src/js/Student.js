document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');
    const backButton = document.getElementById('backToDashboardBtn'); // Ambil elemen tombol 'Back'

    // [KODE UNTUK TOMBOL BACK]
    // Menambahkan fungsionalitas klik pada tombol 'Back'
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back(); // Perintah untuk kembali ke halaman sebelumnya
        });
    }

    // Fungsionalitas untuk form submit
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const existingEvents = JSON.parse(localStorage.getItem('eventSuggestions')) || [];

            const newEvent = {
                id: Date.now(),
                title: document.getElementById('Event-title').value,
                date: document.getElementById('Event-date').value,
                time: document.getElementById('Event-time').value,
                location: document.getElementById('Event-location').value,
                description: document.getElementById('Event-description').value,
                category: document.getElementById('Event-category').value,
                submitter: document.getElementById('Student-name').value || 'Anonymous',
                status: 'Pending',
                reason: '',
                image: ''
            };

            const imageInput = document.getElementById('Event-image');
            if (imageInput && imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(eventReader) {
                    newEvent.image = eventReader.target.result;
                    saveAndFinish(newEvent, existingEvents, eventForm);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                saveAndFinish(newEvent, existingEvents, eventForm);
            }
        });
    }
});

function saveAndFinish(newEvent, existingEvents, eventForm) {
    existingEvents.push(newEvent);
    localStorage.setItem('eventSuggestions', JSON.stringify(existingEvents));
    
    alert('Event suggestion submitted successfully for review!');
    
    // [KODE UNTUK KEMBALI OTOMATIS]
    // Setelah submit, halaman akan otomatis kembali ke dasbor
    window.history.back();
}