import { Board } from "./Board.js";
import { buildStartingPosition, Game } from "./Game.js";

function main() {
  // Init game
  const startingPosition = buildStartingPosition(
    "nnnnknnn/pppppppp/8/bpppqppp/8/8/PPPPPPPP/RRRRKRRR"
  );

  const game = Game(startingPosition);

  const r = 3,
    c = 0;
  game.getLegalMoves(game.position[r][c], r, c);

  const board = Board();
  board.render(game);
}

main();
