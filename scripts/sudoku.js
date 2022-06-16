window.onload = function() {
  let totalSeconds = 0;
  let gameInterval;
  let startArray;
  let solvedArray;
  let table = document.getElementById("sudoku-board");
  let palette = document.getElementById("numbers-palette");
  let minutesLabel = document.getElementById("minutes");
  let secondsLabel = document.getElementById("seconds");
  let sudokuCells = document.querySelectorAll("#sudoku-board td");
  let paletteCells = document.querySelectorAll("#numbers-palette td");
  let startBtn = document.getElementById("start-btn");
  let solveBtn = document.getElementById("solve-btn");
  let resetBtn = document.getElementById("reset-btn");
  let undoBtn = document.getElementById("undo-btn");
  let startModal = new bootstrap.Modal(document.getElementById("startModal"));
  let easyBtn = document.getElementById("easy-btn");
  let mediumBtn = document.getElementById("medium-btn");
  let hardBtn = document.getElementById("hard-btn");
  let successModal = new bootstrap.Modal(document.getElementById("successModal"));
  let input = "";
  let inputCellsArray = [];
  let onClickCell = "";
  let isError = false;
  
  table.disabled = true;
  palette.disabled = true;
  solveBtn.disabled = true;
  resetBtn.disabled = true;
  
  for (let i = 0, row; row = table.rows[i]; i++) {
    for (let j = 0, col; col = row.cells[j]; j++) {
      row.cells[j].setAttribute("id", "" + i + j);
    }  
  }

  function sameBlock(x1, y1, x2, y2) {
    let firstRow = Math.floor(y1 / 3) * 3;
    let firstCol = Math.floor(x1 / 3) * 3;
    return (y2 >= firstRow && y2 <= (firstRow + 2) && x2 >= firstCol && x2 <= (firstCol + 2));
  }
 
  function sameRow(y1, y2) {
    return y1 == y2;
  }
 
  function sameColumn(x1, x2) {
    return x1 == x2;
  }

  function checkInput(x1, y1, x2, y2) {
    if (x1 == x2 && y1 == y2) { return false; }
    return sameBlock(x1, y1, x2, y2) || sameRow(y1, y2) || sameColumn(x1, x2);
  }

  function pad(val) {
    let valString = val + "";
    return (valString.length < 2) ? ("0" + valString) : valString;
  }

  function isWin() {
    for (let i = 0; i < sudokuCells.length; i++) {
      if (sudokuCells[i].innerText == "") {
        return false;
      }
    }
    return true;
  }

  function won(playerSolved) {
    clearInterval(gameInterval);
    for (let i = 0; i < paletteCells.length; i++) {
      paletteCells[i].removeEventListener("click", paletteInputHandler);
    }
    for (let i = 0; i < sudokuCells.length; i++) {
      sudokuCells[i].removeEventListener("click", sudokuInputHandler);
      sudokuCells[i].classList.remove("user-input");
      sudokuCells[i].classList.remove("const");
      sudokuCells[i].classList.remove("error");
    }
    inputCellsArray = [];
    solveBtn.disabled = true;
    resetBtn.disabled = true;
    if (playerSolved) {
      successModal.show();
      let today = new Date().toJSON().slice(0,10).replace(/-/g,'/');
      let duration = minutesLabel.innerText + ":" + secondsLabel.innerText;
      let newRecord = {date: today, duration: duration};
      window.localStorage.setItem(JSON.stringify(newRecord), JSON.stringify(newRecord));
    }
  }

  let sudokuInputHandler = function (event) {
    if (!input) { return; }
    if (isError) {
      if (!this.classList.contains("error")) {
        return;
      }
      inputCellsArray.pop(this);
    }
    this.innerText = input;
    input = "";
    inputCellsArray.push(this);
    onClickCell.classList.remove("on-click");
    for (let i = 0; i < sudokuCells.length; i++) {
      if (sudokuCells[i].innerText == this.innerText) {
        if (checkInput(sudokuCells[i].id.slice(0,1), sudokuCells[i].id.slice(1), this.id.slice(0,1), this.id.slice(1))) {
          this.classList.add("error");
          isError = true;
          return;
        }
      }
    }
    isError = false;
    this.classList.remove("error");
    this.classList.add("user-input");
    if (isWin()) {
      won(true);
    }
  }
  
  let paletteInputHandler = function (event) {
    input = this.innerText;
    if (onClickCell) {
      onClickCell.classList.remove("on-click");
    }
    this.classList.add("on-click");
    onClickCell = this;
  }

  function setTime() {
    ++totalSeconds;
    minutesLabel.innerText = pad(parseInt(totalSeconds / 60));
    secondsLabel.innerText = pad(totalSeconds % 60);
  }

  let startGameHandler = function (numbers) {
    solvedArray = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    generateRandomSudoku(numbers);
    
    inputCellsArray = [];
    
    totalSeconds = 0;
    secondsLabel.innerText = "00";
    minutesLabel.innerText = "00";
    clearInterval(gameInterval);
    gameInterval = setInterval(setTime, 1000);

    resetBtn.disabled = false;
    solveBtn.disabled = false;

    for (let i = 0, row; row = table.rows[i]; i++) {
      for (let j = 0, col; col = row.cells[j]; j++) {
        row.cells[j].classList.remove("const");
        row.cells[j].classList.remove("user-input");  
        row.cells[j].classList.remove("error");
        if (startArray[i][j] == "0") {
          row.cells[j].innerText = "";
        } else {
          row.cells[j].innerText = startArray[i][j];
          row.cells[j].classList.add("const");
        }
      }  
    }
    for (let i = 0; i < paletteCells.length; i++) {
      paletteCells[i].addEventListener("click", paletteInputHandler);
    }
    for (let i = 0; i < sudokuCells.length; i++) {
      if (sudokuCells[i].classList.contains("const")) { continue; }
      sudokuCells[i].addEventListener("click", sudokuInputHandler);
    }
  }

  startBtn.onclick = function() {
    startModal.show();
  };

  easyBtn.onclick = function() {
    startGameHandler(30);
    startModal.hide();
  }

  mediumBtn.onclick = function() {
    startGameHandler(27);
    startModal.hide();
  }

  hardBtn.onclick = function() {
    startGameHandler(24);
    startModal.hide();
  }

 solveBtn.onclick = function() {
    if (onClickCell) {
      onClickCell.classList.remove("on-click");
    }
    won(true);
    for (let i = 0, row; row = table.rows[i]; i++) {
      for (let j = 0, col; col = row.cells[j]; j++) {
        row.cells[j].classList.remove("const");
        row.cells[j].classList.remove("user-input");  
        row.cells[j].classList.remove("error");
        row.cells[j].innerText = solvedArray[i][j];
      }  
    }
 }

 resetBtn.onclick = function() {
  for (let i = 0, row; row = table.rows[i]; i++) {
    for (let j = 0, col; col = row.cells[j]; j++) {
      row.cells[j].innerText = startArray[i][j] == "0" ? "" : startArray[i][j];
      row.cells[j].classList.remove("user-input");  
      row.cells[j].classList.remove("error");
    }  
  }
  inputCellsArray = [];
  if (onClickCell) {
    onClickCell.classList.remove("on-click");
  }
 }

 undoBtn.onclick = function() {
   if (inputCellsArray.length == 0) { return; }
   let undoCell = inputCellsArray.pop();
   undoCell.innerText = "";
   undoCell.classList.remove("user-input");
   undoCell.classList.remove("error");
   isError = false;
 }


 // generate random soduku
 let changesMade = false;
 let counter = 0;
 let fields = [];

 // solves a sudoku
 function solveSudoku() {
  fill_possible_fields();

  changesMade = false;
  counter = 0;

  while (!sudoku_complete()) {
    counter++;
    test_rows_and_cols();
    test_blocks();
    test_possible_fields();
    if (!changesMade) {
      break;
    } else {
      changesMade = false;
    }
    if (counter === 100) {
      break;
    }
  }
 }

 // returns true if there are two equal numbers in the same row
 function duplicateNumberInRow(s, fieldY) {
  numbers = new Array();
  for (let i = 0; i < 9; i++) {
    if (s[i][fieldY] !== 0) {
      if (numbers.includes(s[i][fieldY])) {
        return true;
      } else {
        numbers.push(s[i][fieldY]);
      }
    }
  }
  return false;
 }

 // returns true if there are two equal numbers in the same col
 function duplicateNumberInCol(s, fieldX) {
  numbers = new Array();
  for (let i = 0; i < 9; i++) {
    if (s[fieldX][i] !== 0) {
      if (numbers.includes(s[fieldX][i])) {
        return true;
      } else {
        numbers.push(s[fieldX][i]);
      }
    }
  }
  return false;
 }

 // returns true if there are two equal numbers in the same box
 function duplicateNumberInBox(s, fieldX, fieldY) {
  boxX = Math.floor(fieldX / 3);
  boxY = Math.floor(fieldY / 3);
  numbers = new Array();
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      x = i + 3 * boxX;
      y = j + 3 * boxY;
      if (s[x][y] !== 0) {
        if (numbers.includes(s[x][y])) {
          return true;
        } else {
          numbers.push(s[x][y]);
        }
      }
    }
  }
  return false;
 }

 // returns true if there are two equal numbers in the same row, col or box
 function duplicateNumberExists(s, fieldX, fieldY) {
  if (duplicateNumberInRow(s, fieldY)) {
    return true;
  }
  if (duplicateNumberInCol(s, fieldX)) {
    return true;
  }
  if (duplicateNumberInBox(s, fieldX, fieldY)) {
    return true;
  }
  return false;
 }

 // generates a random sudoku with a given amount of numbers in it
 function generateRandomSudoku(numbers) {
  while (!sudoku_complete() || sudoku_invalid(solvedArray)) {
    // new empty sudoku
    startArray = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    solvedArray = JSON.parse(JSON.stringify(startArray));

    // how many numbers are entered already?
    let numbersDone = 0;

    while (numbersDone < numbers) {
      let fieldX = Math.floor(Math.random() * 9);
      let fieldY = Math.floor(Math.random() * 9);
      let number = Math.floor(Math.random() * 9) + 1;

      if (startArray[fieldX][fieldY] === 0) {
        startArray[fieldX][fieldY] = number;
        if (duplicateNumberExists(startArray, fieldX, fieldY)) {
          startArray[fieldX][fieldY] = 0;
          continue;
        } else {
          numbersDone++;
        }
        //alert("" + numbersDone);
      }
    }
    solvedArray = JSON.parse(JSON.stringify(startArray));
    solveSudoku();
  }
 }

 // fills the possible numbers for the fields
 function fill_possible_fields() {
  for (let i = 0; i < 9; i++) {
    fields[i] = [];
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      fields[i][j] = [];
    }
  }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      for (let k = 0; k < 9; k++) {
        fields[i][j][k] = k + 1;
      }
    }
  }
 }

 // tests the possible 9 numbers for a field, if only one is possible then it's entered to the field
 function test_possible_fields() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (solvedArray[i][j] === 0) {
        let numbers = 0;
        let number = 0;
        for (let k = 0; k < 9; k++) {
          if (fields[i][j][k] !== 0) {
            number = k + 1;
            numbers++;
          }
        }
        if (numbers === 1) {
          solvedArray[i][j] = number;
          changesMade = true;
        }
      }
    }
  }
 }

 // tests the rows and cols
 function test_rows_and_cols() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (solvedArray[i][j] !== 0) {
        let number = solvedArray[i][j];
        for (let k = 0; k < 9; k++) {
          if (solvedArray[i][k] === 0) {
            if (fields[i][k][number - 1] !== 0) {
              changesMade = true;
            }
            fields[i][k][number - 1] = 0;
          }
        }
        number = solvedArray[i][j];
        for (let k = 0; k < 9; k++) {
          if (solvedArray[k][j] === 0) {
            if (fields[k][j][number - 1] !== 0) {
              changesMade = true;
            }
            fields[k][j][number - 1] = 0;
          }
        }
      }
    }
  }
 }

 // tests the blocks
 function test_blocks() {
  for (let k = 0; k < 3; k++) {
    for (let l = 0; l < 3; l++) {
      for (let i = 0 + k * 3; i < 3 + k * 3; i++) {
        for (let j = 0 + l * 3; j < 3 + l * 3; j++) {
          if (solvedArray[i][j] !== 0) {
            let number = solvedArray[i][j];
            for (let a = 0 + k * 3; a < 3 + k * 3; a++) {
              for (let b = 0 + l * 3; b < 3 + l * 3; b++) {
                if (solvedArray[a][b] === 0) {
                  if (fields[a][b][number - 1] !== 0) {
                    changesMade = true;
                  }
                  fields[a][b][number - 1] = 0;
                }
              }
            }
          }
        }
      }
    }
  }
 }

 // tests if a sudoku is complete and returns eiter true or false
 function sudoku_complete() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (solvedArray[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
 }

 //Tests if there are any duplicate numbers in a sudoku
 function sudoku_invalid(s) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (duplicateNumberExists(s, i, j)) {
        return true;
      }
    }
  }
  return false;
 }
}
