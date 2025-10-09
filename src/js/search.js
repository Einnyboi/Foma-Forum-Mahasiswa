document.addEventListener('DOMContentLoaded', () => {
    // Data 
    const allContent = [
        { id: 1, type: 'thread', title: 'Internship vacancies in tech companies', category: 'Career Info', author: 'Ahmad Rahman', description: 'Some of the latest internship vacancies for IT students, suitable for beginners.' },
        { id: 2, type: 'thread', title: 'Recommended hangout spots in Jakarta', category: 'Hobbies & Entertainment', author: 'Sarah Kim', description: 'A list of cafes with fast Wi-Fi and a comfortable atmosphere for work or just relaxing.' },
        { id: 3, type: 'thread', title: 'Effective study tips for semester exams', category: 'Academics', author: 'David Chen', description: 'Study methods proven to increase grades and reduce stress.' },
        { id: 4, type: 'thread', title: 'How to make a simple robot from recycled materials', category: 'Hobbies & Entertainment', author: 'Tech Mentor', description: 'A step-by-step guide for a DIY robotics project.' },
        { id: 5, type: 'thread', title: 'Scholarships abroad in 2025', category: 'Career Info', author: 'Code Guru', description: 'Complete information about fully-funded scholarships in various countries.' },
        { id: 6, type: 'thread', title: 'Q&A forum about final projects', category: 'Academics', author: 'Student Helper', description: 'A discussion space to help students complete their theses.' },
        { id: 7, type: 'thread', title: 'JavaScript vs Python: Which should beginners learn first?', category: 'Programming', author: 'Tech Mentor', description: 'A deep dive into the pros and cons of each language for newcomers.' }
    ];

    // Fungsi untuk menampilkan hasil
    function renderResults(results) {
        const searchResultsList = document.querySelector('.search-results-list');
        if (!searchResultsList) return; // Hentikan jika wadah tidak ditemukan
        searchResultsList.innerHTML = ''; 

        const heading = document.createElement('h2');
        heading.textContent = results.length > 0 ? 'Search Results:' : 'No Results Found';
        searchResultsList.appendChild(heading);

        if (results.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Sorry, no results matched your search.';
            searchResultsList.appendChild(noResultsMessage);
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'popular-search-item';
            resultItem.innerHTML = `
                <strong>${item.title}</strong><br>
                <small>${item.description}</small>
                <div style="font-size: 0.8em; color: #666; margin-top: 4px;">by ${item.author}</div>
            `;
            searchResultsList.appendChild(resultItem);
        });
    }
    
    // Fungsi utama untuk menjalankan pencarian
    function performSearch(searchTerm) {
        if (!searchTerm) {
            renderResults([]);
            return;
        }
        const filteredResults = allContent.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderResults(filteredResults);
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromURL = urlParams.get('query');
    performSearch(searchTermFromURL);
});