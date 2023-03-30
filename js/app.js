'use strict';

var gBoard = [];
var gClickCount = 0;
var gPlayerLives = 3;
var gTotalLeft = 0;
var gCurrSmily = document.querySelector('.smily');

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
  gCurrSmily.src = 'images/restart.jpg';
  gTotalLeft = gLevel.size * gLevel.size - gLevel.mines;

  if (gGame.isOn) {
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    rightClickListener();
  }
}

function rightClickListener() {
  addEventListener('contextmenu', (event) => {
    var indexs = [event.target.parentElement.classList[1]];
    setMarker(indexs);
  });
  document.addEventListener('contextmenu', (event) => event.preventDefault());
}

function setMarker(className) {
  var markedCell = document.querySelector(`.${className}`);
  markedCell.isMarked = true;
  if (markedCell.classList.contains('selected')) {
    if (markedCell.isMine) {
      markedCell.isMarked = false;
    }
    markedCell.classList.remove('selected');
    markedCell.innerHTML = '<img src="images/empty.png">';
  } else {
    if (markedCell.isMine) {
      markedCell.isMarked = true;
    }
    markedCell.classList.add('selected');
    markedCell.innerHTML = '<img src="images/cellFlag.jpg">';
  }

  console.log(markedCell);
}

function showAllMinesOnDeath() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard.length; j++) {
      const currCell = gBoard[i][j];
      if (gPlayerLives === 0) {
        if (currCell.isMine) {
          var currHTMLCell = document.querySelector(`.cell-${i}-${j}`);
          currCell.isShown = true;
          currHTMLCell.innerHTML = `<img src='images/mine.jpg'/>`;
          // console.log(currHTMLCell);
        }
      }
    }
  }
}

function playerHit() {
  gPlayerLives--;

  checkGameOver();
  showAllMinesOnDeath();

  if (gPlayerLives !== 0) {
    console.log('Lost a Life! ' + 'Lifes left: ' + gPlayerLives);
  } else {
    gCurrSmily.src = 'images/lose.png';

    console.log('Game over!');
  }
}
function checkGameOver() {
  if (gPlayerLives === 0) {
    gGame.isOn = false;

    return;
  }
}

function setMinesNegsCount(board) {
  const rowsLength = board.length;
  const colsLength = board[0].length;
  for (var i = 0; i < rowsLength; i++) {
    for (var j = 0; j < colsLength; j++) {
      for (var neighborRowIdx = -1; neighborRowIdx <= 1; neighborRowIdx++) {
        for (var neighborColIdx = -1; neighborColIdx <= 1; neighborColIdx++) {
          const currNeighborRow = neighborRowIdx + i;
          const currNeighborCol = neighborColIdx + j;
          if (currNeighborRow < 0 || currNeighborRow >= rowsLength || currNeighborCol < 0 || currNeighborCol >= colsLength) {
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

function expandClearNeighbors(rowIdx, colIdx) {
  var neighborCount = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= gBoard[0].length) continue;
      var currImg = document.querySelector(`.cell-${i}-${j}`);
      var currCell = gBoard[i][j];
      if (currCell.isMine) {
        neighborCount++;
        return;
      } else if (neighborCount === 0) {
        currImg.innerHTML = `<img src='images/${currCell.minesAroundCount}.png'/>`;
        currCell.isShown = true;
      }
    }
  }
}

function cellClicked(elCell, i, j) {
  if (elCell.classList.contains('selected')) return;
  if (gPlayerLives === 0) return;
  if (gTotalLeft === 0) return;
  const cell = gBoard[i][j];
  if (cell.isMine) {
    playerHit();
    elCell.innerHTML = `<img src='images/gameover.png'/>`;
    return;
  }
  if (cell.isMine) return;
  if (gClickCount === 0) {
    buildMines(gBoard);
    setMinesNegsCount(gBoard);
    gClickCount++;
  }

  expandClearNeighbors(i, j);

  elCell.classList.add('selected');
  elCell.isShown = true;
  elCell.innerHTML = `<img src='images/${cell.minesAroundCount}.png'/>`;
  // console.log(elCell, 'elcell');
  gTotalLeft--;
  // console.log(gTotalLeft);
  if (gTotalLeft === 0) {
    gCurrSmily.src = 'images/win.png';
    console.log('You win!');
  }
}

function handleLevel(elButton) {
  if (elButton.value === 'beginner') {
    gLevel.size = 4;
    gLevel.mines = 2;
    onInit();
  } else if (elButton.value === 'medium') {
    gLevel.size = 8;
    gLevel.mines = 14;
    onInit();
  } else {
    gLevel.size = 12;
    gLevel.mines = 32;
    onInit();
  }
}

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
