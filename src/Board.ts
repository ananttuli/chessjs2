import { isEmpty, Game, GameUI } from "./Game.js";
import { MoveMade } from "./Move.js";
import { Color, Piece, PieceType } from "./Piece.js";

function getSquareColor(row: number, col: number): Color {
  return row % 2 === 0
    ? [Color.WHITE, Color.BLACK][col % 2]
    : [Color.BLACK, Color.WHITE][col % 2];
}

function createBoard(
  numRows: number,
  numCols: number
): { boardEl: HTMLDivElement; squareEls: HTMLDivElement[][] } {
  const boardEl = document.createElement("div");
  const squareEls: HTMLDivElement[][] = [];
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
    squareEls.push(Array.from(rowEl.children) as HTMLDivElement[]);
    boardEl.appendChild(rowEl);
  }

  return { boardEl, squareEls };
}

export function Board() {
  let pieceEls: { [key: string]: HTMLElement } = {};
  let boardEl: HTMLDivElement;
  let squareEls: HTMLDivElement[][] = [];

  return {
    pieceEls,
    render(ui: GameUI) {
      const { game } = ui;
      const { position } = ui.game;
      const numRows = position.length;
      const numCols = position[0].length;

      if (!boardEl) {
        const createdBoard = createBoard(numRows, numCols);
        boardEl = createdBoard.boardEl;
        squareEls = createdBoard.squareEls;
        document.body.appendChild(boardEl);
      }

      for (let i = 0; i < position.length; i++) {
        for (let j = 0; j < position[i].length; j++) {
          const piece = position[i][j];
          const square = squareEls[i][j];

          if (square) {
            square.innerHTML = "";
            square.onclick = null;

            square.style.position = "relative";

            const label = document.createElement("div");
            label.innerHTML = `<span>${i},${j}</span>`;
            label.style.position = "absolute";
            label.style.top = "0%";
            label.style.right = "5%";
            label.style.color = !piece
              ? "teal"
              : piece?.color === Color.BLACK
              ? "white"
              : "black";
            label.style.fontSize = "22px";

            square.appendChild(label);

            if (ui.isCurrentlyHighlighted(i, j)) {
              square.classList.add("candidate");
            } else {
              square.classList.remove("candidate");
            }

            if (ui.currentCoords?.[0] === i && ui.currentCoords?.[1] === j) {
              square.classList.add("selected");
            } else {
              square.classList.remove("selected");
            }

            square.onclick = () => {
              const legalMove = ui.findLegalMoveAt(i, j);

              if (legalMove) {
                game.makeMove(legalMove);
                // game.state.moves.push(new MoveMade(legalMove, game.state.));
                this.render(ui);
              }
            };

            if (!isEmpty(piece)) {
              const pieceEl = pieceEls[piece.uuid] || createPieceEl(piece);

              pieceEls[piece.uuid] = pieceEl;
              pieceEl.onclick = null;
              square.appendChild(pieceEl);

              pieceEl.onclick = () => {
                const currentPiece = position[i][j];

                if (ui.currentSelectedPiece?.uuid === currentPiece?.uuid) {
                  ui.currentSelectedPiece = undefined;
                  ui.currentCoords = undefined;
                } else {
                  ui.currentSelectedPiece = currentPiece;
                  ui.currentCoords = [i, j];
                }

                this.render(ui);
              };
            }
          }
        }
      }
    },
  };
}

function createPieceEl(piece: Piece): HTMLElement {
  const pieceEl = document.createElement("DIV");
  pieceEl.classList.add("piece", `${piece.color}${piece.type}`);
  pieceEl.id = `${piece.uuid}`;
  return pieceEl;
}

function onClickPiece(
  piece: Piece,
  currentSquare: [number, number],
  game: Game
) {}
