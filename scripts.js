// Background music control  
const musicControl = document.getElementById('music-control');  
const backgroundMusic = document.getElementById('background-music');  

// List of music tracks  
const musicTracks = [  
    "music/royalty.mp3",  
    "music/warriors.mp3",  
    "music/savior.mp3",  
    "music/lonely-road.mp3",  
    "music/skrillex.mp3",  
    "music/avamax.mp3",  
    "music/kings.mp3",  
    "music/idol.mp3",  
    "music/METAMORPHOSIS.mp3"  
];  

let lastPlayedTrack = null;  

// Function to select a random track  
function selectRandomTrack() {  
    let randomIndex;  
    do {  
        randomIndex = Math.floor(Math.random() * musicTracks.length);  
    } while (musicTracks[randomIndex] === lastPlayedTrack);  

    lastPlayedTrack = musicTracks[randomIndex]; // Store the newly selected track  
    return lastPlayedTrack;  
}  

// Function to load and play a new track  
function loadAndPlayNewTrack() {  
    const selectedTrack = selectRandomTrack();  
    console.log("Selected track:", selectedTrack); // Log the selected track for debugging  
    backgroundMusic.src = selectedTrack; // Set the new track as the source  
    backgroundMusic.load(); // Load the new track  

    // Play the new track once it's ready  
    backgroundMusic.play().catch(error => {  
        console.error("Error playing track:", error.message);  
    });  
}  

// Load random music track on page load  
window.addEventListener('DOMContentLoaded', () => {  
    loadAndPlayNewTrack(); // Load and play a random track on page load  
});  

// Music control button functionality  
musicControl.addEventListener('click', () => {  
    if (backgroundMusic.paused) {  
        backgroundMusic.play();  
        musicControl.innerHTML = '<i class="fas fa-volume-up"></i>';  
    } else {  
        backgroundMusic.pause();  
        musicControl.innerHTML = '<i class="fas fa-volume-mute"></i>';  
    }  
});  

// Event listener for when the current track ends  
backgroundMusic.addEventListener('ended', () => {  
    console.log("Track ended. Loading a new track.");  
    loadAndPlayNewTrack(); // Load and play a new random track when the current one ends  
});

// Toggle rules popup
const rulesLink = document.getElementById('rules-link');
const rulesPopup = document.getElementById('rules-popup');
const closeBtns = document.querySelectorAll('.close-btn');

rulesLink.addEventListener('click', (e) => {
    e.preventDefault();
    rulesPopup.style.display = 'flex';
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.popup-container').style.display = 'none';
    });
});

// Toggle navigation menu for small screens
const menuIcon = document.querySelector('.menu-icon');
const navMenu = document.querySelectorAll('.nav-menu');
const sideMenu = document.querySelector('#side-menu');
const closeIcon = document.querySelector('#side-menu-close');
const navLinks = document.querySelectorAll('.nav-menu a, .side-menu-items a');

menuIcon.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (isSmallScreen()) {
            // Add any additional functionality for link clicks here
            sideMenu.classList.remove('open');
        }
    });
});
// Close side menu on close icon click
closeIcon.addEventListener('click', () => {
    sideMenu.classList.remove('open');
});
// Toggle matches popup
const matchesBtn = document.getElementById('matches-btn');
const matchesPopup = document.getElementById('matches-popup');

matchesBtn.addEventListener('click', () => {
    matchesPopup.style.display = 'flex';
});

// Toggle MVP popup
const mvpBtn = document.getElementById('mvp-btn');
const mvpPopup = document.getElementById('mvp-popup');

mvpBtn.addEventListener('click', () => {
    mvpPopup.style.display = 'flex';
});

// Toggle announcements popup
const announcementsLink = document.getElementById('announcements-link');
const announcementsPopup = document.getElementById('announcements-popup');

announcementsLink.addEventListener('click', (e) => {
    e.preventDefault();
    announcementsPopup.style.display = 'flex';
});


