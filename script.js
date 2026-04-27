console.log("Hello World! Welcome to skateXP!");

// Get the elements we need
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
    alert("Added!")
}


// Add click events
addTrickBtn.addEventListener('click', showAddTrickForm);
cancelBtn.addEventListener('click', hideAddTrickForm);
saveBtn.addEventListener('click', saveNewTrick);

