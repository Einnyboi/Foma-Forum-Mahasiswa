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
    if (login(email, password)) {
        alert(`Welcome back, ${currentUser.name}!`);
        updateNavi();
        showpage('home');
    }
});

