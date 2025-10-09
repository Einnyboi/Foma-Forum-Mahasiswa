const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        clearError();

        const email = document.getElementById('signupEmail').value.trim();
        const pass = document.getElementById('signupPass').value;
        const confpass = document.getElementById('confirmPass').value;
        const name = document.getElementById('fullName').value.trim();
        let isValid = true;

        // LAKUKAN VALIDASI DENGAN MEMANGGIL FUNGSI DARI dashboard.js
        if (!name || !validateName(name)) {
            document.getElementById('fullNameError').textContent = 'Nama tidak valid (3-32 karakter huruf)!';
            isValid = false;
        }

        if (!email || !validateEmail(email)) {
            document.getElementById('signupEmailError').textContent = 'Format email tidak valid!';
            isValid = false;
        } else if (findUserByEmail(email)) { // Mengecek ke `registeredUsers` utama
            document.getElementById('signupEmailError').textContent = 'Email sudah terdaftar!';
            isValid = false;
        }

        if (!pass || pass.length < 8) {
            document.getElementById('signupPassError').textContent = 'Password minimal 8 karakter!';
            isValid = false;
        }

        if (pass !== confpass) {
            document.getElementById('confirmPassError').textContent = 'Konfirmasi Password tidak sesuai!';
            isValid = false;
        }
        
        // JIKA SEMUA VALID, PROSES PENDAFTARAN
        if (isValid) {
            const newUser = {
                name: name,
                email: email,
                password: pass,
                registrationDate: new Date().toLocaleDateString('id-ID'),
                role: "user"
            };
            
            registeredUsers.push(newUser); 
            saveToStorage();               
            
            alert('Pendaftaran akun berhasil! Silakan login.');
            showpage('login');
        }
    });
} else {
    console.error("Elemen form signup dengan ID 'signupForm' tidak ditemukan!");
}