
let origBoard;

let huPlayer = "O";

let aiPlayer = "X";

let winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

let cells = document.querySelectorAll(".cell");


startGame();

function startGame(){

  document.querySelector(".endgame").style.display = "none";

  origBoard = Array.from(Array(9).keys());

for(let i=0; i < cells.length; i++){

  cells[i].style.removeProperty("background-color");

  cells[i].innerText = "";

  cells[i].addEventListener("click", turnClick, false)

}
}

function turnClick(square){

  if(typeof origBoard[square.target.id] == "number"){

    turn(square.target.id, huPlayer);

    if(!checkTie())

    turn( bestSpot(), aiPlayer)

  }
}

function turn(squareId, player){

  origBoard[squareId] = player;

  document.getElementById(squareId).innerText = player;

  let gameWon = checkWin(origBoard, player);

  if(gameWon) gameOver(gameWon);
}

function checkWin(board, player){

  let plays = board.reduce((a,e,i) =>(e == player)? a.concat(i) : a,[]);

   let gameWon = null

  for(let [index, win ] of winCombos.entries()){

    if(win.every(elm => plays.indexOf(elm) > -1)){

      gameWon = {index: index, player: player}

      break;
    }
  }

  return gameWon;
}

function gameOver(gameWon){

  for(let index of winCombos[gameWon.index]){

    document.getElementById(index).style.backgroundColor =

    gameWon.player === huPlayer ? "blue" : "red";
  }
  for(let i=0; i < cells.length; i++){

    cells[i].removeEventListener("click", turnClick, false);

  }
  declareWinner(gameWon.player == huPlayer ? "You Win" : "You Lose");
}

function declareWinner(who){

  document.querySelector(".endgame").style.display = "block";

  document.querySelector(".text").innerText = who;
}

function emptySquares(){

  return origBoard.filter( s => typeof s == "number");
}

function bestSpot(){

  return minimax(origBoard, aiPlayer).index;

}

function checkTie(){

  if(emptySquares().length == 0){

    for( let i=0; i < cells.length; i++){

      cells[i].style.backgroundColor = "green";

      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie game");

    return true;
  }
  return false;
}

function minimax(newboard, player){


  let availSpots = emptySquares(newboard);

  if(checkWin(newboard, huPlayer)){

    return {score: -10}

  }else if(checkWin(newboard, aiPlayer)){

    return {score: 20}

  }else if(availSpots.length == 0){

    return {score: 0}
  }

  let moves = [];

  for(let i=0; i < availSpots.length; i++){

    let move = {};

    move.index = newboard[availSpots[i]];

    newboard[availSpots[i]] = player;

    if(player == aiPlayer){

      let result = minimax(newboard, huPlayer)

      move.score = result.score;

    }else{

      let result = minimax(newboard, aiPlayer)

      move.score = result.score;
    }
    newboard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;

  if(player == aiPlayer){

    let bestScore = -10000;

    for(let i=0; i < moves.length; i++){

      if(moves[i].score > bestScore){

        bestScore = moves[i].score;

        bestMove = i;
      }
    }
  }else{
    let bestScore = 10000;

    for(let i=0; i < moves.length; i++){

      if(moves[i].score < bestScore){

        bestScore = moves[i].score;
        
        bestMove = i;
      }
    }
  }

  return moves[bestMove]
}
