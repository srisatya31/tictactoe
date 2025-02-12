console.log("Welcome to TICTACTOE")
let music= new Audio("music.mp3")
let audioTurn= new Audio("ting.mp3")
let gameover= new Audio("gameover.mp3")
let turn = "X"
let isgameover = false;
const changeturn= ()=>{
    return turn === "X"? "0": "X"
}

const checkwin=()=>{
    let boxtext = document.getElementsByClassName('boxtext');
    let wins=[
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135],
       ]
       wins.forEach(e => {
        if((boxtext[e[0]].innerText === boxtext[e[1]].innerText) && (boxtext[e[2]].innerText === boxtext[e[1]].innerText) && (boxtext[e[0]].innerText !== "")){
            document.querySelector('.info').innerText = boxtext[e[0]].innerText + " Won"
            isgameover = true
            gameover.play();
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "200px";
            document.querySelector(".line").style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`
            document.querySelector(".line").style.width = "20vw";
        }

       })

}
//music.play()
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element =>{
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', ()=>{
        if(boxtext.innerText === ''){
            boxtext.innerText = turn;
            turn = changeturn();
            audioTurn.play();
            checkwin();
            if (!isgameover){
            document.getElementsByClassName("info")[0].innerText = "Turn For " + turn ;
            }
        }
    })

})

reset.addEventListener('click', ()=>{
    let boxtexts = document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(element => {
        element.innerText = ""
    });
    turn = "X"; 
    isgameover = false
    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "0px"
    document.getElementsByClassName("info")[0].innerText  = "Turn for " + turn;
    document.querySelector(".line").style.width = "0vw";
});

const themeToggle = document.getElementById("togglebtn");

function setTheme(mode) {
    document.body.classList.toggle("dark-mode", mode === "dark");
    localStorage.setItem("theme", mode);
    themeToggle.innerText = mode === "dark" ? "🌙 Dark Mode" : "🌞 Light Mode";
}

const savedTheme = localStorage.getItem("theme") || 
                   (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
});
