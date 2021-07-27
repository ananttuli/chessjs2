export const PieceType = {
  KNIGHT: "KNIGHT",
  ROOK: "ROOK",
  BISHOP: "BISHOP",
  KING: "KING",
  QUEEN: "QUEEN",
  PAWN: "PAWN",
};

export const Color = {
  BLACK: "BLACK",
  WHITE: "WHITE",
};

/**
 * @typedef {Object} PieceBase
 * @property {PieceType} type
 * @property {Color} color
 * @property {string} uuid
 * @property {(row: number, col: number, moveNumber: number, color: Color) => [number, number][]} getLegalMoves
 */

/**
 *
 * @param {Color} color
 * @param {PieceType} type
 * @param {(row: number, col: number, moveNumber: number, color: Color) => [number, number][]} getLegalMoves
 * @returns {PieceBase}
 */
export function Piece(color, type, getLegalMoves) {
  return {
    color,
    type,
    getLegalMoves,
    uuid: uuidv4(),
  };
}

export const PieceFactory = {
  [PieceType.PAWN]: Pawn,
  [PieceType.BISHOP]: Bishop,
};

/**
 *
 * @param {Color} color
 */
function Pawn(color) {
  const piece = Piece(color, PieceType.PAWN, (row, col, moveNumber, color) => {
    const legalMoves = [];
    const pawnAdder = color === Color.WHITE ? -1 : 1;

    legalMoves.push([row + 1 * pawnAdder, col]);

    if (moveNumber === 1) {
      legalMoves.push([row + 2 * pawnAdder, col]);
    }

    return legalMoves;
  });

  return piece;
}

function generateDiagonals(row, col) {
  const diagonals = [];

  for (
    let i = 1;
    row - i >= 0 && row + i < 8 && col - i >= 0 && col + i < 8;
    i++
  ) {
    diagonals.push([row + i, col + i]);
    diagonals.push([row - i, col + i]);
    diagonals.push([row + i, col - i]);
    diagonals.push([row - i, col - i]);
  }

  return diagonals;
}

/**
 *
 * @param {Color} color
 */
function Bishop(color) {
  const piece = Piece(
    color,
    PieceType.BISHOP,
    (row, col, moveNumber, color) => {
      const legalMoves = generateDiagonals(row, col);
      console.log("bishop legalMoves", legalMoves);
      return legalMoves;
    }
  );

  return piece;
}

function Rook(color) {
  const piece = Piece(color, PieceType.ROOK, (row, col, moveNumber, color) => {
    const legalMoves = [];

    for (let i = row + 1; i < 8; i++) {
      legalMoves.push([i, j]);
    }

    for (let i = row - 1; i > -1; i--) {
      legalMoves.push([i, j]);
    }

    return legalMoves;
  });

  return piece;
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
