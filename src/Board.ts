import { isEmpty, GameType } from "./Game.js";
import { Color } from "./Piece.js";

function getSquareColor(row: number, col: number): Color {
  return row % 2 === 0
    ? [Color.WHITE, Color.BLACK][col % 2]
    : [Color.BLACK, Color.WHITE][col % 2];
}

function createBoard(numRows: number, numCols: number): HTMLElement {
  const boardEl = document.createElement("div");
  boardEl.id = "board";

  for (let i = 0; i < numRows; i++) {
    const rowEl = document.createElement("div");
    rowEl.classList.add("row");
    for (let j = 0; j < numCols; j++) {
      const square = document.createElement("div");
      square.classList.add("square", getSquareColor(i, j));
      square.id = `sq-${i}_${j}`;
      square.setAttribute("data-row", i.toString());
      square.setAttribute("data-col", j.toString());

      rowEl.appendChild(square);
    }
    boardEl.appendChild(rowEl);
  }

  return boardEl;
}

export function Board() {
  let pieceEls: { [key: string]: HTMLElement } = {};

  return {
    pieceEls,
    render: (game: GameType) => {
      const { position } = game;
      const numRows = position.length;
      const numCols = position[0].length;

      if (!document.getElementById("#board")) {
        const boardEl = createBoard(numRows, numCols);
        document.body.appendChild(boardEl);
      }

      for (let i = 0; i < position.length; i++) {
        for (let j = 0; j < position[i].length; j++) {
          const piece = position[i][j];
          const square = document.getElementById(`sq-${i}_${j}`);

          if (square) {
            square.innerHTML = "";
            square.style.position = "relative";

            const label = document.createElement("div");
            label.innerHTML = `<span>${i},${j}</span>`;
            label.style.position = "absolute";
            label.style.top = "0%";
            label.style.right = "5%";
            label.style.color = piece.color === Color.BLACK ? "white" : "black";
            square.appendChild(label);

            if (!isEmpty(piece)) {
              const pieceEl = pieceEls[piece.uuid] || createPieceEl(piece);
              pieceEls[piece.uuid] = pieceEl;
              square.appendChild(pieceEl);
            }
          }
        }
      }
    },
  };
}

function createPieceEl(piece: any): HTMLElement {
  const pieceEl = document.createElement("DIV");
  pieceEl.classList.add("piece", `${piece.color}${piece.type}`);
  pieceEl.id = `${piece.uuid}`;
  return pieceEl;
}
