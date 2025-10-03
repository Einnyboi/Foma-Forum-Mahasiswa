// Data acara contoh
        const events = [
            {
                id: 1,
                title: "Kuliah Umum FTI Gedung R",
                date: "2025-10-15",
                time: "14:00",
                location: "Gedung R, FTI Building",
                description: "Kuliah umum tentang perkembangan teknologi terkini dan peluang karir di bidang IT.",
                image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                status: "approved",
                participants: 142,
                submittedBy: "Jessica",
                submittedDate: "2025-09-28"
            },
            {
                id: 2,
                title: "Workshop UI/UX Design",
                date: "2025-10-20",
                time: "10:00",
                location: "Lab Komputer, Gedung A",
                description: "Pelajari prinsip-prinsip desain antarmuka pengguna dan pengalaman pengguna dalam workshop interaktif ini.",
                image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                status: "pending",
                participants: 0,
                submittedBy: "Michael",
                submittedDate: "2025-09-29"
            },
            {
                id: 3,
                title: "Seminar Kewirausahaan",
                date: "2025-11-05",
                time: "09:00",
                location: "Auditorium Kampus",
                description: "Seminar tentang memulai bisnis dan mengembangkan mindset kewirausahaan.",
                status: "approved",
                participants: 89,
                submittedBy: "Sarah",
                submittedDate: "2025-09-25"
            },
            {
                id: 4,
                title: "Pelatihan Competitive Programming",
                date: "2025-10-10",
                time: "13:00",
                location: "Lab Programming, Gedung C",
                description: "Latihan pemrograman kompetitif untuk persiapan lomba programming nasional.",
                image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                status: "rejected",
                participants: 0,
                submittedBy: "David",
                submittedDate: "2025-09-27",
                rejectionReason: "Jadwal bentrok dengan kegiatan kampus lainnya"
            },
            {
                id: 5,
                title: "Tech Talk: AI & Machine Learning",
                date: "2025-10-25",
                time: "15:30",
                location: "Ruang Seminar, Gedung B",
                description: "Diskusi tentang perkembangan terbaru dalam bidang Artificial Intelligence dan Machine Learning.",
                image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                status: "pending",
                participants: 0,
                submittedBy: "Jessica",
                submittedDate: "2025-09-29"
            },
            {
                id: 6,
                title: "Hackathon 2025",
                date: "2025-11-15",
                time: "08:00",
                location: "Gedung Serba Guna",
                description: "Kompetisi coding 24 jam untuk mengembangkan solusi inovatif untuk masalah sosial.",
                image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                status: "approved",
                participants: 210,
                submittedBy: "Hackathon Club",
                submittedDate: "2025-09-20"
            }
        ];

        // Elemen DOM
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.content');
        const logoutBtn = document.querySelector('.logout-btn');

        // Inisialisasi aplikasi
        document.addEventListener('DOMContentLoaded', function() {
            // Atur penggantian tab
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Perbarui tab aktif
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Tampilkan konten yang sesuai
                    contents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === tabId) {
                            content.classList.add('active');
                        }
                    });
                    
                    // Muat acara yang sesuai untuk tab
                    loadEventsForTab(tabId);
                });
            });

            // Atur tombol keluar
            logoutBtn.addEventListener('click', function() {
                if (confirm('Apakah Anda yakin ingin keluar?')) {
                    alert('Berhasil keluar!');
                    // Di aplikasi nyata, ini akan mengarahkan ke halaman login
                }
            });

            // Atur pendengar perubahan filter
            document.getElementById('sort-events').addEventListener('change', function() {
                loadEventsForTab('dashboard');
            });
            
            document.getElementById('sort-pending').addEventListener('change', function() {
                loadEventsForTab('pending');
            });
            
            document.getElementById('sort-approved').addEventListener('change', function() {
                loadEventsForTab('approved');
            });
            
            document.getElementById('sort-rejected').addEventListener('change', function() {
                loadEventsForTab('rejected');
            });

            // Muat awal
            updateStats();
            loadEventsForTab('dashboard');
        });

        // Perbarui statistik
        function updateStats() {
            const totalEvents = events.length;
            const pendingEvents = events.filter(event => event.status === 'pending').length;
            const approvedEvents = events.filter(event => event.status === 'approved').length;
            const rejectedEvents = events.filter(event => event.status === 'rejected').length;

            document.getElementById('total-events').textContent = totalEvents;
            document.getElementById('pending-events').textContent = pendingEvents;
            document.getElementById('approved-events').textContent = approvedEvents;
            document.getElementById('rejected-events').textContent = rejectedEvents;
        }

        // Muat acara untuk tab tertentu
        function loadEventsForTab(tabId) {
            let filteredEvents = [];
            let containerId = '';
            let sortValue = '';

            switch(tabId) {
                case 'dashboard':
                    filteredEvents = events.filter(event => event.status === 'approved');
                    containerId = 'recent-events';
                    sortValue = document.getElementById('sort-events').value;
                    break;
                case 'pending':
                    filteredEvents = events.filter(event => event.status === 'pending');
                    containerId = 'pending-events-container';
                    sortValue = document.getElementById('sort-pending').value;
                    break;
                case 'approved':
                    filteredEvents = events.filter(event => event.status === 'approved');
                    containerId = 'approved-events-container';
                    sortValue = document.getElementById('sort-approved').value;
                    break;
                case 'rejected':
                    filteredEvents = events.filter(event => event.status === 'rejected');
                    containerId = 'rejected-events-container';
                    sortValue = document.getElementById('sort-rejected').value;
                    break;
            }

            // Urutkan acara
            filteredEvents = sortEvents(filteredEvents, sortValue);

            // Tampilkan acara
            displayEvents(filteredEvents, containerId, tabId);
        }

        // Urutkan acara berdasarkan kriteria yang dipilih
        function sortEvents(events, sortBy) {
            switch(sortBy) {
                case 'recent':
                    return events.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
                case 'oldest':
                    return events.sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));
                case 'popular':
                    return events.sort((a, b) => b.participants - a.participants);
                case 'alphabetical':
                    return events.sort((a, b) => a.title.localeCompare(b.title));
                default:
                    return events;
            }
        }

        // Tampilkan acara di container
        function displayEvents(events, containerId, tabId) {
            const container = document.getElementById(containerId);
            
            if (events.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="Tidak ada acara">
                        <h3>Tidak ada acara ditemukan</h3>
                        <p>Tidak ada acara untuk ditampilkan dalam kategori ini.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = events.map(event => `
                <div class="event-card">
                    <img src="${event.image}" alt="${event.title}" class="event-image">
                    <div class="event-details">
                        ${getStatusBadge(event.status)}
                        <h3 class="event-title">${event.title}</h3>
                        <div class="event-meta">
                            <div>
                                <i>📅</i>
                                <span>${formatDate(event.date)} pukul ${event.time}</span>
                            </div>
                            <div>
                                <i>📍</i>
                                <span>${event.location}</span>
                            </div>
                            <div>
                                <i>👤</i>
                                <span>Diajukan oleh: ${event.submittedBy}</span>
                            </div>
                            ${event.status === 'approved' ? `
                            <div>
                                <i>👥</i>
                                <span>${event.participants} peserta</span>
                            </div>
                            ` : ''}
                            ${event.status === 'rejected' && event.rejectionReason ? `
                            <div>
                                <i>❌</i>
                                <span>Alasan: ${event.rejectionReason}</span>
                            </div>
                            ` : ''}
                        </div>
                        <p>${event.description}</p>
                        <div class="event-actions">
                            ${getActionButtons(event, tabId)}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Dapatkan badge status HTML
        function getStatusBadge(status) {
            switch(status) {
                case 'pending':
                    return '<span class="pending-badge">Menunggu Tinjauan</span>';
                case 'approved':
                    return '<span class="approved-badge">Disetujui</span>';
                case 'rejected':
                    return '<span class="rejected-badge">Ditolak</span>';
                default:
                    return '';
            }
        }

        // Dapatkan tombol aksi berdasarkan status acara dan tab
        function getActionButtons(event, tabId) {
            let buttons = '';
            
            if (tabId === 'pending') {
                buttons = `
                    <button class="btn btn-approve" onclick="approveEvent(${event.id})">Setujui</button>
                    <button class="btn btn-reject" onclick="rejectEvent(${event.id})">Tolak</button>
                `;
            } else if (tabId === 'approved') {
                buttons = `
                    <button class="btn btn-edit" onclick="editEvent(${event.id})">Edit</button>
                    <button class="btn btn-reject" onclick="rejectEvent(${event.id})">Tolak</button>
                `;
            } else if (tabId === 'rejected') {
                buttons = `
                    <button class="btn btn-approve" onclick="approveEvent(${event.id})">Setujui</button>
                    <button class="btn btn-edit" onclick="editEvent(${event.id})">Edit</button>
                `;
            } else {
                buttons = `
                    <button class="btn btn-edit" onclick="editEvent(${event.id})">Edit</button>
                `;
            }
            
            return buttons;
        }

        // Format tanggal ke format yang mudah dibaca
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        }

        // Fungsi aksi acara
        function approveEvent(eventId) {
            if (confirm('Apakah Anda yakin ingin menyetujui acara ini?')) {
                const eventIndex = events.findIndex(event => event.id === eventId);
                if (eventIndex !== -1) {
                    events[eventIndex].status = 'approved';
                    updateStats();
                    loadEventsForTab(getActiveTab());
                    alert('Acara berhasil disetujui!');
                }
            }
        }

        function rejectEvent(eventId) {
            const reason = prompt('Berikan alasan penolakan:');
            if (reason !== null) {
                const eventIndex = events.findIndex(event => event.id === eventId);
                if (eventIndex !== -1) {
                    events[eventIndex].status = 'rejected';
                    events[eventIndex].rejectionReason = reason;
                    updateStats();
                    loadEventsForTab(getActiveTab());
                    alert('Acara berhasil ditolak!');
                }
            }
        }

        function editEvent(eventId) {
            alert(`Fungsionalitas edit untuk acara ${eventId} akan membuka formulir di aplikasi nyata.`);
            // Di aplikasi nyata, ini akan membuka modal atau mengarahkan ke formulir edit
        }

        // Dapatkan tab yang sedang aktif
        function getActiveTab() {
            const activeTab = document.querySelector('.tab.active');
            return activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
        }
