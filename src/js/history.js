document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.querySelector('select[name="filter"]');
    const activityContainer = document.querySelector('#activity-container'); 
    const postItems = Array.from(activityContainer.querySelectorAll('article'));

    filterSelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        let sortedPosts = [];

        switch (selectedValue) {
            case 'newest':
                sortedPosts = postItems.sort((a, b) => {
                    const dateA = new Date(getDateFromFooter(a));
                    const dateB = new Date(getDateFromFooter(b));
                    return dateB - dateA; // Urutan paling baru duluan
                });
                break;
            case 'oldest':
                sortedPosts = postItems.sort((a, b) => {
                    const dateA = new Date(getDateFromFooter(a));
                    const dateB = new Date(getDateFromFooter(b));
                    return dateA - dateB; // Urutan paling lama duluan
                });
                break;
            case 'most-likes':
                sortedPosts = postItems.sort((a, b) => {
                    const likesA = getLikesFromFooter(a);
                    const likesB = getLikesFromFooter(b);
                    return likesB - likesA; // Urutan paling banyak disukai duluan
                });
                break;
            case 'most-comments':
                sortedPosts = postItems.sort((a, b) => {
                    const commentsA = getCommentsFromFooter(a);
                    const commentsB = getCommentsFromFooter(b);
                    return commentsB - commentsA; // Urutan paling banyak dikomentari duluan
                });
                break;
        }

        // Membersihkan container dan menambahkan kembali elemen yang sudah diurutkan
        activityContainer.innerHTML = '';
        sortedPosts.forEach(post => activityContainer.appendChild(post));
    });

    function getDateFromFooter(postElement) {
        const dateSpan = postElement.querySelector('.post-footer > span:first-child');
        const dateString = dateSpan.textContent.trim();
        const dateObject = new Date(dateString);
        // Pastikan tanggalnya valid sebelum digunakan
        if (isNaN(dateObject.getTime())) {
            console.error("Error: Invalid date.");
            return null; 
        }
        return dateObject;
    }

    // Fungsi helper untuk mendapatkan jumlah suka dari footer
    function getLikesFromFooter(postElement) {
        const likesSpan = postElement.querySelector('.post-footer > span:nth-child(2)');
        const likesString = likesSpan.textContent.trim();
        const likesMatch = likesString.match(/(\d+)/);
        return likesMatch ? parseInt(likesMatch[1]) : 0;
    }

    // Fungsi helper untuk mendapatkan jumlah balasan dari footer
    function getCommentsFromFooter(postElement) {
        const commentsSpan = postElement.querySelector('.post-footer > span:last-child');
        const commentsString = commentsSpan.textContent.trim();
        const commentsMatch = commentsString.match(/(\d+)/);
        return commentsMatch ? parseInt(commentsMatch[1]) : 0;
    }
});