/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = "1";
let board;
let allowClick = true;
const newGameButton = document.querySelector("#newGameButton");
newGameButton.addEventListener("click", newGame);
const displayPlayer = document.querySelector("#currentPlayer");

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
    board = [];
    //TODO: set "board" to empty HEIGHT x WIDTH matrix array

    for (let y = 0; y < HEIGHT; y++) {
        board.push(Array.from({ length: WIDTH }));
    }
}

function createRow(y,row){
    for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        cell.setAttribute("class", "pieceContainer");
        row.append(cell);
    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    displayPlayer.innerText = "1";

    const htmlBoard = document.querySelector("#board");

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.setAttribute("class", "player1Turn");
    top.addEventListener("click", handleClick);

    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        headCell.setAttribute("class", "placeHere");
        headCell.innerText = "\u21E3";
        headCell.style.fontSize="60px"
        top.append(headCell);
    }
    htmlBoard.append(top);


    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        createRow(y,row);
        htmlBoard.append(row);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (!board[y][x]) {
            return y;
        }
    }
    return null;
}

/**Create chip that will pe placed in table */
function createChip(y,callback){
    const chip = document.createElement("div");

    let topPosition = (y * 72) + 84;
    chip.setAttribute("style", `transform: translateY(-${topPosition}px)`);
    chip.classList.add("piece", `p${currPlayer}`);
    chip.addEventListener('animationend', () => {
        callback();
    });
    return chip
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x, callback) {
    const chipCell = document.getElementById(`${y}-${x}`);
    chipCell.append(createChip(y,callback));    
}

/** endGame: announce game end */

function endGame(msg) {
    allowClick = false;
    //alert(msg);
    Swal.fire(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
    if (!allowClick) {
        return;
    }
    let x = +evt.target.id;
    allowClick = false;
    let y = findSpotForCol(x);
    if (y === null) {
        allowClick = true;
        return;
    }



    /**go to next turn after animation is complete */
    const callback = () => {
        allowClick = true;

        // check for win
        if (checkForWin(y, x)) {
            return endGame(`Player ${currPlayer} won!`);
        }
        // check for tie
        // TODO: check if all cells in board are filled; if so call, call endGame
        if (board.every((cell) => cell === "")) {
            endGame(`Tie Game! Start New Game`);
            console.log("tie");
        }
        // switch players
        // TODO: switch currPlayer 1 <-> 2
        const htmlBoard = document.querySelector("#column-top");
        currPlayer === "1" ? (currPlayer = "2") : (currPlayer = "1");
        displayPlayer.innerText = currPlayer;
        htmlBoard.classList.toggle("player1Turn");
        htmlBoard.classList.toggle("player2Turn");
    }

    // place piece in board and add to HTML table
    board[y][x] = currPlayer;
    placeInTable(y, x, callback);

}

/** checkForWin: check aroung the placed chip for 3 more chips of same player*/

function checkForWin(y, x) {
    const _win = {
        upLeft: (y, x) => {
            let matches = 0;
            y--;
            x--;
            while (testMatch(y, x)) {
                y--;
                x--;
                matches++;
            }

            return matches;
        },

        left: (y, x) => {
            let matches = 0;
            x--;
            while (testMatch(y, x)) {
                x--;
                matches++;
            }
            return matches;
        },

        downLeft: (y, x) => {
            let matches = 0;
            y++;
            x--;
            while (testMatch(y, x)) {
                y++;
                x--;
                matches++;
            }
            return matches;
        },

        down: (y, x) => {
            let matches = 0;
            y++;
            while (testMatch(y, x)) {
                y++;
                matches++;
            }
            return matches;
        },

        downRight: (y, x) => {
            let matches = 0;
            y++;
            x++;
            while (testMatch(y, x)) {
                y++;
                x++;
                matches++;
            }
            return matches;
        },

        right: (y, x) => {
            let matches = 0;
            x++;
            while (testMatch(y, x)) {
                x++;
                matches++;
            }
            return matches;
        },

        upRight: (y, x) => {
            let matches = 0;
            y--;
            x++;
            while (testMatch(y, x)) {
                y--;
                x++;
                matches++;
            }
            return matches;
        },
    };

    /**testMatch checks if coordinates are on the board and if chip is assigned to currentPlayer */
    const testMatch = (y, x) => {
        if (
            y >= 0 &&
            y < HEIGHT &&
            x >= 0 &&
            x < WIDTH &&
            board[y][x] === currPlayer
        ) {
            return true;
        }
        return false;
    };

    let horizontalMatches = _win.left(y, x) + _win.right(y, x);
    let verticalMatches = _win.down(y, x);
    let rightDiagnolMatches = _win.downLeft(y, x) + _win.upRight(y, x);
    let leftDiagnolMatches = _win.upLeft(y, x) + _win.downRight(y, x);

    if (
        horizontalMatches >= 3 ||
        verticalMatches >= 3 ||
        rightDiagnolMatches >= 3 ||
        leftDiagnolMatches >= 3
    ) {
        return true;
    }
}

makeBoard();
makeHtmlBoard();

/**reset html and start new game */
function newGame(evt) {
    evt.preventDefault();
    const htmlBoard = document.querySelector("#board");
    htmlBoard.innerHTML = "";
    htmlBoard.classList.remove("player2Turn");
    currPlayer = "1";
    allowClick = true;
    makeBoard();
    makeHtmlBoard();
}