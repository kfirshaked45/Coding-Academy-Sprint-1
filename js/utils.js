'use strict';

function buildBoard() {
  const board = [];
  for (var i = 0; i < gLevel.size; i++) {
    board[i] = [];
    for (var j = 0; j < gLevel.size; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }
  // board[2][2].isMine = true;
  // board[0][0].isMine = true;
  // console.log(board[2][2]);

  // console.log(cell);
  return board;
}

function buildMines(board) {
  for (let i = 0; i < gLevel.mines; i++) {
    var num = getRandomIntInclusive(0, gLevel.size - 1);
    var num2 = getRandomIntInclusive(0, gLevel.size - 1);
    var mine = board[num][num2];
    mine.isMine = true;
    console.log(mine);
  }

  return mine;
}

function renderBoard(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      const cell = mat[i][j] ? '<img src="/images/t.png" />' : null;
      const className = `cell cell-${i}-${j}`;
      strHTML += `<td class="${className}" onclick='cellClicked(this,${i},${j})'>${cell}</td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';

  const elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
