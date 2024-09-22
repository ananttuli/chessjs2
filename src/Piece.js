import { isEmpty, Move } from "./Game.js";

export const PieceType = {
  N: "N",
  R: "R",
  B: "B",
  K: "K",
  Q: "Q",
  P: "P",
};

export const Color = {
  BLACK: "BLACK",
  WHITE: "WHITE",
};

const getMoveKey = (row, col) => {
  return `${row}_${col}`;
};

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
  [PieceType.N]: Knight,
  [PieceType.R]: Rook,
  [PieceType.B]: Bishop,
  [PieceType.K]: King,
  [PieceType.Q]: Queen,
  [PieceType.P]: Pawn,
};

const Direction = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  upRight: "upRight",
  upLeft: "upLeft",
  downLeft: "downLeft",
  downRight: "downRight",
};
const nextSquareInDirection = {
  [Direction.up]: ([row, col]) => [row - 1, col],
  [Direction.down]: ([row, col]) => [row + 1, col],
  [Direction.left]: ([row, col]) => [row, col - 1],
  [Direction.right]: ([row, col]) => [row, col + 1],
  [Direction.upRight]: ([row, col]) => [row - 1, col + 1],
  [Direction.upLeft]: ([row, col]) => [row - 1, col - 1],
  [Direction.downLeft]: ([row, col]) => [row + 1, col - 1],
  [Direction.downRight]: ([row, col]) => [row + 1, col + 1],
};

const possibleDirections = {
  [Direction.up]: false,
  [Direction.down]: false,
  [Direction.left]: false,
  [Direction.right]: false,
  [Direction.upRight]: false,
  [Direction.upLeft]: false,
  [Direction.downLeft]: false,
  [Direction.downRight]: false,
};

function isWithinPositionLimits([row, col], position) {
  const rowUpperLimit = position.length - 1;
  const rowLowerLimit = 0;
  const colUpperLimit = position[0].length - 1;
  const colLowerLimit = 0;

  return (
    row >= rowLowerLimit &&
    row <= rowUpperLimit &&
    col >= colLowerLimit &&
    col <= colUpperLimit
  );
}

function findAllMovesInDirectionFromStartingPosition(
  [startRow, startCol],
  position,
  direction,
  maxJumps
) {
  console.log("findAllMovesInDirectionFromStartingPosition", {
    at: [startRow, startCol],
    position,
    direction,
    maxJumps,
  });
  const possibleMoves = [];

  let row = startRow,
    col = startCol;

  let numJumps = 0;

  while (true) {
    const potentialMove = nextSquareInDirection[direction]([row, col]);

    const withinMaxJumps = maxJumps == null ? true : numJumps < maxJumps;

    if (
      isWithinPositionLimits(potentialMove, position) &&
      isEmpty(position[potentialMove[0]][potentialMove[1]]) &&
      withinMaxJumps
    ) {
      console.log({ numJumps, potentialMove });
      possibleMoves.push(potentialMove);
      [row, col] = potentialMove;
      numJumps++;
    } else {
      break;
    }
  }

  return possibleMoves;
}

function findAllMovesFromStartingPosition(
  [startingRow, startingCol],
  dirMap,
  position,
  maxJumps
) {
  console.log("Dirmap", dirMap, [startingRow, startingCol]);
  return Object.entries(dirMap)
    .filter(([_, enabled]) => enabled)
    .flatMap(([dir]) =>
      findAllMovesInDirectionFromStartingPosition(
        [startingRow, startingCol],
        position,
        dir,
        maxJumps
      )
    );
}

