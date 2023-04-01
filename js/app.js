'use strict';

var gBoard = [];
var gClickCount = 0;
var gPlayerLives = 3;
var gCurrSmily = document.querySelector('.smily');
var gSecond = 0;
var gMinute = 0;
var gIsClicked = false;

var gTimer = 0;

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
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gSecond = 0;
  gMinute = 0;
  gPlayerLives = 3;
  gClickCount = 0;
  clearInterval(gTimer);
  // createHints();
  gCurrSmily.src = 'images/restart.jpg';

  if (gGame.isOn) {
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    rightClickListener();
    gTimer = setInterval(() => {
      if (gSecond === 60) {
        gSecond = 0;
        gMinute++;
      }
      gSecond++;
      gGame.secsPassed++;
      if (gSecond < 10) {
        document.querySelector('h4').innerHTML = `Timer: 0${gMinute}:0${gSecond}`;
      } else if (gMinute < 10) {
        document.querySelector('h4').innerHTML = `Timer: 0${gMinute}:${gSecond}`;
      } else {
        document.querySelector('h4').innerHTML = `Timer: ${gMinute}:${gSecond}`;
      }
    }, 1000);
  }
}

function rightClickListener() {
  if (gPlayerLives === 0) return;
  window.addEventListener('contextmenu', (event) => {
    console.log(event);

    var indexs = event.target.offsetParent.classList[1];
    setMarker(indexs);
  });
  document.addEventListener('contextmenu', (event) => event.preventDefault());
}

function setMarker(className) {
  if (gPlayerLives === 0) return;
  var markedImg = document.querySelector(`.${className}`);
  var markedIndexAndJ = markedImg.classList[1].split('-');
  var markedCell = gBoard[markedIndexAndJ[1]][markedIndexAndJ[2]];
  if (markedCell.isShown) return;
  // console.log(markedImg, markedCell, markedIndexAndJ);

  if (markedCell.isMarked) {
    if (markedCell.isMine) {
      gGame.markedCount--;
    }

    markedCell.isMarked = false;
    markedImg.classList.remove('selected');
    markedImg.innerHTML = '<img src="images/empty.png">';
  } else {
    markedCell.isMarked = true;
    markedImg.classList.add('selected');
    markedImg.innerHTML = '<img src="images/cellFlag.jpg">';
    if (markedCell.isMine) {
      gGame.markedCount++;
      checkWin();
    }
  }
}

function showAllMinesOnDeath() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard.length; j++) {
      const currCell = gBoard[i][j];
      if (gPlayerLives === 0) {
        if (currCell.isMine) {
          var currHTMLCell = document.querySelector(`.cell-${i}-${j}`);
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
    clearInterval(gTimer);
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
            if (gIsClicked) board[currNeighborRow][currNeighborCol].minesAroundCount = 0;
            board[currNeighborRow][currNeighborCol].minesAroundCount++;
          }
        }
      }
    }
  }
}

function expandClearNeighbors(rowIdx, colIdx) {
  // console.log(gBoard[rowIdx][colIdx]);
  if (gBoard[rowIdx][colIdx].isShown) return;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= gBoard[0].length) continue;
      var currImg = document.querySelector(`.cell-${i}-${j}`);
      var currCell = gBoard[i][j];
      var lastCell = gBoard[rowIdx][colIdx];
      if (currCell.isShown) return;
      if (currCell.isMine) return;
      if (lastCell.minesAroundCount > 0 && currCell.minesAroundCount > 0) return;
      // var isHint = handleHint();
      // if (isHint) {
      //   currImg.innerHTML = `<img src='images/${currCell.minesAroundCount}.png'/>`;
      //   currCell.isShown = true;
      //   setTimeout(() => {
      //     currImg.innerHTML = `<img src='images/empty.png'/>`;
      //     currCell.isShown = false;
      //   }, 1000);
      // }

      currImg.innerHTML = `<img src='images/${currCell.minesAroundCount}.png'/>`;
      currCell.isShown = true;
      // console.log(currCell);
      gGame.shownCount++;
    }
  }
}

function checkWin() {
  var totalShownNeeded = gLevel.size * gLevel.size - gLevel.mines;
  console.log(gGame.shownCount);
  if (gGame.markedCount === gLevel.mines) {
    if (gGame.shownCount === totalShownNeeded) {
      gCurrSmily.src = 'images/win.png';
      console.log('You win!');
      clearInterval(gTimer);
    }
  }
}

function cellClicked(elCell, i, j) {
  // console.log(elCell);
  const cell = gBoard[i][j];
  if (cell.isMarked) return;
  if (cell.isShown) return;
  if (gPlayerLives === 0) return;

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
  cell.isShown = true;
  gGame.shownCount++;
  elCell.innerHTML = `<img src='images/${cell.minesAroundCount}.png'/>`;
  checkWin();
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
function darkMode() {
  document.querySelector('body').style.backgroundColor = 'Black';
  document.querySelector('body').style.color = 'White';
}
function minesExterminator() {
  var countDestroyed = 0;
  gIsClicked = true;

  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      var currCell = gBoard[i][j];
      if (countDestroyed === 3) return;
      if (currCell.isMine) {
        console.log(currCell);
        currCell.isMine = false;
        currCell.innerHTML = `<img src='images/${currCell.minesAroundCount}.png'/>`;
        countDestroyed++;
        currCell.isMarked = true;

        setMinesNegsCount(gBoard);
      }
    }
  }
}

// function handleHint() {
//   return true;
// }
// function createHints() {
//   var hintsDiv = document.querySelector('.hints');
//   // 💥
//   for (let i = 0; i < 3; i++) {
//     hintsDiv.innerHTML += `<div class='hint' onclick='handleHint()'>💡</div>`;
//
//   console.log(hintsDiv);
// }
// Clicking the “Exterminator” button, eliminate 3 of the existing
// mines, randomly. These mines will disappear from the board.
// We will need re-calculation of neighbors-coun

// BONUS: if you have the time
// later, try to work more like the
// real algorithm (see description
// at the Bonuses section below)
