"use strict";

var turn = 0;
var gameOver = false;
var startGame = false;
var moveCount = 0;

var players ={
    player1: "Player 1",
    player2: "Player 2"
};

var gameStatus = document.getElementById("gameStatus");

var startButton = document.getElementById("startGame");

var restartButton = document.getElementById("restartGame");

var boxes = document.getElementsByClassName("box");

restartButton.style.display = "none";


function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidSymbol(symbol)
{
    return symbol === "O" || symbol === "X";
}

function getPlayerNameFromSymbol(symbol)
{
    return (symbol == "O") ? players.player1 : players.player2;
}

function areSymbolsEqual(symbol1, symbol2)
{
    return symbol1 == symbol2;
}

async function declareGameOver(status)
{
    gameOver = true;
    startGame = false;

    await sleep(1000);

    for(let index = 0; index < boxes.length; index++)
    {
        boxes[index].innerHTML = "";
    }
    
    if(status === players.player1 || status === players.player2)
    {
        status = `${status} has won the game`;
    }
    else if (status === "Draw")
    {
        status = `Game Result is ${status}`;
    }

    gameStatus.innerHTML = status;
    restartButton.style.display = "block";
}

function validateDiagonals()
{
    let isGameOver = true;
    let r = 3, c = 1;
    while(r < 9 && c < 3)
    {
        let index = r + c;
        let prevIndex = index - 4;
    
        if(!areSymbolsEqual(boxes[prevIndex].innerHTML, boxes[index].innerHTML))
        {
            isGameOver = false;
            break;
        }
        r += 3;
        c++;
    }
    let symbol = boxes[0].innerHTML;
    if(isGameOver && isValidSymbol(symbol))
    {
        declareGameOver(getPlayerNameFromSymbol(symbol));
        return true;
    }
    
    isGameOver = true;
    r = 3;
    c = 1;
    while(r < 9 && c >= 0)
    {
        let index = r + c;
        let prevIndex = index - 2;
    
        if(!areSymbolsEqual(boxes[prevIndex].innerHTML, boxes[index].innerHTML))
        {
            isGameOver = false;
            break;
        }
        r += 3;
        c--;
    }

    symbol = boxes[2].innerHTML;
    if(isGameOver && isValidSymbol(symbol))
    {
        declareGameOver(getPlayerNameFromSymbol(symbol));
        return true;
    }
    return false;
}

function validateMove()
{
    for(let row = 0; row < 9; row += 3)
    {
        let isGameOver = true;
        for(let col = 1; col < 3; col++)
        {
            let index = row + col;
        
            if(!areSymbolsEqual(boxes[index-1].innerHTML, boxes[index].innerHTML))
            {
                isGameOver = false;
                break;
            }
        }
        
        let symbol = boxes[row].innerHTML;

        if(isGameOver && isValidSymbol(symbol))
        {
            declareGameOver(getPlayerNameFromSymbol(symbol));
            return;
        }
    }

    for(let col = 0; col < 3; col++)
    {
        let isGameOver = true;
        for(let row = 3; row < 9; row += 3)
        {
            let index = row + col;
            
            if(!areSymbolsEqual(boxes[index-3].innerHTML, boxes[index].innerHTML))
            {
                isGameOver = false;
                break;
            }
        }

        let symbol = boxes[col].innerHTML;
        
        if(isGameOver && isValidSymbol(symbol))
        {
            declareGameOver(getPlayerNameFromSymbol(symbol));
            return;
        }
    }

    let isGameOver = validateDiagonals()
    
    if(isGameOver)
    {
        return;
    }

    if(moveCount == 9)
    {
        declareGameOver("Draw");
        return;
    }

    switch(turn)
    {
        case 0: gameStatus.innerHTML = `${players.player2}'s Turn`;
        break;
        case 1: gameStatus.innerHTML = `${players.player1}'s Turn`;
        break;
    }
}

function makeMove(element)
{
    let elementText = element.innerHTML;
    if(elementText !== "")
    {
        return;
    }

    switch(turn)
    {
        case 0: element.innerHTML = "O";
        break;
        case 1: element.innerHTML = "X";
        break;
    }
    moveCount++;
    validateMove();

    turn = (turn + 1)%2;
}

function boxOnClick()
{
    if(!startGame || gameOver)
    {
        return;
    }    
    makeMove(this);
}

for(let index = 0; index < boxes.length; index++)
{
    let box = boxes[index];
    box.addEventListener("click", boxOnClick);
}


startButton.onclick = async function(){
    startButton.style.display = "none";
    
    gameStatus.innerHTML = "Game Begins!!!";
    
    await sleep(1500);
    
    gameStatus.innerHTML = `${players.player1}'s Turn`;
    startGame = true;
};

restartButton.onclick = async function(){
    restartButton.style.display = "none";

    gameStatus.innerHTML = "Game Begins!!!";

    await sleep(1500);

    gameStatus.innerHTML = `${players.player1}'s Turn`;
    turn = 0;
    moveCount = 0;
    startGame = true;
    gameOver = false;
};