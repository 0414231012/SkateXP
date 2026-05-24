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
    openConfirmDialog('Log out ' + currentUser + '?', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});

//get trick counter / session logger elements
let sessionBtn = document.querySelector('.session-btn');
let streakNumber = document.querySelector('.streak .stat-number');
let lastSessionText = document.querySelector('.last-session');
let streakFire = document.querySelector('.streak-fire');
let xpNumber = document.querySelector('.xp-card .stat-number');
let xpDetails = document.querySelector('.xp-details');

// Function to check if user already skated today
function hasSkatedToday() {
    let today = new Date().toDateString();
    let lastSkateDate = localStorage.getItem(currentUser + '_lastSkate');
    return lastSkateDate === today;
}

function getDaysDiff(startDate, endDate) {
    let msPerDay = 1000 * 60 * 60 * 24;
    let start = new Date(startDate);
    let end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return Math.round((end - start) / msPerDay);
}

function normalizeTrickName(name) {
    return name.trim();
}

function safeParseJSON(value) {
    try {
        return JSON.parse(value);
    } catch (error) {
        return [];
    }
}

function updateStreak() {
    let today = new Date();
    let todayString = today.toDateString();
    let lastSkateDate = localStorage.getItem(currentUser + '_lastSkate');
    let currentStreak = parseInt(localStorage.getItem(currentUser + '_streak')) || 0;

    if (lastSkateDate === todayString) {
        return false;
    }

    if (lastSkateDate) {
        let daysDiff = getDaysDiff(lastSkateDate, today);
        if (daysDiff >= 1 && daysDiff <= 3) {
            currentStreak += 1;
        } else {
            currentStreak = 1;
        }
    } else {
        currentStreak = 1;
    }

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
        sessionBtn.style.backgroundColor = 'orange';
        
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
        updateBadgeDisplay(); // Check if badges should be unlocked
        
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
function getActiveStreak() {
    let currentStreak = parseInt(localStorage.getItem(currentUser + '_streak')) || 0;
    let lastSkateDate = localStorage.getItem(currentUser + '_lastSkate');
    if (!lastSkateDate || currentStreak <= 0) {
        return 0;
    }

    let daysDiff = getDaysDiff(lastSkateDate, new Date());
    return daysDiff >= 0 && daysDiff <= 3 ? currentStreak : 0;
}

function displayStreak() {
    let currentStreak = getActiveStreak();
    streakNumber.innerText = currentStreak;

    if (currentStreak >= 50) {
        streakFire.innerText = '⚡️';
    } else if (currentStreak >= 10) {
        streakFire.innerText = '⭐️';
    } else if (currentStreak > 0) {
        streakFire.innerText = '🔥';
    } else {
        streakFire.innerText = '';
    }
}

function displayLastSession() {
    let lastSkateDate = localStorage.getItem(currentUser + '_lastSkate');

    if (!lastSkateDate) {
        lastSessionText.innerText = 'Last session: Never';
        return;
    }

    let daysDiff = getDaysDiff(lastSkateDate, new Date());

    if (daysDiff === 0) {
        lastSessionText.innerText = 'Last session: Today!';
    } else if (daysDiff === 1) {
        lastSessionText.innerText = 'Last session: Yesterday';
    } else {
        lastSessionText.innerText = 'Last session: ' + daysDiff + ' days ago';
    }
}

function clampXP(value) {
    return Math.max(0, value);
}

function addXP(amount) {
    let previousLevelData = calculateLevel();
    let currentXP = parseInt(localStorage.getItem(currentUser + '_xp')) || 0;
    currentXP = clampXP(currentXP + amount);
    localStorage.setItem(currentUser + '_xp', currentXP);
    let newLevelData = calculateLevel();

    if (newLevelData.level > previousLevelData.level) {
        triggerLevelUpAnimation();
    }

    displayXP();
}

function triggerLevelUpAnimation() {
    let userLevel = document.querySelector('.user-level');
    if (!userLevel) {
        return;
    }
    userLevel.classList.remove('level-up');
    // Trigger reflow to restart animation
    void userLevel.offsetWidth;
    userLevel.classList.add('level-up');
    
    // Play sound effect (optional - uses browser beep)
    playLevelUpSound();
}

function playLevelUpSound() {
    // Create a simple web audio beep for level up
    try {
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let oscillator = audioContext.createOscillator();
        let gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch(e) {
        // Audio context not available, skip sound
    }
}

function displayXP() {
    let currentXP = parseInt(localStorage.getItem(currentUser + '_xp')) || 0;
    let levelData = calculateLevel();
    
    xpNumber.innerText = currentXP;
    
    let xpProgress = document.querySelector('.xp-progress');
    if (xpProgress) {
        xpProgress.style.width = levelData.progress + '%';
    }

    let userLevel = document.querySelector('.user-level');
    if (userLevel) {
        userLevel.innerText = 'LVL ' + levelData.level;
    }

    if (xpDetails) {
        let nextLevelXP = getXPNeededForLevel(levelData.level + 1);
        let xpRemaining = Math.max(nextLevelXP - currentXP, 0);
        xpDetails.innerText = 'Next level in ' + xpRemaining + ' XP';
    }
}

// Calculate cumulative XP needed to reach a specific level
function getXPNeededForLevel(level) {
    // Each level needs more XP: Level 1->2 needs 100, Level 2->3 needs 150, Level 3->4 needs 200, etc.
    // Cumulative: Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 450, Level 5: 700, etc.
    let totalXP = 0;
    for (let i = 2; i <= level; i++) {
        totalXP += 50 + (i - 1) * 50; // 100, 150, 200, 250, 300...
    }
    return totalXP;
}

// Calculate current level based on total XP with progressive difficulty
function calculateLevel() {
    let currentXP = parseInt(localStorage.getItem(currentUser + '_xp')) || 0;
    let level = 1;
    
    // Find current level
    while (getXPNeededForLevel(level + 1) <= currentXP) {
        level++;
    }
    
    // Calculate progress to next level
    let xpForCurrentLevel = getXPNeededForLevel(level);
    let xpForNextLevel = getXPNeededForLevel(level + 1);
    let xpInCurrentLevel = currentXP - xpForCurrentLevel;
    let xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    let progressPercent = Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100);
    
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
let confirmDialog = document.getElementById('confirmDialog');
let confirmMessage = document.getElementById('confirmMessage');
let confirmYesBtn = document.getElementById('confirmYesBtn');
let confirmNoBtn = document.getElementById('confirmNoBtn');
let undoSnackbar = document.getElementById('undoSnackbar');
let undoBtn = document.getElementById('undoBtn');
let pendingConfirmAction = null;
let lastDeletedTrick = null;
let undoTimer = null;

function openConfirmDialog(message, action) {
    if (!confirmMessage || !confirmDialog) {
        if (typeof action === 'function') {
            action();
        }
        return;
    }

    confirmMessage.innerText = message;
    pendingConfirmAction = action;
    confirmDialog.classList.remove('hidden');
}

function closeConfirmDialog() {
    if (!confirmDialog) {
        return;
    }
    confirmDialog.classList.add('hidden');
    pendingConfirmAction = null;
}

function showUndoSnackbar(message) {
    if (!undoSnackbar) {
        return;
    }
    let messageSpan = document.getElementById('undoSnackbarMessage');
    if (messageSpan) {
        messageSpan.innerText = message;
    }
    undoSnackbar.classList.remove('hidden');
    if (undoTimer) {
        clearTimeout(undoTimer);
    }
    undoTimer = setTimeout(hideUndoSnackbar, 5000);
}

function hideUndoSnackbar() {
    if (!undoSnackbar) {
        return;
    }
    undoSnackbar.classList.add('hidden');
    if (undoTimer) {
        clearTimeout(undoTimer);
        undoTimer = null;
    }
    lastDeletedTrick = null;
}

function undoDelete() {
    if (!lastDeletedTrick) {
        hideUndoSnackbar();
        return;
    }

    let userTricks = getUserTricks();
    userTricks.push(lastDeletedTrick);
    setUserTricks(userTricks);
    createTrickCard(lastDeletedTrick);
    addXP(5);
    updateBadgeDisplay();

    hideUndoSnackbar();
}

function deleteTrickConfirmed(trickName, trickCard) {
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
            lastDeletedTrick = userTricks[index];
            userTricks.splice(index, 1);
        }
        setUserTricks(userTricks);

        // Remove XP and show update
        addXP(-5);
        showUndoSnackbar('Trick deleted. Undo?');
    }, 300);
}

