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

    tableBody.innerHTML = ''; 

    if (proposals.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Tidak ada proposal event yang masuk.</td></tr>';
        return;
    }

    proposals.forEach(event => {
        const row = document.createElement('tr');
        const isPending = event.status === 'Pending';
        
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
            <td><span class="status-${event.status.toLowerCase()}">${event.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-primary btn-approve approve-btn" data-id="${event.id}" ${!isPending ? 'disabled' : ''}>Diterima</button>
                    <button class="btn-primary btn-reject reject-btn" data-id="${event.id}" ${!isPending ? 'disabled' : ''}>Ditolak</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fungsi untuk mengubah status event (diterima/ditolak)
function updateEventStatus(eventId, newStatus, reason = '') {
    let events = getEventProposals();
    // [PERUBAIKAN] Di sini kita menggunakan '==' agar tidak terlalu ketat soal tipe data,
    // karena eventId dari prompt bisa jadi string atau angka.
    const eventIndex = events.findIndex(event => event.id == eventId);

    if (eventIndex !== -1) {
        events[eventIndex].status = newStatus;
        if (newStatus === 'Rejected') {
            events[eventIndex].reason = reason;
        }
        saveEventProposals(events);
        displayEventProposals(); // Refresh tabel
    } else {
        console.error('Event with ID', eventId, 'not found.');
    }
}

// Event listener untuk tombol di tabel persetujuan
document.addEventListener('click', function(e) {
    // Tombol Diterima
    if (e.target.classList.contains('approve-btn')) {
        // [PERBAIKAN] Mengubah ID dari string kembali ke angka menggunakan parseInt
        const eventId = parseInt(e.target.dataset.id, 10);
        if (confirm('Are you sure you want to approve this event?')) {
            updateEventStatus(eventId, 'Approved');
        }
    }

    // Tombol Ditolak
    if (e.target.classList.contains('reject-btn')) {
        // [PERBAIKAN] Mengubah ID dari string kembali ke angka menggunakan parseInt
        const eventId = parseInt(e.target.dataset.id, 10);
        const reason = prompt("Silakan masukkan alasan penolakan untuk event ini:");
        
        if (reason) { 
            updateEventStatus(eventId, 'Rejected', reason);
        } else if (reason === "") {
            alert("Reason for rejection cannot be empty.");
        }
    }
});