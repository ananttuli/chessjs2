import { Board } from "./Board.js";
import { buildStartingPosition, Game, GameUI } from "./Game.js";

function main() {
  // Init game
  const startingPosition = buildStartingPosition();

  const game = new Game(startingPosition);
  const gameUI = new GameUI(game);

  const r = 3,
    c = 4;

  const board = Board();
  board.render(gameUI);
}

main();
