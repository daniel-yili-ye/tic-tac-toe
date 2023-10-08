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
      gameController.switchPlayerTurn();
    }

    // check for 3 in a row and tie
    console.log(gameController.checkBoard(gameBoard.getBoard()));
  };
  boardItems.forEach((item) =>
    item.addEventListener("click", clickHandlerItem)
  );
})();
