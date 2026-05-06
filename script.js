console.log("Welcome to SkateXP!");

//login stuff
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

// Add logout functionality when user clicks their name
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
let streakFire = document.querySelector('.streak-fire');
let xpNumber = document.querySelector('.xp-card .stat-number');

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
            // Skated yesterday, continue streak and give motivation
            currentStreak += 1;
            alert('Streak updated! 😎')
        } else if (daysDiff >= 3) {
            // Missed 3+ days, reset streak
            currentStreak = 1;
            //alert the user they lost their streak
            alert('Its been 3 days! you lost your streak!😭')
        } else if (daysDiff === 0) {
            // Already skated today, don't change streak
            return false;
        }
    } else {
        // First time skating and give alert
        currentStreak = 1;
        alert('Keep skating everyday to get your streak up!, Miss 3 days and it resets!')
    }
    
    // Save the new data
    localStorage.setItem(currentUser + '_lastSkate', todayString);
    localStorage.setItem(currentUser + '_streak', currentStreak);
    
    return true;
}

// when user clicks the skated today button
// checks if they skated and or to update 
function handleSkateSession() {
    // Check if already skated today
    if (hasSkatedToday()) {
        alert('You already logged a session today! Keep it up! 🛹');
        return;
    }
    
    // Update the streak
    if (updateStreak()) {
        // Refresh the display
        addXP(10);
        displayStreak();
        displayLastSession();
        
    }
}

// gets current streak from local storage and 
// changes emoji for the streak and number
function displayStreak() {
    let currentStreak = parseInt(localStorage.getItem(currentUser + '_streak'))  ||0;
    //change streak icon
    if (currentStreak > 0){ 
        streakFire.innerText = "🔥"
    }
    if (currentStreak >= 10){
        streakFire.innerText = "⭐️"
    }
    if (currentStreak >= 50){
        streakFire.innerText = "⚡️"
    }
    // change the actual number
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

function addXP(amount) {
    let currentXP = parseInt(localStorage.getItem(currentUser + '_xp')) || 0;
    currentXP += amount;
    localStorage.setItem(currentUser + '_xp', currentXP);
    displayXP();
}

function displayXP() {
    let currentXP = parseInt(localStorage.getItem(currentUser + '_xp')) || 0;
    let levelData = calculateLevel();
    
    // Update XP display
    xpNumber.innerText = currentXP;
    
    // Update progress bar
    let xpProgress = document.querySelector('.xp-progress');
    xpProgress.style.width = levelData.progress + '%';
    
    // Update level display
    let userLevel = document.querySelector('.user-level');
    userLevel.innerText = 'LVL ' + levelData.level;
}

function calculateLevel() {
    let currentXP = parseInt(localStorage.getItem(currentUser + '_xp')) || 0;
    let level = Math.floor(currentXP / 100) + 1; // Level 1, 2, 3, etc.
    let xpInCurrentLevel = currentXP % 100; // XP progress in current level (0-99)
    let progressPercent = xpInCurrentLevel; // Since 100 XP per level, this is already a percent
    
    return {
        level: level,
        progress: progressPercent
    };
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
    let trickName = trickInput.value;
    
    if (trickName === '') {
        alert('Please enter a trick name!');
        return;
    }
    
    // Create and display the trick card
    createTrickCard(trickName);
    
    // Save to localStorage
    saveTrickToStorage(trickName);
    
    // Add XP for learning a new trick
    addXP(5); // How much XP do you want for adding a trick?
    
    hideAddTrickForm();
    trickInput.value = '';
    
    alert('New trick added! +5 XP earned! 🛹');
}

// Function to delete a trick
function deleteTrick(trickName, trickCard) {
    // Confirm deletion
    if (confirm('Delete ' + trickName + '? You will lose 5 XP.')) {
        // Remove from display
        tricksGrid.removeChild(trickCard);
        
        // Remove from localStorage
        let userTricks = JSON.parse(localStorage.getItem(currentUser + '_tricks')) || [];
        let index = userTricks.indexOf(trickName);
        if (index > -1) {
            userTricks.splice(index, 1);
        }
        localStorage.setItem(currentUser + '_tricks', JSON.stringify(userTricks));
        
        // Remove XP
        addXP(-5);
        
        alert('Trick deleted. -5 XP');
    }
}



// Function to create a trick card element
function createTrickCard(trickName) {
    let newTrickCard = document.createElement('div');
    newTrickCard.className = 'trick-card';
    
    let trickNameDiv = document.createElement('div');
    trickNameDiv.className = 'trick-name';
    trickNameDiv.innerText = trickName.toUpperCase();
    
    let consistencyDiv = document.createElement('div');
    consistencyDiv.className = 'trick-consistency';
    consistencyDiv.innerText = '0%';
    
    let trickBar = document.createElement('div');
    trickBar.className = 'trick-bar';
    
    let trickProgress = document.createElement('div');
    trickProgress.className = 'trick-progress';
    trickProgress.style.width = '0%';
    
    // Create delete button
    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'X';
    deleteBtn.className = 'delete-trick-btn';
    deleteBtn.style.color = 'red';
    deleteBtn.style.cursor = 'pointer';
    
    // Add delete functionality
    deleteBtn.addEventListener('click', function() {
        deleteTrick(trickName, newTrickCard);
    });
    
    trickBar.appendChild(trickProgress);
    newTrickCard.appendChild(trickNameDiv);
    newTrickCard.appendChild(consistencyDiv);
    newTrickCard.appendChild(trickBar);
    newTrickCard.appendChild(deleteBtn);
    
    tricksGrid.appendChild(newTrickCard);
}


// Function to save a trick to localStorage
function saveTrickToStorage(trickName) {
    let userTricks = JSON.parse(localStorage.getItem(currentUser + '_tricks')) || [];
    userTricks.push(trickName);
    localStorage.setItem(currentUser + '_tricks', JSON.stringify(userTricks));
}

// Function to load saved tricks when page loads
function loadSavedTricks() {
    let userTricks = JSON.parse(localStorage.getItem(currentUser + '_tricks')) || [];
    
    for (let i = 0; i < userTricks.length; i++) {
        createTrickCard(userTricks[i]);
    }
}


// Add clickables
addTrickBtn.addEventListener('click', showAddTrickForm);
cancelBtn.addEventListener('click', hideAddTrickForm);
saveBtn.addEventListener('click', saveNewTrick);
sessionBtn.addEventListener('click', handleSkateSession)

displayStreak();
displayLastSession();
displayXP();
loadSavedTricks();
