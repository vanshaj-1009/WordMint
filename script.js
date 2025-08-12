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