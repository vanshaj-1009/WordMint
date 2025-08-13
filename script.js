// Global variables to track application state
let currentUser = null;
let editingPostId = null;
let posts = [];


// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

/* Initialize the application by loading saved data and setting up the UI */
function initializeApp() {
    // Load user data and posts from localStorage
    loadUserData();
    loadPosts();

    // Update the UI based on whether user is logged in
    updateUI();

    // Display all posts regardless of login status
    displayPosts();
}


/* Load user data from localStorage */
function loadUserData() {
    const savedUser = localStorage.getItem('wordmint_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

/* Load posts from localStorage */
function loadPosts() {
    const savedPosts = localStorage.getItem('wordmint_posts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    }
}

/* Save posts to localStorage */
function savePosts() {
    localStorage.setItem('wordmint_posts', JSON.stringify(posts));
}

/* Save user data to localStorage */
function saveUserData() {
    if (currentUser) {
        localStorage.setItem('wordmint_currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('wordmint_currentUser');
    }
}





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


/* Update the UI based on user login status */
function updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const username = document.getElementById('username');

    if (currentUser) {
        // User is logged in
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userNameDisplay.classList.remove('hidden');
        username.textContent = currentUser.username;
    } else {
        // User is not logged in
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userNameDisplay.classList.add('hidden');
    }
}

/* Handle click on New Post button - check if user is logged in */
function handleNewPostClick() {
    if (!currentUser) {
        showMessage('Please login or register to create a post', 'error');
        showLoginForm();
        return;
    }

    showCreatePostForm();
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

/* Show the edit post form modal*/
function showEditPostForm(postId) {
    // Check if user is logged in
    if (!currentUser) {
        showMessage('Please login to edit posts', 'error');
        showLoginForm();
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Check if user is the author of the post
    if (post.authorId !== currentUser.id) {
        showMessage('You can only edit your own posts', 'error');
        return;
    }

    editingPostId = postId;
    document.getElementById('postModalTitle').textContent = 'Edit Post';
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postModal').classList.remove('hidden');
    document.getElementById('postTitle').focus();
}

/*Show the view post modal*/
function viewPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    document.getElementById('viewPostTitle').textContent = post.title;
    document.getElementById('viewPostAuthor').textContent = post.authorName;
    document.getElementById('viewPostDate').textContent = formatDate(post.createdAt);
    document.getElementById('viewPostContent').textContent = post.content;

    document.getElementById('viewPostModal').classList.remove('hidden');
}

/* Close a modal by its ID*/
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');

    // Clear form data when closing modals
    if (modalId === 'registerModal') {
        document.getElementById('registerForm').reset();
    } else if (modalId === 'loginModal') {
        document.getElementById('loginForm').reset();
    } else if (modalId === 'postModal') {
        document.getElementById('postForm').reset();
        editingPostId = null;
    }
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



/* Display all posts */
function displayPosts() {
    const postsContainer = document.getElementById('postsContainer');

    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No posts yet</h3>
                <p>Be the first to share your thoughts with the world!</p>
                <button class="btn btn-primary" onclick="handleNewPostClick()">Create First Post</button>
            </div>
        `;
        return;
    }

    // Generate HTML for all posts
    postsContainer.innerHTML = posts.map(post => {
        // Determine if the current user is the author of this post
        const isAuthor = currentUser && currentUser.id === post.authorId;

        // Create post card with appropriate action buttons
        return `
            <article class="post-card">
                <div class="post-header">
                    <h3 class="post-title" onclick="viewPost(${post.id})">${escapeHtml(post.title)}</h3>
                    ${isAuthor ? `
                        <div class="post-actions">
                            <button class="btn btn-highlight btn-sm" onclick="showEditPostForm(${post.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deletePost(${post.id})">Delete</button>
                        </div>
                    ` : ''}
                </div>
                <div class="post-meta">
                    By ${escapeHtml(post.authorName)} on ${formatDate(post.createdAt)}
                    ${post.updatedAt !== post.createdAt ? `<br><small>(Updated: ${formatDate(post.updatedAt)})</small>` : ''}
                </div>
                <div class="post-content">${escapeHtml(post.content)}</div>
                <div class="read-more" onclick="viewPost(${post.id})">Read more</div>
            </article>
        `;
    }).join('');
}


/* Handle user logout */
function logout() {
    currentUser = null;
    saveUserData();
    updateUI();
    showMessage('You have been logged out successfully', 'success');
}



/* Handle post creation or editing */
function handlePostSubmit(event) {
    event.preventDefault();

    // Check if user is logged in
    if (!currentUser) {
        showMessage('Please login to create or edit posts', 'error');
        showLoginForm();
        return;
    }

    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();

    // Basic validation
    if (!title || !content) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (editingPostId) {
        // Edit existing post
        const postIndex = posts.findIndex(p => p.id === editingPostId);
        if (postIndex !== -1) {
            posts[postIndex].title = title;
            posts[postIndex].content = content;
            posts[postIndex].updatedAt = new Date().toISOString();
            showMessage('Post updated successfully!', 'success');
        }
    } else {
        // Create new post
        const newPost = {
            id: Date.now(),
            title: title,
            content: content,
            authorId: currentUser.id,
            authorName: currentUser.username,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        posts.unshift(newPost); // Add to beginning of array
        showMessage('Post created successfully!', 'success');
    }

    // Save posts and update display
    savePosts();
    displayPosts();
    closeModal('postModal');
}


/* Delete a post */
function deletePost(postId) {
    // Check if user is logged in
    if (!currentUser) {
        showMessage('Please login to delete posts', 'error');
        showLoginForm();
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Check if user is the author of the post
    if (post.authorId !== currentUser.id) {
        showMessage('You can only delete your own posts', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        return;
    }

    // Remove post from array
    posts = posts.filter(post => post.id !== postId);

    // Save and update display
    savePosts();
    displayPosts();

    showMessage('Post deleted successfully', 'success');
}

/* Show a message to the user*/
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');

    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;

    messageContainer.appendChild(messageElement);

    // Remove message after 4 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 4000);
}