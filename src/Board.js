import { Color } from "./Piece.js";

function getSquareColor(row, col) {
  if (row % 2 === 0) {
    return [Color.WHITE, Color.BLACK][col % 2];
  }

  return [Color.BLACK, Color.WHITE][col % 2];
}

export function Board(numRows = 8, numCols = 8) {
  /**
   * @type {[key: string]: HTMLElement}
   */
  let pieceEls = {};

  return {
    pieceEls,
    /**
     *
     * @param {import("./Game").GameType} game
     */
    render: (game) => {
      console.log("game render:", game);
      const gamePosition = game.position;
      if (!document.getElementById("#board")) {
        const boardEl = document.createElement("div");
        boardEl.id = "board";
        for (let i = 0; i < numRows; i++) {
          const rowEl = document.createElement("div");
          rowEl.classList.add("row");

          for (let j = 0; j < numCols; j++) {
            const square = document.createElement("div");
            square.classList.add("square", getSquareColor(i, j));
            square.id = `sq-${i}_${j}`;
            square.setAttribute("data-row", i);
            square.setAttribute("data-col", j);
            rowEl.appendChild(square);
          }

          boardEl.appendChild(rowEl);
        }
        document.body.appendChild(boardEl);

        // Based on initial game position, create piece HTML Elements
        pieceEls = Object.entries(gamePosition).reduce((acc, piece) => {
          acc[piece.uuid] = createPieceEl(piece, game);
          return acc;
        }, {});
      }

      Object.entries(gamePosition).forEach(([k, piece]) => {
        const squareEl = document.getElementById(`sq-${k}`);
        squareEl.innerHTML = "";
        if (piece === false) {
          squareEl.innerHTML = "";
        } else {
          const cachedPiece = pieceEls[piece.uuid];
          const isValidCachedPiece = !!cachedPiece?.classList;

          const pieceEl = isValidCachedPiece
            ? cachedPiece
            : createPieceEl(piece, game);
          pieceEls[piece.uuid] = pieceEl;

          squareEl.appendChild(pieceEl);
        }
      });
    },
  };
}

/**
 *
 * @param {PieceBase} piece
 * @param {GameType} game
 * @returns
 */
function createPieceEl(piece, game, cb) {
  const pieceEl = document.createElement("DIV");
  pieceEl.classList.add("piece", `${piece.color}${piece.type}`);
  pieceEl.addEventListener("click", function (e) {
    const row = parseInt(
      e.currentTarget.parentElement.getAttribute("data-row")
    );
    const col = parseInt(
      e.currentTarget.parentElement.getAttribute("data-col")
    );
    const allowedMoves = game.getLegalMoves(piece, row, col);
    console.log("allowedMoves:", allowedMoves);
    // allowedMoves.forEach((move) => {
    //   document
    //     .getElementById(`sq-${move[0]}_${move[1]}`)
    //     .classList.add("candidate");
    // });

    // console.log("allowed moves: ", allowedMoves);

    // pieceEl.addEventListener("focusout", (e) => {
    //   const allowedMoves = game.getLegalMovesByPieceType(piece);

    //   allowedMoves.forEach((move) => {
    //     document
    //       .getElementById(`sq-${move[0]}_${move[1]}`)
    //       .classList.remove("candidate");
    //   });
    // });
  });
  return pieceEl;
}

/**
 * @typedef {import('./Game').GamePosition} GamePosition
 */

/**
 * @typedef {import("./Piece.js").PieceBase} PieceBase
 */

/**
 * @typedef {import("./Game").GameType} GameType
 */
