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

const displayController = (() => {
  const boardItems = document.querySelectorAll(".board-item");

  const clickHandlerItem = (e) => {
    gameBoard.updateBoard("X", e.target.dataset.row, e.target.dataset.col);
    e.target.innerText = "X";
    console.log(gameBoard.getBoard());
  };
  boardItems.forEach((item) =>
    item.addEventListener("click", clickHandlerItem)
  );
})();
