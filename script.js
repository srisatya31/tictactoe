console.log("Welcome to TICTACTOE")
let music = new Audio("music.mp3")
let audioTurn = new Audio("ting.mp3")
let gameover = new Audio("gameover.mp3")
let turn = "X"
let isgameover = false;

// Initialize scores
let scores = {
    X: 0,
    O: 0,
    draws: 0
};

const changeturn = () => {
    return turn === "X" ? "O" : "X"  // Changed "0" to "O"
}

const updateScoreBoard = () => {
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
    document.getElementById('scoreDraw').textContent = scores.draws;
}

const checkwin = () => {
    let boxtext = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135],
    ]

    // Check for win
    for (let e of wins) {
        if ((boxtext[e[0]].innerText === boxtext[e[1]].innerText) && 
            (boxtext[e[2]].innerText === boxtext[e[1]].innerText) && 
            (boxtext[e[0]].innerText !== "")) {
            document.querySelector('.info').innerText = boxtext[e[0]].innerText + " Won"
            isgameover = true;
            gameover.play();
            
            // Update score for winner
            if(boxtext[e[0]].innerText === "X") {
                scores.X++;
            } else if(boxtext[e[0]].innerText === "O") {
                scores.O++;
            }
            updateScoreBoard();
            
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "200px";
            document.querySelector(".line").style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`
            document.querySelector(".line").style.width = "20vw";
            return;
        }
    }

    // Check for draw
    let isDraw = true;
    Array.from(boxtext).forEach(box => {
        if(box.innerText === '') {
            isDraw = false;
        }
    });

    if (isDraw && !isgameover) {
        document.querySelector('.info').innerText = "Game Draw!";
        isgameover = true;
        scores.draws++;
        updateScoreBoard();
    }
}

// Game Logic
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', () => {
        if (boxtext.innerText === '') {
            boxtext.innerText = turn;
            turn = changeturn();
            audioTurn.play();
            checkwin();
            if (!isgameover) {
                document.getElementsByClassName("info")[0].innerText = "Turn For " + turn;
            }
        }
    })
})

// Reset button event listener
reset.addEventListener('click', () => {
    let boxtexts = document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(element => {
        element.innerText = ""
    });
    turn = "X";
    isgameover = false;
    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "0px"
    document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
    document.querySelector(".line").style.width = "0vw";
});

// Reset scores button event listener
document.getElementById('resetScores').addEventListener('click', () => {
    scores = {
        X: 0,
        O: 0,
        draws: 0
    };
    updateScoreBoard();
});

// Initial score board setup
updateScoreBoard();