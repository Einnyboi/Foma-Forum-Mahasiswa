// data.js

// --- Central Data Object and Initialization ---

const loadData = (key, defaultValue) => {
    try {
        const data = localStorage.getItem(key);
        // Returns parsed data or the default value
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error(`Error loading data for key ${key}:`, e);
        return defaultValue;
    }
};

// --- Global Data Container (Use AppData.<property> in all other JS files) ---
// This object holds all live, in-memory data for the application.
const AppData = {
    // 1. Users (fomaUsers is the consistent key used in Login.js/signup.js)
    registeredUsers: loadData('fomaUsers', [
        // Default dummy users (includes admin from admin-script.js)
        { id: 1, name: 'Budi Santoso', email: 'budi.s@example.com', password: 'password', role: 'user' },
        { id: 6, name: 'Admin Utama', email: 'admin@foma.com', password: 'password', role: 'admin' }
        // Add other default users here...
    ]),
    currentUser: loadData('currentUser', null),

    // 2. Content/Posts (forumThreads is the key used in admin-content-manajer.js)
    posts: loadData('forumThreads', [
        // Initial posts data from dashboard.js
        { id: 1, type: 'thread', title: 'Internship vacancies...', author: 'Ahmad Rahman', category: 'Career Info', likes: 25, comments: [] },
        { id: 2, type: 'thread', title: 'JavaScript vs Python...', author: 'Tech Mentor', category: 'Programming', likes: 42, comments: [] },
    ]),
    
    // 3. Events/Proposals (eventSuggestions is the key used in admin-approval.js)
    eventProposals: loadData('eventSuggestions', []), 

    // 4. Communities (from communityscript.js)
    communities: loadData('communities', []), 
};

// --- Global Save Function (Call this AFTER any change to AppData) ---
function saveData() {
    try {
        localStorage.setItem('fomaUsers', JSON.stringify(AppData.registeredUsers));
        localStorage.setItem('currentUser', JSON.stringify(AppData.currentUser));
        localStorage.setItem('forumThreads', JSON.stringify(AppData.posts));
        localStorage.setItem('eventSuggestions', JSON.stringify(AppData.eventProposals));
        localStorage.setItem('communities', JSON.stringify(AppData.communities));
    } catch (e) {
        console.error("Error saving data to localStorage:", e);
    }
}

// Ensure the initial data is saved to localStorage on the very first run
if (localStorage.getItem('fomaUsers') === null) {
    saveData();
}

console.log("Data Service loaded. AppData ready.");