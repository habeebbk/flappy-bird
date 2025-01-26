const game = document.getElementById('game');
const bird = document.getElementById('bird');
const obstacles = document.getElementById('obstacles');

let birdTop = 250;
let gravity = 2;
let gameHeight = 600;
let gameWidth = 400;
let obstacleWidth = 60;
let obstacleGap = 200;
let obstacleSpeed = 2;
let score = 0;
let gameOver = false;

// Apply gravity to the bird
function applyGravity() {
    birdTop += gravity;
    bird.style.top = birdTop + 'px';
    if (birdTop > gameHeight - 40 || birdTop < 0) {
        endGame();
    }
}

// Make the bird jump
function jump() {
    birdTop -= 60;
    bird.style.top = birdTop + 'px';
}

// Generate obstacles
function createObstacle() {
    if (gameOver) return;

    let obstacleTop = Math.random() * (gameHeight - obstacleGap);
    let obstacleBottom = gameHeight - obstacleTop - obstacleGap;

    let topObstacle = document.createElement('div');
    topObstacle.classList.add('obstacle');
    topObstacle.style.height = obstacleTop + 'px';
    topObstacle.style.left = gameWidth + 'px';

    let bottomObstacle = document.createElement('div');
    bottomObstacle.classList.add('obstacle');
    bottomObstacle.style.height = obstacleBottom + 'px';
    bottomObstacle.style.left = gameWidth + 'px';
    bottomObstacle.style.bottom = '0';

    obstacles.appendChild(topObstacle);
    obstacles.appendChild(bottomObstacle);

    moveObstacles(topObstacle, bottomObstacle);
}

// Move obstacles
function moveObstacles(topObstacle, bottomObstacle) {
    let obstacleInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(obstacleInterval);
            return;
        }

        let topObstacleLeft = parseInt(topObstacle.style.left);
        let bottomObstacleLeft = parseInt(bottomObstacle.style.left);

        topObstacle.style.left = topObstacleLeft - obstacleSpeed + 'px';
        bottomObstacle.style.left = bottomObstacleLeft - obstacleSpeed + 'px';

        if (topObstacleLeft < -obstacleWidth) {
            obstacles.removeChild(topObstacle);
            obstacles.removeChild(bottomObstacle);
            score++;
            console.log('Score: ' + score);
        }

        if (detectCollision(bird, topObstacle) || detectCollision(bird, bottomObstacle)) {
            endGame();
        }
    }, 20);
}

// Detect collision
function detectCollision(bird, obstacle) {
    let birdRect = bird.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    return !(
        birdRect.top > obstacleRect.bottom ||
        birdRect.bottom < obstacleRect.top ||
        birdRect.right < obstacleRect.left ||
        birdRect.left > obstacleRect.right
    );
}

// End the game
function endGame() {
    gameOver = true;
    alert('Game Over! Your score: ' + score);
    window.location.reload();
}

// Event listener for jumping
document.addEventListener('keydown', () => {
    if (!gameOver) jump();
});

// Game loop
setInterval(applyGravity, 20);
setInterval(createObstacle, 2000);