console.log("Hello World! Welcome to skateXP!");

//login 
let currentUser = localStorage.getItem('currentUser');

if (currentUser === null) {
    // No user logged in, send back to login
    window.location.href = 'login.html';
} else {
    console.log('Welcome back, ' + currentUser + '!');
}

// Replace login button with username and add logout functionality
let loginButton = document.querySelector('.login-btn-header');
loginButton.innerText = currentUser;
loginButton.href = '#'; // Remove the link to login.html

// Add logout functionality
loginButton.addEventListener('click', function(event) {
    event.preventDefault(); // Stop the link from working
    
    // Ask if they really want to logout
    if (confirm('Log out ' + currentUser + '?')) {
        // Clear the stored user
        localStorage.removeItem('currentUser');
        // Go back to login page
        window.location.href = 'login.html';
    }
});

//get trick counter / session logger elements
let sessionBtn = document.querySelector('.session-btn');
let streakNumber = document.querySelector('.streak .stat-number');
let lastSessionText = document.querySelector('.last-session');
let streakFire = document.querySelector('.streak-fire')

// Function to check if user already skated today
function hasSkatedToday() {
    let today = new Date().toDateString();
    let lastSkateDate = localStorage.getItem(currentUser + '_lastSkate');
    return lastSkateDate === today;
}

function updateStreak() {
    let today = new Date();
    let todayString = today.toDateString();
    let lastSkateDate = localStorage.getItem(currentUser + '_lastSkate');
    let currentStreak = parseInt(localStorage.getItem(currentUser + '_streak')) || 0;
    
    if (lastSkateDate) {
        let lastDate = new Date(lastSkateDate);
        let daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
            // Skated yesterday, continue streak
            currentStreak += 1;
        } else if (daysDiff >= 3) {
            // Missed 3+ days, reset streak
            currentStreak = 1;
        } else if (daysDiff === 0) {
            // Already skated today, don't change streak
            return false;
        }
    } else {
        // First time skating
        currentStreak = 1;
    }
    
    // Save the new data
    localStorage.setItem(currentUser + '_lastSkate', todayString);
    localStorage.setItem(currentUser + '_streak', currentStreak);
    
    return true;
}


function handleSkateSession() {
    // Check if already skated today
    if (hasSkatedToday()) {
        alert('You already logged a session today! Keep it up! 🛹');
        return;
    }
    
    // Update the streak
    if (updateStreak()) {
        // Refresh the display
        displayStreak();
        displayLastSession();
        
        // Give some encouragement!
        alert('Session logged! Streak updated! 🔥');
    }
}

function displayStreak() {
    let currentStreak = parseInt(localStorage.getItem(currentUser + '_streak')) || 0;
    streakNumber.innerText = currentStreak
}

function displayLastSession() {
    let lastSkateDate = localStorage.getItem(currentUser + '_lastSkate');
    
    if (lastSkateDate) {
        let lastDate = new Date(lastSkateDate);
        let today = new Date();
        
        // Compare just the dates (ignore time)
        let todayDateString = today.toDateString();
        let lastDateString = lastDate.toDateString();
        
        if (todayDateString === lastDateString) {
            lastSessionText.innerText = 'Last session: Today!';
        } else {
            // Calculate days difference properly
            let daysDiff = Math.floor((today.setHours(0,0,0,0) - lastDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                lastSessionText.innerText = 'Last session: Yesterday';
            }
            // need to fix !
            else if (daysDiff > 2) {
                lastSessionText.innerText = "You lost your streak! Last session: " + daysDiff + " days ago ";
                let currentStreak = parseInt(localStorage.getItem(currentUser + '_streak')) || 0;
                currentStreak = 0;
                displayStreak();
                } 

            else {
                lastSessionText.innerText = 'Last session: ' + daysDiff + ' days ago';
            }
        }
    } else {
        lastSessionText.innerText = 'Last session: Never';
    }
}

// Get the elements we need for adding a new trick
let addTrickBtn = document.querySelector('.add-trick-btn');
let addTrickForm = document.querySelector('.add-trick-form');
let cancelBtn = document.querySelector('.cancel-btn');
let saveBtn = document.querySelector('.save-btn');
let trickInput = document.querySelector('.trick-input'); 
let tricksGrid = document.querySelector('.tricks-grid');

// Function to show the add trick form
function showAddTrickForm() {
    addTrickForm.style.display = 'block';
}

// Function to hide the add trick form
function hideAddTrickForm() {
    addTrickForm.style.display = 'none';
}

// Function to save a new trick
function saveNewTrick() {
    // Get the trick name from input
    let trickName = trickInput.value;
    
    // Check if they actually typed something
    if (trickName === '') {
        alert('Please enter a trick name!');
        return;
    }
    
    // Create the new trick card
    let newTrickCard = document.createElement('div');
    newTrickCard.className = 'trick-card';
    
    // Create the trick name element
    let trickNameDiv = document.createElement('div');
    trickNameDiv.className = 'trick-name';
    trickNameDiv.innerText = trickName.toUpperCase();
    // Consistency
    let consistencyDiv = document.createElement('div');
    consistencyDiv.className = 'trick-consistency';
    consistencyDiv.innerText = '0%';
    
    // Progress Bar
    let trickBar = document.createElement('div');
    trickBar.className = 'trick bar'

     // Create progress bar fill
    let trickProgress = document.createElement('div');
    trickProgress.className = 'trick-progress';
    trickProgress.style.width = '0%';
    
    // Put everything together
    trickBar.appendChild(trickProgress);
    newTrickCard.appendChild(trickNameDiv);
    newTrickCard.appendChild(consistencyDiv);
    newTrickCard.appendChild(trickBar);
    
    // Add to tricks grid
    tricksGrid.appendChild(newTrickCard);
    
    // Clean up - hide form and clear input
    hideAddTrickForm();
    trickInput.value = '';
}


// Add click events
addTrickBtn.addEventListener('click', showAddTrickForm);
cancelBtn.addEventListener('click', hideAddTrickForm);
saveBtn.addEventListener('click', saveNewTrick);
sessionBtn.addEventListener('click', handleSkateSession)

displayStreak();
displayLastSession();
