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

/* Show the create post form modal */
function showCreatePostForm() {
    editingPostId = null;
    document.getElementById('postModalTitle').textContent = 'Create New Post';
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postModal').classList.remove('hidden');
    document.getElementById('postTitle').focus();
}