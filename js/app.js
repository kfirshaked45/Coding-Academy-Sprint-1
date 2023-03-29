'use strict';

var gBoard = [];
var gClickCount = 0;
var gPlayerLives = 3;
const gLevel = {
  size: 4,
  mines: 2,
};
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function onInit() {
  gGame.isOn = true;
  gPlayerLives = 3;
  gClickCount = 0;
  if (gGame.isOn) {
    document.querySelector('.modal').classList.add('hidden');
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
  }
}

function playerHit() {
  gPlayerLives--;
  checkGameOver();
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard.length; j++) {
      const currCell = gBoard[i][j];
      if (currCell.isMine) {
        var currHTMLCell = document.querySelector(`.cell-${i}-${j}`);
        currHTMLCell.innerHTML = `<img src='images/mine.jpg'/>`;
        console.log(currHTMLCell);
      }
    }
  }
  if (gPlayerLives !== 0) {
    console.log('Lost a Life! ' + 'Lifes left: ' + gPlayerLives);
  } else {
    console.log('Game over!');
  }
}
function checkGameOver() {
  if (gPlayerLives === 0) {
    gGame.isOn = false;
    document.querySelector('.modal').classList.remove('hidden');
    return;
  }
}

function setMinesNegsCount(board) {
  const numOfRows = board.length;
  const numOfCols = board[0].length;
  for (var i = 0; i < numOfRows; i++) {
    for (var j = 0; j < numOfCols; j++) {
      for (var lastAndNextRow = -1; lastAndNextRow <= 1; lastAndNextRow++) {
        for (var lastAndNextCol = -1; lastAndNextCol <= 1; lastAndNextCol++) {
          const currNeighborRow = lastAndNextRow + i;
          const currNeighborCol = lastAndNextCol + j;
          if (currNeighborRow < 0 || currNeighborRow >= numOfRows || currNeighborCol < 0 || currNeighborCol >= numOfCols) {
            continue;
          }
          if (board[i][j].isMine) {
            board[currNeighborRow][currNeighborCol].minesAroundCount++;
          }
        }
      }
    }
  }
}

function cellClicked(elCell, i, j) {
  const cell = gBoard[i][j];
  if (cell.isMine) {
    playerHit();
    elCell.innerHTML = `<img src='images/gameover.png'/>`;

    return;
  }
  if (gClickCount === 0) {
    buildMines(gBoard);
    setMinesNegsCount(gBoard);
    gClickCount++;
  }

  elCell.innerHTML = `<img src='images/${cell.minesAroundCount}.png'/>`;
}

// onInit() This is called when page loads
// buildBoard() Builds the board
// Set the mines
// Call setMinesNegsCount()
// Return the created board
// setMinesNegsCount(board) Count mines around each cell
// and set the cell's
// minesAroundCount.
// renderBoard(board) Render the board as a <table>
// to the page
// onCellClicked(elCell, i, j) Called when a cell is clicked
// onCellMarked(elCell) Called when a cell is right-
// clicked
// See how you can hide the context
// menu on right click
// checkGameOver() Game ends when all mines are
// marked, and all the other cells
// are shown
// expandShown(board, elCell,
// i, j) When user clicks a cell with no
// mines around, we need to open
// not only that cell, but also its
// neighbors.
// NOTE: start with a basic
// implementation that only opens
// the non-mine 1st degree
// neighbors
// BONUS: if you have the time
// later, try to work more like the
// real algorithm (see description
// at the Bonuses section below)
