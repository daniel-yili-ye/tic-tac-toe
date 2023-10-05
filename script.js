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

  return {
    getCurrentPlayer,
    switchPlayerTurn,
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
  };
  boardItems.forEach((item) =>
    item.addEventListener("click", clickHandlerItem)
  );
})();
