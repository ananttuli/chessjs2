import { Board } from "./Board.js";
import { Game } from "./Game.js";

function main() {
  // Init game
  const game = Game();

  const board = Board();
  board.render(game);
}

main();
