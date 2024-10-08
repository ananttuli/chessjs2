import { Board } from "./Board.js";
import { buildStartingPosition, Game, GameUI } from "./Game.js";

function main() {
  // Init game
  const startingPosition = buildStartingPosition();

  const game = new Game(startingPosition);
  console.log({ game });
  const gameUI = new GameUI(game);
  console.log({ gameUI });

  const board = Board();
  board.render(gameUI);
}

main();
