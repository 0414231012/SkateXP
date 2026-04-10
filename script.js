console.log("Hello World! Welcome to skateXP!");

// Get the elements we need
let addTrickBtn = document.querySelector('.add-trick-btn');
let addTrickForm = document.querySelector('.add-trick-form');
let cancelBtn = document.querySelector('.cancel-btn');
let saveBtn = document.querySelector('.save-btn');
let trickInput = document.querySelector('.trick-input');  // Fixed this line!
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
    
    // Your turn: Can you create the consistency div?
    // Hint: Look at your existing trick cards - what should new tricks start at?
}


// Add click events
addTrickBtn.addEventListener('click', showAddTrickForm);
cancelBtn.addEventListener('click', hideAddTrickForm);
saveBtn.addEventListener('click', saveNewTrick);

