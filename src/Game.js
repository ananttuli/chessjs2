import { Color, PieceFactory, PieceType } from "./Piece.js";

function getPieceRow(color, row) {
  return Array(8)
    .fill(0)
    .map((_) => PieceFactory[PieceType.BISHOP](color))
    .reduce((map, piece, col) => {
      map[`${row}_${col}`] = piece;
      return map;
    }, {});
}

function getPawnRow(color, row) {
  return Array(8)
    .fill(0)
    .map((_) => PieceFactory[PieceType.PAWN](color))
    .reduce((map, piece, col) => {
      map[`${row}_${col}`] = piece;
      return map;
    }, {});
}

/**
 *
 * @param {number} row
 * @returns {{[key: string]: -1}}
 */
function getEmptyRow(row) {
  return Array(8)
    .fill(-1)
    .reduce((map, placeholder, col) => {
      map[`${row}_${col}`] = placeholder;
      return map;
    }, {});
}

/**
 *
 * @param {number} row
 * @returns
 */
function getEmptyRows(rows) {
  return rows
    .map((row) => getEmptyRow(row))
    .reduce((acc, r) => {
      acc = { ...acc, ...r };
      return acc;
    }, {});
}

export function Game(providedPosition) {
  const position = providedPosition || {
    ...getPieceRow(Color.BLACK, 0),
    ...getPawnRow(Color.BLACK, 1),
    ...getEmptyRows([2, 3, 4, 5]),
    ...getPawnRow(Color.WHITE, 6),
    ...getPieceRow(Color.WHITE, 7),
  };

  const captured = [];

  const state = { moveNumber: 0 };
  return {
    captured,
    position,
    state,
    makeMove: (piece, from, to) => {
      if (position[to] !== -1) {
        // Capture has taken place
        // Process capture
        captured.push({ ...position[to] });
      }

      position[to] = piece;

      // Empty space from where the move was made
      position[from] = -1;
    },
    /**
     *
     * @param {PieceBase} piece
     */
    getLegalMoves: (piece) => {
      const findPieceKey = Object.entries(position).find(
        ([k, p]) => piece.uuid === p.uuid
      );
      const [row, col] = findPieceKey[0].split("_").map((x) => parseInt(x));

      const legalMoves = piece.getLegalMoves(
        row,
        col,
        state.moveNumber,
        piece.color
      );

      // Get available squares
      return legalMoves.filter(
        (m) =>
          position[`${m[0]}${m[1]}`] === -1 ||
          position[`${m[0]}${m[1]}`]?.color !== piece.color
      );
    },
  };
}

/**
 * @typedef {import('./Piece').PieceBase} PieceBase
 */

/**
 * @typedef {{[key: string]: -1 | PieceBase}} GamePosition
 */

/**
 * @typedef {Object} GameType
 * @property {GamePosition} position
 * @property {PieceBase[]} captured
 * @property {(piece, from, to) => void} makeMove
 * @property {(piece) => [number, number]} getLegalMoves
 */
