// module pattern -> 1 of something
const gameBoard = (() => {
  const board = [];

  // gives only read access to board
  const getBoard = () => board;

  return {
    getBoard,
  };
})();

// factory function -> many of something
const playerFactory = () => {
  return {};
};

const gameController = (() => {
  return {};
})();

const displayController = (() => {
  return {};
})();
