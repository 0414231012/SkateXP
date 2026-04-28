console.log("Login!")

// Get the login form
let loginForm = document.querySelector('.login-form');

// Handle form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get the skater name using class instead of placeholder
    let usernameInput = document.querySelector('.login-input');
    let username = usernameInput.value;
    
    // Check if they entered a name
    if (username === '') {
        alert('Please enter your skater name!');
        return;
    }
    
    // Save the username and go to main page
    localStorage.setItem('currentUser', username);
    window.location.href = 'index.html';
});
