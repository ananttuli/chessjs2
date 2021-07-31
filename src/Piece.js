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

const getMoveKey = (row, col) => {
  return `${row}_${col}`;
};

/**
 * @typedef {Object} PieceBase
 * @property {PieceType} type
 * @property {Color} color
 * @property {string} uuid
 * @property {(row: number, col: number, moveNumber: number, color: Color, position: GamePosition) => {[key: string]: boolean}} getLegalMoves
 */

/**
 * @typedef {import('./Game').GamePosition} GamePosition
 */

/**
 * Piece
 * @param {PieceBase['color']} color
 * @param {PieceBase['type']} type
 * @param {PieceBase['getLegalMoves']} getLegalMoves
 * @returns {PieceBase}
 */
export function Piece(color, type, getLegalMoves) {
  // const movesCache = {};

  return {
    // __movesCache: movesCache,
    color,
    type,
    getLegalMoves,
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
  const piece = Piece(
    color,
    PieceType.PAWN,
    (row, col, moveNumber, color, position) => {
      const legalMoves = {};
      const pawnAdder = color === Color.WHITE ? -1 : 1;
      const oneMoveKey = getMoveKey(row + 1 * pawnAdder, col);
      const twoMoveKey = getMoveKey(row + 2 * pawnAdder, col);
      !position[oneMoveKey] && (legalMoves[oneMoveKey] = true);
      console.log(position);
      if (moveNumber === 1) {
        !position[oneMoveKey] &&
          !position[twoMoveKey] &&
          (legalMoves[twoMoveKey] = true);
      }
      return legalMoves;
    }
  );

  return piece;
}

/**
 *
 * @param {*} row
 * @param {*} col
 * @param {*} color
 * @param {GamePosition} position
 * @returns {{isLegal: boolean, pathTerminated: boolean}}
 */
function checkSquareAvailable(row, col, color, position) {
  const key = getMoveKey(row, col);

  return {
    isLegal: !position[key] || position[key].color !== color,
    pathTerminated: !!position[key],
  };
}

/**
 *
 * @param {*} row
 * @param {*} col
 * @param {*} upperLimit
 * @param {GamePosition} position
 * @returns
 */
function generateDiagonals(
  row,
  col,
  upperLimit = 8,
  lowerLimit = -1,
  position,
  color
) {
  function markLegalMoves(rowObj, colObj, moveMap, ptn) {
    const [row, rowInLimit] = rowObj;
    const [col, colInLimit] = colObj;
    const { isLegal, pathTerminated } = checkSquareAvailable(
      row,
      col,
      color,
      ptn
    );

    if (isLegal && rowInLimit && colInLimit) {
      moveMap[getMoveKey(row, col)] = true;
    }

    return pathTerminated || !rowInLimit || !colInLimit;
  }

  const diagonals = {};

  for (let i = 1; ; i++) {
    const [colPlus, colMinus, rowPlus, rowMinus] = [
      [col + i, col + i < upperLimit],
      [col - i, col - i > lowerLimit],
      [row + i, row + i < upperLimit],
      [row - i, row - i > lowerLimit],
    ];

    const terminators = [
      !!markLegalMoves(rowPlus, colMinus, diagonals, position),
      !!markLegalMoves(rowPlus, colPlus, diagonals, position),
      !!markLegalMoves(rowMinus, colPlus, diagonals, position),
      !!markLegalMoves(rowMinus, colMinus, diagonals, position),
    ];

    if (terminators.some((x) => x)) break;
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
    (row, col, moveNumber, color, position) => {
      const legalMoves = generateDiagonals(
        row,
        col,
        undefined,
        undefined,
        position,
        color
      );

      return legalMoves;
    }
  );

  return piece;
}

/**
 *
 * @param {number} row
 * @param {number} col
 * @param {number | undefined} limit
 * @param {GamePosition} position
 * @returns
 */
function rookType(row, col, limit = 8, position, color) {
  const legalMoves = {};
  let [colTerminated, rowTerminated] = [false, false];
  for (let i = 0; i < limit; i++) {
    if (i === row) continue;
    if (i === col) continue;
    const colKey = getMoveKey(i, col);
    const rowKey = getMoveKey(row, i);
    if (!colTerminated) {
      if (position[colKey]) {
        if (position[colKey].color !== color) {
          legalMoves[colKey] = true;
          colTerminated = true;
        } else colTerminated = true;
      } else {
        legalMoves[colKey] = true;
      }
    }

    if (!rowTerminated) {
      if (position[rowKey]) {
        if (position[rowKey].color !== color) {
          legalMoves[rowKey] = true;
          rowTerminated = true;
        } else rowTerminated = true;
      } else {
        legalMoves[rowKey] = true;
      }
    }
  }
  return legalMoves;
}

function Rook(color) {
  const piece = Piece(
    color,
    PieceType.ROOK,
    (row, col, moveNumber, color, position) => {
      const legalMoves = rookType(row, col, undefined, position, color);

      return legalMoves;
    }
  );

  return piece;
}

function Queen(color) {
  // Queen is a combination of rook and bishop movements
  const rookPiece = Rook(color);
  const bishopPiece = Bishop(color);

  const piece = Piece(color, PieceType.QUEEN, (row, col, moveNumber, color) => {
    return Object.assign(
      {},
      rookPiece.getLegalMovesByPieceType(row, col, moveNumber, color),
      bishopPiece.getLegalMovesByPieceType(row, col, moveNumber, color)
    );
  });

  return piece;
}

function King(color) {
  const piece = Piece(
    color,
    PieceType.KING,
    (row, col, moveNumber, color, position) => {
      const checkKingBounds = ([r, c]) =>
        r <= row + 1 && c <= col + 1 && r >= row - 1 && c >= col - 1;

      const diagonals = Object.entries(
        generateDiagonals(row, col, undefined, undefined, position, color)
      )
        .filter(checkKingBounds)
        .reduce((acc, moveKey) => {
          acc[moveKey] = true;
          return acc;
        }, {});

      const rookMoves = Object.entries(
        rookType(row, col, undefined, position, color)
      )
        .filter(checkKingBounds)
        .reduce((acc, moveKey) => {
          acc[moveKey] = true;
          return acc;
        }, {});

      const kingMoves = Object.assign({}, diagonals, rookMoves);
      return kingMoves;
    }
  );

  return piece;
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
