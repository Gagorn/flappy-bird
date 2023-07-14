const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// vamos precisar do gamecontainer para deixá-lo embaçado
// quando exibimos o menu final
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png';

//constantes do jogo
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Variaveis do bird
let birdX = 50;
let birdY = 50;
let birdVelocity = 2;
let birdAcceleration = 0.5;

// Variaveis da colisão
let pipeX = 400;
let pipeY = canvas.height - 200;

// Pontuação variaveis
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// adicionamos uma variável bool, para que possamos verificar quando o flappy passa aumentamos a pontuação

let scored = false;

// nos permite controlar o pássaro com a tecla de espaço
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

// nos permite reiniciar o jogo se atingirmos o fim do jogo
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})



function increaseScore() {
    // aumenta agora nosso contador quando nosso flappy passa pelos canos
    if(birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
          birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // redefine a bandeira, se o pássaro passar pelos canos
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Cria caixas delimitadoras para o pássaro e os canos

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Verifica se há colisão com a caixa do tubo superior
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    // Verifica se há colisão com a caixa do tubo inferior
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }

    // verifica se o pássaro atinge os limites
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }


    return false;
}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // Assim atualizamos sempre nosso recorde ao final do nosso jogo
    // se tivermos uma pontuação mais alta que a anterior
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// redefinimos os valores para o início, então começamos
// com o pássaro no começo
function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // redefine o ctx após cada iteração do loop
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Flappy Bird
    ctx.drawImage(flappyImg, birdX, birdY);

    // Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // agora precisaríamos adicionar uma verificação de colisão para exibir nosso menu final
    // e finaliza o jogo
    // a colisãoCheck nos retornará verdadeiro se tivermos uma colisão
    // caso contrário falso
    if (collisionCheck()) {
        endGame();
        return;
    }


    // esqueceu de mover os canos
    pipeX -= 1.5;
    // se o tubo se mover para fora do quadro, precisamos redefinir o tubo
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    // aplica gravidade ao pássaro e deixa-o se mover
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    // sempre verifica se você chama a função...
    increaseScore()
    requestAnimationFrame(loop);
}

loop();