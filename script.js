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

  const playOptimalMove = () => {
    const score = {
      "❌": 1,
      "⭕": -1,
      tie: 0,
    };

    const minmax = (board, isMaximizing) => {
      // check for win condition
      let result = gameController.checkBoard(board);
      if (result) {
        return score[result];
      }

      if (isMaximizing) {
        let maxScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board.length; j++) {
            if (board[i][j] === "") {
              board[i][j] = "❌";
              let score = minmax(board, false);
              board[i][j] = "";
              maxScore = Math.max(score, maxScore);
            }
          }
        }
        return maxScore;
      } else {
        let minScore = Infinity;
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board.length; j++) {
            if (board[i][j] === "") {
              board[i][j] = "⭕";
              let score = minmax(board, true);
              board[i][j] = "";
              minScore = Math.min(score, minScore);
            }
          }
        }
        return minScore;
      }
    };

    if (getPlayerType() === "bot") {
      const board = gameBoard.getBoard();
      const piece = getPlayerPiece();
      let bestScore = piece === "❌" ? -Infinity : Infinity;
      let isMaximizing = piece === "❌" ? false : true;
      let move;
      console.log(getPlayerPiece());
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (board[i][j] === "") {
            board[i][j] = getPlayerPiece();
            let score = minmax(board, isMaximizing);
            board[i][j] = "";

            if (piece === "❌") {
              if (score > bestScore) {
                bestScore = score;
                move = { i, j };
              }
            } else {
              if (score < bestScore) {
                bestScore = score;
                move = { i, j };
              }
            }
            console.log(i, j, score, bestScore);
          }
        }
      }
      setTimeout(() => {
        document
          .querySelector(`button[data-row='${move.i}'][data-col='${move.j}']`)
          .click();
      }, 100);
    }
  };

  return {
    getPlayerPiece,
    getPlayerName,
    getPlayerType,
    updateName,
    updatePlayerType,
    playOptimalMove,
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
      return lineSet.values().next().value;
    }
  };

  const checkBoard = (board) => {
    let winner;

    // check rows
    for (let i = 0; i < board.length; i++) {
      winner = checkLine(board[i]);
      if (winner) {
        return winner;
      }
    }
    // check cols
    const transposedBoard = board[0].map((x, i) => board.map((x) => x[i]));
    for (let i = 0; i < transposedBoard.length; i++) {
      winner = checkLine(transposedBoard[i]);
      if (winner) {
        return winner;
      }
    }

    // check diagonals
    const diagOne = board.map((x, i) => x[i]);
    winner = checkLine(diagOne);
    if (winner) {
      return winner;
    }

    const diagTwo = board.map((x, i) => x[x.length - i - 1]);
    winner = checkLine(diagTwo);
    if (winner) {
      return winner;
    }

    // tie check
    if (
      gameBoard
        .getBoard()
        .flat()
        .filter((x) => x == "").length == 0
    ) {
      return "tie";
    }

    return winner;
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
  const form = document.querySelector("form[id='form']");
  const board = document.querySelector(".board");
  const back = document.querySelector("button[id='back']");

  // radio inputs
  const radioItems = document.querySelectorAll("input[type='radio']");

  const restartGame = () => {
    // clear the board and switch player back to X after a win
    gameController.resetGame();
    // clear UI
    boardItems.forEach((item) => (item.innerText = ""));
    // play optimal move
    gameController.getCurrentPlayer().playOptimalMove();
  };

  const clickHandlerItem = (e) => {
    const piece = gameController.getCurrentPlayer().getPlayerPiece();

    if (!e.target.innerText) {
      gameBoard.updateBoard(piece, e.target.dataset.row, e.target.dataset.col);
      e.target.innerText = piece;
      const timeOut = 1;

      // check for 3 in a row
      if (gameController.checkBoard(gameBoard.getBoard()) === piece) {
        // declare winner
        setTimeout(() => {
          alert(
            `Player ${piece} - ${gameController
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
      else if (gameController.checkBoard(gameBoard.getBoard()) === "tie") {
        setTimeout(() => {
          alert(`It's a tie 👔!`);
          restartGame();
        }, timeOut);
      } else {
        gameController.switchPlayerTurn();
        // play optimal move
        gameController.getCurrentPlayer().playOptimalMove();
      }
    }
  };

  boardItems.forEach((item) =>
    item.addEventListener("click", clickHandlerItem)
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    board.style.display = "grid";
    form.style.display = "none";
    back.style.display = "flex";

    const formData = new FormData(e.target);

    gameController.playerOne.updateName(formData.get("xname"));
    gameController.playerTwo.updateName(formData.get("oname"));

    gameController.playerOne.updatePlayerType(formData.get("xradio"));
    gameController.playerTwo.updatePlayerType(formData.get("oradio"));

    restartGame();
  });

  radioItems.forEach((item) =>
    item.addEventListener("click", (e) => (e.target.checked = true))
  );

  back.addEventListener("click", (e) => {
    board.style.display = "none";
    form.style.display = "";
    back.style.display = "none";
  });
})();
