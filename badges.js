// Badges Info Page Script
let currentUser = localStorage.getItem('currentUser');

if (currentUser === null) {
    window.location.href = 'login.html';
} else {
    console.log('Welcome back, ' + currentUser + '!');
}

// Update username in header
let loginButton = document.querySelector('.login-btn-header');
loginButton.innerText = currentUser;
loginButton.href = '#';

loginButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (confirm('Log out ' + currentUser + '?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
});

// Update user level in header
function displayUserLevel() {
    let userLevel = document.querySelector('.user-level');
    let currentXP = parseInt(localStorage.getItem(currentUser + '_xp')) || 0;
    let level = calculateLevelFromXP(currentXP);
    userLevel.innerText = 'LVL ' + level;
}

function calculateLevelFromXP(xp) {
    let level = 1;
    for (let i = 2; i <= 100; i++) {
        let xpNeeded = 0;
        for (let j = 2; j <= i; j++) {
            xpNeeded += 50 + (j - 1) * 50;
        }
        if (xpNeeded <= xp) {
            level = i;
        } else {
            break;
        }
    }
    return level;
}

// Update badge progress displays
function updateBadgeProgress() {
    // Week Warrior Progress
    let currentStreak = parseInt(localStorage.getItem(currentUser + '_streak')) || 0;
    let weekWarriorProgressEl = document.getElementById('weekWarriorProgress');
    weekWarriorProgressEl.innerText = currentStreak + ' days';
    
    // Speed Demon Progress
    let userTricks = getUserTricks();
    let highestLevel = 1;
    userTricks.forEach(function(trick) {
        let level = trick.level || 1;
        if (level > highestLevel) {
            highestLevel = level;
        }
    });
    let speedDemonProgressEl = document.getElementById('speedDemonProgress');
    speedDemonProgressEl.innerText = 'Level ' + highestLevel;
}

// Get user tricks (same function from script.js)
function getUserTricks() {
    let storedTricks = JSON.parse(localStorage.getItem(currentUser + '_tricks')) || [];
    return storedTricks.map(function(item) {
        if (typeof item === 'string') {
            return { name: item, level: 1 };
        }
        return item;
    });
}

// Initialize
displayUserLevel();
updateBadgeProgress();
