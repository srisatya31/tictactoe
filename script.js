console.log("Welcome to TICTACTOE");
let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");

// Game Variables
let turn = "X";
let isgameover = false;
let isBotMode = false;
let botLevel = "easy"; // Default bot level

const turnchange = document.querySelector('.turnchange');
const info = document.querySelector('.info');
const resetButton = document.getElementById("reset");
const botButton = document.getElementById("bot");

const changeturn = () => (turn === "X" ? "0" : "X");

// Function to Check for a Win
const checkwin = () => {
    let boxtext = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    wins.forEach(e => {
        if (
            boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[1]].innerText === boxtext[e[2]].innerText &&
            boxtext[e[0]].innerText !== ""
        ) {
            info.innerText = boxtext[e[0]].innerText + " Won!";
            isgameover = true;
            gameover.play();
            document.querySelector('.imgbox img').style.width = "200px";
            disableBoxes();
        }
    });
};

// Disable All Boxes
const disableBoxes = () => {
    document.querySelectorAll('.box').forEach(box => box.style.pointerEvents = "none");
};

// Enable All Boxes
const enableBoxes = () => {
    document.querySelectorAll('.box').forEach(box => box.style.pointerEvents = "auto");
};

// Player Move (Click Event)
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', () => {
        if (boxtext.innerText === '' && !isgameover) {
            boxtext.innerText = turn;
            turn = changeturn();
            audioTurn.play();
            checkwin();

            if (!isgameover) {
                info.innerText = "Turn For " + turn;

                // If Bot Mode is ON and it's Bot's turn
                if (isBotMode && turn === "0") {
                    setTimeout(botMove, 500); // Small delay for realism
                }
            }
        }
    });
});

// Reset Game
resetButton.addEventListener('click', resetGame);

function resetGame() {
    document.querySelectorAll('.boxtext').forEach(element => element.innerText = "");
    turn = "X";
    isgameover = false;
    enableBoxes();
    document.querySelector('.imgbox img').style.width = "0px";
    info.innerText = "Turn for " + turn;

    if (isBotMode && turn === "0") {
        setTimeout(botMove, 500);
    }
}

// ----------------------- BOT SYSTEM -----------------------

// Play with Bot Button
botButton.addEventListener('click', () => {

    let existingLevels = document.querySelector('.level');
    if (existingLevels) {
        existingLevels.remove();
    }


    const levels = document.createElement('div');
    levels.innerHTML = `
        <div class="level">
            <button id="easy">Easy</button>
            <button id="medium">Medium</button>
            <button id="hard">Hard</button>
        </div>
    `;
    turnchange.appendChild(levels);

    document.getElementById("easy").addEventListener("click", () => startBotGame("easy"));
    document.getElementById("medium").addEventListener("click", () => startBotGame("medium"));
    document.getElementById("hard").addEventListener("click", () => startBotGame("hard"));
});

// Start Bot Mode
const startBotGame = (level) => {
    botLevel = level;
    isBotMode = true;
    turn = "X";
    resetGame();
};

// Bot Move Logic
const botMove = () => {
    let board = Array.from(document.getElementsByClassName('boxtext')).map(b => b.innerText);
    let botSymbol = "0", playerSymbol = "X";

    let move;
    if (botLevel === "easy") {
        move = botMoveEasy(board);
    } else if (botLevel === "medium") {
        move = botMoveMedium(board, botSymbol, playerSymbol);
    } else if (botLevel === "hard") {
        move = botMoveHard(board, botSymbol, playerSymbol);
    }

    if (move !== undefined) {
        document.getElementsByClassName("boxtext")[move].innerText = botSymbol;
        turn = changeturn();
        audioTurn.play();
        checkwin();

        if (!isgameover) {
            info.innerText = "Turn For " + turn;
        }
    }
};

// Easy Mode: Random Move
const botMoveEasy = (board) => {
    let emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(idx => idx !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// Medium Mode: Block or Win Strategy
const botMoveMedium = (board, botSymbol, playerSymbol) => {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = botSymbol;
            if (checkWin(board, botSymbol)) return i;
            board[i] = '';
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = playerSymbol;
            if (checkWin(board, playerSymbol)) return i;
            board[i] = '';
        }
    }
    return botMoveEasy(board);
};

// Hard Mode: Minimax Algorithm
const minimax = (board, isMaximizing, botSymbol, playerSymbol) => {
    if (checkWin(board, botSymbol)) return { score: 1 };
    if (checkWin(board, playerSymbol)) return { score: -1 };
    if (board.every(cell => cell !== '')) return { score: 0 };

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = isMaximizing ? botSymbol : playerSymbol;
            let score = minimax(board, !isMaximizing, botSymbol, playerSymbol).score;
            board[i] = '';

            if (isMaximizing ? score > bestScore : score < bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return { score: bestScore, move: bestMove };
};

const botMoveHard = (board, botSymbol, playerSymbol) => {
    return minimax(board, true, botSymbol, playerSymbol).move;
};

// Helper Function: Check Win for AI
const checkWin = (board, symbol) => {
    return [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ].some(e => board[e[0]] === symbol && board[e[1]] === symbol && board[e[2]] === symbol);
};
