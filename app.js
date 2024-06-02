// Function to handle user registration
document.getElementById('register-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Retrieve user input
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const rulesAccepted = document.getElementById('rules').checked;

    if (!rulesAccepted) {
        alert('Anda harus menyetujui aturan sebelum mendaftar.');
        return;
    }

    // Check if username already exists
    if (localStorage.getItem(username)) {
        alert('Username sudah ada. Silahkan pilih username lain.');
        return;
    }

    // Create a unique user ID
    const userId = 'U' + new Date().getTime();

    // Save user data to localStorage
    const user = { userId, username, password, name, phone, email, address, loans: [] };
    localStorage.setItem(username, JSON.stringify(user));

    // Show user ID
    document.getElementById('user-id').textContent = userId;
    document.getElementById('user-id-display').style.display = 'block';
    document.getElementById('register-form').reset();
});

// Function to handle user login
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Retrieve user input
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Check if user exists
    const user = JSON.parse(localStorage.getItem(username));
    if (user) {
        // Verify password
        if (user.password === password) {
            // Redirect to user dashboard
            localStorage.setItem('currentUser', username);
            window.location.href = 'user-dashboard.html';
        } else {
            alert('Password salah. Silahkan coba lagi.');
        }
    } else {
        alert('Username tidak ditemukan');
    }
});

// Function to handle admin login
document.getElementById('admin-login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Retrieve admin input
    const adminName = document.getElementById('admin-name').value;
    const adminPassword = document.getElementById('admin-password').value;

    // Simple admin check
    if (adminName === 'admin' && adminPassword === 'admin123') {
        // Redirect to admin panel
        window.location.href = 'admin-panel.html';
    } else {
        alert('Username atau password salah');
    }
});

// Function to load user data in admin panel
if (window.location.pathname.includes('admin-panel.html')) {
    const userTableBody = document.querySelector('#user-data tbody');
    Object.keys(localStorage).forEach(function (key) {
        if (key !== 'currentUser') {
            const user = JSON.parse(localStorage.getItem(key));
            user.loans.forEach(function (loan, index) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.userId}</td>
                    <td>${user.name}</td>
                    <td>${user.phone}</td>
                    <td>${user.email}</td>
                    <td>${user.address}</td>
                    <td>${loan.bookTitle}</td>
                    <td>${loan.loanDate}</td>
                    <td>${loan.returnDate ? loan.returnDate : 'Belum Dikembalikan'}</td>
                    <td>${loan.returnDate ? 'Dikembalikan' : 'Belum Dikembalikan'}</td>
                    <td>${loan.returnDate ? '' : `<button onclick="markAsReturned('${user.username}', ${index})">Telah Dikembalikan</button>`}</td>
                `;
                userTableBody.appendChild(row);
            });
        }
    });
}

// Function to mark a loan as returned
function markAsReturned(username, loanIndex) {
    const user = JSON.parse(localStorage.getItem(username));
    user.loans[loanIndex].returnDate = new Date().toLocaleDateString();
    localStorage.setItem(username, JSON.stringify(user));
    location.reload();
}

// Function to load user loan history in user dashboard
if (window.location.pathname.includes('user-dashboard.html')) {
    const currentUser = localStorage.getItem('currentUser');
    const user = JSON.parse(localStorage.getItem(currentUser));
    const loanHistoryTableBody = document.querySelector('#loan-history tbody');
    document.getElementById('user-name').textContent = user.name;

    user.loans.forEach(function (loan) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.bookTitle}</td>
            <td>${loan.author}</td>
            <td>${loan.publisher}</td>
            <td>${loan.year}</td>
            <td>${loan.loanDate}</td>
            <td>${loan.returnDate ? loan.returnDate : 'Belum Dikembalikan'}</td>
            <td>${loan.returnDate ? 'Dikembalikan' : 'Belum Dikembalikan'}</td>
        `;
        loanHistoryTableBody.appendChild(row);
    });
}

// Function to handle loan book form submission
document.getElementById('loan-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const currentUser = localStorage.getItem('currentUser');
    const user = JSON.parse(localStorage.getItem(currentUser));

    const bookTitle = document.getElementById('book-title').value;
    const author = document.getElementById('author').value;
    const publisher = document.getElementById('publisher').value;
    const year = document.getElementById('year').value;
    const loanDate = new Date().toLocaleDateString();

    const loan = { bookTitle, author, publisher, year, loanDate, returnDate: null };
    user.loans.push(loan);

    localStorage.setItem(currentUser, JSON.stringify(user));
    document.getElementById('loan-form').reset();
    location.reload();
});
