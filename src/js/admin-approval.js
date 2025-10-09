// Fungsi untuk mengambil data event dari localStorage
function getEventProposals() {
    const events = localStorage.getItem('eventSuggestions');
    return events ? JSON.parse(events) : [];
}

// Fungsi untuk menyimpan kembali data event ke localStorage
function saveEventProposals(events) {
    localStorage.setItem('eventSuggestions', JSON.stringify(events));
}

// Fungsi untuk menampilkan proposal event di tabel admin
function displayEventProposals() {
    const proposals = getEventProposals();
    const tableBody = document.getElementById('approvals-table-body');

    tableBody.innerHTML = ''; // Kosongkan tabel terlebih dahulu

    if (proposals.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Tidak ada proposal event yang masuk.</td></tr>';
        return;
    }

    proposals.forEach(event => {
        const row = document.createElement('tr');
        const isPending = event.status === 'Pending';
        
        // Menampilkan detail event
        const details = `
            Tanggal: ${event.date} <br>
            Waktu: ${event.time} <br>
            Lokasi: ${event.location} <br>
            Deskripsi: ${event.description}
        `;

        row.innerHTML = `
            <td>${event.title}</td>
            <td style="font-size: 0.9em;">${details}</td>
            <td>${event.submitter}</td>
            <td>${event.status}</td>
            <td>
                <button class="btn-primary approve-btn" data-id="${event.id}" style="background-color: #10b981; margin-bottom: 5px;" ${!isPending ? 'disabled' : ''}>Diterima</button>
                <button class="btn-primary reject-btn" data-id="${event.id}" ${!isPending ? 'disabled' : ''}>Ditolak</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fungsi untuk mengubah status event (diterima/ditolak)
function updateEventStatus(eventId, newStatus, reason = '') {
    let events = getEventProposals();
    const eventIndex = events.findIndex(event => event.id == eventId);

    if (eventIndex !== -1) {
        events[eventIndex].status = newStatus;
        events[eventIndex].reason = reason; // Simpan alasan penolakan
        saveEventProposals(events);
        displayEventProposals(); // Refresh tabel
    }
}

// Event listener untuk tombol di tabel persetujuan
document.addEventListener('click', function(e) {
    // Tombol Diterima
    if (e.target.classList.contains('approve-btn')) {
        const eventId = e.target.dataset.id;
        updateEventStatus(eventId, 'Approved');
    }

    // Tombol Ditolak
    if (e.target.classList.contains('reject-btn')) {
        const eventId = e.target.dataset.id;
        const reason = prompt("Silakan masukkan alasan penolakan untuk event ini:");
        if (reason) { // Hanya proses jika admin mengisi alasan
            updateEventStatus(eventId, 'Rejected', reason);
        }
    }
});