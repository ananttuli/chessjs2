console.log("index.js");

import { Board } from "./Board.js";
import { buildStartingPosition, Game } from "./Game.js";

function main() {
  // Init game
  const startingPosition = buildStartingPosition(
    "nnnnknnn/pppppppp/8/ppppqppp/8/8/PPPPPPPP/RRRRKRRR"
  );
  // "nnnnknnn/pppppppp/8/8/8/8/PPPPPPPP/RRRRKRRR"

  const game = Game(startingPosition);

  const r = 3,
    c = 4;

  game.getLegalMoves(game.position[r][c], r, c);

  console.log({ game });

  const board = Board();
  board.render(game);
}

main();
