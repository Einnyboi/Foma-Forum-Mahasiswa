// Event Management System
document.addEventListener('DOMContentLoaded', function() {
    // Load events from localStorage
    loadEvents();
    
    // Event form submission
    document.getElementById('event-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitEvent();
    });
});

// Event class to represent an event suggestion
class EventSuggestion {
    constructor(title, date, time, location, description, category, image, studentName) {
        this.id = Date.now().toString();
        this.title = title;
        this.date = date;
        this.time = time;
        this.location = location;
        this.description = description || '';
        this.category = category;
        this.image = image || '';
        this.studentName = studentName || 'Anomimus';
        this.status = 'pending';
        this.createdAt = new Date().toISOString();
        this.participants = 0;
    }
}

// Submit a new event suggestion
function submitEvent() {
    const title = document.getElementById('Event-title').value;
    const date = document.getElementById('Event-date').value;
    const time = document.getElementById('Event-time').value;
    const location = document.getElementById('Event-location').value;
    const description = document.getElementById('Event-description').value;
    const category = document.getElementById('Event-category').value;
    const studentName = document.getElementById('Student-name').value;
    
    // Handle image upload
    const imageInput = document.getElementById('Event-image');
    let imageData = '';
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            completeSubmission(title, date, time, location, description, category, imageData, studentName);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        completeSubmission(title, date, time, location, description, category, '', studentName);
    }
}

function completeSubmission(title, date, time, location, description, category, image, studentName) {
    // Create new event
    const newEvent = new EventSuggestion(title, date, time, location, description, category, image, studentName);
    
    // Save to localStorage
    saveEvent(newEvent);
    
    // Clear form
    document.getElementById('event-form').reset();
    
    // Show success message
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
    
    // Reload events display
    loadEvents();
}

// Display all events in the events container
function displayEvents(events) {
    // This function can be used to display events on the student page if needed
    console.log('Events loaded:', events.length);
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize with some sample data if none exists
function initializeSampleData() {
    if (!localStorage.getItem('collegeEvents')) {
        const sampleEvents = [
            {
                id: '1',
                title: 'FTI General Lecture Building R',
                date: '2025-10-15',
                time: '14:00',
                location: 'Building R, FTI Campus',
                description: 'A general lecture about the latest trends in technology and innovation.',
                category: 'academic',
                image: '',
                studentName: 'Jessica',
                status: 'pending',
                createdAt: new Date().toISOString(),
                participants: 0
            },
            {
                id: '2',
                title: 'Student Community Meetup',
                date: '2025-10-20',
                time: '16:00',
                location: 'Student Center',
                description: 'Monthly meetup for student community members to discuss upcoming activities.',
                category: 'social',
                image: '',
                studentName: 'Alex',
                status: 'approved',
                createdAt: new Date().toISOString(),
                participants: 25
            }
        ];
        
        localStorage.setItem('collegeEvents', JSON.stringify(sampleEvents));
    }
}

// Call initialization when the page loads
initializeSampleData();