// Function to show the add trick form
function showAddTrickForm() {
    addTrickForm.style.display = 'block';
    trickInput.focus();
    saveBtn.disabled = false;
}

// Function to hide the add trick form
function hideAddTrickForm() {
    addTrickForm.style.display = 'none';
    saveBtn.disabled = false;
}

function saveNewTrick() {
    let trickName = normalizeTrickName(trickInput.value);
    saveBtn.disabled = true;

    if (trickName === '') {
        trickInput.placeholder = 'Please enter a trick name!';
        trickInput.style.borderColor = 'red';
        saveBtn.disabled = false;
        return;
    }

    let userTricks = getUserTricks();
    let normalizedInput = trickName.toUpperCase();

    let trickExists = userTricks.some(function(trick) {
        return trick.name.toUpperCase() === normalizedInput;
    });

    if (trickExists) {
        trickInput.value = '❌ Trick already exists!';
        trickInput.style.color = 'red';

        setTimeout(function() {
            trickInput.value = '';
            trickInput.style.color = '';
            trickInput.style.borderColor = '';
            saveBtn.disabled = false;
        }, 1500);
        return;
    }

    let trickData = { name: trickName, level: 1 };
    createTrickCard(trickData);
    saveTrickToStorage(trickData);
    addXP(5);
    updateBadgeDisplay();

    trickInput.value = '✅ Trick added! +5 XP';
    trickInput.style.color = 'green';

    setTimeout(function() {
        hideAddTrickForm();
        trickInput.value = '';
        trickInput.style.color = '';
        trickInput.style.borderColor = '';
        trickInput.placeholder = 'Enter trick name (e.g., Kickflip)';
        saveBtn.disabled = false;
    }, 1500);
}

