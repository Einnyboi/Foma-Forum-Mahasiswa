document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPass").value.trim();
    let valid = true;

    // Reset errors
    document.getElementById("loginEmailError").textContent = "";
    document.getElementById("loginPassError").textContent = "";

    if (!email) {
        document.getElementById("loginEmailError").textContent = "Email is required";
        valid = false;
    }

    if (!password) {
        document.getElementById("loginPassError").textContent = "Password is required";
        valid = false;
    }

    if (valid) {
        alert("Login successful!");
        window.location.href = "dashboard.html"; // redirect after login
    }
});

// Load users from localStorage or initialize with test data
function loadUsersFromStorage()
{
    try
    {
        let storedUsers = JSON.parse(localStorage.getItem('fomaUsers')) || [];
        
        // Ensure all users have a 'role' property (migration/safety check)
        registeredUsers = storedUsers.map(user => ({
            ...user,
            role: user.role || (user.email === 'admin@gmail.com' ? 'admin' : 'user')
        }));
        
        if (registeredUsers.length === 0 || !registeredUsers.some(u => u.role === 'admin'))
        {
            // Standard Test User
            registeredUsers.push(
            {
                name: "Test User",
                email: "test@gmail.com",
                password: "12345678",
                registrationDate: new Date().toLocaleDateString('id-ID'),
                role: "user" 
            });
            // Admin User for testing (Use admin@foma.com/adminpassword to test)
            registeredUsers.push( 
            {
                name: "Admin",
                email: "admin@gmail.com", 
                password: "71757678188",
                registrationDate: new Date().toLocaleDateString('id-ID'),
                role: "admin" 
            });
        }
        
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser)
        {
            currentUser = JSON.parse(loggedInUser);
        }
    } 
    catch (error)
    {
        console.log('LocalStorage not available, using memory storage only');
        // Fallback for Standard Test User in memory if storage fails
        registeredUsers.push(
        {
            name: "Test User",
            email: "test@gmail.com",
            password: "12345678",
            registrationDate: new Date().toLocaleDateString('id-ID'),
            role: "user"
        });
        // Fallback for Admin User in memory if storage fails
        registeredUsers.push( 
        {
            name: "Admin",
            email: "admin@gmail.com", 
            password: "71757678188",
            registrationDate: new Date().toLocaleDateString('id-ID'),
            role: "admin"
        });
    }
}

function login(email, password)
{
    const user = findUserByEmail(email);
    if (user && user.password === password)
    {
        currentUser = user;
        saveToStorage();
        updateNavi();
        
        // **UPDATED: Redirect Admin immediately to their separate HTML file**
        if (currentUser.role === 'admin') {
            // Note: The path below assumes Index(Admin).html is at the same level as dashboard.html
            window.location.href = 'Index(Admin).html'; 
            return true;
        }

        return true;
    }
    return false;
}

function testLogin()
{
    if (registeredUsers.length > 0)
    {
        // Try to get a standard user first
        let userToLogin = registeredUsers.find(u => u.role === 'user'); 
        if (!userToLogin)
        {
            // Fallback to admin if no user (e.g., if you only have the test admin)
            userToLogin = registeredUsers.find(u => u.role === 'admin'); 
        }
        
        if (userToLogin) {
            currentUser = userToLogin;
            saveToStorage();
            updateNavi();
            
            // **Redirect if testing admin login**
            if (currentUser.role === 'admin')
            {
                window.location.href = 'Index(Admin).html';
            }
            else
            {
                showpage('home');
            }
            alert(`Welcome back, ${currentUser.name}!`);
        }
        else
        {
            alert('No test users available');
        }
    }
    else
    {
        alert('No test users available');
    }
}