import { Board } from "./Board.js";
import { buildStartingPosition, Game } from "./Game.js";

function main() {
  // Init game
  const startingPosition = buildStartingPosition();

  const game = Game(startingPosition);

  const r = 3,
    c = 4;

  const board = Board();
  board.render(game);
}

main();
