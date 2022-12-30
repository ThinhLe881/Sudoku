let changesMade = false;
let counter = 0;
let fields = [];
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
			}
		}
		solvedArray = JSON.parse(JSON.stringify(startArray));
		solveSudoku();
	}
	return [startArray, solvedArray];
}

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
