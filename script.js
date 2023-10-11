// module pattern -> 1 of something
const gameBoard = (() => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  // gives only read access to board
  const getBoard = () => board;

  const updateBoard = (piece, row, col) => {
    board[row][col] = piece;
  };

  return {
    getBoard,
    updateBoard,
  };
})();

// factory function -> many of something
const playerFactory = (piece) => {
  return { piece };
};

const gameController = (() => {
  const playerOne = playerFactory("X");
  const playerTwo = playerFactory("O");

  let currentPlayer = playerOne;

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayerTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const resetGame = () => {
    // reset player
    currentPlayer = playerOne;

    // reset board
    const board = gameBoard.getBoard();
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        gameBoard.updateBoard("", row, col);
      }
    }
  };

  const checkLine = (line) => {
    const lineSet = new Set(line);
    if (lineSet.size == 1 && !lineSet.has("")) {
      return true;
    }
  };

  const checkBoard = (board) => {
    // check rows
    for (let i = 0; i < board.length; i++) {
      if (checkLine(board[i])) {
        return true;
      }
    }
    // check cols
    const transposedBoard = board[0].map((x, i) => board.map((x) => x[i]));
    for (let i = 0; i < transposedBoard.length; i++) {
      if (checkLine(transposedBoard[i])) {
        return true;
      }
    }

    // check diagonals
    const diagOne = board.map((x, i) => x[i]);
    if (checkLine(diagOne)) {
      return true;
    }
    const diagTwo = board.map((x, i) => x[x.length - i - 1]);
    if (checkLine(diagTwo)) {
      return true;
    }

    return false;
  };

  return {
    getCurrentPlayer,
    switchPlayerTurn,
    resetGame,
    checkBoard,
  };
})();

const displayController = (() => {
  const boardItems = document.querySelectorAll(".board-item");

  const clickHandlerItem = (e) => {
    const piece = gameController.getCurrentPlayer().piece;

    if (!e.target.innerText) {
      gameBoard.updateBoard(piece, e.target.dataset.row, e.target.dataset.col);
      e.target.innerText = piece;

      // check for 3 in a row and tie
      if (gameController.checkBoard(gameBoard.getBoard())) {
        // declare winner
        console.log(`${gameController.getCurrentPlayer().piece} wins!`);
        // clear the board and switch player back to X after a win
        gameController.resetGame();
        // clear UI
        boardItems.forEach((item) => (item.innerText = ""));
      } else {
        gameController.switchPlayerTurn();
      }
    }
  };
  boardItems.forEach((item) =>
    item.addEventListener("click", clickHandlerItem)
  );
})();
