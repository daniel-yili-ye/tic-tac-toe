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
const playerFactory = (piece, name = "", type = "human") => {
  let playerPiece = piece;
  let playerName = name;
  let playerType = type;

  const getPlayerPiece = () => playerPiece;
  const getPlayerName = () => playerName;
  const getPlayerType = () => playerType;

  const updateName = (name) => {
    playerName = name;
  };

  const updatePlayerType = (type) => {
    playerType = type;
  };

  return {
    getPlayerPiece,
    getPlayerName,
    getPlayerType,
    updateName,
    updatePlayerType,
  };
};

const gameController = (() => {
  const playerOne = playerFactory("❌");
  const playerTwo = playerFactory("⭕");

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
    playerOne,
    playerTwo,
  };
})();

const displayController = (() => {
  const boardItems = document.querySelectorAll(".board-item");
  const form = document.querySelector("form");

  // radio inputs
  const radioItems = document.querySelectorAll("input[type='radio']");

  const restartGame = () => {
    // clear the board and switch player back to X after a win
    gameController.resetGame();
    // clear UI
    boardItems.forEach((item) => (item.innerText = ""));
  };

  const clickHandlerItem = (e) => {
    const piece = gameController.getCurrentPlayer().getPlayerPiece();
    console.log(gameController.getCurrentPlayer().getPlayerName());

    if (!e.target.innerText) {
      gameBoard.updateBoard(piece, e.target.dataset.row, e.target.dataset.col);
      e.target.innerText = piece;
      const timeOut = 1;

      // check for 3 in a row
      if (gameController.checkBoard(gameBoard.getBoard())) {
        // declare winner
        setTimeout(() => {
          alert(
            `Player ${gameController
              .getCurrentPlayer()
              .getPlayerPiece()} - ${gameController
              .getCurrentPlayer()
              .getPlayerName()} wins!`
          );
          confetti.start();
          setTimeout(() => {
            confetti.stop();
          }, 1000);
          restartGame();
        }, timeOut);
      }
      // check for tie
      else if (
        gameBoard
          .getBoard()
          .flat()
          .filter((x) => x == "").length == 0
      ) {
        setTimeout(() => {
          alert(`It's a tie 👔!`);
          restartGame();
        }, timeOut);
      } else {
        gameController.switchPlayerTurn();
        // let other player
      }
    }
  };

  boardItems.forEach((item) =>
    item.addEventListener("click", clickHandlerItem)
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    restartGame();

    const formData = new FormData(e.target);

    gameController.playerOne.updateName(formData.get("xname"));
    gameController.playerTwo.updateName(formData.get("oname"));

    gameController.playerOne.updatePlayerType(formData.get("xradio"));
    gameController.playerTwo.updatePlayerType(formData.get("oradio"));
  });

  radioItems.forEach((item) =>
    item.addEventListener("click", (e) => (e.target.checked = true))
  );
})();
