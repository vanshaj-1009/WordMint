// Global variables to track application state
let currentUser = null;
let editingPostId = null;
let posts = [];









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