// Function to delete a trick
function deleteTrick(trickName, trickCard) {
    openConfirmDialog('Delete ' + trickName + '? You will lose 5 XP.', function() {
        deleteTrickConfirmed(trickName, trickCard);
    });
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
    updateBadgeDisplay(); // Check if Speed Demon badge should unlock

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
    let storedTricks = safeParseJSON(localStorage.getItem(currentUser + '_tricks')) || [];
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

// ============ BADGE SYSTEM ============

// Function to check if Week Warrior badge is earned (7+ day streak)
function isWeekWarriorUnlocked() {
    let currentStreak = parseInt(localStorage.getItem(currentUser + '_streak')) || 0;
    return currentStreak >= 7;
}

// Function to check if Speed Demon badge is earned (any trick at level 5+)
function isSpeedDemonUnlocked() {
    let userTricks = getUserTricks();
    return userTricks.some(function(trick) {
        return (trick.level || 1) >= 5;
    });
}

// Function to check if Street King badge is earned (not available yet)
function isStreetKingUnlocked() {
    return false; // Street King not available yet
}

// Function to update badge display
function updateBadgeDisplay() {
    // Week Warrior badge
    let weekWarriorBadge = document.querySelectorAll('.badge')[0];
    if (isWeekWarriorUnlocked()) {
        weekWarriorBadge.classList.remove('locked');
        weekWarriorBadge.classList.add('earned');
    } else {
        weekWarriorBadge.classList.remove('earned');
        weekWarriorBadge.classList.add('locked');
    }
    
    // Speed Demon badge
    let speedDemonBadge = document.querySelectorAll('.badge')[1];
    if (isSpeedDemonUnlocked()) {
        speedDemonBadge.classList.remove('locked');
        speedDemonBadge.classList.add('earned');
    } else {
        speedDemonBadge.classList.remove('earned');
        speedDemonBadge.classList.add('locked');
    }
    
    // Street King badge (always locked, not available)
    let streetKingBadge = document.querySelectorAll('.badge')[2];
    streetKingBadge.classList.add('locked');
    streetKingBadge.classList.remove('earned');
}

// ============ END BADGE SYSTEM ============

// Add clickables
if (addTrickBtn) addTrickBtn.addEventListener('click', showAddTrickForm);
if (cancelBtn) cancelBtn.addEventListener('click', hideAddTrickForm);
if (saveBtn) saveBtn.addEventListener('click', saveNewTrick);
if (sessionBtn) sessionBtn.addEventListener('click', handleSkateSession);
if (confirmYesBtn) confirmYesBtn.addEventListener('click', function() {
    if (typeof pendingConfirmAction === 'function') {
        pendingConfirmAction();
    }
    closeConfirmDialog();
});
if (confirmNoBtn) confirmNoBtn.addEventListener('click', closeConfirmDialog);
if (undoBtn) undoBtn.addEventListener('click', undoDelete);
if (confirmDialog) {
    let overlay = confirmDialog.querySelector('.confirm-dialog-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeConfirmDialog);
    }
}

displayStreak();
displayLastSession();
displayXP();
loadSavedTricks();
updateBadgeDisplay();