function Pawn(color) {
  const piece = Piece(
    color,
    PieceType.P,
    (row, col, moveNumber, color, position) => {
      const isWhite = color === Color.WHITE;

      const dirMap = {
        ...possibleDirections,
        down: !isWhite,
        up: isWhite,
      };

      const allPossibleMoves = findAllMovesFromStartingPosition(
        [row, col],
        dirMap,
        position,
        moveNumber === 1 ? 2 : 1
      );

      return allPossibleMoves;
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

// function generateDiagonals(
//   row,
//   col,
//   upperLimit = 8,
//   lowerLimit = -1,
//   position,
//   color
// ) {
//   function markLegalMoves(rowObj, colObj, moveMap, ptn) {
//     const [row, rowInLimit] = rowObj;
//     const [col, colInLimit] = colObj;
//     const { isLegal, pathTerminated } = checkSquareAvailable(
//       row,
//       col,
//       color,
//       ptn
//     );

//     if (isLegal && rowInLimit && colInLimit) {
//       moveMap[getMoveKey(row, col)] = true;
//     }

//     return pathTerminated || !rowInLimit || !colInLimit;
//   }

//   const diagonals = {};

//   for (let i = 1; ; i++) {
//     const [colPlus, colMinus, rowPlus, rowMinus] = [
//       [col + i, col + i < upperLimit],
//       [col - i, col - i > lowerLimit],
//       [row + i, row + i < upperLimit],
//       [row - i, row - i > lowerLimit],
//     ];

//     const terminators = [
//       !!markLegalMoves(rowPlus, colMinus, diagonals, position),
//       !!markLegalMoves(rowPlus, colPlus, diagonals, position),
//       !!markLegalMoves(rowMinus, colPlus, diagonals, position),
//       !!markLegalMoves(rowMinus, colMinus, diagonals, position),
//     ];

//     if (terminators.some((x) => x)) break;
//   }

//   return diagonals;
// }

function Bishop(color) {
  const piece = Piece(
    color,
    PieceType.B,
    (row, col, moveNumber, color, position) => {
      const dirMap = {
        ...possibleDirections,
        upRight: true,
        upLeft: true,
        downRight: true,
        downLeft: true,
      };

      const allPossibleMoves = findAllMovesFromStartingPosition(
        [row, col],
        dirMap,
        position
      );

      return allPossibleMoves;

      // const legalMoves = generateDiagonals(
      //   row,
      //   col,
      //   undefined,
      //   undefined,
      //   position,
      //   color
      // );

      // return legalMoves;
    }
  );

  return piece;
}

function Knight(color) {
  const piece = Piece(
    color,
    PieceType.N,
    (row, col, moveNumber, color, position) => {
      const legalMoves = {};
      return legalMoves;
    }
  );

  return piece;
}

// function rookType(row, col, limit = 8, position, color) {
//   const legalMoves = {};
//   let [colTerminated, rowTerminated] = [false, false];
//   for (let i = 0; i < limit; i++) {
//     if (i === row) continue;
//     if (i === col) continue;
//     const colKey = getMoveKey(i, col);
//     const rowKey = getMoveKey(row, i);
//     if (!colTerminated) {
//       if (position[colKey]) {
//         if (position[colKey].color !== color) {
//           legalMoves[colKey] = true;
//           colTerminated = true;
//         } else colTerminated = true;
//       } else {
//         legalMoves[colKey] = true;
//       }
//     }

//     if (!rowTerminated) {
//       if (position[rowKey]) {
//         if (position[rowKey].color !== color) {
//           legalMoves[rowKey] = true;
//           rowTerminated = true;
//         } else rowTerminated = true;
//       } else {
//         legalMoves[rowKey] = true;
//       }
//     }
//   }
//   return legalMoves;
// }

function Rook(color) {
  const piece = Piece(
    color,
    PieceType.R,
    (row, col, moveNumber, color, position) => {
      const dirMap = {
        ...possibleDirections,
        up: true,
        down: true,
        left: true,
        right: true,
      };

      const allPossibleMoves = findAllMovesFromStartingPosition(
        [row, col],
        dirMap,
        position
      );

      return allPossibleMoves;

      // const legalMoves = rookType(row, col, undefined, position, color);

      // return legalMoves;
    }
  );

  return piece;
}

function Queen(color) {
  // Queen is a combination of rook and bishop movements
  const rookPiece = Rook(color);
  const bishopPiece = Bishop(color);

  const piece = Piece(
    color,
    PieceType.Q,
    (row, col, moveNumber, color, position) => {
      // return Object.assign(
      //   {},
      //   rookPiece.getLegalMovesByPieceType(row, col, moveNumber, color),
      //   bishopPiece.getLegalMovesByPieceType(row, col, moveNumber, color)
      // );

      const dirMap = {
        ...possibleDirections,
        ...Object.keys(Direction).reduce(
          (acc, dir) => Object.assign(acc, { [dir]: true }),
          {}
        ),
      };

      const allPossibleMoves = findAllMovesFromStartingPosition(
        [row, col],
        dirMap,
        position
      );

      return allPossibleMoves;
    }
  );

  return piece;
}

function King(color) {
  const piece = Piece(
    color,
    PieceType.K,
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