// Game Elements
const gamePopup = document.getElementById('game-popup');
const gameGrid = document.getElementById('game-grid');
const gameStatus = document.getElementById('game-status');
const resetButton = document.getElementById('reset-game');
const showRecordsButton = document.getElementById('show-records');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const gameLink = document.getElementById('game-link');
const gameResult = document.getElementById('game-result');
const resultMessage = document.getElementById('result-message');
const restartGameButton = document.getElementById('restart-game');
const closeGameBtn = document.querySelector('.close-game-btn');

// Initialize Game
function initGame() {
    gameGrid.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('game-cell'); 
        cellElement.setAttribute('data-index', index);
        cellElement.addEventListener('click', handleCellClick);
        gameGrid.appendChild(cellElement);
    });
    updateStatus();
    loadGame();
    
    // Let the bot play first if it's O's turn
    if (currentPlayer === "O") botMove();
}

gameLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    gamePopup.style.display = 'block'; // Show the game popup
});

// Event listener for closing the game popup
closeGameBtn.addEventListener('click', () => {
    gamePopup.style.display = 'none'; // Hide the game popup
    resetGame(); // Optionally reset the game
});

// Event Listeners
difficultyButtons.forEach(button => button.addEventListener('click', (event) => {
    difficulty = event.target.dataset.difficulty;
    document.querySelector('.game-header').style.display = 'none';
    document.querySelector('.game-grid').style.display = 'grid';
    document.querySelector('.game-info').style.display = 'block';

    // Reset the game for a fresh start
    resetGame();
    
    // Check if bot is 'O' and make the first move immediately
    if (currentPlayer === "O") {
        botMove();
    }
}));

resetButton.addEventListener('click', resetGame);
showRecordsButton.addEventListener('click', showRecords);

// Show popup when "GAME" menu item is clicked
gameLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    gamePopup.style.display = 'flex'; // Show the game popup
    document.querySelector('.game-header').style.display = 'block'; // Show the difficulty selection initially
    document.querySelector('.game-grid').style.display = 'none'; // Hide the game grid initially
    document.querySelector('.game-info').style.display = 'none'; // Hide the game info initially
});

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "O"; // User is 'X', Bot is 'O'
let gameActive = true;
let difficulty = "easy"; // Default difficulty
let scores = { wins: 0, losses: 0, draws: 0 };



// Handle Cell Click
function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] !== "" || !gameActive || currentPlayer !== "X") return; // Ensure player X's turn

    board[index] = currentPlayer;
    currentPlayer = "O"; // Switch to bot's turn
    saveGame();
    renderBoard();
    checkGameResult();

    if (gameActive) {
        botMove(); // Let the bot play after the player
    }
}

function botMove() {
    if (!gameActive || currentPlayer !== "O") return; // Ensure it's the bot's turn

    let availableCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    if (availableCells.length === 0) return;

    let move;

    if (difficulty === "easy") {
        // Random move for easy difficulty
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    } else if (difficulty === "medium" || difficulty === "hard") {
        // Check if the bot can win or block the player
        move = findWinningMove("O") || findWinningMove("X") || availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    board[move] = "O";
    currentPlayer = "X"; // Hand the turn back to the player
    saveGame();
    renderBoard();
    checkGameResult();
}

// Function to find a winning or blocking move
function findWinningMove(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const condition of winConditions) {
        const [a, b, c] = condition;

        // Check if two cells are filled with the player's symbol and one is empty
        if (board[a] === player && board[b] === player && board[c] === "") {
            return c;
        }
        if (board[a] === player && board[c] === player && board[b] === "") {
            return b;
        }
        if (board[b] === player && board[c] === player && board[a] === "") {
            return a;
        }
    }

    return null; // No winning or blocking move found
}


// Check Game Result
function checkGameResult() {
    let result = null;

    // Win conditions
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    winConditions.forEach(condition => {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            result = board[a] === 'X' ? 'win' : 'loss';
        }
    });

    // Check for a draw
    if (!result && board.every(cell => cell)) {
        result = 'draw';
    }

    if (result) {
        gameActive = false;
        updateScores(result);
    }

    updateStatus(result);
    saveGame();
}
restartGameButton.addEventListener('click', () => {
    resetGame(); // Reset the game board
    gameResult.style.display = 'none'; // Hide the result message
    gameGrid.style.pointerEvents = 'auto'; // Re-enable the grid for a new game
});

