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
  const movesCache = {};

  return {
    __movesCache: movesCache,
    color,
    type,
    getLegalMoves: (row, col, moveNumber, color) => {
      const CACHE_KEY = `${row}_${col}`;

      if (!movesCache[CACHE_KEY]) {
        const moves = getLegalMoves(row, col, moveNumber, color);
        movesCache[CACHE_KEY] = moves;
      }

      return movesCache[CACHE_KEY];
    },
    getLegalMovesWithPosition: (row, col, moveNumber, color, position) => {
      const CACHE_KEY = `${row}_${col}`;

      if (!movesCache[CACHE_KEY]) {
        const moves = getLegalMoves(row, col, moveNumber, color);
        movesCache[CACHE_KEY] = moves;
      }

      const possiblePieceMoves = movesCache[CACHE_KEY];
      const finalMoves = [];
      for (let i = 0; i < possiblePieceMoves.length; i++) {
        const move = possiblePieceMoves[i];

        const pieceOnPosition = position[`${move[0]}_${move[1]}`];
        if (pieceOnPosition === -1) {
          finalMoves.push(move);
          continue;
        }

        if (pieceOnPosition.color === color) {
          continue;
        }
      }
      possiblePieceMoves.forEach((move) => {});
    },
    uuid: uuidv4(),
  };
}

export const PieceFactory = {
  [PieceType.PAWN]: Pawn,
  [PieceType.BISHOP]: Bishop,
  [PieceType.QUEEN]: Queen,
  [PieceType.KING]: King,
  [PieceType.ROOK]: Rook,
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

function generateDiagonals(row, col, upperLimit = 8) {
  const diagonals = [];

  for (let i = 1; ; i++) {
    const [colPlus, colMinus, rowPlus, rowMinus] = [
      col + i,
      col - i,
      row + i,
      row - i,
    ];

    const colInUpperBounds = colPlus < upperLimit;
    const colInLowerBounds = colMinus > -1;
    const rowInUpperBounds = rowPlus < upperLimit;
    const rowInLowerBounds = rowMinus > -1;

    const terminate =
      !colInUpperBounds &&
      !colInLowerBounds &&
      !rowInUpperBounds &&
      !rowInLowerBounds;

    if (terminate) break;

    {
      rowInUpperBounds &&
        colInLowerBounds &&
        diagonals.push([rowPlus, colMinus]);
    }

    {
      rowInUpperBounds &&
        colInUpperBounds &&
        diagonals.push([rowPlus, colPlus]);
    }

    {
      rowInLowerBounds &&
        colInUpperBounds &&
        diagonals.push([rowMinus, colPlus]);
    }

    {
      rowInLowerBounds &&
        colInLowerBounds &&
        diagonals.push([rowMinus, colMinus]);
    }
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

      return legalMoves;
    }
  );

  return piece;
}

function rookType(row, col, limit = 8) {
  const legalMoves = [];

  for (let i = 0; i < limit; i++) {
    if (i === row) continue;
    if (i === col) continue;
    legalMoves.push([i, col]);
    legalMoves.push([row, i]);
  }
  return legalMoves;
}

function Rook(color) {
  const piece = Piece(color, PieceType.ROOK, (row, col, moveNumber, color) => {
    const legalMoves = rookType(row, col);

    return legalMoves;
  });

  return piece;
}

function Queen(color) {
  // Queen is a combination of rook and bishop movements
  const rookPiece = Rook(color);
  const bishopPiece = Bishop(color);

  const piece = Piece(color, PieceType.QUEEN, (row, col, moveNumber, color) => {
    return rookPiece
      .getLegalMoves(row, col, moveNumber, color)
      .concat(bishopPiece.getLegalMoves(row, col, moveNumber, color));
  });

  return piece;
}

function King(color) {
  const piece = Piece(color, PieceType.KING, (row, col, moveNumber, color) => {
    const checkKingBounds = ([r, c]) =>
      r <= row + 1 && c <= col + 1 && r >= row - 1 && c >= col - 1;

    const diagonals = generateDiagonals(row, col).filter(checkKingBounds);

    const rookMoves = rookType(row, col).filter(checkKingBounds);

    const kingMoves = diagonals.concat(rookMoves);
    return kingMoves;
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
