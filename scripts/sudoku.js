window.onload = function () {
	let totalSeconds = 0;
	let gameInterval;
	let startArray;
	let solvedArray;
	let board = document.getElementById('board');
	let palette = document.getElementById('palette');
	let minutesLabel = document.getElementById('minutes-lb');
	let secondsLabel = document.getElementById('seconds-lb');
	let boardCells = document.querySelectorAll('#board td');
	let paletteCells = document.querySelectorAll('#palette td');
	let startBtn = document.getElementById('start-btn');
	let solveBtn = document.getElementById('solve-btn');
	let resetBtn = document.getElementById('reset-btn');
	let undoBtn = document.getElementById('undo-btn');
	let easyBtn = document.getElementById('easy-btn');
	let mediumBtn = document.getElementById('medium-btn');
	let hardBtn = document.getElementById('hard-btn');
	let startModal = new bootstrap.Modal(document.getElementById('start-modal'));
	let successModal = new bootstrap.Modal(document.getElementById('success-modal'));
	let input = '';
	let inputCellsArray = [];
	let onClickCell = '';
	let isError = false;

	board.disabled = true;
	palette.disabled = true;
	solveBtn.disabled = true;
	resetBtn.disabled = true;

	for (let i = 0, row; (row = board.rows[i]); i++) {
		for (let j = 0, col; (col = row.cells[j]); j++) {
			row.cells[j].setAttribute('id', '' + i + j);
		}
	}

	function sameBlock(x1, y1, x2, y2) {
		let firstRow = Math.floor(y1 / 3) * 3;
		let firstCol = Math.floor(x1 / 3) * 3;
		return y2 >= firstRow && y2 <= firstRow + 2 && x2 >= firstCol && x2 <= firstCol + 2;
	}

	function sameRow(y1, y2) {
		return y1 == y2;
	}

	function sameColumn(x1, x2) {
		return x1 == x2;
	}

	function checkInput(x1, y1, x2, y2) {
		if (x1 == x2 && y1 == y2) {
			return false;
		}
		return sameBlock(x1, y1, x2, y2) || sameRow(y1, y2) || sameColumn(x1, x2);
	}

	function pad(val) {
		let valString = val + '';
		return valString.length < 2 ? '0' + valString : valString;
	}

	function isWin() {
		for (let i = 0; i < boardCells.length; i++) {
			if (boardCells[i].innerText == '') {
				return false;
			}
		}
		return true;
	}

	function won(playerSolved) {
		clearInterval(gameInterval);
		for (let i = 0; i < paletteCells.length; i++) {
			paletteCells[i].removeEventListener('click', paletteInputHandler);
		}
		for (let i = 0; i < boardCells.length; i++) {
			boardCells[i].removeEventListener('click', sudokuInputHandler);
			boardCells[i].classList.remove('user-input');
			boardCells[i].classList.remove('const');
			boardCells[i].classList.remove('error');
		}
		inputCellsArray = [];
		solveBtn.disabled = true;
		resetBtn.disabled = true;
		if (playerSolved) {
			successModal.show();
			let today = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
			let duration = minutesLabel.innerText + ':' + secondsLabel.innerText;
			let newRecord = { date: today, duration: duration };
			window.localStorage.setItem(JSON.stringify(newRecord), JSON.stringify(newRecord));
		}
	}

	function sudokuInputHandler(event) {
		if (!input) {
			return;
		}
		if (isError) {
			if (!this.classList.contains('error')) {
				return;
			}
			inputCellsArray.pop(this);
		}
		this.innerText = input;
		input = '';
		inputCellsArray.push(this);
		onClickCell.classList.remove('on-click');
		for (let i = 0; i < boardCells.length; i++) {
			if (boardCells[i].innerText == this.innerText) {
				if (
					checkInput(
						boardCells[i].id.slice(0, 1),
						boardCells[i].id.slice(1),
						this.id.slice(0, 1),
						this.id.slice(1)
					)
				) {
					this.classList.add('error');
					isError = true;
					return;
				}
			}
		}
		isError = false;
		this.classList.remove('error');
		this.classList.add('user-input');
		if (isWin()) {
			won(true);
		}
	}

	function paletteInputHandler(event) {
		input = this.innerText;
		if (onClickCell) {
			onClickCell.classList.remove('on-click');
		}
		this.classList.add('on-click');
		onClickCell = this;
	}

	function setTime() {
		++totalSeconds;
		minutesLabel.innerText = pad(parseInt(totalSeconds / 60));
		secondsLabel.innerText = pad(totalSeconds % 60);
	}

	function startGameHandler(numbers) {
		[startArray, solvedArray] = generateRandomSudoku(numbers);

		inputCellsArray = [];

		totalSeconds = 0;
		secondsLabel.innerText = '00';
		minutesLabel.innerText = '00';
		clearInterval(gameInterval);
		gameInterval = setInterval(setTime, 1000);

		resetBtn.disabled = false;
		solveBtn.disabled = false;

		for (let i = 0, row; (row = board.rows[i]); i++) {
			for (let j = 0, col; (col = row.cells[j]); j++) {
				row.cells[j].classList.remove('const');
				row.cells[j].classList.remove('user-input');
				row.cells[j].classList.remove('error');
				if (startArray[i][j] == '0') {
					row.cells[j].innerText = '';
				} else {
					row.cells[j].innerText = startArray[i][j];
					row.cells[j].classList.add('const');
				}
			}
		}
		for (let i = 0; i < paletteCells.length; i++) {
			paletteCells[i].addEventListener('click', paletteInputHandler);
		}
		for (let i = 0; i < boardCells.length; i++) {
			if (boardCells[i].classList.contains('const')) {
				continue;
			}
			boardCells[i].addEventListener('click', sudokuInputHandler);
		}
	}

	startBtn.onclick = function () {
		startModal.show();
	};

	easyBtn.onclick = function () {
		startGameHandler(30);
		startModal.hide();
	};

	mediumBtn.onclick = function () {
		startGameHandler(27);
		startModal.hide();
	};

	hardBtn.onclick = function () {
		startGameHandler(24);
		startModal.hide();
	};

	solveBtn.onclick = function () {
		if (onClickCell) {
			onClickCell.classList.remove('on-click');
		}
		won(true);
		for (let i = 0, row; (row = board.rows[i]); i++) {
			for (let j = 0, col; (col = row.cells[j]); j++) {
				row.cells[j].classList.remove('const');
				row.cells[j].classList.remove('user-input');
				row.cells[j].classList.remove('error');
				row.cells[j].innerText = solvedArray[i][j];
			}
		}
	};

	resetBtn.onclick = function () {
		for (let i = 0, row; (row = board.rows[i]); i++) {
			for (let j = 0, col; (col = row.cells[j]); j++) {
				row.cells[j].innerText = startArray[i][j] == '0' ? '' : startArray[i][j];
				row.cells[j].classList.remove('user-input');
				row.cells[j].classList.remove('error');
			}
		}
		inputCellsArray = [];
		if (onClickCell) {
			onClickCell.classList.remove('on-click');
		}
	};

	undoBtn.onclick = function () {
		if (inputCellsArray.length == 0) {
			return;
		}
		let undoCell = inputCellsArray.pop();
		undoCell.innerText = '';
		undoCell.classList.remove('user-input');
		undoCell.classList.remove('error');
		isError = false;
	};
};
