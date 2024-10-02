document.addEventListener('DOMContentLoaded', function () {
    const rpsIcons = document.querySelectorAll('.rps-icons i');
    const resultText = document.getElementById('result-text');
    const scoreBoard = document.getElementById('score-board');
    const playMinesBtn = document.getElementById('play-mines-btn');
    const minesweeperPopup = document.getElementById('minesweeper-popup');
    const closeMinesweeperBtn = document.querySelector('.close-minesweeper-btn');
    const startGameBtn = document.getElementById('start-game');
    const minesweeperGrid = document.getElementById('minesweeper-grid');
    const gridSizeSelect = document.getElementById('grid-size');
    const mineCountSelect = document.getElementById('mine-count');
    const checkProgressBtn = document.getElementById('check-progress');
    const restartGameBtn = document.getElementById('restart-game');
    const minesweeperStatus = document.getElementById('minesweeper-status');

    let userScore = 0;
    let computerScore = 0;
    const winScore = 10;

    function resetGame() {
        userScore = 0;
        computerScore = 0;
        scoreBoard.textContent = `YOU 👤  0 ⚔ 0  SOUL `;
        resultText.textContent = '';
    }
    // Rock Paper Scissors logic
    rpsIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const userChoice = this.getAttribute('data-choice');
            const choices = ['rock', 'paper', 'scissors'];
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            let result = '';

            if (userChoice === computerChoice) {
                result = "It's a tie!";
            } else if (
                (userChoice === 'rock' && computerChoice === 'scissors') ||
                (userChoice === 'paper' && computerChoice === 'rock') ||
                (userChoice === 'scissors' && computerChoice === 'paper')
            ) {
                result = "You win!";
                userScore++;
            } else {
                result = "You lose!";
                computerScore++;
            }

            resultText.textContent = `SOUL chose ${computerChoice}. ${result}`;
            scoreBoard.textContent = `YOU 👤 ${userScore} ⚔ ${computerScore} SOUL`;

            if (userScore === winScore || computerScore === winScore) {
                resultText.textContent = `You ${userScore} : ${computerScore} Soul - ${userScore === winScore ? 'You win!' : 'SOUL ⚔ wins!'}`;

                // Display result for 6 seconds, then reset
                setTimeout(resetGame, 4000);
            }
        });
    });

    // Play Minesweeper button click
    playMinesBtn.addEventListener('click', function () {
        minesweeperPopup.classList.remove('hidden');
    });

    // Close Minesweeper popup
    closeMinesweeperBtn.addEventListener('click', function () {
        minesweeperPopup.classList.add('hidden');
        minesweeperGrid.innerHTML = '';
        minesweeperStatus.textContent = '';
    });

    // Start Minesweeper game
    startGameBtn.addEventListener('click', function () {
        const gridSize = gridSizeSelect.value;
        const mineCount = parseInt(mineCountSelect.value, 10);
        const [rows, cols] = gridSize.split('x').map(Number);

        // Generate grid
        minesweeperGrid.innerHTML = '';
        minesweeperGrid.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
        minesweeperGrid.style.gridTemplateRows = `repeat(${rows}, 40px)`;

        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', function () {
                handleCellClick(this, mineCount, rows, cols);
            });
            minesweeperGrid.appendChild(cell);
        }

        // Randomly place mines
        const cells = Array.from(minesweeperGrid.children);
        const mineIndices = new Set();
        while (mineIndices.size < mineCount) {
            mineIndices.add(Math.floor(Math.random() * cells.length));
        }
        mineIndices.forEach(index => cells[index].dataset.mine = true);
    });

    // Handle cell click
    function handleCellClick(cell, mineCount, rows, cols) {
        if (cell.classList.contains('opened')) return;

        cell.classList.add('opened');
        if (cell.dataset.mine) {
            revealAllCells(rows, cols);
            minesweeperStatus.textContent = 'Oops you hit a mine 💣 please restart';
        } else {
            const adjacentMines = countAdjacentMines(cell, rows, cols);
            if (adjacentMines > 0) {
                cell.textContent = adjacentMines;
            }
            // Optionally reveal adjacent cells if number of adjacent mines is 0
        }
    }

    // Reveal all cells
    function revealAllCells(rows, cols) {
        const cells = Array.from(minesweeperGrid.children);
        cells.forEach(cell => {
            if (cell.dataset.mine) {
                cell.classList.add('opened');
                cell.textContent = '💣';
            } else {
                cell.classList.add('opened');
            }
        });
    }
    function updateStatus() {
        minesweeperStatus.innerText = `Score: ${score}`;
    }
    function saveProgress() {
        const progress = {
            gridSize: gridSizeSelect.value,
            mineCount: mineCountSelect.value,
            openedCells: Array.from(minesweeperGrid.children).map(cell => ({
                isOpened: cell.classList.contains('opened'),
                hasMine: cell.dataset.mine ? true : false,
                adjacentMines: cell.textContent
            })),
            statusText: minesweeperStatus.innerText
        };
        localStorage.setItem('minesweeperProgress', JSON.stringify(progress));
    }
    
    function loadProgress() {
        const savedProgress = localStorage.getItem('minesweeperProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
    
            // Restore grid size and mine count
            gridSizeSelect.value = progress.gridSize;
            mineCountSelect.value = progress.mineCount;
            const [rows, cols] = progress.gridSize.split('x').map(Number);
    
            // Restore the grid and the state of each cell
            minesweeperGrid.innerHTML = '';
            minesweeperGrid.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
            minesweeperGrid.style.gridTemplateRows = `repeat(${rows}, 40px)`;
    
            progress.openedCells.forEach((cellState, index) => {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (cellState.isOpened) {
                    cell.classList.add('opened');
                    if (cellState.hasMine) {
                        cell.textContent = '💣';
                    } else {
                        cell.textContent = cellState.adjacentMines;
                    }
                }
                if (cellState.hasMine) {
                    cell.dataset.mine = true;
                }
                cell.addEventListener('click', function () {
                    handleCellClick(this, mineCount, rows, cols);
                });
                minesweeperGrid.appendChild(cell);
            });
    
            // Restore the status text
            minesweeperStatus.innerText = progress.statusText;
        }
    }
    

    // Count adjacent mines
    function countAdjacentMines(cell, rows, cols) {
        const index = Array.from(minesweeperGrid.children).indexOf(cell);
        const row = Math.floor(index / cols);
        const col = index % cols;
        let count = 0;

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    const adjacentIndex = r * cols + c;
                    const adjacentCell = minesweeperGrid.children[adjacentIndex];
                    if (adjacentCell && adjacentCell.dataset.mine) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    // Restart game
    restartGameBtn.addEventListener('click', function () {
        minesweeperPopup.classList.remove('hidden');
        minesweeperGrid.innerHTML = '';
        minesweeperStatus.textContent = '';
    });

    // Check progress
    checkProgressBtn.addEventListener('click', function () {
        const cells = Array.from(minesweeperGrid.children);
        const revealedCells = cells.filter(cell => cell.classList.contains('opened')).length;
        const totalCells = cells.length;
        const safeCells = totalCells - cells.filter(cell => cell.dataset.mine).length;
    
        if (revealedCells === safeCells) {
            minesweeperStatus.textContent = 'You have not opened any cell';
        } else {
            minesweeperStatus.textContent = `Opened Cells: ${revealedCells}, Mines Hit: ${cells.filter(cell => cell.classList.contains('opened') && cell.dataset.mine).length}`;
        }
    });
    

    // Music control
    const backgroundMusic = document.getElementById('background-music');
    const musicControlBtn = document.getElementById('music-control');

    // List of music tracks  
    const musicTracks = [  
        "royalty.mp3",  
        "warriors.mp3",  
        "savior.mp3",  
        "lonely-road.mp3",
        "skrillex.mp3",
        "avamax.mp3",
        "kings.mp3",
        "idol.mp3",
        "METAMORPHOSIS.mp3"
    ]; 
    // Function to select a random track  
    function selectRandomTrack() {  
        const randomIndex = Math.floor(Math.random() * musicTracks.length);  
        return musicTracks[randomIndex];  
    }  

    // Function to load and play a new track  
    function loadAndPlayNewTrack() {  
        const selectedTrack = selectRandomTrack();  
        backgroundMusic.src = selectedTrack; // Set the new track as the source  
        backgroundMusic.load(); // Load the new track  
        backgroundMusic.play(); // Play the new track  
    }  

    // Load random music track on page load  
    window.addEventListener('DOMContentLoaded', () => {  
        loadAndPlayNewTrack(); // Load and play a random track on page load  
    });  

    
    musicControlBtn.addEventListener('click', function () {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicControlBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            backgroundMusic.pause();
            musicControlBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    function handleMediaQueryChange(e) {
        if (e.matches) {
            // Screen width is 768px or less
            console.log('Small screen');
            // Adjust JavaScript functionality as needed
        } else {
            // Screen width is more than 768px
            console.log('Large screen');
            // Adjust JavaScript functionality as needed
        }
    }

    // Initial check
    handleMediaQueryChange(mediaQuery);

    // Listen for changes
    mediaQuery.addListener(handleMediaQueryChange);
});
