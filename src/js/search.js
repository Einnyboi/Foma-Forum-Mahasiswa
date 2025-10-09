document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DATA SOURCE ---
    // REMOVED: The old, hardcoded 'allContent' array is gone.
    // NEW: Load the 'posts' array directly from localStorage.
    let allPosts = [];
    try {
        // Use the same key your dashboard.js uses: 'fomaPosts'
        allPosts = JSON.parse(localStorage.getItem('fomaPosts')) || [];
    } catch (error) {
        console.error("Could not load posts from localStorage.", error);
        // If there's an error, the search will just return no results.
        allPosts = [];
    }

    // --- 2. RENDER FUNCTION (No changes needed here) ---
    function renderResults(results) {
        const searchResultsList = document.querySelector('.search-results-list');
        if (!searchResultsList) return;
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
    
    // --- 3. SEARCH FUNCTION (Updated to use the new data) ---
    function performSearch(searchTerm) {
        if (!searchTerm) {
            renderResults([]);
            return;
        }

        // CHANGED: This now filters 'allPosts' which comes from localStorage.
        // I also improved it to search the author and category fields.
        const filteredResults = allPosts.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        renderResults(filteredResults);
    }
    
    // --- 4. INITIALIZATION (No changes needed here) ---
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromURL = urlParams.get('query');
    performSearch(searchTermFromURL);
});