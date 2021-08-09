let chess = document.getElementById('table');
let reset = document.getElementById('reset');
let numberOfClicks = 0;
let myVar;


// initializeBoard: (boardSize: integer) -> Array
function initializeBoard(boardSize) { 
    return [...Array(boardSize)].map(v => 
                [...Array(boardSize)].map(v => false));
  }
  
  // copyBoard: (board: Array) -> Array
  function copyBoard(board) { 
    return board.map(column => column.slice());
  }
  
  // entireBoardVisited: (board: Array) -> boolean
  function entireBoardVisited(board) { 
    return board.every(column => column.every(square => square));
  }
  
  // possibleMoves: (x: integer, y: integer, 
  //                 board: Array, size: integer) -> Array
  function possibleMoves(x, y, board, size) {
    const moves = []
    
    const possibilities = [[1, 2], [1, -2], [-1, 2], [-1, -2],
                       [2, 1], [2, -1], [-2, 1], [-2, -1]]
    for (let [offsetX, offsetY] of possibilities) {
      const newX = x + offsetX;
      const newY = y + offsetY;
      if ( newX < size && newX >= 0 
        && newY < size && newY >= 0 
        && !board[newX][newY]) { 
          moves.push([newX, newY]); 
      }
    }
    return moves;
  }
  
  // visitNextPosition: (x: integer, y: integer, 
  //                     board: Array, boardSize: integer) 
  //                     -> Array|boolean
  function visitNextPosition(x, y, board, boardSize) {
    const copiedBoard = copyBoard(board); 
    copiedBoard[x][y] = true; 
    
    let moves = possibleMoves(x, y, copiedBoard, boardSize);
    if (moves.length === 0 ) {
      if (entireBoardVisited(copiedBoard)) return [[x, y]]; 
      else return false;  
    }
  
    moves = warnsdorff(moves, copiedBoard, boardSize); 
    
    for (let [nextX, nextY] of moves) {
      let path = visitNextPosition(nextX, nextY, copiedBoard, boardSize); 
      if (!!path) {
        path.push([x, y]); 
        return path;
      }
    }
    return false;
  }
  
  // warnsdorff: (moves: Array, board: Array, size: integer) -> Array
  function warnsdorff(moves, board, size) {
    const weightedMoves = [];
    for (const [x, y] of moves) {
      const weight = possibleMoves(x, y, board, size).length; 
      weightedMoves.push({move: [x, y], weight});
    }
    return weightedMoves
            .sort((a, b) => a.weight - b.weight) 
            .map(weighted => weighted.move); 
  }
  
  // knightsTour(x: integer, y: integer, 
  //             boardSize: integer) -> Array|boolean
  function knightsTour(x, y, boardSize) {
    const board = initializeBoard(boardSize);
    
    return visitNextPosition(x, y, board, boardSize).reverse();
  }

  // Reset
  function onReset() {
    clearInterval(myVar);
    clearTable();
    numberOfClicks = 0;
  }

  reset.addEventListener('click', onReset);

  // Draw table
  function drawTable() {
    let chessTable = '';
    for (let i = 0; i < 8; i++) {
        let chessRow = '';
        for (let j = 0; j < 8; j++) {
          let id = '' + i + j;
            chessRow += '<th id="'+id+'" style="cursor:pointer;" class="text-center align-middle" onclick="runKnight('+i+', '+j+', event)"></th>';
        }
        chessTable += '<tr>' + chessRow + '</tr>';
    };
    chess.innerHTML = chessTable;
}

// Clear table
function clearTable() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      document.getElementById(''+i+j).innerHTML = '';
      document.getElementById(''+i+j).style.backgroundColor = '#17a2b8';
    }
  }
}


let id = (arr, i) => {
  let index = '' + arr[i][0] + arr[i][1];
  return index;
}

// On click event
function runKnight(i, j, e) {
   numberOfClicks++;
   if (numberOfClicks > 1) {
     e.preventDefault();
   } else {
    let allKnightMoves = knightsTour(i, j, 8);
    let k = 0;
    myVar = setInterval(function(){
     document.getElementById(id(allKnightMoves, k)).innerHTML = k + 1;
     document.getElementById(id(allKnightMoves, k)).style.backgroundColor = '#138496';
     document.getElementById(id(allKnightMoves, k)).style.color = '#f7f7f7';
     k++;
     if (k >= 64) {
       clearInterval(myVar);
     }
    }, 250);
   } 
}

drawTable();


