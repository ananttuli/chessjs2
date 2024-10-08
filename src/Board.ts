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

            if (
              ui.selectedPiece?.sq[0] === i &&
              ui.selectedPiece?.sq[1] === j
            ) {
              square.classList.add("selected");
            } else {
              square.classList.remove("selected");
            }

            square.onclick = (squareClickEvent) => {
              squareClickEvent.stopPropagation();

              handleClick(i, j, ui);

              this.render(ui);
            };

            if (!isEmpty(piece)) {
              const pieceEl = pieceEls[piece.uuid] || createPieceEl(piece);

              pieceEls[piece.uuid] = pieceEl;
              pieceEl.onclick = null;
              square.appendChild(pieceEl);

              pieceEl.onclick = (e) => {
                e.stopPropagation();

                handleClick(i, j, ui);

                this.render(ui);
              };
            }
          }
        }
      }
    },
  };
}

function handleClick(x: number, y: number, ui: GameUI) {
  const position = ui.game.position;

  const currentPiece = position[x][y];

  // 1. Click on empty square without clicking anything else
  // 2. Click on piece of turn color
  //  2.1 then click on empty square -> Move
  //  2.2 then click on piece of opposite color -> capture
  // 3. Click on piece not of turn color, nothing happens

  const currentClickOnEmpty = currentPiece == null;
  const { selectedPiece: previouslySelectedPiece, game } = ui;

  const isCurrentPieceTurn = currentPiece?.color === game.turn;
  const legalMove = ui.findLegalMoveAt(x, y);

  if (currentClickOnEmpty) {
    // current click on empty
    if (previouslySelectedPiece) {
      if (previouslySelectedPiece.piece.color === game.turn && legalMove) {
        game.makeMove(legalMove);
      }
    }

    ui.clearSelection();
  } else {
    // current click on piece
    if (previouslySelectedPiece) {
      // capture
      if (legalMove && previouslySelectedPiece.piece.color === game.turn) {
        game.makeMove(legalMove);
      }

      ui.clearSelection();
    } else {
      // select piece
      if (currentPiece.color === game.turn) {
        ui.selectedPiece = { piece: currentPiece, sq: [x, y] };
      } else {
        ui.clearSelection();
      }
    }
  }
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
