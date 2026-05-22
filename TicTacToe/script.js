const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const themeToggleBtn = document.querySelector(".themeToggleBtn");

let cornerStyle = ["roundCornerTopLeft","roundCornerTopRight","roundCornerBottomLeft","roundCornerBottomRight"];

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let options = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";
let running = false;

//start the game by default when starting the page

initializeGame()

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click",cellClicked));
    restartBtn.addEventListener("click",restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();

}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`

}
let winner = "";

function checkWinner(){
    let roundWon = false;
    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];
        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB==cellC){
            roundWon = true;
            winner = currentPlayer;
            break;
        }
    }
    if(roundWon){
            statusText.textContent = `${winner} wins!`;
            running = false;
        }
    else if(!options.includes("")){
        statusText.textContent = "Draw!!";
        running = false;
    }
    else{
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;

}

function toggleRoundCorners(){
    let corners = [cells[0],cells[2],cells[6],cells[8]];
    let i = 0;
    let j = 0;
    while(i<=corners.length){
        corners[i].classList.toggle(cornerStyle[j])
        i++;
        j++;
    }
}

//darktheme

themeToggleBtn.addEventListener("click",toggleTheme);

function toggleTheme(){
    document.body.classList.toggle("darkMode");
}