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
          acc[piece.uuid] = createPieceEl(piece);
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
            : createPieceEl(piece);
          pieceEls[piece.uuid] = pieceEl;

          squareEl.appendChild(pieceEl);
        }
      });

      document.addEventListener("click", (e) => {
        document.querySelectorAll(".candidate").forEach((el) => {
          el.classList.remove("candidate");
        });

        if (e.target.classList.contains("piece")) {
          pieceClickHandler(e.target, game);
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
function createPieceEl(piece) {
  const pieceEl = document.createElement("DIV");
  pieceEl.classList.add("piece", `${piece.color}${piece.type}`);
  pieceEl.id = `${piece.uuid}`;
  return pieceEl;
}

/**
 *
 * @param {HTMLElement} el
 * @param {GameType} game
 * @returns
 */
function pieceClickHandler(el, game) {
  const row = parseInt(el?.parentElement?.getAttribute("data-row") || -1);
  const col = parseInt(el?.parentElement?.getAttribute("data-col") || -1);
  if (row === -1 || col === -1) return;

  const piece = game.position[`${row}_${col}`];
  const allowedMoves = game.getLegalMoves(piece, row, col);
  console.log("allowedMoves:", allowedMoves);

  Object.keys(allowedMoves).forEach((moveKey) => {
    const move = moveKey.split("_").map((x) => parseInt(x));
    document
      .getElementById(`sq-${move[0]}_${move[1]}`)
      .classList.add("candidate");
  });
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
