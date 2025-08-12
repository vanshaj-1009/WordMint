// Global variables to track application state
let currentUser = null;
let editingPostId = null;
let posts = [];







// Set up all event listeners for the application 
function setupEventListeners() {
    // Navigation button event listeners
    document.getElementById('loginBtn').addEventListener('click', showLoginForm);
    document.getElementById('registerBtn').addEventListener('click', showRegisterForm);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('newPostBtn').addEventListener('click', handleNewPostClick);

    // Form submission event listeners
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('postForm').addEventListener('submit', handlePostSubmit);


    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
}


/* Show the registration form modal */
function showRegisterForm() {
    document.getElementById('registerModal').classList.remove('hidden');
    document.getElementById('regUsername').focus();
}

/* Show the login form modal */
function showLoginForm() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginUsername').focus();
}

/* Show the create post form modal */
function showCreatePostForm() {
    editingPostId = null;
    document.getElementById('postModalTitle').textContent = 'Create New Post';
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postModal').classList.remove('hidden');
    document.getElementById('postTitle').focus();
}


/* Handle user registration */
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    // Basic validation
    if (!username || !email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    // Check if user already exists (simulate checking against a database)
    const existingUsers = JSON.parse(localStorage.getItem('wordmint_users') || '[]');
    const userExists = existingUsers.some(user =>
        user.username === username || user.email === email
    );

    if (userExists) {
        showMessage('Username or email already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
    };

    // Save user to localStorage
    existingUsers.push(newUser);
    localStorage.setItem('wordmint_users', JSON.stringify(existingUsers));

    // Log the user in
    currentUser = newUser;
    saveUserData();

    // Close modal and update UI
    closeModal('registerModal');
    updateUI();

    showMessage('Account created successfully! Welcome to WordMint!', 'success');
}


/* Handle user login */
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Basic validation
    if (!username || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    // Check credentials (simulate checking against a database)
    const existingUsers = JSON.parse(localStorage.getItem('wordmint_users') || '[]');
    const user = existingUsers.find(u =>
        u.username === username && u.password === password
    );

    if (!user) {
        showMessage('Invalid username or password', 'error');
        return;
    }

    // Log the user in
    currentUser = user;
    saveUserData();

    // Close modal and update UI
    closeModal('loginModal');
    updateUI();

    showMessage(`Welcome back, ${user.username}!`, 'success');
}