// Update Status Message
function updateStatus(result) {
    switch (result) {
        case "win":
            resultMessage.textContent = "You won! 🏆";
            break;
        case "loss":
            resultMessage.textContent = "You lost! 😞";
            break;
        case "draw":
            resultMessage.textContent = "It's a draw! 🤝";
            break;
        default:
            resultMessage.textContent = `Current turn: ${currentPlayer}`;
            break;
    }

    if (result) {
        gameResult.style.display = 'block'; // Show the game result
        gameGrid.style.pointerEvents = 'none'; // Disable further clicks on the grid
    } else {
        gameResult.style.display = 'none'; // Hide the game result
        gameGrid.style.pointerEvents = 'auto'; // Enable clicks on the grid
    }
}

// Update Scores
function updateScores(result) {
    if (result === "win") {
        scores.wins++;
    } else if (result === "loss") {
        scores.losses++;
    } else if (result === "draw") {
        scores.draws++;
    }
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

// Render Game Board
function renderBoard() {
    gameGrid.querySelectorAll('.game-cell').forEach((cell, index) => {
        cell.textContent = board[index];
        cell.classList.toggle('active', board[index] !== "");
    });
}

// Save Game State
function saveGame() {
    localStorage.setItem('ticTacToeBoard', JSON.stringify(board));
    localStorage.setItem('ticTacToeCurrentPlayer', currentPlayer);
    localStorage.setItem('ticTacToeActive', gameActive);
}

// Load Game State
function loadGame() {
    const savedBoard = JSON.parse(localStorage.getItem('ticTacToeBoard'));
    const savedPlayer = localStorage.getItem('ticTacToeCurrentPlayer');
    const savedActive = localStorage.getItem('ticTacToeActive');
    const savedScores = JSON.parse(localStorage.getItem('ticTacToeScores'));

    if (savedBoard) board = savedBoard;
    if (savedPlayer) currentPlayer = savedPlayer;
    if (savedActive !== null) gameActive = JSON.parse(savedActive);
    if (savedScores) scores = savedScores;

    renderBoard();
    updateStatus();
}

// Reset Game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "O"; // Adjust this if you want the bot to start as 'O'
    gameActive = true;
    saveGame();
    renderBoard();
    updateStatus();

    // If bot starts, make the first move
    if (currentPlayer === "O") {
        botMove();
    }
}

// Show Game Records
function showRecords() {
    alert(`Wins: ${scores.wins}\nLosses: ${scores.losses}\nDraws: ${scores.draws}`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    // Show popup when Game menu item is clicked
    document.querySelector('.game-menu-item').addEventListener('click', () => {
        gamePopup.style.display = 'flex';
    });
});

// Select side menu items
const sideAnnouncementsLink = document.getElementById('side-announcements-link');
const sideRulesLink = document.getElementById('side-rules-link');
const sideGameLink = document.getElementById('side-game-link');
const sideAchievementsLink = document.getElementById('side-achievements-link');
const sideCommunityLink = document.getElementById('side-community-link');

// Attach event listeners for side menu links
sideAnnouncementsLink.addEventListener('click', (e) => {
    e.preventDefault();
    announcementsPopup.style.display = 'flex';
    sideMenu.classList.remove('open'); // Close side menu on link click
});

sideRulesLink.addEventListener('click', (e) => {
    e.preventDefault();
    rulesPopup.style.display = 'flex';
    sideMenu.classList.remove('open'); // Close side menu on link click
});

sideGameLink.addEventListener('click', (e) => {
    e.preventDefault();
    gamePopup.style.display = 'flex'; // Show the game popup
    sideMenu.classList.remove('open'); // Close side menu on link click
});

sideAchievementsLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Your functionality here
    sideMenu.classList.remove('open'); // Close side menu on link click
});

sideCommunityLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Your functionality here
    sideMenu.classList.remove('open'); // Close side menu on link click
});

// Function to check if the screen size is small
function isSmallScreen() {
    return window.innerWidth <= 768; // Adjust the width based on your design
}

