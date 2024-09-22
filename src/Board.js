import { isEmpty } from "./Game.js";
import { Color } from "./Piece.js";

function getSquareColor(row, col) {
  if (row % 2 === 0) {
    return [Color.WHITE, Color.BLACK][col % 2];
  }

  return [Color.BLACK, Color.WHITE][col % 2];
}

function createBoard(numRows, numCols) {
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

      // label.style.top = "50%";
      // label.style.left = "50%";
      // label.style.right = "50%";
      //  = {
      // position: "absolute",
      // left: "50%",
      // top: "50%",
      // bottom: "50%",
      // right: "50%",/
      // };

      rowEl.appendChild(square);
    }

    boardEl.appendChild(rowEl);
  }

  return boardEl;
}

export function Board() {
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
      const { position } = game;
      console.log("render - position", position);

      const numRows = position.length;
      const numCols = position[0].length;

      if (!document.getElementById("#board")) {
        const boardEl = createBoard(numRows, numCols);
        console.log({ boardEl });

        document.body.appendChild(boardEl);

        // Based on initial game position, create piece HTML Elements
        pieceEls = Object.entries(position).reduce((acc, piece) => {
          acc[piece.uuid] = createPieceEl(piece);
          return acc;
        }, {});
      }

      for (let i = 0; i < position.length; i++) {
        const rank = position[i];

        for (let j = 0; j < rank.length; j++) {
          const piece = rank[j];
          const square = document.getElementById(`sq-${i}_${j}`);

          square.innerHTML = "";

          square.style.position = "relative";
          const label = document.createElement("div");
          label.innerHTML = `<span>${i},${j}</span>`;
          label.style.position = "absolute";
          label.style.top = "0%";
          label.style.right = "5%";
          label.style.color =
            piece.color === Color.BLACK
              ? "white"
              : piece.color === Color.WHITE
              ? "black"
              : "grey";
          label.style.zIndex = 2;
          square.appendChild(label);

          if (isEmpty(piece)) {
            continue;
          }

          const cachedPiece = pieceEls[piece.uuid];

          const pieceEl = cachedPiece ?? createPieceEl(piece);

          pieceEls[piece.uuid] = pieceEl;

          square.appendChild(pieceEl);
        }
      }

      // Object.entries(position).forEach(([k, piece]) => {
      //   const squareEl = document.getElementById(`sq-${k}`);
      //   squareEl.innerHTML = "";
      //   if (piece === false) {
      //     squareEl.innerHTML = "";
      //   } else {
      //     const cachedPiece = pieceEls[piece.uuid];
      //     const isValidCachedPiece = !!cachedPiece?.classList;

      //     const pieceEl = isValidCachedPiece
      //       ? cachedPiece
      //       : createPieceEl(piece);
      //     pieceEls[piece.uuid] = pieceEl;

      //     squareEl.appendChild(pieceEl);
      //   }
      // });

      // document.addEventListener("click", (e) => {
      //   document.querySelectorAll(".candidate").forEach((el) => {
      //     el.classList.remove("candidate");
      //   });

      //   if (e.target.classList.contains("piece")) {
      //     pieceClickHandler(e.target, game);
      //   }
      // });
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
