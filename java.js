document.addEventListener('DOMContentLoaded', function () {
    const rpsIcons = document.querySelectorAll('.rps-icons i');
    const resultText = document.getElementById('result-text');
    const choices = ['rock', 'paper', 'scissors'];

    // Function to get computer's choice
    function getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }

    // Function to determine the winner
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'It\'s a draw!';
        }
        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'scissors' && computerChoice === 'paper') ||
            (playerChoice === 'paper' && computerChoice === 'rock')
        ) {
            return 'You win!';
        }
        return 'You lose!';
    }

    // Add click event listeners to the icons
    rpsIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const playerChoice = this.getAttribute('data-choice');
            const computerChoice = getComputerChoice();
            const result = determineWinner(playerChoice, computerChoice);

            // Display the result
            resultText.textContent = `You chose ${playerChoice}. SOUL chose ${computerChoice}. ${result}`;
        });
    });
});

// Background music control  
const musicControl = document.getElementById('music-control');  
const backgroundMusic = document.getElementById('background-music');  

// List of music tracks  
const musicTracks = [  
    "royalty.mp3",  
    "warriors.mp3",  
    "savior.mp3",  
    "lonely-road.mp3",
    "skrillex.mp3",
    "avamax.mp3",
    "kings.mp3",
    'idol.mp3',
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
    loadAndPlayNewTrack(); // Load and play a new random track when the current one ends  
});  