/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = "p1"; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let allowClick = true;
const newGameButton = document.querySelector("#newGameButton");
newGameButton.addEventListener("click", newGame);
const displayPlayer = document.querySelector("#currentPlayer");
displayPlayer.innerText = "1";

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
    board = [];
    // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    for (let col = 0; col < HEIGHT; col++) {
        board.push([]);
        for (let row = 0; row < WIDTH; row++) {
            board[col].push([]);
        }
    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.querySelector("#board");
    // TODO: add comment for this code

    //creates the top 7 blocks with click listeners
    //creates an element for each box with a listener
    //appends the elements from left to right with the idx stored as the id
    //appends the top column to the dom
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.setAttribute("class", "player1Turn");
    top.addEventListener("click", handleClick);

    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        headCell.setAttribute("class", "placeHere");
        headCell.innerText = "Drop Here";
        top.append(headCell);
    }
    htmlBoard.append(top);

    // TODO: add comment for this code

    //creates the board that will display the game pieces.
    //creates a row element
    //creates each cell based on the width
    //appends each cell with id x an y that shows where the cell is ocated on the board. to the row
    //appends the row to the board game
    //loops the same as the height to fill up the board
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            cell.setAttribute("class", "pieceContainer");
            row.append(cell);
        }
        htmlBoard.append(row);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    // TODO: write the real version of this, rather than always returning 0
    for (let y = HEIGHT - 1; y >= 0; y--) {
        const cell = document.getElementById(`${y}-${x}`);
        if (!cell.innerHTML) {
            return y;
        }
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    // TODO: make a div and insert into correct table cell
    const chipCell = document.getElementById(`${y}-${x}`);
    const chip = document.createElement("div");
    let topPosition = (y + 1) * 10.75;
    chip.classList.add("piece", currPlayer);
    chip.setAttribute("style", `position:relative; bottom:${topPosition}vh`);
    chipCell.append(chip);
    //topPosition = 64;
    const animate = setInterval(() => {
        if (topPosition > 0) {
            topPosition = topPosition - 0.5;
            chip.style.bottom = `${topPosition}vh`;
        } else {
            clearInterval(animate);
            nextTurn(y, x);
        }
    }, 5);
}

/** endGame: announce game end */

function endGame(msg) {
    allowClick = false;
    alert(msg);
    // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
    if (!allowClick) {
        return;
    }
    // get x from ID of clicked cell
    let x = +evt.target.id;
    allowClick = false;
    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
        allowClick = true;
        return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    board[y][x] = currPlayer;
    placeInTable(y, x);
}


/**go to next turn after animation is complete */
function nextTurn(y, x) {
    allowClick = true;
    currPlayer === "p1" ?
        (displayPlayer.innerText = "2") :
        (displayPlayer.innerText = "1");
    // check for win
    if (checkForWin(y, x)) {
        return endGame(`Player ${currPlayer.charAt(1)} won!`);
    }
    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    if (board.every((cell) => cell === "")) {
        ndGame(`Tie Game! Start New Game`)
        console.log("tie");
    }
    // switch players
    // TODO: switch currPlayer 1 <-> 2
    const htmlBoard = document.querySelector("#column-top");
    currPlayer === "p1" ? (currPlayer = "p2") : (currPlayer = "p1");
    htmlBoard.classList.toggle("player1Turn");
    htmlBoard.classList.toggle("player2Turn");
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin(y, x) {
    const _win = {
        upLeft: (y, x) => {
            let matches = 0;
            while (board[y][x] !== undefined) {
                if (board[y][x] === currPlayer) {
                    y--;
                    x--;
                    matches++;
                }
            }
            return matches;
        },

        left: (y, x) => {
            let matches = 0;
            while (board[y][x] !== undefined) {
                if (board[y][x] === currPlayer) {
                    x--;
                    matches++;
                }
            }
            return matches;
        },

        downLeft: (y, x) => {
            let matches = 0;
            while (board[y][x] !== undefined) {
                if (board[y][x] === currPlayer) {
                    y++;
                    x--;
                    matches++;
                }
            }
            return matches;
        },

        down: (y, x) => {
            let matches = 0;
            while (board[y][x] !== undefined) {
                if (board[y][x] === currPlayer) {
                    y++;
                    matches++;
                }
            }
            return matches;
        },

        downRight: (y, x) => {
            let matches = 0;
            while (board[y][x] !== undefined) {
                if (board[y][x] === currPlayer) {
                    y++;
                    x++;
                    matches++;
                }
            }
            return matches;
        },

        right: (y, x) => {
            let matches = 0;
            while (board[y][x] !== undefined) {
                if (board[y][x] === currPlayer) {
                    x++;
                    matches++;
                }
            }
            return matches;
        },

        upRight: (y, x) => {
            let matches = 0;
            while (board[y][x] !== undefined) {
                if (board[y][x] === currPlayer) {
                    y--;
                    x++;
                    matches++;
                }
            }
            return matches;
        },


    }
    let horizontalMatches = _win.left(y, x) + _win.right(y, x);
    let verticalMatches = _win.down(y, x);
    let rightDiagnolMatches = _win().downLeft(y, x) + _win().upRight(y, x);;
    let leftDiagnolMatches = _win().upLeft(y, x) + _win().downRight(y, x);;

    if (horizontalMatches < 2 || verticalMatches < 2 || rightDiagnolMatches < 2 || leftDiagnolMatches < 2) {
        return true
    }







}

makeBoard();
makeHtmlBoard();

/**reset html and start new game */
function newGame(evt) {
    evt.preventDefault();
    const htmlBoard = document.querySelector("#board");
    htmlBoard.innerHTML = "";
    allowClick = true;
    makeBoard();
    makeHtmlBoard();
}