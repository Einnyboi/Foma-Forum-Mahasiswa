document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-box .input');
    const searchButton = document.querySelector('.search-box .button');
    const popularCategories = document.querySelectorAll('.filter-section .btn-secondary');
    const searchResultsSection = document.querySelector('.search-results');

    // --- DUMMY DATA ---
    const allContent = [
        { id: 1, type: 'thread', title: 'Internship vacancies in tech companies', category: 'Career Info', description: 'Some of the latest internship vacancies for IT students, suitable for beginners.' },
        { id: 2, type: 'thread', title: 'Recommended hangout spots in Jakarta', category: 'Hobbies & Entertainment', description: 'A list of cafes with fast Wi-Fi and a comfortable atmosphere for work or just relaxing.' },
        { id: 3, type: 'thread', title: 'Effective study tips for semester exams', category: 'Academics', description: 'Study methods proven to increase grades and reduce stress.' },
        { id: 4, type: 'thread', title: 'How to make a simple robot from recycled materials', category: 'Hobbies & Entertainment', description: 'A step-by-step guide for a DIY robotics project.' },
        { id: 5, type: 'thread', title: 'Scholarships abroad in 2025', category: 'Career Info', description: 'Complete information about fully-funded scholarships in various countries.' },
        { id: 6, type: 'thread', title: 'Q&A forum about final projects', category: 'Academics', description: 'A discussion space to help students complete their theses.' },
        { id: 7, type: 'popular', title: 'Internship vacancies', category: null, description: null },
        { id: 8, type: 'popular', title: 'Recommended hangout spots', category: null, description: null }
    ];

    // --- CORE SEARCH & RENDERING FUNCTIONS ---
    function renderResults(results) {
        const searchResultsSection = document.querySelector('.search-results');
        searchResultsSection.innerHTML = '';
        
        const heading = document.createElement('h6');
        heading.textContent = results.length > 0 ? 'Search Results:' : 'No Results Found';
        searchResultsSection.appendChild(heading);

        if (results.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Sorry, no results matched your search.';
            searchResultsSection.appendChild(noResultsMessage);
            return;
        }

        const fragment = document.createDocumentFragment();

        results.forEach(item => {
            if (item.type !== 'popular') {
                const resultItemDiv = document.createElement('div');
                resultItemDiv.className = 'popular-search-item';

                const titleElement = document.createElement('strong');
                titleElement.textContent = item.title;
                
                const descriptionElement = document.createElement('small');
                descriptionElement.textContent = item.description;

                resultItemDiv.appendChild(titleElement);
                if (item.description) {
                    resultItemDiv.appendChild(document.createElement('br'));
                    resultItemDiv.appendChild(descriptionElement);
                }
                
                fragment.appendChild(resultItemDiv);
            }
        });

        searchResultsSection.appendChild(fragment);
    }

    function handleSearch(searchTerm) {
        const filteredResults = allContent.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
            const descriptionMatch = item.description ? item.description.toLowerCase().includes(searchTerm.toLowerCase()) : false;
            return titleMatch || descriptionMatch;
        });
        
        renderResults(filteredResults);
    }
    
    function handleCategoryFilter(category) {
        const filteredResults = allContent.filter(item => {
            return item.category && item.category.toLowerCase() === category.toLowerCase();
        });

        renderResults(filteredResults);
    }

    // --- EVENT LISTENERS ---
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            handleSearch(searchTerm);
        } else {
            renderResults(allContent.filter(item => item.type === 'popular'));
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchButton.click();
        }
    });

    popularCategories.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.textContent;
            searchInput.value = '';
            handleCategoryFilter(category);
        });
    });

    // Initialization: Display "Popular Searches" on initial page load
    renderResults(allContent.filter(item => item.type === 'popular'));

});