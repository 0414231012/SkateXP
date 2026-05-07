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
        // Change button temporarily
        sessionBtn.innerText = '✅ Already logged today!';
        sessionBtn.style.backgroundColor = '#orange';
        
        // Reset after 2 seconds
        setTimeout(function() {
            sessionBtn.innerHTML = '<span class="btn-icon">🛹</span> I SKATED TODAY';
            sessionBtn.style.backgroundColor = ''; // Reset to original
        }, 2000);
        return;
    }
    
    // Update the streak
    if (updateStreak()) {
        // Add XP for daily session
        addXP(10);
        
        // Refresh the display
        displayStreak();
        displayLastSession();
        
        // Show success feedback
        sessionBtn.innerText = '🔥 +10 XP! Session logged!';
        sessionBtn.style.backgroundColor = '#4CAF50';
        
        // Reset after 2 seconds
        setTimeout(function() {
            sessionBtn.innerHTML = '<span class="btn-icon">🛹</span> I SKATED TODAY';
            sessionBtn.style.backgroundColor = '';
        }, 2000);
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
    
    // Disable the save button immediately
    saveBtn.disabled = true;
    
    if (trickName === '') {
        trickInput.placeholder = 'Please enter a trick name!';
        trickInput.style.borderColor = 'red';
        saveBtn.disabled = false; // Re-enable if error
        return;
    }
    
    // Check if trick already exists
    let userTricks = getUserTricks();
    let trickNameUpper = trickName.toUpperCase();
    
    let trickExists = userTricks.some(function(trick) {
        return trick.name.toUpperCase() === trickNameUpper;
    });
    
    if (trickExists) {
        trickInput.value = '❌ Trick already exists!';
        trickInput.style.color = 'red';
        
        setTimeout(function() {
            trickInput.value = '';
            trickInput.style.color = '';
            saveBtn.disabled = false; // Re-enable
        }, 1500);
        return;
    }
    
    // Create and display the trick card
    let trickData = { name: trickName, level: 1 };
    createTrickCard(trickData);
    
    // Save to localStorage
    saveTrickToStorage(trickData);
    
    // Add XP for learning a new trick
    addXP(5);
    
    // Show success in the input field
    trickInput.value = '✅ Trick added! +5 XP';
    trickInput.style.color = 'green';
    
    // Reset and hide after 1.5 seconds
    setTimeout(function() {
        hideAddTrickForm();
        trickInput.value = '';
        trickInput.style.color = '';
        trickInput.style.borderColor = '';
        trickInput.placeholder = 'Enter trick name (e.g., Kickflip)';
        saveBtn.disabled = false; // Re-enable when done
    }, 1500);
}

function showAddTrickForm() {
    addTrickForm.style.display = 'block';
    saveBtn.disabled = false; // Make sure it's enabled when opening
}

function hideAddTrickForm() {
    addTrickForm.style.display = 'none';
    saveBtn.disabled = false; // Re-enable when cancelling
}



// Function to delete a trick
function deleteTrick(trickName, trickCard) {
    if (confirm('Delete ' + trickName + '? You will lose 5 XP.')) {
        // Add fade effect before removing
        trickCard.style.opacity = '0.5';
        
        setTimeout(function() {
            // Remove from display
            tricksGrid.removeChild(trickCard);
            
            // Remove from localStorage
            let userTricks = getUserTricks();
            let index = userTricks.findIndex(function(trick) {
                return trick.name === trickName;
            });
            if (index > -1) {
                userTricks.splice(index, 1);
            }
            setUserTricks(userTricks);
            
            // Remove XP and show update
            addXP(-5);
        }, 300);
    }
}




// Function to create a trick card element
function createTrickCard(trickData) {
    let trickName = trickData.name;
    let trickLevel = trickData.level || 1;

    let newTrickCard = document.createElement('div');
    newTrickCard.className = 'trick-card';
    
    let trickInfo = document.createElement('div');
    trickInfo.className = 'trick-info';
    
    let trickNameDiv = document.createElement('div');
    trickNameDiv.className = 'trick-name';
    trickNameDiv.innerText = trickName.toUpperCase();
    
    let trickLevelDiv = document.createElement('div');
    trickLevelDiv.className = 'trick-consistency';
    trickLevelDiv.innerText = 'LEVEL ' + trickLevel;
    
    let trickBar = document.createElement('div');
    trickBar.className = 'trick-bar';
    
    let trickProgress = document.createElement('div');
    trickProgress.className = 'trick-progress';
    trickProgress.style.width = Math.min(trickLevel * 15, 100) + '%';
    
    let actionGroup = document.createElement('div');
    actionGroup.className = 'trick-actions';

    let markBtn = document.createElement('button');
    markBtn.innerText = 'MARK';
    markBtn.className = 'mark-trick-btn';
    markBtn.title = 'Mark trick complete and earn XP';
    
    markBtn.addEventListener('click', function() {
        markTrickCompleted(trickName, newTrickCard);
    });

    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = '×';
    deleteBtn.className = 'delete-trick-btn';
    deleteBtn.title = 'Delete trick';
    
    deleteBtn.addEventListener('click', function() {
        deleteTrick(trickName, newTrickCard);
    });
    
    trickBar.appendChild(trickProgress);
    trickInfo.appendChild(trickNameDiv);
    trickInfo.appendChild(trickLevelDiv);
    trickInfo.appendChild(trickBar);
    actionGroup.appendChild(markBtn);
    actionGroup.appendChild(deleteBtn);
    
    newTrickCard.appendChild(trickInfo);
    newTrickCard.appendChild(actionGroup);
    
    tricksGrid.appendChild(newTrickCard);
}

function updateTrickCardUI(trickCard, trickData) {
    let levelDiv = trickCard.querySelector('.trick-consistency');
    let progress = trickCard.querySelector('.trick-progress');
    if (levelDiv) {
        levelDiv.innerText = 'LEVEL ' + trickData.level;
    }
    if (progress) {
        progress.style.width = Math.min(trickData.level * 15, 100) + '%';
    }
}

function markTrickCompleted(trickName, trickCard) {
    let userTricks = getUserTricks();
    let trick = userTricks.find(function(item) {
        return item.name === trickName;
    });
    if (!trick) {
        return;
    }
    trick.level = (trick.level || 1) + 1;
    setUserTricks(userTricks);
    updateTrickCardUI(trickCard, trick);
    addXP(5);

    let markBtn = trickCard.querySelector('.mark-trick-btn');
    if (markBtn) {
        markBtn.innerText = '+5 XP';
        markBtn.style.backgroundColor = '#4CAF50';
        markBtn.style.color = '#000000';
        setTimeout(function() {
            markBtn.innerText = 'MARK';
            markBtn.style.backgroundColor = '';
            markBtn.style.color = '';
        }, 900);
    }
}


// Function to save a trick to localStorage
function getUserTricks() {
    let storedTricks = JSON.parse(localStorage.getItem(currentUser + '_tricks')) || [];
    return storedTricks.map(function(item) {
        if (typeof item === 'string') {
            return { name: item, level: 1 };
        }
        return item;
    });
}

function setUserTricks(tricks) {
    localStorage.setItem(currentUser + '_tricks', JSON.stringify(tricks));
}

function saveTrickToStorage(trickData) {
    let userTricks = getUserTricks();
    userTricks.push(trickData);
    setUserTricks(userTricks);
}

function loadSavedTricks() {
    let userTricks = getUserTricks();
    
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
