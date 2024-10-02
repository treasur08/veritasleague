const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const snakePopup = document.querySelector('#snake-popup');
const closePopup = document.querySelector('#close-popup');
const snakeBtn1 = document.querySelector('#snake-btn-1');
const snakeBtn2 = document.querySelector('#snake-btn-2');

const box = 20;
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();
let direction = null;
let score = 0;
let highScore = localStorage.getItem('highScore') ? localStorage.getItem('highScore') : 0;
document.getElementById('high-score').innerText = highScore;

document.addEventListener('keydown', setDirection);

// Event listeners for mobile controls (arrow buttons)
document.getElementById('up-btn').addEventListener('click', () => handleButtonPress('ArrowUp', 'up-btn'));
document.getElementById('down-btn').addEventListener('click', () => handleButtonPress('ArrowDown', 'down-btn'));
document.getElementById('left-btn').addEventListener('click', () => handleButtonPress('ArrowLeft', 'left-btn'));
document.getElementById('right-btn').addEventListener('click', () => handleButtonPress('ArrowRight', 'right-btn'));

let directionChanged = false;  // Prevent direction from changing multiple times between frames

function setDirection(event) {
    if (directionChanged) return;

    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';

    directionChanged = true; // Only allow one direction change per frame
}

// Handle button press and apply visual effects
function handleButtonPress(arrowKey, btnId) {
    setDirection({ key: arrowKey });
    const button = document.getElementById(btnId);
    
    // Apply "pressed" styling
    button.classList.add('pressed');
    
    // Remove "pressed" styling after a short delay (to simulate release)
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 150);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === 'UP') headY -= box;
    if (direction === 'DOWN') headY += box;
    if (direction === 'LEFT') headX -= box;
    if (direction === 'RIGHT') headX += box;

    // Game over if snake hits the wall or itself
    if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height || checkCollision(headX, headY)) {
        clearInterval(game);
        alert('Game Over! Press Restart to Play Again.');
        return;  // Stop the draw loop
    }

    // If snake eats food
    if (headX === food.x && headY === food.y) {
        score += 10;
        document.getElementById('score').innerText = score;
        food = generateFood();  // Generate new food
    } else {
        snake.pop(); // Remove last part of the snake
    }

    let newHead = { x: headX, y: headY };
    snake.unshift(newHead);  // Add new head to the snake

    updateScore();  // Update score and high score

    directionChanged = false; // Reset the direction change flag
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}

function checkCollision(x, y) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
            return true;
        }
    }
    return false;
}

function updateScore() {
    // Check if the current score is greater than the stored high score
    if (score > highScore) {
        highScore = score; // Update high score
        localStorage.setItem('highScore', highScore); // Save new high score in localStorage
        document.getElementById('high-score').innerText = highScore; // Update high score display
    }
}
function showPopup() {
    snakePopup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Function to hide the popup
function hidePopup() {
    snakePopup.classList.add('hidden');
    document.body.style.overflow = '';  
}

// Event listeners for buttons
snakeBtn1.addEventListener('click', showPopup);
snakeBtn2.addEventListener('click', showPopup);
closePopup.addEventListener('click', hidePopup);

window.addEventListener('click', function(event) {
    if (event.target === snakePopup) {
        hidePopup();
    }
});

function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    document.getElementById('score').innerText = score;
    clearInterval(game);
    game = setInterval(drawGame, 170);
}

let game = setInterval(drawGame, 180);
